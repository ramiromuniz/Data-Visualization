function VaccionationRate() {
    
  // Name for the visualisation to appear in the menu bar.
  this.name = 'Covid-19 Vaccination: As of January 7th, 2022';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'vax-vs-unvax';

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    // Locations of margin positions. Left and bottom have double margin
    // size due to axis and tick labels.
    leftMargin: 130,
    rightMargin: width,
    topMargin: 30,
    bottomMargin: height,
    pad: 5,

    plotWidth: function() {
      return this.rightMargin - this.leftMargin;
    },
      

    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 10,
    numYTickLabels: 8,
  };

  // Middle of the plot: for 50% line.
  this.midX = (this.layout.plotWidth() / 2) + this.layout.leftMargin;
    
  // Create an array of objects containing the text perecentages 
  // and the location across the graph on the bottom
  var percentX = [];
  for (var i = 0; i < 4; i++){
    
    percentX.push({"xPos":(this.layout.plotWidth() / 5) * (i+1) + this.layout.leftMargin, 
                   "percentages": 20 + i*20});
}
    

  // Default visualisation colours.
  this.fullyVaccinated = color(0, 100, 0);
  this.partlyVaccinated = color(173, 255, 47);
  this.unvaccinated = color(255, 165, 0);

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/vax-vs-unvax/covid-vaccination-rate.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      })

  };

  this.setup = function() {
    // Font defaults.
    textSize(13);
  };

  this.destroy = function() {
  };
    

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
      
      
    // Draw Female/Male labels at the top of the plot.
    this.drawCategoryLabels();

    var lineHeight = ((height-15) - this.layout.topMargin) /
        this.data.getRowCount();
      
      //As we only have the number of people we have to calculate the percentage so its easier to graph.

      //Add Fully Vaccinated percentage column
        this.data.addColumn('FVpercentage');
      //Add Partly Vaccinated percentage column
        this.data.addColumn('PVpercentage');
      //Add unvaccinated percentage column
        this.data.addColumn('unvaccinated');
      
      for (var i = 0; i < this.data.getRowCount(); i++){
          
        //Fully vaccinated times 100 divided total population 
        //to get the percentage
        var FVpercentage = round((this.data.getNum(i, 'people_fully_vaccinated')*100 / (this.data.getNum(i, 'total population'))));
        //Partly vaccinated times 100 divided total population 
        //to get the percentage
         var PVpercentage = round((this.data.getNum(i, 'people_vaccinated')*100 / (this.data.getNum(i, 'total population'))));

 
        //Add values to the percentage columns
        this.data.set(i, 'FVpercentage', FVpercentage);
        this.data.set(i, 'PVpercentage', PVpercentage);
  
        //100 minus Partly vaccinated percentage
         var unvaccinated = (100 - (this.data.getNum(i, 'PVpercentage')));
          
          this.data.set(i, 'unvaccinated', unvaccinated);
      }
      
      
    for (var i = 0; i < this.data.getRowCount(); i++) {

      // Calculate the y position for each company.
      var lineY = (lineHeight * i) + this.layout.topMargin;
        

      // Create an object that stores data from the current row.
      var country = {
        // Convert strings to numbers.
        'name': this.data.getString(i, 'location'),
        'totalVaccinated': this.data.getNum(i, 'PVpercentage'),
        'fullyVaccinated': this.data.getNum(i, 'FVpercentage'),
        'unvaccinated': this.data.getNum(i, 'unvaccinated')
      };
        
        

      // Draw the company name in the left margin.
      fill(0);
      noStroke();
      textAlign('right', 'top');
      text(country.name,
           this.layout.leftMargin - this.layout.pad,
           lineY);
        
      
      // Draw total vaccinated rectangle
      
      fill(this.partlyVaccinated);
      rect(this.layout.leftMargin,
           lineY,
           this.mapPercentToWidth(country.totalVaccinated),
           lineHeight - this.layout.pad);
        
      // Draw fully vaccinated rectangle
      fill(this.fullyVaccinated);
      rect(this.layout.leftMargin,
           lineY,
           this.mapPercentToWidth(country.fullyVaccinated),
           lineHeight - this.layout.pad);

      // Draw unvaccinated rectangle
      fill(this.unvaccinated);
      rect(this.layout.leftMargin + this.mapPercentToWidth(country.totalVaccinated),
           lineY,
           this.mapPercentToWidth(country.unvaccinated),
           lineHeight - this.layout.pad);
        
        
      fill(255);  
      stroke(5);
      textAlign('left', 'top');
      text(country.totalVaccinated + '%',
           this.midX,
           lineY+5);
    }
      

  };

  this.drawCategoryLabels = function() {
    fill(0);
    noStroke();
    textAlign('left', 'top');
    text('Fully Vaccinated',
         this.layout.leftMargin,
         this.layout.pad);
      
    //0 and 100 percent on the graph
    textAlign('left', 'bottom');
    text('0%',
         this.layout.leftMargin,
         height);
      
    textAlign('right', 'bottom');
    text('100%',
         this.layout.rightMargin,
         height);
      
    textAlign('right', 'top');
    text('Unvaccinated',
         this.layout.rightMargin,
         this.layout.pad);
      
    textAlign('center', 'top');
    text('Partly Vaccinated',
         this.midX,
         this.layout.pad);
      
      //20 to 80 percentages
      for(var i = 0; i < percentX.length; i++){
        textAlign('left', 'bottom');
        text(percentX[i].percentages + '%',
         percentX[i].xPos,
         height);
      }
      
      //Reference ellipses for rectangle color
      fill(this.unvaccinated)
      ellipse(this.layout.rightMargin-90,
         this.layout.topMargin -19, 10)
      fill(this.fullyVaccinated)
      ellipse(this.layout.leftMargin+105,
         this.layout.topMargin -19, 10)
      fill(this.partlyVaccinated)
      ellipse(this.layout.leftMargin+390,
         this.layout.topMargin -19, 10)
  };

  this.mapPercentToWidth = function(percent) {
    return map(percent,
               0,
               100,
               0,
               this.layout.plotWidth());
  };
}
