import { execCommand, crearDirectorioSiNoExiste } from "./utils.js";
import inquirer from "inquirer";
import moment from "moment";
import fs from "fs";

export async function downloadDumpFromDB(
  host,
  usuario,
  contraseña,
  nombreDB,
  dstFolder
) {
  try {
    const now = moment().format("YYYYMMDD");
    const dumpFile = `${nombreDB}_${now}.sql`;

    if (fs.existsSync(`${dstFolder}/${dumpFile}`)) {
      console.log(`! El archivo ${dumpFile} ya existe.`);
      return;
    }

    await crearDirectorioSiNoExiste(dstFolder);

    const rutaArchivo = `${dstFolder}/${dumpFile}`;

    const dbDumpCmd = `mysqldump --host=${host} --user=${usuario} --password=${contraseña} ${nombreDB} > ${rutaArchivo}`;

    const { stdout: crearDbOutput } = await execCommand(dbDumpCmd);

    return rutaArchivo;
  } catch (error) {
    console.error("Error al realizar las operaciones:", error);
  }
}

export async function obtainMysqlParams() {
  try {
    const respuestas = await inquirer.prompt([
      {
        type: "input",
        name: "host",
        message: "Ingrese el Host:",
        default: process.env.MYSQL_HOST,
      },
      {
        type: "input",
        name: "usuario",
        message: "Ingrese el usuario:",
        default: process.env.MYSQL_USER,
      },
      {
        type: "input",
        name: "password",
        message: "Ingrese la contraseña:",
        default: process.env.MYSQL_PASSWORD,
      },
    ]);

    const host = respuestas.host;
    const usuario = respuestas.usuario;
    const password = respuestas.password;

    // console.log("Valores ingresados por el usuario:");
    // console.log("Host:", host);
    // console.log("Usuario:", usuario);
    // console.log("Password:", password);

    return {
      host,
      usuario,
      password,
    };
  } catch (error) {
    console.error("Ocurrió un error:", error);
  }
}
