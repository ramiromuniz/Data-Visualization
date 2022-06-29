function PopulationGrowth() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Population Growth: 1950-2100';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'population-growth';

  // Title to display above the plot.
  this.title = 'Projected Population Growth: 1950-2100';

    // Names for each axis.
  this.xAxisLabel = 'Year';
  this.yAxisLabel = 'Population';

  var marginSize = 50;

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    marginSize: marginSize,

    // Locations of margin positions. Left and bottom have double margin
    // size due to axis and tick labels.
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - marginSize * 2,
    pad: 5,

    plotWidth: function() {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function() {
      return this.bottomMargin - this.topMargin;
    },

    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 15,
    numYTickLabels: 5,
  };

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/population-growth/world-population-1950-2100.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });

  };

  this.setup = function() {
      if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
    // Font defaults.
    textSize(16);

    // Set min and max years: assumes data is sorted by date.
    this.startYear = this.data.getNum(0, 'year');
    this.endYear = this.data.getNum(this.data.getRowCount()-1 , 'year');

    // Find min and max population for mapping to canvas height.
    this.minPopulation = 0;  
    this.maxPopulation = max(this.data.getColumn('World'));
    this.maxPopUk = max(this.data.getColumn('UK'));
    

    // Create a select DOM element.
    this.sel = createSelect();
    this.sel.position(620, 20);

    // Fill the options with World and UK
    var places = this.data.columns;

    // First entry is empty.
    for (let i = 1; i < places.length; i++) {
      this.sel.option(places[i]);
    }

  };

  this.destroy = function() {
    this.sel.remove();
  };
    

  this.draw = function() {
      
    // Get the value of the place we're interested in from the
    // select item.
    var place = this.sel.value();

    // Draw the title above the plot.
    this.drawTitle();

      // Call different functions depending on what is selected in the dropdown menu
      if(place == 'World')
          {
            // Draw all y-axis labels for world population
            drawYAxisTickLabelsPopG(this.minPopulation,
                        this.maxPopulation,
                        this.layout,
                        this.mapPopulationToHeight.bind(this),
                        0); 
          }
      else if(place == 'UK'){
            // Draw all y-axis labels for UK population
            drawYAxisTickLabelsUkPop(this.minPopulation,
                        this.maxPopUk,
                        this.layout,
                        this.mapPopUkToHeight.bind(this),
                        0); 
      }


    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel,
                   this.yAxisLabel,
                   this.layout);

    // Plot population between startYear and endYear using the width
    // of the canvas minus margins.
      
    //Previous and Previous1 for World and UK population respectively
    var previous;
    var previous1;
    var numYears = this.endYear - this.startYear;
      

    // Loop over all rows and draw a line from the previous value to
    // the current
      
    for (var i = 0; i < this.data.getRowCount(); i++) {

      // Create an object to store data for the current year.
      var current = {
        // Convert strings to numbers.
        'year': this.data.getNum(i, 'year'),
        'totalPopulation': this.data.getNum(i, 'World'),
        'xStep': i
      };
        // Same object but for UK population
        var current1 = {
        'year': this.data.getNum(i, 'year'),
        'uk_pop': this.data.getNum(i,'UK'),
        'xStep': i
      };

      //Constrain mouseX only inside the graph
      var pointerConstrain = constrain(mouseX, this.layout.leftMargin, this.layout.rightMargin);
      //Width of the graph
      var graphWidth  = this.layout.rightMargin - this.layout.leftMargin;
      //Width of the graph divided in years gives us the distance between years in the canvas
      var yearStep = graphWidth / this.data.getRowCount();
        
    
    // If you select World, it will draw world population, if not, the UK population
    if(place == 'World'){

          //if mouseX divided the distance between years is equal to the year and total population indexed by 'xStep' draw the point in that location
          if (int((pointerConstrain - this.layout.leftMargin) / yearStep) == current.xStep)
          {
            this.pointer(this.mapPopulationToHeight(current.totalPopulation), current.totalPopulation, current.year);
          }


          if (previous != null) {
              
            // Draw line segment connecting previous year to current year
             stroke(173, 216, 230);

             line(this.mapYearToWidth(previous.year),
             this.mapPopulationToHeight(previous.totalPopulation),
             this.mapYearToWidth(current.year),
             this.mapPopulationToHeight(current.totalPopulation)); 


            // The number of x-axis labels to skip so that only
            // numXTickLabels are drawn.
            var xLabelSkip = ceil(numYears / this.layout.numXTickLabels);

            // Draw the tick label marking the start of the previous year.
            if (i % xLabelSkip == 0) {
              drawXAxisTickLabel(previous.year+1, this.layout,
                                 this.mapYearToWidth.bind(this));
            }

          }
          // Assign current year to previous year so that it is available
          // during the next iteration of this loop to give us the start
          // position of the next line segment.
          previous = current;
    }
        
        else if(place == 'UK'){
                
            if (int((pointerConstrain - this.layout.leftMargin) / yearStep) == current1.xStep)
              {
                this.pointer1(this.mapPopUkToHeight(current1.uk_pop), current1.uk_pop, current1.year);
              }

              if (previous1 != null) {
                // Draw line segment connecting previous year to current year
                 stroke(128, 207, 169);

                 line(this.mapYearToWidth(previous1.year),
                 this.mapPopUkToHeight(previous1.uk_pop),
                 this.mapYearToWidth(current1.year),
                 this.mapPopUkToHeight(current1.uk_pop)); 

                // The number of x-axis labels to skip so that only
                // numXTickLabels are drawn.
                var xLabelSkip = ceil(numYears / this.layout.numXTickLabels);

                // Draw the tick label marking the start of the previous year.
                if (i % xLabelSkip == 0) {
                  drawXAxisTickLabel(previous1.year+1, this.layout,
                                     this.mapYearToWidth.bind(this));
                }

              }
            
            previous1 = current1;
        }
        
    }
 
};


  this.drawTitle = function() {
    rect()
    fill(0);
    noStroke();
    textAlign('center', 'center');
      
    text(this.title,
         (this.layout.plotWidth() / 2) + this.layout.leftMargin,
         this.layout.topMargin - (this.layout.marginSize / 2));
  };
    

  this.mapYearToWidth = function(value) {
    return map(value,
               this.startYear,
               this.endYear,
               this.layout.leftMargin,  
               this.layout.rightMargin);
  };
    

  this.mapPopulationToHeight = function(value) {
    return map(value,
               this.minPopulation,
               this.maxPopulation,
               this.layout.bottomMargin, 
               this.layout.topMargin);   
  };
    
  //UK population
  this.mapPopUkToHeight = function(value) {
    return map(value,
               this.minPopulation,
               this.maxPopUk,
               this.layout.bottomMargin, 
               this.layout.topMargin);   
  };

    
    //Convert big number in billions into a smaller format (Ex: 10.234.234.234 = 10.23 Billion)
    this.numConverter = function(num, decimal){
        return Math.abs(num) > 999999999 ? Math.sign(num)*((Math.abs(num)/1000000000).toFixed(decimal)): Math.sign(num)*Math.abs(num)
    }
    //Same function as above only for numbers in millions
    this.milConverter = function(num, decimal){
    return Math.abs(num) > 999999 ? Math.sign(num)*((Math.abs(num)/1000000).toFixed(decimal)): Math.sign(num)*Math.abs(num)
}
    
    // Function that draws point, line and information where the pointer is (World) 
    this.pointer = function(yPos, population, year) {
    
        var cursor = constrain(mouseX, this.layout.leftMargin, this.layout.rightMargin + 60);
        var cursorY = constrain(mouseY, this.layout.topMargin+30, this.layout.bottomMargin -50);

        line(cursor, 
             this.layout.topMargin, 
             cursor, 
             this.layout.bottomMargin); 

        strokeWeight(5);  
        point(cursor, yPos); 
        strokeWeight(0); 
        fill(173, 216, 230, 200);

        //Only draw the rectangle with information inside the margins

        rect(cursor - 210, cursorY - 20, 200, 60, 15);
        fill(0)
        textAlign(LEFT);
        text("Population: " + this.numConverter(population, 2)  + ' Billion', cursor - 200, cursorY );
        text("Year: " + year, cursor - 200, cursorY + 20);
        strokeWeight(1); 

  }

    // Function that draws point, line and information where the pointer is (UK)  
    this.pointer1 = function(yPos, population, year) {
    
    var cursor = constrain(mouseX, this.layout.leftMargin, this.layout.rightMargin + 60);
    var cursorY = constrain(mouseY, this.layout.topMargin, this.layout.bottomMargin -100);
    
    line(cursor, 
         this.layout.topMargin, 
         cursor, 
         this.layout.bottomMargin); 
    
    strokeWeight(5);  
    point(cursor, yPos); 
    strokeWeight(0); 
    fill(128, 207, 169, 200);
    
    //Only draw the rectangle with information inside the margins

    rect(cursor - 210, cursorY - 20, 200, 60, 15);
    fill(0)
    textAlign(LEFT);
    text("Population: " + this.milConverter(population, 2)  + ' Million', cursor - 200, cursorY );
    text("Year: " + year, cursor - 200, cursorY + 20);
    strokeWeight(1); 

  }
      
}
