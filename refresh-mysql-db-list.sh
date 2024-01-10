#!/bin/bash

source config.conf

DB_LIST_FILE=guachos-$DB_FOLDER-db-list

# Lista original
lista=$(aws s3 ls s3://$BUCKET/$DB_FOLDER/)

# Eliminar los espacios en blanco delante del prefijo "PRE" y el "/" al final de cada elemento
lista_sin_espacios_y_prefijo_y_slash=$(echo "$lista" | sed 's/ *PRE //g; s/\/$//g')

# Imprimir la lista sin espacios en blanco delante del prefijo y el slash final
echo "$lista_sin_espacios_y_prefijo_y_slash" > $DB_LIST_FILE