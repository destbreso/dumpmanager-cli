import inquirer from "inquirer";
import { ACTION_CHOICES } from "./constants.js";

export const selectDBType = async () => {
  const choices = ["mysql"];
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "Selecciona un tipo de DB:",
      choices,
    },
  ]);

  return answer.option;
};

export const selectDumpMode = async (choices) => {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "Selecciona una opción:",
      choices,
    },
  ]);

  return answer.option;
};

export async function selectOperations() {
  const answer = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selection",
      message: "Selecciona una o varias operaciones:",
      choices: [
        ACTION_CHOICES.DOWNLAD,
        ACTION_CHOICES.LOAD,
        ACTION_CHOICES.REFRESH,
        ACTION_CHOICES.PURGE,
      ],
      default: ACTION_CHOICES.DOWNLAD,
    },
  ]);

  return answer.selection;
}
