#!/bin/bash

# directorio actual del script
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"

config_file=$BASE_DIR/config.conf

# Definir los campos de configuración en un arreglo
declare -a fields=(
  "BUCKET"
  "DUMP_FOLDER"
  "MYSQL_FOLDER"
  "MYSQL_HOST"
  "MYSQL_USER"
  "MYSQL_PASSWORD"
)

# Función para leer y mostrar la configuración actual
read_config() {
  if [ -f "$config_file" ]; then
    echo "Configuración actual:"
    echo ""
    cat "$config_file"
    echo ""
  else
    echo "No se encontró ninguna configuración existente."
    echo ""
  fi
}

# Función para guardar la configuración
save_config() {
  # Guardar la configuración en el archivo
  echo "Configuración guardada exitosamente en '$config_file'."
  echo ""
  exit 0
}

# Verificar si se proporcionó un archivo de configuración
if [ -z "$config_file" ]; then
  echo "Error: Debes proporcionar un archivo de configuración como parámetro."
  echo "Uso: ./script.sh <ruta_archivo_configuracion>"
  exit 1
fi

# Leer y mostrar la configuración actual
read_config

# Recorrer los campos y solicitar los valores
declare -A config_values  # Arreglo asociativo para almacenar los valores de configuración
for field in "${fields[@]}"; do
  read -p "Ingresa el valor para '$field': " value
  config_values[$field]=$value
done

# Mostrar la configuración actualizada
echo "Configuración actualizada:"
echo ""
for field in "${fields[@]}"; do
  echo "$field=${config_values[$field]}"
done

# Prompt para guardar la configuración
read -p "¿Deseas guardar la nueva configuración en '$config_file'? (S/N): " response
if [[ "$response" == "S" || "$response" == "s" ]]; then
  # Guardar la configuración
  for field in "${fields[@]}"; do
    echo "$field=${config_values[$field]}" >> "$config_file"
  done
  save_config
else
  echo "La configuración no se guardó."
  echo ""
fi