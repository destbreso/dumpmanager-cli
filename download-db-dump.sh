#!/bin/bash

source config.conf

DB_LIST_FILE=guachos-$DB_FOLDER-db-list

download_dump(){
  opt=$1
  if [[ ! " ${DB_OPTIONS[@]} " =~ " $opt " ]]; then
    echo "Opcion invalida $REPLY"
    exit 1  
  fi
  
  # echo "Seleccione una fecha de los últimos 7 días:"

  # for ((i=0; i<=6; i++)); do
  #     date=$(date "-$i day" +%Y%m%d)
  #     echo "$i) $date"
  # done

  # read -p "Ingrese el número correspondiente a la fecha: " choice

  # if (( choice >= 0 && choice <= 6 )); then
  #     selected_date=$(date -d "-$choice day" +%Y%m%d)
  #     echo "Ha seleccionado la fecha: $selected_date"
  # else
  #     echo "Opción inválida"
  #     exit 1
  # fi


  dbFolder=$opt
  # now=$selected_date
  now=`date +%Y%m%d`
  dumpFile=${opt}_$now.sql.gz
  echo "Se va a descargar $dumpFile"
  read -p "¿Estás seguro de continuar? (s/n): " response
  
  if [[ $response == [sS] ]]; then
    echo "Continuando..."
    dstFolder=$DUMP_FOLDER/$DB_FOLDER/$dbFolder
    if [ ! -d "$dstFolder" ]; then
      # Crear el directorio
      mkdir -p "$dstFolder"
      echo "Directorio creado: $dstFolder"
    fi
    # Descargar el archivo de S3 y mostrar la barra de progreso basada en el tamaño total del archivo
    # aws s3 cp s3://$BUCKET/$DB_FOLDER/$dbFolder/$dumpFile - | pv -p $(aws s3 ls -s s3://$BUCKET/$DB_FOLDER/$dbFolder/$dumpFile | awk '{print $3}') > $dstFolder/$dumpFile

    aws s3 cp s3://$BUCKET/$DB_FOLDER/$dbFolder/$dumpFile $dstFolder
  else
    echo "Cancelado."
  fi
  exit 0
}

# Arreglo para almacenar los elementos
declare -a DB_OPTIONS

while IFS= read -r line; do
  DB_OPTIONS+=("$line")
done < "$DB_LIST_FILE"

pick_db=1
# Verificar si se ha proporcionado una opción
if [ $# -gt 0 ]; then
    opt_database=$1
    pick_db=0
fi

if [ $pick_db -eq 1 ]; then
  PS3='Seleccione una opcion: '
  select opt in "${DB_OPTIONS[@]}"
  do
    download_dump $opt
    exit 0
  done
else
  download_dump $opt_database
  exit 0
fi






