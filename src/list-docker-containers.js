import Docker from "dockerode";
import inquirer from "inquirer";

// Crea una instancia de Dockerode
const docker = new Docker();

export async function listarContenedores(dbType) {
  try {
    // Obtiene la lista de todos los contenedores
    const containers = await docker.listContainers();

    // Filtra los contenedores que están corriendo y tienen la imagen de {dbType}
    const contenedores = containers.filter(
      (container) =>
        container.State === "running" && container.Image.includes(dbType)
    );

    // console.log("contenedores", contenedores);

    const result = contenedores.map((container) => ({
      name: container.Names[0].slice(1),
      id: container.Id,
    }));

    // console.log("contenedores", result);
    return result;
  } catch (error) {
    console.error(`Error al listar los contenedores de ${dbType}:`, error);
  }
}

export async function selectDockerContainers(dbType) {
  const contenedores = await listarContenedores(dbType);
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "container",
      message: "Selecciona un contenedor:",
      choices: contenedores,
    },
  ]);
  return contenedores.find((container) => container.name === answer.container);
}

// selectDockerContainers("mysql").then((container) => console.log(container));
