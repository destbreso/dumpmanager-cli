#!/bin/bash

source config.conf

# Verifica si se proporciona la fecha límite como argumento
if [[ $# -eq 0 ]]; then
    echo "Debe proporcionar la fecha límite en formato YYYYMMDD como argumento."
    exit 1
fi

# Almacena la fecha límite proporcionada como argumento
fecha_limite=$1

# Función para verificar si una fecha es anterior a la fecha límite
function es_fecha_anterior() {
    fecha_archivo=$(echo "$1" | awk -F "_" '{print $NF}' | sed 's/\.sql$//')
    if [[ $fecha_archivo -lt $fecha_limite ]]; then
        echo "Fecha anterior": $1
        return 0
    else
        echo "Fecha posterior": $1
        return 1
    fi
}

# Recorre todos los subdirectorios y borra los archivos anteriores a la fecha límite
find "$DUMP_FOLDER" -type f -name "*_[0-9]*.sql" | while read -r archivo; do
    nombre_archivo=$(basename "$archivo")
    if es_fecha_anterior "$nombre_archivo"; then
        rm "$archivo"
        echo "Archivo borrado: $archivo"
    fi
done