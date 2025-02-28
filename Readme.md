# Documentación del Funcionamiento del Código

## Introducción
Este documento describe el funcionamiento del código del proyecto de la página web. He utilizado Markmap para visualizar la estructura del contenido.

## Estructura del Proyecto
Todo está contenido en la carpeta public
- **index.html**
    - Contiene la estructura principal de la página web.
- **app.js**
    - Contiene las peticiones a la API de github mediante una API interna.
- **algoritmos.json**
    - JSON que contiene la información de los algoritmos y las variables utilizadas en cada uno de ellos.
- **extensiontoImg.json**
    - JSON que relaciona la extensión de un fichero con la imagen asociada al lenguaje utilizado al escribir un algoritmo.
- **Carpeta css**
    - Contiene los ficheros css usados en las páginas HTML del proyecto.
- **Carpeta html_files**
    - Contiene los ficheros html utilizados en el proyecto.
- **Carpeta img**
    - Guarda las imagenes usadas.
- **Carpeta JS**
    - Almacena los ficheros de Javascript.

## Despliegue
> [!NOTE]
> Se nececita instalar express y atob. Además la versión de node debe ser superior a la 20 para ejecutar el siguiente comando y no depender de dotenv

Para realizar el despliegue debemos de ejecutar node --env-file .env app.js


