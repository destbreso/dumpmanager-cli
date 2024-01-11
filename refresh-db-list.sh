#!/bin/bash

source config.conf

if [ -z "$1" ]; then
  echo "Debe proporcionar el directorio de la base de datos como primer argumento."
  exit 1
fi
DB_FOLDER=$1

DB_LIST_FILE=$DB_FOLDER-db-list

# Lista original
lista=$(aws s3 ls s3://$BUCKET/$DB_FOLDER/)

# Eliminar los espacios en blanco delante del prefijo "PRE" y el "/" al final de cada elemento
lista_sin_espacios_y_prefijo_y_slash=$(echo "$lista" | sed 's/ *PRE //g; s/\/$//g')

# Imprimir la lista sin espacios en blanco delante del prefijo y el slash final
echo "$lista_sin_espacios_y_prefijo_y_slash" > $DB_LIST_FILE