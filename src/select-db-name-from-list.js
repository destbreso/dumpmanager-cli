import inquirer from "inquirer";
import { readDatabasesFromFile } from "./utils.js";

export async function selectDBNameFromList(fileName) {
  const databases = readDatabasesFromFile(fileName);

  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "database",
      message: "Selecciona una base de datos:",
      choices: databases,
    },
  ]);
  return answer.database;
}
