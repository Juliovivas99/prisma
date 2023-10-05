import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import Papa from 'papaparse';
import fs from 'fs';

function parseCSV(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
      const csvContent = fs.readFileSync(filePath, 'utf8');

      const parsedData = Papa.parse(csvContent, {  
          header: true,
          skipEmptyLines: true,
          delimiter: ',' 
      });

      if (parsedData.errors && parsedData.errors.length > 0) {
          reject(parsedData.errors);
      } else {
          resolve(parsedData.data);
      }
  });
}

async function createTasksFromCSV(): Promise<void> {
  const trainers: any[] = await prisma.trainer.findMany();
  console.log("Parsed CSV data:");
  const csvData = await parseCSV('./data.csv');
  console.log("Parsed data:", csvData);


  for (let trainer of trainers) {
      const tasksForThisTrainer = csvData
          .filter(row => row['Coaching Style'] === trainer.name) 
          .map(row => ({
              title: row['Daily Goal Prompt'],               
              shortDescription: row['Description (Why)'],     
              longDescription: row['Description (How)'],      
              order: parseInt(row['Daily Goal (Day)']),       
              trainerId: trainer.id,
              improvementArea: row['Desired Outcome']  //improvment typo                       
          }));
      console.log(`Tasks for ${trainer.name}:`, tasksForThisTrainer);
      console.log(`Creating ${tasksForThisTrainer.length} tasks for trainer ${trainer.name}`);

      await prisma.task.createMany({ data: tasksForThisTrainer });
  }
  console.log('Tasks created from CSV for each trainer');
}

async function main() {
    await createTasksFromCSV();
    await prisma.$disconnect();
}

main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
});



















// async function createTrainers() {
//     try {
//       const createdTrainers = await prisma.trainer.createMany({
//         data: [
//           { name: 'Coach Vincent Fury'},
//           { name: 'Coach Grace Shah' },
//           { name : 'Coach Olivia Turner'},
//           { name : 'Coach Bobby Quips'}
//         ],
//       });
  
//       console.log('Created trainers:', createdTrainers);
//     } catch (error) {
//       console.error('Error creating trainers:', error);
//     } finally {
//       await prisma.$disconnect();
//     }
//   }
  
//   createTrainers();

  