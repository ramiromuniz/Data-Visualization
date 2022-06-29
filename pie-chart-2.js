function PieChartTwo(x, y, diameter) {

  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.labelSpace = 40;

  this.get_radians = function(data) {
    var total = sum(data);
    var radians = [];

    for (let i = 0; i < data.length; i++) {
      radians.push((data[i] / total) * TWO_PI);
    }

    return radians;
  };

  this.draw = function(data, labels, colours, title) { //data is the column of raw data for year, so its going to have the percentages, and have a lenght of 21 as well.


  //Populate new array without the percentages, only the number of deaths.
  var dataOne = [];
  for (var i = 1; i < 11; i++)
      {
        dataOne.push(data[i])
      }
     
    // Test that data is not empty and that each input array is the
    // same length.
    if (dataOne.length == 0) {
      alert('Data has length zero!');
    } else if (![labels, colours].every((array) => {
      return array.length == dataOne.length;
    })) {
              alert(`Data (length: ${dataOne.length})
        Labels (length: ${labels.length})
        Colours (length: ${colours.length})
        Arrays must be the same length!`);
    }
      
      
    // https://p5js.org/examples/form-pie-chart.html

    var angles = this.get_radians(dataOne);
    var lastAngle = 0;
    var colour;
      
      
    for (var i = 0; i < dataOne.length; i++) {
      if (colours) {
        colour = colours[i];
      } else {
        colour = map(i, 0, dataOne.length, 0, 255);
      }

      stroke(2);
      strokeWeight(0);
      fill(colour);
        
//If the mouse is in the pie chart, it highlights the portion of the pie it's on and prints the percentages to the screen.
        
    var distance = dist(mouseX, mouseY, this.x, this.y);

    if(distance < diameter/2)
        {
            var angle = acos((mouseX - this.x) / (distance));

            if(mouseY < this.y)
                {
                    angle = TWO_PI - angle;
                }
            if(angle >= lastAngle && angle <= lastAngle + angles[i])
                {
                    strokeWeight(3);
                    push();
                    noStroke();
                    fill('black');
                    textSize(12);
                    text(data[i+11] + '%', this.x-((diameter/2)+40), this.y);
                    pop();
                }
        }


      arc(this.x, this.y,
          this.diameter, this.diameter,
          lastAngle, lastAngle + angles[i] + 0.001, PIE); //PIE so we draw a closed arc.
        
    

      if (labels) {
        this.makeLegendItem(labels[i], i, colour, data[i+11]); //data[i+11] are the percentages
      }

      lastAngle += angles[i];
    }

    if (title) {
      noStroke();
      textAlign('center', 'center');
      textSize(24);
      text(title, this.x, this.y - this.diameter * 0.6);
    }
  };

  this.makeLegendItem = function(label, i, colour, perc) {
    var x = this.x + 50 + this.diameter / 2;
    var y = this.y + (this.labelSpace * i) - this.diameter / 3;
    var boxWidth = this.labelSpace / 2;
    var boxHeight = this.labelSpace / 2;

    fill(colour);
    ellipse(x, y, boxWidth, boxHeight);
    fill('black');
    noStroke();
    textFont('Georgia');
    textAlign('left', 'center');
    textSize(12);
    text(label, x + boxWidth, y + (boxWidth / 2) - 10);
  };
}

