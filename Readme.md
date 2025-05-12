# Documentación del Funcionamiento del Código

## Introducción
Este proyecto consiste en una página web que muestra distintos algoritmos con su información y archivos fuente, obtenidos dinámicamente desde un repositorio privado o público de GitHub.

## 📁 Estructura del Proyecto
Todo está contenido en la carpeta `public/`:
```
public/
├── css/
│ ├── comun.css
│ ├── principal.css
│ └── style.css
├── html_files/
│ ├── algoritmos.html
│ ├── contacto.html
│ └── showAlgorithm.html
├── img/
│ ├── [archivos .png y .webp de logos y lenguajes]
├── js/
│ ├── codegit.js
│ ├── dataLoader.js
│ ├── infoAlgorithm.js
│ ├── listado_algoritmos.js
│ ├── menu.js
├── algoritmos.json
├── extensiontoImg.json
├── index.html
```

`app.js` es el servidor de Node.js con Express que levantaremos a continuación.

## 🚀 Guía de Despliegue

### 🧩 Requisitos

- Node.js `>= 20`
- Dependencias: `express`, `atob`

Para instalar las dependencias ejecutamos el siguiente comando:
```bash
npm install express atob
```

### ⚙️ Contenido del fichero .env
Debe contener las siguientes variables:
```bash
GITHUB_TOKEN=tu_token_personal
REPO_OWNER=tu_usuario_github
REPO_NAME=nombre_del_repositorio
```
> [!NOTE]
> El token es necesario al ser el repositorio privado. Además de esta forma se permiten 5000 peticiones/hora peo si no lo estás solamente 60.

> [!CAUTION]
> Recuerda no subir tu fichero .env

### ▶️ Despliegue
Para realizar el despliegue debemos de ejecutar: 
```bash
node --env-file .env app.js
```

Esto permite cargar las variables de entorno sin usar la libería dotenv.

> [!TIP]
> Si tienes una versión de Node.js >= 22 puedes agregar la siguiente línea:
> ```bash
> process.loadEnvFile();
> ```
> Esto permite cargar las variables de entorno al realizar el despliegue y el comando nuevo sería:
>```bash
> node app.js
>```

## ➕ Añadir Nuevos Algoritmos
### 1. Crear Carpeta del Algoritmo (si no está creada ya)
La carpeta se debe crear en el directorio correspondiente y el nombre de la carpeta debe de comenzar con mayúscula.

### 2. Subir Archivos Fuente
Los nombres de los archivos deben estar en minúsculas, y coincidir con el identificador del algoritmo que se pondrá en el archivo JSON en el siguiente paso.

### 3. Añadir Entrada en `algoritmos.json`
La entrada debe ser como el ejemplo siguiente:
```json
"bubblesort": {
    "title": "Bubble Sort",
    "description": "Bubble Sort es un algoritmo de ordenación simple. Funciona comparando cada elemento de la lista con el siguiente, y cambiándolos de posición si están en el orden incorrecto. El proceso se repite hasta que la lista esté ordenada.",
    "complexity": {
        "best": "O(n)",
        "average": "O(n^2)",
        "worst": "O(n^2)"
    },
    "pathGithub": "Ordenacion/Directos/Bubblesort/"
},
```
> [!IMPORTANT]
> Consideraciones:
> - Nombre del algoritmo (clave JSON): debe de ir en minúsculas, sin espacios y coincidir con el nombre de los ficheros fuente subidos.
> - `pathGithub`: Debe coincidir con la ruta del repositorio GitHub.
> - Cada entrada debe incluir las claves `title`, `description`, `complexity` y `pathGithub`.
> - Asegúrate de que las claves `best`, `average` y `worst` dentro de `complexity` están correctamente definidas.

## 💻 Tecnologías Utilizadas
- HTML + CSS + JavaScript.
- Node.js con Express.
- GitHub API para obtener el contenido de los ficheros.




