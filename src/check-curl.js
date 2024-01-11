import { execCommand } from "./utils.js";

const ERR_CODE = {
  OK: 0,
  NOT_INSTALLED: 1,
};
export async function verificarCurl() {
  try {
    await execCommand("curl --version");
  } catch (error) {
    return {
      error: NOT_INSTALLED,
    };
  }

  return {
    success: true,
  };
}

// verificarAWS();
