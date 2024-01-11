# `dumpmanager-cli`

"dumpmanager-cli" is a command-line interface (CLI) tool designed to simplify the process of managing and interacting with database dumps, specifically within local Docker containers. With this tool, developers can easily create, import, export, and manipulate database dumps from various database management systems. It provides a streamlined and efficient workflow for working with database dumps, allowing developers to seamlessly import and restore dumps into their local Docker containers. By automating the handling of database dumps within Docker, "dumpmanager-cli" enhances the developer experience, making it easier to test, debug, and develop applications that rely on database interactions. This tool empowers developers to efficiently manage and interact with database dumps, ultimately improving productivity and speeding up the development process.

With this utility, you can:

- Manage database dumps in the local environment, allowing you to download them from various sources such as S3, URLs, and databases.
- Load dumps into a local container.

1. Configure the CLI by executing the following command:

    ```bash
    yarn run configure
    ```

    > The `DUMP_FOLDER` variable is mandatory for the CLI to function properly. Here, you should provide the path to the directory where the dumps managed by this utility will be stored.

    The rest of the variables are optional but helpful as they allow generating default values for the commands.

2. Optionally, you can update the list of databases from S3. This is applicable when you have database dumps stored in an S3 bucket in the format: `${BUCKET_NAME}/${dbType}/${dbName}/${dbName}_YYYYMMDD.sql.gz`.

    ```bash
    yarn run mysql:refresh
    ```

    > It is required to have `aws-cli` installed and configured with valid credentials.

3. Run the CLI:

    ```bash
    yarn run dumpmanager
    ```
