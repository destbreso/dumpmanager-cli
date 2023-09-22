#!/bin/bash

source config.conf

DB_LIST_FILE=guachos-$DB_FOLDER-db-list
target_containers=$(docker ps | grep mysql | sed -E "s/.* ([^ ]+)$/\1/")

ensure_dump(){
  target_dump=$1
  if [ -f "$target_dump" ]; then
      echo "ensure_dump: El archivo existe: $target_dump"
  else
      echo "ensure_dump: El archivo no existe: $target_dump"
      if [ -f "$target_dump_gz" ]; then
        # echo "El archivo existe: $target_dump_gz"
        if [ ! -d "$dstFolder" ]; then
          # Crear el directorio
          mkdir -p "$dstFolder"
          echo "ensure_dump: Directorio creado: $dstFolder"
        else
            echo "ensure_dump: El directorio ya existe: $dstFolder"
        fi
        # Descomprimir el archivo
        gunzip "$target_dump_gz"
        echo "ensure_dump: Archivo descomprimido."
      else
          echo "ensure_dump: El archivo no existe: $target_dump_gz"
          
          read -p "ensure_dump: ¿Desea descargar el dump? (s/n): " response
          if [[ $response == [sS] ]]; then
            echo "ensure_dump: Continuando..."
            
            db_downlad=$(bash download-guachos-database-dump.sh $opt)
            # Verificar el estado de salida
            db_downlad=$?
            # Verificar si el comando se ejecutó correctamente
            if [ $db_downlad -eq 0 ]; then
                echo "ensure_dump: El comando se ejecutó correctamente."
                # Descomprimir el archivo
                gunzip "$target_dump_gz"
                echo "ensure_dump: Archivo descomprimido."
            else
                echo "ensure_dump: Hubo un error al ejecutar el comando."
                exit 1
            fi
          else
            echo "ensure_dump: Cancelado."
            exit 1
          fi
      fi
  fi
}

load_dump(){
  target_dump=$1
  target_db=$2

  if [ ! -f "$target_dump" ]; then
      echo "Error: El archivo de dump no existe."
      exit 1
  fi

  PS3='Seleccione un container: '
  select opt_container in "${target_containers[@]}"
  do
    if [[ ! " ${target_containers[@]} " =~ " $opt_container " ]]; then
      echo "Opcion invalida $REPLY"
      exit 1  
    fi
    
    target_container=$opt_container
    echo "Se va a utilizar el dump: $target_dump"
    echo "Se va a utilizar el container $target_container"

    # echo "comando: docker exec -i $target_container $DB_FOLDER -uroot -proot localexpv1 < $target_dump"
    read -p "¿Desea cargar el dump en el container? (s/n): " response

    if [[ $response == [sS] ]]; then
      echo "Continuando..."
      
      docker_load=$(docker exec -i $target_container $DB_FOLDER -uroot -proot -e "CREATE DATABASE IF NOT EXISTS $target_db" && docker exec -i $target_container $DB_FOLDER -uroot -proot $target_db < $target_dump)
      # Verificar el estado de salida
      
      docker_load=$?
      # Verificar si el comando se ejecutó correctamente
      if [ $docker_load -eq 0 ]; then
          echo "El comando se ejecutó correctamente."
          exit 0
      else
          echo "Hubo un error al ejecutar el comando."
          exit 1
      fi
    else
      echo "Cancelado."
      exit 1
    fi
    
    exit 0
  done
}

# Arreglo para almacenar los elementos
declare -a DB_OPTIONS

while IFS= read -r line; do
  DB_OPTIONS+=("$line")
done < "$DB_LIST_FILE"

PS3='Seleccione una db: '
select opt in "${DB_OPTIONS[@]}"
do
  if [[ ! " ${DB_OPTIONS[@]} " =~ " $opt " ]]; then
    echo "Opcion invalida $REPLY"
    exit 1  
  fi

  dbFolder=$opt
  now=`date +%Y%m%d`
  dumpFile=${opt}_$now.sql
  dumpFile_gz=$dumpFile.gz
  dstFolder=$DUMP_FOLDER/$DB_FOLDER/$dbFolder
  target_dump=$dstFolder/$dumpFile
  target_dump_gz=$dstFolder/$dumpFile_gz
  # Verificar si el archivo existe

  ensure_dump $target_dump && load_dump $target_dump $opt

  
done