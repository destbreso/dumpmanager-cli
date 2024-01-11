import { execCommand } from "./utils.js";

const ERR_CODE = {
  AWS_OK: 0,
  AWS_NOT_INSTALLED: 1,
  AWS_INVALID_CREDENTIALS: 2,
};
export async function verificarAWS(estricto = false) {
  // Verificar si el comando 'aws' está instalado
  try {
    await execCommand("aws --version");
    // console.log('El comando "aws" está instalado.');
  } catch (error) {
    // console.error('El comando "aws" no está instalado:', error.message);
    return {
      error: ERR_CODE.AWS_NOT_INSTALLED,
    };
  }

  if (estricto) {
    // Verificar si las credenciales son válidas para acceder a AWS S3
    try {
      await execCommand("aws s3 ls");
      // console.log("Las credenciales son válidas para acceder a AWS S3.");
    } catch (error) {
      // console.error(
      //   "Las credenciales no son válidas para acceder a AWS S3:",
      //   error.message
      // );
      return {
        error: ERR_CODE.AWS_INVALID_CREDENTIALS,
      };
    }
  }

  return {
    success: true,
  };
}

// verificarAWS();
