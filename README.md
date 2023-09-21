# Scripts utilies para cargar los dumps en las db locales (`mysql` version)

Primeramente actualizar el la variable `DUMP_FOLDER` en el fichero `config.conf`

Q podemos hacer:

* Descargar el ultimo dump del s3 de guachos-storage

```bash
bash download-guachos-database-dump.sh
```

* Cargar el dump en la db local a un docker

```bash
bash load-guachos-database-dump-to-docker.sh
```

se puede usar el docker compose que se proporciona. este script crea una db del mismo nombre en caso de que esta no exista en el container de docker. luego es solo actualizar el enviroment de desarrollo para que use esta db en el localhost

* actualizar la lista de db que tienen dump

```bash
bash refresh-guachos-mysql-db-list.sh
```