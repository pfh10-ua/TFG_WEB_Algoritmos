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

- Node.js `>= 20` que puedes descragar en [text](https://nodejs.org/es/download)
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

> [!TIP]
> El repositorio que puedes usar es como referencia puede ser el mío cuyo enlace es [text](https://github.com/pfh10-ua/AlgoritmosTFG)
> Puedes hacer un fork de dicho repositorio
> EL contenido de este repositorio te servirá también para entender mejor los siguientes apartados siguiente apartado


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

### 2. Añadir Entrada en `algoritmos.json`
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
> - `pathGithub`: Debe coincidir con la ruta del repositorio GitHub donde has alojado los ficheros fuentes del algoritmo.
> - Cada entrada debe incluir las claves `title`, `description`, `complexity` y `pathGithub`.
> - Asegúrate de que las claves `best`, `average` y `worst` dentro de `complexity` están correctamente definidas.

### 3. Subir Archivos Fuente
Los nombres de los archivos deben coincidir con el identificador del algoritmo que se estableción en el fichero `algoritmos.json`


## 📊 Animación del algoritmo.
Para poder tener animación en el algoritmo, es necesario subir un fichero llamado nextstep.js cuyo contenido podría ser el siguiente en el caso del algoritmo llamado selectionSort:
```
module.exports ={
    variables: {
        indices:{
            i:0,
            j:1,
            minIndex:0
        },
        colors: ["orange", "yellow", "red"], // Colores para cada barra
        sortedOrFind: false, // Indica si el arreglo ya está ordenado
        data: [30, 80, 45, 60, 20, 90, 50], // Datos a ordenar
        lineaActual: {
            cpp: 8, 
            py: 7, 
            js: 8
        }, // Línea actual de ejecución
        language: "" // Lenguaje de programación
    },
    nextstep: function(){
        const { variables } = this; // Acceder a las variables del objeto exportado

        if (variables.sortedOrFind) return; // Si ya está ordenado, no hacer nada

        const {indices, data, language } = variables;

        if (indices.i >= data.length - 1) {
            variables.sortedOrFind = true; // Marcar como ordenado
            variables.lineaActual[language] = this.getFinalLine(language); //Línea final
            return;
        }

        // Comparar y actualizar el índice del mínimo
        if (data[indices.j] < data[indices.minIndex]) {
            indices.minIndex = indices.j; // Actualizar el índice del mínimo
            variables.lineaActual[language] = this.getUpdateMinIndexLine(language); //Actualización del minimo
        }
        else {
            variables.lineaActual[language] = this.getDefaultComparisonLine(language); //Comparación por defecto
        }

        indices.j++; // Avanzar al siguiente índice de la iteración interna

        if (indices.j === data.length) {
            // Intercambiar los elementos data[i] y data[minIndex]
            [data[indices.i], data[indices.minIndex]] = [data[indices.minIndex], data[indices.i]];

            // Avanzar a la siguiente iteración externa
            indices.i++;
            indices.j = indices.i + 1;
            indices.minIndex = indices.i;
            variables.lineaActual[language] = this.getSwapLine(language); // Intercambio
        }
    },
    getFinalLine: function (language) {
        switch (language) {
            case 'cpp': return 15;
            case 'py': return 17;
            default: return '-';
        }
    },
    getUpdateMinIndexLine: function (language) {
        switch (language) {
            case 'cpp': return [9,10];
            case 'py': return [13,14];
            default: return '-';
        }
    },
    getDefaultComparisonLine: function (language) {
        switch (language) {
            case 'cpp': return 8;
            case 'py': return 12;
            default: return '-';
        }
    },
    getSwapLine: function (language) {
        switch (language) {
            case 'cpp': return 13;
            case 'py': return 16;
            default: return '-';
        }
    }
};
```
### Cosas a destacar
- Todo el fichero es un `module.export={};`
- En variables se encuentran:
    - `indices` que son las variables para los bucles.
    - `colors` indica los colores que representarán a los índices. Es importante que haya la misma cantidad de colores que índices. El `color por defecto` para valores que no represente un índice es `"teal"`. Van por orden de los índices. El primer color es para el primer índice y así sucesivamente.
    - `sortedOrFind` indica si ha sido ordenado o encontrado. Por defecto, `debe ser falso`.
    - `data` representa los valores numéricos a ordenar.
    - `lineaActual` contiene la línea actual en la que estás dependiendo del lenguaje que se esté utilizando gracias a la terminación del fichero fuente.
    - `language` guarda dicha extensión del fichero fuente.
- La función que indica las posibles decisiones de una iteración se debe llamar `nextstep`. Y debe tener la siguiente estructura:
    - Primero se deben de importar las variables.
    ```
    const { variables } = this;
    ```
    - Posteriormente, se debe comprobar el valor de `sortedOrFind` para saber si se ha ordenado o se ha encontrado el elemento.
    ```
    if (variables.sortedOrFind) return; 
    ```
    - Seguidamente, iría el cuerpo del algoritmo recorriendo cada una de las posibles decisiones a tomar en una iteración y aumentando los índices de manera correcta. Hay que destacar que el profesor, puede crear sus propias funciones para marcar líneas como en el ejemplo pueden ser `getUpdateMinIndexLine` o `getSwapLine` dependiendo del lenguaje a utilizar como párametro. Es por ello que se debe crear un switch con los diferentes casos o extensiones indicando el número de líneas o el array de líneas a marcar en cada caso.
    ```
    getUpdateMinIndexLine: function (language) {
        switch (language) {
            case 'cpp': return [9,10];
            case 'py': return [13,14];
            default: return '-';
        }
    },
    getSwapLine: function (language) {
        switch (language) {
            case 'cpp': return 13;
            case 'py': return 16;
            default: return '-';
        }
    }
    ```

## 💻 Tecnologías Utilizadas
- HTML + CSS + JavaScript.
- Node.js con Express.
- GitHub API para obtener el contenido de los ficheros.
- D3.js para crear los diagramas de barras.
