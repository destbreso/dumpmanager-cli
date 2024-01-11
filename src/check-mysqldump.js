import { execCommand } from "./utils.js";

const ERR_CODE = {
  MYSQLDUMP_OK: 0,
  MYSQLDUMP_NOT_INSTALLED: 1,
};
export async function verificarMysqldump() {
  try {
    await execCommand("mysqldump --version");
  } catch (error) {
    return {
      error: ERR_CODE.MYSQLDUMP_NOT_INSTALLED,
    };
  }

  return {
    success: true,
  };
}

// verificarAWS();
