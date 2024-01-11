import { execCommand, crearDirectorioSiNoExiste } from "./utils.js";
import inquirer from "inquirer";
import moment from "moment";
import fs from "fs";

export async function downloadDumpFromURL(url, nombreDB, dstFolder) {
  try {
    const now = moment().format("YYYYMMDD");
    const dumpFile = `${nombreDB}_${now}.sql`;

    if (fs.existsSync(`${dstFolder}/${dumpFile}`)) {
      console.log(`! El archivo ${dumpFile} ya existe.`);
      return;
    }

    await crearDirectorioSiNoExiste(dstFolder);

    const rutaArchivo = `${dstFolder}/${dumpFile}`;

    const urlDumpCmd = `curl -o ${rutaArchivo}  ${url}`;

    const { stdout: crearDbOutput } = await execCommand(urlDumpCmd);

    return rutaArchivo;
  } catch (error) {
    console.error("Error al realizar las operaciones:", error);
  }
}

export async function obtainUrlParams() {
  try {
    const respuestas = await inquirer.prompt([
      {
        type: "input",
        name: "url",
        message: "Ingrese la url:",
      },
    ]);

    const url = respuestas.url;

    // console.log("Valores ingresados por el usuario:");
    // console.log("URL:", url);

    return {
      url,
    };
  } catch (error) {
    console.error("Ocurrió un error:", error);
  }
}
