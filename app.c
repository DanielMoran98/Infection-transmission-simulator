#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <pthread.h>

#define rows 500
#define columns 500
#define generations 150
#define MAX_THREADS 4

int cells[rows][columns];

//Declare our multipliers. These are used to determine how a cell is effected by its surrounding neighbors
const float zNeighborMultiplier =  0.025;
const float hNeighborMultiplier = -0.001;
const float mNeighborMultiplier = -0.75;

int zombieCount = 0;
int humanCount = 0;
int militaryArrived = 0;
int generation = 0;

FILE* outputTXT;

//Function declarations
void *evolve(void *rank);                //Uses multiplt threads to loop around each cell and invoke checkNeighbors() on it
void generate();                         //Populates our grid with random values
void logStates();                        //Outputs our data to a file after each generation
void checkNeighbors(int row, int col);   //Checks the surrounding cells of a particular cell and decides what will happen to that cell in the next generation



void *evolve(void *rank)
{
  long my_rank = (long) rank;
  int row = 0;
  int col = 0;
  int threadMinRow;
  int threadMaxRow;

  threadMinRow = (rows / MAX_THREADS ) * my_rank;
  threadMaxRow = ((rows / MAX_THREADS) * 2 ) * my_rank;
  row = threadMinRow;

  if(generation < generations)
  {
      for(row = 0; row < rows; row++) //Loops through each row
      {
	if(row >= threadMinRow && row <= threadMaxRow)
	{
	  for(col = 0; col < columns; col++) //Loops through each column
	  {
	    checkNeighbors(row, col);
	  }
	}

      }

      if(zombieCount > (rows*columns)*0.5 && militaryArrived == 0) //Bring in military if zombie population >50%
      {

        int i;
        for(i=0; i < columns; i=i+4)
        {
            cells[rows/2][i] = 4; //Place military cells across the center row every 4 cells
        }
        militaryArrived++;
      }
  }
}

void generate() //Populates the cells at the beginning
{
  int row = 0; //Col counter
  int col = 0; //Row counter
  printf("Running generate()\n");

  for(row = 0; row < rows; row++) // Loops through each row
  {
    for(col = 0; col < columns; col++)//Loops through each column
    {

      float random = (float)rand()/(float)RAND_MAX;
      if(random > 0.998)
      {
        cells[row][col] = 2; //0.02% chance of zombie
        zombieCount++;
      }else{
        cells[row][col] = 1;//99.8% chance of human
        humanCount++;
      }

    }
  }
  printf("Generating finished\n");
}

void logStates() //Logs state of cells to file
{
  int row = 0; //Col counter
  int col = 0; //Row counter

  for(row = 0; row < rows; row++) // Loops through each row
  {
    for(col = 0; col < columns; col++)//Loops through each column
    {
      int print = cells[row][col];
      checkNeighbors(row, col);
      if(col == columns-1)
      {
        fprintf(outputTXT, "%d" , print);
      }else{
        fprintf(outputTXT, "%d," , print); //Prints , to seperate cells
      }
    }
    fprintf(outputTXT, "-");  //Prints - to seperate rows
  }
  fprintf(outputTXT, "."); //Prints . to seperate generations

}

void checkNeighbors(int row, int col)
{
  float chanceOfInfection = 0;
  int humanNeighbors = 0;
  int zombieNeighbors = 0;
  int deceasedNeighbors = 0;
  int militaryNeighbors = 0;

  int neighborN = cells[(row) % rows][(col+1) % columns];
  int neighborS = cells[(row) % rows][(col-1) % columns];
  int neighborE = cells[(row+1) % rows][(col) % columns];
  int neighborW = cells[(row-1) % rows][(col) % columns];
  int neighborNW = cells[(row-1) % rows][(col+1) % columns];
  int neighborNE = cells[(row+1) % rows][(col+1) % columns];
  int neighborSW = cells[(row-1) % rows][(col-1) % columns];
  int neighborSE = cells[(row+1) % rows][(col-1) % columns];

  if(cells[row][col] == 1)
  {
    if(neighborN == 1) {humanNeighbors++;}   //Checks each neighbor and updates humanNeighbors value
    if(neighborS == 1) {humanNeighbors++;}
    if(neighborE == 1) {humanNeighbors++;}
    if(neighborW == 1) {humanNeighbors++;}
    if(neighborNW == 1) {humanNeighbors++;}
    if(neighborNE == 1) {humanNeighbors++;}
    if(neighborSW == 1) {humanNeighbors++;}
    if(neighborSE == 1) {humanNeighbors++;}

    if(neighborN == 2) {zombieNeighbors++;}   //Checks each neighbor and updates zombieNeighbors value
    if(neighborS == 2) {zombieNeighbors++;}
    if(neighborE == 2) {zombieNeighbors++;}
    if(neighborW == 2) {zombieNeighbors++;}
    if(neighborNW == 2) {zombieNeighbors++;}
    if(neighborNE == 2) {zombieNeighbors++;}
    if(neighborSW == 2) {zombieNeighbors++;}
    if(neighborSE == 2) {zombieNeighbors++;}

    if(neighborN == 3) {deceasedNeighbors++;}   //Checks each neighbor and updates deceasedNeighbors value
    if(neighborS == 3) {deceasedNeighbors++;}
    if(neighborE == 3) {deceasedNeighbors++;}
    if(neighborW == 3) {deceasedNeighbors++;}
    if(neighborNW == 3) {deceasedNeighbors++;}
    if(neighborNE == 3) {deceasedNeighbors++;}
    if(neighborSW == 3) {deceasedNeighbors++;}
    if(neighborSE == 3) {deceasedNeighbors++;}

    if(neighborN == 4) {militaryNeighbors++;}   //Checks each neighbor and updates militareighbors value
    if(neighborS == 4) {militaryNeighbors++;}
    if(neighborE == 4) {militaryNeighbors++;}
    if(neighborW == 4) {militaryNeighbors++;}
    if(neighborNW == 4) {militaryNeighbors++;}
    if(neighborNE == 4) {militaryNeighbors++;}
    if(neighborSW == 4) {militaryNeighbors++;}
    if(neighborSE == 4) {militaryNeighbors++;}
  }

  if(cells[row][col] == 4) //If cell is military
  {
    if(neighborN == 2) {cells[(row) % rows][(col+1) % columns] = 3;}   //Checks each neighbor and updates humanNeighbors value
    if(neighborS == 2) {cells[(row) % rows][(col-1) % columns] = 3;}
    if(neighborE == 2) {cells[(row+1) % rows][(col) % columns] = 3;}
    if(neighborW == 2) {cells[(row-1) % rows][(col) % columns] = 3;}
    if(neighborNW == 2) {cells[(row-1) % rows][(col+1) % columns] =3;}
    if(neighborNE == 2) {cells[(row+1) % rows][(col+1) % columns] =3;}
    if(neighborSW == 2) {cells[(row-1) % rows][(col-1) % columns] =3;}
    if(neighborSE == 2) {cells[(row+1) % rows][(col-1) % columns] =3;}


    int ran = rand() % 8; //Random value 0-7
    if(ran == 0)
    {
      if(cells[(row) % rows][(col+1) % columns] == 1 || cells[(row) % rows][(col+1) % columns] == 3)
      {
        int temp = cells[(row) % rows][(col+1) % columns];
        cells[(row) % rows][(col+1) % columns] = 4;
        cells[row][col] = temp;
      }
    }else if(ran == 1)
    {
      if(cells[(row) % rows][(col-1) % columns] == 1 || cells[(row) % rows][(col-1) % columns] == 3 )
      {
        int temp = cells[(row) % rows][(col-1) % columns];
        cells[(row) % rows][(col-1) % columns] = 4;
        cells[row][col] = temp;
      }
    }else if(ran == 2)
    {
      if(cells[(row+1) % rows][(col) % columns] == 1 || cells[(row+1) % rows][(col) % columns] == 3 )
      {
        int temp = cells[(row+1) % rows][(col) % columns];
        cells[(row+1) % rows][(col) % columns] = 4;
        cells[row][col] = temp;
      }
    }else if(ran == 3)
    {
      if(cells[(row-1) % rows][(col) % columns] == 1 || cells[(row-1) % rows][(col) % columns] == 3)
      {
        int temp = cells[(row-1) % rows][(col) % columns];
        cells[(row-1) % rows][(col) % columns]=4;
        cells[row][col] = temp;
      }
    }else if(ran == 4)
    {
      if(cells[(row-1) % rows][(col+1) % columns] == 1 ||  cells[(row-1) % rows][(col+1) % columns] == 3)
      {
        int temp = cells[(row-1) % rows][(col+1) % columns];
        cells[(row-1) % rows][(col+1) % columns] = 4;
        cells[row][col] = temp;
      }
    }else if(ran == 5)
    {
      if(cells[(row+1) % rows][(col+1) % columns] == 1 || cells[(row+1) % rows][(col+1) % columns] == 3 )
      {
        int temp = cells[(row+1) % rows][(col+1) % columns];
        cells[(row+1) % rows][(col+1) % columns] = 4;
        cells[row][col] = temp;
      }
    }else if(ran == 6)
    {
      if(cells[(row-1) % rows][(col-1) % columns] == 1 || cells[(row-1) % rows][(col-1) % columns] == 3 )
      {
        int temp = cells[(row-1) % rows][(col-1) % columns];
        cells[(row-1) % rows][(col-1) % columns] = 4;
        cells[row][col] = temp;
      }
    }else if(ran == 7)
    {
      if(cells[(row+1) % rows][(col-1) % columns] == 1 || cells[(row+1) % rows][(col-1) % columns] == 3)
      {
        int temp = cells[(row+1) % rows][(col-1) % columns];
        cells[(row+1) % rows][(col-1) % columns] = 4;
        cells[row][col] = temp;
      }
    }
  }

  chanceOfInfection = zNeighborMultiplier * zombieNeighbors;    		                	// Increases the chance of infection based on zombie neighbors
  chanceOfInfection = (hNeighborMultiplier * humanNeighbors) + chanceOfInfection;   	// Reduces the chance of infection based on human neighbors
  chanceOfInfection = (mNeighborMultiplier * militaryNeighbors) + chanceOfInfection;	// Reduces the chance of infection based on military neighbors

  float random = (float)rand()/(float)RAND_MAX;
  if(random < chanceOfInfection) //If the random value between 0.0-1.0 is below the chance of infection value, infect that cell
  {
    cells[row][col] = 2;
    zombieCount++;
    humanCount--;
  }
}

int main()
{
  clock_t start = clock();	//Begin our timer
  srand(time(NULL));		//Declare our seed used for our random values
  outputTXT = fopen("output.txt", "w");
  generate();

  //THREAD SECTION
  pthread_t threads[MAX_THREADS];
  int thread = 0;
  int genIncremented = 0;

  //Create our threads
  for(thread = 0; thread < MAX_THREADS; thread++)
  {
    pthread_create(&threads[thread], NULL, evolve, (void *) thread);
  }

  while(generation < generations)
  {
    //Await threads
    for(thread = 0; thread < MAX_THREADS; thread++)
    {
      pthread_join(threads[thread], NULL);
    }

    evolve((void *) thread);

    if(genIncremented == 0)
    {
     generation++;
     logStates();
     genIncremented++;
    }

    genIncremented = 0;
    printf(" -----Generation %d complete!-----\n", generation);

  }

  printf("Output finished and ready to run.");
  fclose(outputTXT);
  clock_t end = clock();
  double timeSpent = (double)(end - start) / CLOCKS_PER_SEC;
  printf("\nTime taken: %f", timeSpent);
  return 0;
}
