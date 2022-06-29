function MortalityRate() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Leading Causes of Death: 1999-2017';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'mortality-rate';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/mortality-rate/leading-causes-of-death-2.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
  };
    
  var percentages = [];
    
  this.setup = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Create a select DOM element.
    this.select = createSelect();
    this.select.position(970, 40);
      
      
    //Number of TOTAL DEATHS EVERY YEAR
    // Push the first row with total deaths data to totalDeaths array so we have an array, not an object
    var totalDeaths = [];
    totalDeaths.push(this.data.getRow(0).arr);

    //Push the rest of the deaths number for every cause
    var everyCause = [];
    for(var i = 1; i < this.data.getRowCount(); i++)
      {
         everyCause.push(this.data.getRow(i).arr);
      }
      
    //Calculate percentages for each row and push them to percentages array
    for(var r = 0; r < this.data.getRowCount()-1; r++)
      {
        for(var c = 1; c < this.data.getColumnCount(); c++)
            {
                percentages.push(round((everyCause[r][c]*100)/totalDeaths[0][c])) // Number of death of one cause times 100, divided in the total deaths
            }
      }
      
      //Now we have the array with all percentages in order, so we have to split them by cause.
      
      //SPLIT PERCENTAGES ARRAY INTO DEATH GROUPS
    function splitArray(arr, len) 
      {
        var groups = [], i = 0, n = arr.length;
        while (i < n) 
            {
                groups.push(arr.slice(i, i += len));
            }
          return groups;
      }
    var deathGroups = splitArray(percentages,19); // Array containing 10 arrays, each representing percentages of each death group


  //Now we have to modify the csv file in order to work with the new data we have.

  //ADD ROWS WITH PERCENTAGES
  var diseaseId = ['HD%', 'Cancer%', 'UI%', 'CLRD%', 'Stroke%','AD%', 'Diabetes%', 'Pneumonia%', 'KD%', 'Suicide%'];

  // The file now has 10 rows, so we are going to add the new data in the row number 11 to 21.

  //ADD CAUSE ID TO THE FIRST COLUMN STARTING IN ROW 11
  for(var i = 0; i < diseaseId.length; i++)
      {
           this.data.addRow();
           this.data.setString(i+11, 0, diseaseId[i]);
      }

  // WRITE THE PERCENTAGES INTO THE DATA TABLE SO NOW WE ARE WORKING WITH A LARGER DATASET WHICH CONTAINS THE PERCENTAGES
  for(var r = 11; r < this.data.getRowCount(); r++)
      {
        for(var c = 1; c < this.data.getColumnCount(); c++)
            {
                this.data.setNum(r, c, deathGroups[r-11][c-1]);  
            }
      }

      
      
    // Fill the options with all years
    var years = this.data.columns;


    // First entry is empty.
    for (let i = 1; i < years.length; i++) {
      this.select.option(years[i]);
    }

      
  };

  this.destroy = function() {
    this.select.remove();
  };

  // Create a new pie chart object.
  this.pie = new PieChartTwo(width / 2, height / 2, width * 0.4);

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
    

    // Get the value of the year we're interested in from the
    // select item.
    var year = this.select.value();

    // Get the column of raw data for year.
    var col = this.data.getColumn(year);
    
     
    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    // Copy the row labels from the table (the first item of each row until row 11, because after that we have the percentages and we dont want them as labels).
    var labels = [];
    for (var i = 1; i < 11; i++)
      {
        labels.push(this.data.get(i, 0));
      }   
 
    // Colour to use for each category.
    var colours = [color(38,169,108), color(219,22,47), color(229,223,172), color(95,117,142), color(239,247,207), color(186,217,181), color(171,163,97), color(115,44,44), color(214,140,69), color(153,178,221)];
      
    // Make a title.
    var title = 'Leading Causes of Death of ';
    
    // Draw the pie chart!
    this.pie.draw(col, labels, colours, title); 
  };
}


