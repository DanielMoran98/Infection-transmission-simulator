//Rows Columns
const rows =100;
const columns = 100;
var generationCounter = 0;
var generations = 500;
//Array for LineChart progression
var humanArray = [];
var zombieArray = [];
var deceasedArray = [];
var militaryArray = [];
var latentArray = [];
var generationArray = [];
//Array for Display of Simulation
var rowArray = [];
//Incrementing counters
var humanCount= 0;
var zombieCount= 0;
var latentCount= 0;
var deceasedCount= 0;
var militaryCount= 0;


//Read file using jquery Live-sever must be enabled
function readFile()
{
  $.get('output.txt', function(data) {
      outputTXT = data;
      generations = outputTXT.split(".");
      draw();
  });
}

//Function Draws grid and Charts
function draw() {
  document.getElementById('Content').innerHTML ='<div id="simulationGrid"></div>';
  var t = new terra.Terrarium(rows, columns, {
    id: 'mySimulation',
    cellSize: 5,
    insertAfter: document.getElementById('simulationGrid')
  });

  //Defining variables for grid
  var a = '1', b = '2' , c = '3' , d = '4' , e = '5',f = '6',g = '7',h ='8';
  //Creating Each data type for grid
  terra.registerCreature({
    type: a,
    color: [127, 255, 0]
  });
  terra.registerCreature({
    type: b,
    color: [255, 0, 0]
  });
  terra.registerCreature({
    type: c,
    color: [255, 255, 255]
  });
  terra.registerCreature({
    type: d,
    color: [0, 181, 204]
  });
  terra.registerCreature({
    type: e,
    color: [0,100,0]
  });
  terra.registerCreature({
    type: f,
    color: [0,100,0]
  });
  terra.registerCreature({
    type: g,
    color: [0,100,0]
  });
  terra.registerCreature({
    type: h,
    color: [0,100,0]
  });
  //Gen Counter is under 299 get % and display charts
  if(generationCounter <= 500){
  var  humSize = humanCount * 0.010;
  var  zombieSize = zombieCount * 0.010;
  var  deceasedSize = deceasedCount * 0.010;
  var  latentSize = latentCount * 0.010;
  var  militarySize = militaryCount * 0.010;
  //making grid with rowArray defined in evolve
  t.grid = t.makeGrid(rowArray);
  rowArray = [];
  //Drawing grid
  t.draw();
  //Getting Canvas for Pie Chart
  document.getElementById('canvas').innerHTML = "";
  let piec =  document.getElementById('canvas').getContext('2d');
  //pie data calls incremented counts
  data = {
    labels: ['Human', 'Zombie', 'Deceased', 'Military', 'Latent'],
            datasets: [{
                data: [humanCount, zombieCount, deceasedCount , militaryCount , latentCount ],
                backgroundColor: ['green', 'red','white', 'blue' , 'black'],
            }]
  };
  var myPieChart = new Chart(piec, {
    type: 'pie',
    data: data,
    options: {
        tooltips: {enabled: false},
        hover: {mode: null},
        animation: {
            duration: 0, // general animation time
        },
        hover: {
            animationDuration: 0, // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
    }
  });
  //line Chart
  var line = document.getElementById('canvasLine').getContext('2d');
  var chart = new Chart(line, {
      type: 'line',

      //Calls arrays filled with values for gen
      data: {
          labels: generationArray,
          datasets: [{
              label: "Human",
              borderColor: 'green',
              data: humanArray,
              fill: false,
            },
            {
              label: "Zombie",
              borderColor: 'red',
              data: zombieArray,
              fill: false,
            },
            {
              label: "Deceased",
              borderColor: 'white',
              data: deceasedArray,
              fill: false,
            },
            {
              label: "Military",
              borderColor: 'blue',
              data: militaryArray,
              fill: false,
            },
            {
              label: "Latent",
              borderColor: 'black',
              data: latentArray,
              fill: false,
            },
        ]
      },

      options: {
            responsive: true,
            tooltips: {enabled: false},
            hover: {mode: null},
            animation: {
                duration: 0, // general animation time
            },
            hover: {
                animationDuration: 0, // duration of animations when hovering an item
            },
            responsiveAnimationDuration: 0, // animation duration after a resize
      }
  });
  //Getting % from counters fixing them to 2 decmil
  humSize = humSize.toFixed(2);
  zombieSize = zombieSize.toFixed(2);
  deceasedSize = deceasedSize.toFixed(2);
  militarySize = militarySize.toFixed(2);
  latentSize = latentSize.toFixed(2);

  console.log("the gen is " + generationCounter + "the human % is " + humSize);
  $("#humanCounter").text("Humans: "+ humSize +" %");
  $("#zombieCounter").text("Zombies: "+ zombieSize +" %");
  $("#deceasedCounter").text("Deceased: "+ deceasedSize +" %");
  $("#militaryCounter").text("Military: "+ militarySize +" %");
  $("#latentCounter").text("Latent: "+ latentSize +" %");
  humanCount =0;
  zombieCount = 0;
  deceasedCount =0;
  militaryCount = 0;
  latentCount = 0;
  }

  //Incrementing Gen
  generationArray.push("Generation" +generationCounter);
  $("#genCounter").text("Generation: " +generationCounter+"/"+(generations.length-1));
  generationCounter++;
  //looping for next gen
  evolve();
}

function evolve() //Loops around and changes cell states depending on values in output.txt
{
  var thisGen = generations[generationCounter];
  var rows = thisGen.split("-");
  var cellCounter = 0;
  var rowCounter = 0;
  for(rowCounter = 0; rowCounter < rows.length; rowCounter++) //Loop through rows
  {
    rowArray.push(rows[rowCounter]);
    var cells = rows[rowCounter].split(",");

    for(cellCounter = 0; cellCounter < cells.length; cellCounter++) // Loop through cells in each row
    {
      if(cells[cellCounter] == 1)
      {
        humanCount++;
      }
      if(cells[cellCounter] == 2)
      {
        zombieCount++;
      }if(cells[cellCounter] == 3)
      {
        deceasedCount++;
      }
      if(cells[cellCounter] == 4)
      {
        militaryCount++;
      }
      if(cells[cellCounter] == 5)
      {
        latentCount++;
      }
      if(cells[cellCounter] == 6)
      {
        latentCount++;
      }
      if(cells[cellCounter] == 7)
      {
        latentCount++;
      }
      if(cells[cellCounter] == 8)
      {
        latentCount++;
      }
    }
  }
  humanArray.push(humanCount);
  zombieArray.push(zombieCount);
  militaryArray.push(militaryCount);
  deceasedArray.push(deceasedCount);
  latentArray.push(latentCount);
  setTimeout(function(){ draw(); 3000 });
}

function setup()
{
  readFile();
}

$(document).ready ( function(){
//cust gen through input
 $( "#CustomGen" ).click(function() {
   generationCounter = $( "#Generation" ).val();
   evolveNoLoop();
 });
 //start Simulation
 $( "#BeginSimulaton" ).click(function() {
   setup();
   generationCounter = 0;
 });

});


//Same Functions with no loop
function evolveNoLoop() //Loops around and changes cell states depending on values in output.txt
{
  var thisGen = generations[generationCounter];
  var rows = thisGen.split("-");
  var cellCounter = 0;
  var rowCounter = 0;
  for(rowCounter = 0; rowCounter < rows.length; rowCounter++) //Loop through rows
  {
    rowArray.push(rows[rowCounter]);
    var cells = rows[rowCounter].split(",");

    for(cellCounter = 0; cellCounter < cells.length; cellCounter++) // Loop through cells in each row
    {
      if(cells[cellCounter] == 1)
      {
        humanCount++;
      }
      if(cells[cellCounter] == 2)
      {
        zombieCount++;
      }if(cells[cellCounter] == 3)
      {
        deceasedCount++;
      }
      if(cells[cellCounter] == 4)
      {
        militaryCount++;
      }
      if(cells[cellCounter] == 5)
      {
        latentCount++;
      }
      if(cells[cellCounter] == 6)
      {
        latentCount++;
      }
      if(cells[cellCounter] == 7)
      {
        latentCount++;
      }
      if(cells[cellCounter] == 8)
      {
        latentCount++;
      }
    }
  }

  setTimeout(function(){ drawNoLoop(); 3000 });
}


function drawNoLoop() {
  document.getElementById('Content').innerHTML ='<div id="simulationGrid"></div>';
  var t = new terra.Terrarium(rows, columns, {
    id: 'simulation',
    cellSize: 5,
    background: [22, 22, 22],
    insertAfter: document.getElementById('simulationGrid')
  });

  var a = '1', b = '2' , c = '3' , d = '4' , e = '5',f = '6',g = '7',h ='8';
  //Creating Each data type for grid
  terra.registerCreature({
    type: a,
    color: [127, 255, 0]
  });
  terra.registerCreature({
    type: b,
    color: [255, 0, 0]
  });
  terra.registerCreature({
    type: c,
    color: [255, 255, 255]
  });
  terra.registerCreature({
    type: d,
    color: [0, 181, 204]
  });
  terra.registerCreature({
    type: e,
    color: [0,100,0]
  });
  terra.registerCreature({
    type: f,
    color: [0,100,0]
  });
  terra.registerCreature({
    type: g,
    color: [0,100,0]
  });
  terra.registerCreature({
    type: h,
    color: [0,100,0]
  });
  //Gen Counter is under 299 get % and display charts
  if(generationCounter <= 500){
  var  humSize = humanCount * 0.010;
  var  zombieSize = zombieCount * 0.010;
  var  deceasedSize = deceasedCount * 0.010;
  var  latentSize = latentCount * 0.010;
  var  militarySize = militaryCount * 0.010;
  //making grid with rowArray defined in evolve
  t.grid = t.makeGrid(rowArray);
  rowArray = [];
  //Drawing grid
  t.draw();
  //Getting Canvas for Pie Chart
  document.getElementById('canvas').innerHTML = "";
  let piec =  document.getElementById('canvas').getContext('2d');
  //pie data calls incremented counts
  data = {
    labels: ['Human', 'Zombie', 'Deceased', 'Military', 'Latent'],
            datasets: [{
                data: [humanCount, zombieCount, deceasedCount , militaryCount , latentCount ],
                backgroundColor: ['green', 'red','white', 'blue' , 'black'],
            }]
  };
  var myPieChart = new Chart(piec, {
    type: 'pie',
    data: data,
    options: {
        tooltips: {enabled: false},
        hover: {mode: null},
        animation: {
            duration: 0, // general animation time
        },
        hover: {
            animationDuration: 0, // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
    }
  });
document.getElementById('canvasLine').innerHTML = "";
bardata = {
  labels: ['Human', 'Zombie', 'Deceased', 'Military'],
          datasets: [{
              data: [humanCount, zombieCount, deceasedCount , militaryCount ],
              backgroundColor: ['green', 'red','white', 'blue'],
          }]
};
var barChat = document.getElementById('canvasLine').getContext('2d');
var bchart = new Chart(barChat, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: data,

    // Configuration options go here
    options: {
        tooltips: {enabled: false},
        hover: {mode: null},
        animation: {
            duration: 0, // general animation time
        },
        hover: {
            animationDuration: 0, // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
    }
});

//Getting % from counters fixing them to 2 decmil
humSize = humSize.toFixed(2);
zombieSize = zombieSize.toFixed(2);
deceasedSize = deceasedSize.toFixed(2);
militarySize = militarySize.toFixed(2);
latentSize = latentSize.toFixed(2);

console.log("the gen is " + generationCounter + "the human % is " + humSize);
$("#humanCounter").text("Humans: "+ humSize +" %");
$("#zombieCounter").text("Zombies: "+ zombieSize +" %");
$("#deceasedCounter").text("Deceased: "+ deceasedSize +" %");
$("#militaryCounter").text("Military: "+ militarySize +" %");
$("#latentCounter").text("Latent: "+ latentSize +" %");
humanCount =0;
zombieCount = 0;
deceasedCount =0;
militaryCount = 0;
latentCount = 0;
}

//Incrementing Gen
generationArray.push("Generation" +generationCounter);
$("#genCounter").text("Generation: " +generationCounter+"/"+(generations.length-1));
}
