import {
  execCommand,
  crearDirectorioSiNoExiste,
  descomprimirArchivo,
} from "./utils.js";
import moment from "moment";
import inquirer from "inquirer";
import fs from "fs";

export async function downloadDumpFromS3(targetDb, s3Folder, dstFolder) {
  try {
    const now = moment().format("YYYYMMDD");
    const dumpFile = `${targetDb}_${now}.sql`;

    if (fs.existsSync(`${dstFolder}/${dumpFile}`)) {
      console.log(`! El archivo ${dumpFile} ya existe.`);
      return `${dstFolder}/${dumpFile}`;
    }

    // Descargar el archivo de S3 y mostrar la barra de progreso basada en el tamaño total del archivo
    // aws s3 cp s3://$BUCKET/$MYSQL_FOLDER/$dbFolder/$dumpFile - | pv -p $(aws s3 ls -s s3://$BUCKET/$MYSQL_FOLDER/$dbFolder/$dumpFile | awk '{print $3}') > $dstFolder/$dumpFile

    await crearDirectorioSiNoExiste(dstFolder);
    // console.log(`aws s3 cp s3://${s3Folder}/${dumpFile} ${dstFolder}`);
    const s3CopyCmd = `aws s3 cp s3://${s3Folder}/${dumpFile}.gz ${dstFolder}`;

    // Ejecutar los comandos en secuencia
    const { stdout: crearDbOutput } = await execCommand(s3CopyCmd);

    await descomprimirArchivo(
      `${dstFolder}/${dumpFile}.gz`,
      `${dstFolder}/${dumpFile}`
    );

    // console.log("Operaciones completadas correctamente.");
    return `${dstFolder}/${dumpFile}`;
  } catch (error) {
    console.error("Error al realizar las operaciones:", error);
  }
}

export async function obtainS3Params(dbType, dbName) {
  try {
    const respuestas = await inquirer.prompt([
      {
        type: "input",
        name: "s3Folder",
        message: "Ingrese el nombre de la carpeta en S3:",
        default: `${process.env.BUCKET}/${dbType}/${dbName}`,
      },
    ]);

    const s3Folder = respuestas.s3Folder;

    // console.log("Valores ingresados por el usuario:");
    // console.log("Carpeta en S3:", s3Folder);

    return {
      s3Folder,
    };
  } catch (error) {
    console.error("Ocurrió un error:", error);
  }
}
