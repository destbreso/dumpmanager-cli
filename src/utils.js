import fs from "fs";
import zlib from "zlib";
import util from "util";
import { exec } from "child_process";

const execCommand = util.promisify(exec);

function getDatabaseNamesFromFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    return [];
  }
  const fileNames = fs.readdirSync(folderPath);
  const databaseNames = fileNames
    .filter((x) => x[0] !== ".")
    .map((fileName) => fileName)
    .filter(Boolean);
  return databaseNames;
}

function readDatabasesFromFile(fileName) {
  const fileContent = fs.readFileSync(fileName, "utf8");
  const databases = fileContent.split("\n").filter(Boolean);
  return databases;
}

function crearDirectorioSiNoExiste(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
    // console.log(`Se ha creado el directorio: ${path}`);
  } else {
    // console.log(`El directorio ${path} ya existe.`);
  }
}

async function descomprimirArchivo(archivoEntrada, archivoSalida) {
  const archivoEntradaStream = fs.createReadStream(archivoEntrada);
  const archivoSalidaStream = fs.createWriteStream(archivoSalida);

  const descompresor = zlib.createGunzip();

  await new Promise((resolve, reject) => {
    archivoEntradaStream
      .pipe(descompresor)
      .pipe(archivoSalidaStream)
      .on("finish", () => {
        // console.log(`Archivo descomprimido guardado en: ${archivoSalida}`);
        resolve();
      })
      .on("error", reject);
  });

  // Eliminar archivo comprimido si la descompresión se realizó correctamente
  fs.unlink(archivoEntrada, (error) => {
    if (error) {
      console.error("Error al eliminar el archivo comprimido:", error);
    } else {
      // console.log("Archivo comprimido eliminado correctamente.");
    }
  });
}

export {
  execCommand,
  getDatabaseNamesFromFolder,
  readDatabasesFromFile,
  crearDirectorioSiNoExiste,
  descomprimirArchivo,
};
