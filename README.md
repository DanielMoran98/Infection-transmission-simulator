# Simulating the spread of an infection using a cellular automoton.

## About
For this project I wanted to be able to use a huge cellular automaton for my simulation, so since it would take so long to do all the calculations for each generation I decided to use a multithreaded approach, as well as splitting my application into two programs.

- A multithreaded C program which will do all the calculations and output data for each generation to a file.
- A JavaScript program to read in this output file, and display the data alongside live statistics for the current simulation.

## Technologies Used
- C
  - PThread library

- JavaScript
  - Node.js
  - Terra.js
  - Charts.js

## To use
This program is displayed on a webserver but is currently not hosted, so to run you will need Node.js installed.

- Open the project folder with a CLI and use the command ```npm install``` to install all dependencies.
- Then use ```node app``` to run the program.
- Finally go to ```localhost:3000``` on a web browser to start.

**Note:** The provided 'output.txt' will allow the simulation to run but since this project uses the PThreads library. It is only possible to generate and run additional simulations unless using Linux.

## Demonstration
The following YouTube video shows a simulation from start to finish.
[![YOUTUBE VIDEO](https://i.imgur.com/HleJbJG.png)](https://www.youtube.com/watch?v=Ei_PS6TsFmw)
