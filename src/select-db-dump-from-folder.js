import inquirer from "inquirer";
import { getDatabaseNamesFromFolder } from "./utils.js";

export async function selectDBDumpFromFolder(folderPath) {
  const databases = getDatabaseNamesFromFolder(folderPath);

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
