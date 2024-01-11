import { execCommand } from "./utils.js";

export async function cargarMysqlDumpEnContenedor(
  targetContainer,
  targetDb,
  targetDump
) {
  try {
    // Comando para crear la base de datos si no existe
    const crearDbCmd = `docker exec -i ${targetContainer} mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS ${targetDb}"`;

    // Comando para cargar el dump en la base de datos
    const cargarDumpCmd = `docker exec -i ${targetContainer} mysql -uroot -proot ${targetDb} < ${targetDump}`;

    // Ejecutar los comandos en secuencia
    const { stdout: crearDbOutput } = await execCommand(crearDbCmd);
    // console.log("Resultado de crear la base de datos:", crearDbOutput);

    const { stdout: cargarDumpOutput } = await execCommand(cargarDumpCmd);
    // console.log("Resultado de cargar el dump:", cargarDumpOutput);

    // console.log("Operaciones completadas correctamente.");
  } catch (error) {
    console.error("Error al realizar las operaciones:", error);
  }
}

// Ejemplo de uso
// const targetContainer = "guachos-mysql-local";
// const targetDb = "acreditacionfitcuba";
// const targetDump =
//   "/Volumes/Data/WORK/GUAJIRITOS/DB_DUMPS/mysql/acreditacionfitcuba/acreditacionfitcuba_20240103.sql";

// cargarMysqlDumpEnContenedor(targetContainer, targetDb, targetDump);
