import { config } from "dotenv";
config({ path: "config.conf" });

import path from "path";
import { selectDBNameFromList } from "./src/select-db-name-from-list.js";
import {
  getDatabaseNamesFromFolder,
  descomprimirArchivo,
} from "./src/utils.js";
import { selectDBDumpFromFolder } from "./src/select-db-dump-from-folder.js";
import { selectDockerContainers } from "./src/list-docker-containers.js";
import { cargarMysqlDumpEnContenedor } from "./src/load-dump-to-conainer.js";
import { verificarAWS } from "./src/check-aws-config.js";
import { verificarMysqldump } from "./src/check-mysqldump.js";
import { verificarCurl } from "./src/check-curl.js";
import { downloadDumpFromS3, obtainS3Params } from "./src/download-dump-s3.js";
import {
  downloadDumpFromDB,
  obtainMysqlParams,
} from "./src/download-dump-db.js";
import {
  downloadDumpFromURL,
  obtainUrlParams,
} from "./src/download-dump-url.js";
import {
  selectDBType,
  selectOperations,
  selectDumpMode,
} from "./src/prompts.js";
import { DUMP_CHOICES, ACTION_CHOICES } from "./src/constants.js";

const getDumpBaseChoices = async () => {
  const BASE_CHOICES = [];
  const [checkAWS, checkMysqldump, checkCurl] = await Promise.all([
    verificarAWS(),
    verificarMysqldump(),
    verificarCurl(),
  ]);
  if (checkAWS.error) {
    console.warn(
      `! La opcion <${DUMP_CHOICES.S3}> solo estara habiltada si se configura correctamente aws-cli`
    );
  } else {
    BASE_CHOICES.push(DUMP_CHOICES.S3);
  }

  if (checkMysqldump.error) {
    console.warn(
      `! La opcion <${DUMP_CHOICES.LIVE}> solo estara habiltada si se instala mysqldump`
    );
  } else {
    BASE_CHOICES.push(DUMP_CHOICES.LIVE);
  }
  if (checkCurl.error) {
    console.warn(
      `! La opcion <${DUMP_CHOICES.URL}> solo estara habiltada si se instala curl`
    );
  } else {
    BASE_CHOICES.push(DUMP_CHOICES.URL);
  }
  return BASE_CHOICES;
};

async function main() {
  if (!process.env.DUMP_FOLDER) {
    console.error(
      `x No se ha configurado correctamente el cli. Ejecute 'yarn run configure'`
    );
    return;
  }
  const dbType = await selectDBType();
  const targetListName = `${dbType}-db-list`;

  const operations = await selectOperations();

  if (operations.includes(ACTION_CHOICES.REFRESH)) {
    // Lógica para refrescar la lista de bases de datos
    console.log(
      "Seleccionaste refrescar la lista de bases de datos: NO IMPLEMENTADO"
    );
  }

  const dbName = await selectDBNameFromList(`${targetListName}`);
  const targetFolder = `${process.env.DUMP_FOLDER}/${dbType}/${dbName}`;
  let dumpMode = null;

  if (
    operations.includes(ACTION_CHOICES.DOWNLAD) ||
    operations.includes(ACTION_CHOICES.LOAD) // implies ACTION_CHOICES.DOWNLAD action
  ) {
    const BASE_CHOICES = await getDumpBaseChoices();

    if (operations.includes(ACTION_CHOICES.LOAD)) {
      const localDumps = await getDatabaseNamesFromFolder(targetFolder);

      const modeChoices = localDumps.length
        ? [DUMP_CHOICES.DISK, ...BASE_CHOICES]
        : BASE_CHOICES;

      dumpMode = await selectDumpMode(modeChoices);
    } else {
      dumpMode = await selectDumpMode(BASE_CHOICES);
    }
  }

  let targetDumpFile;
  if (dumpMode === DUMP_CHOICES.DISK) {
    const dumpFullName = await selectDBDumpFromFolder(targetFolder);

    const extension = path.extname(dumpFullName);
    const nameWithoutExtension = path.basename(dumpFullName, extension);

    let fileName = dumpFullName;
    if ([".tar.gz", ".gz"].includes(extension)) {
      fileName = nameWithoutExtension;
      await descomprimirArchivo(
        `${targetFolder}/${dumpFullName}`,
        `${targetFolder}/${nameWithoutExtension}`
      );
    }

    targetDumpFile = `${targetFolder}/${fileName}`;
  } else if (dumpMode === DUMP_CHOICES.S3) {
    const { s3Folder } = await obtainS3Params(dbType, dbName);
    targetDumpFile = await downloadDumpFromS3(dbName, s3Folder, targetFolder);
  } else if (dumpMode === DUMP_CHOICES.LIVE) {
    const { host, usuario, password } = await obtainMysqlParams();
    targetDumpFile = await downloadDumpFromDB(
      host,
      usuario,
      password,
      dbName,
      targetFolder
    );
  } else if (dumpMode === DUMP_CHOICES.URL) {
    const { url } = await obtainUrlParams();
    targetDumpFile = await downloadDumpFromURL(url, targetFolder);
  }

  if (operations.includes(ACTION_CHOICES.LOAD)) {
    const container = await selectDockerContainers(dbType);
    await cargarMysqlDumpEnContenedor(container.name, dbName, targetDumpFile);
  }

  if (operations.includes(ACTION_CHOICES.PURGE)) {
    // Lógica para borrar dumps antiguos
    console.log("Seleccionaste borrar dumps antiguos: NO IMPLEMENTADO");
    return;
  }
}

main();
