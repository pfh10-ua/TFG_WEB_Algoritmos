// Funcion para cargar el archivo JSON con los datos de los algoritmos
async function cargarJsonAlgoritmos() {
  try {
    const response = await fetch('../algoritmos.json'); // Ruta al archivo JSON
    if (!response.ok) {
      throw new Error(`Error al cargar JSON: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al cargar el archivo JSON:", error);
  }
}
// Variable para almacenar los datos del archivo JSON
let algorithmsData = {};
// Variables globales para almacenar los valores de las variables del algoritmo
let globalVariables = {};
// Colores para resaltar las variables en el gráfico obtenidos del archivo JSON
let colores = {};
// Datos iniciales del gráfico (valores de las barras)
let data = [30, 80, 45, 60, 20, 90, 50];

// Dimensiones del gráfico
const width = 500; // Ancho total del SVG
const height = 200; // Alto total del SVG
const barWidth = width / data.length; // Ancho de cada barra

let sorted = false; // Indicador de si el arreglo ya está completamente ordenado

// Crear el contenedor SVG para el gráfico de barras
const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width) // Ancho del SVG
  .attr("height", height); // Alto del SVG

// Crear un texto para mostrar el estado del ordenamiento
const statusText = d3.select(".animation")
  .append("p") // Crear un elemento <p> debajo del gráfico
  .style("text-align", "center")
  .style("font-size", "16px")
  .style("font-weight", "bold")
  .text(""); // Inicialmente vacío

/**
 * Función para renderizar el gráfico de barras
 */
function renderBars() {
  // Eliminar las barras previas antes de volver a dibujar
  svg.selectAll("rect").remove();
  svg.selectAll("text").remove();

  // Dibujar las barras
  svg.selectAll("rect")
    .data(data) // Asignar los datos a las barras
    .enter()// Un elemento a cada dato del array
    .append("rect")
    .attr("x", (d, idx) => idx * barWidth) // Posición horizontal de cada barra
    .attr("y", d => height - d) // Posición vertical basada en el valor de la barra
    .attr("width", barWidth - 2) // Ancho de la barra (con separación)
    .attr("height", d => d) // Altura de la barra basada en el valor
    .attr("fill", (d, idx) => {
        let keys = Object.keys(globalVariables);
        for (let i = 0; i < keys.length; i++) {
            if (globalVariables[keys[i]] == idx) {  // Comparar índice con valor
                return colores[keys[i]];  // Color asignado
            }
        }
        return "teal";  // Color base si no coincide
    });
  // Agregar etiquetas de texto para los valores
  svg.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(d => d) // Mostrar el valor de la barra
    .attr("x", (d, idx) => idx * barWidth + (barWidth - 2) / 2) // Centrar el texto en la barra
    .attr("y", d => height - d - 5) // Colocar el texto encima de la barra
    .attr("text-anchor", "middle") // Centrar el texto horizontalmente
    .attr("font-size", "12px") // Tamaño del texto
    .attr("fill", "black"); // Color del texto

  // Actualizar el texto del estado del ordenamiento
  if (sorted) {
    statusText.text("¡El arreglo está completamente ordenado!"); // Mostrar mensaje cuando esté ordenado
  } else {
    statusText.text(""); // Limpiar el mensaje si no está ordenado
  }
}

/**
 * Función para realizar un paso hacia adelante en el Selection Sort
 */
function nextStep() {
  if (sorted) return; // Si ya está ordenado, no hacer nada

  if (globalVariables.i >= data.length - 1) { // Si ya se completaron todas las iteraciones
    sorted = true; // Marcar el arreglo como ordenado
    renderBars(); // Actualizar el gráfico
    return;
  }

  // Comparar y actualizar el índice del mínimo
  if (data[globalVariables.j] < data[globalVariables.minIndex]) {
    globalVariables.minIndex = globalVariables.j; // Actualizar el índice del mínimo encontrado 
  }

  globalVariables.j++;

  if (globalVariables.j === data.length) { // Si se completó la iteración interna
    // Intercambiar los elementos data[i] y data[minIndex]
    const temp = data[globalVariables.i];
    data[globalVariables.i] = data[globalVariables.minIndex];
    data[globalVariables.minIndex] = temp;

    // Avanzar a la siguiente iteración externa
    //console.log("Antes de finalizar bucle j: i->" + globalVariables.i + " j->" + globalVariables.j + " min->" + globalVariables.minIndex);
    globalVariables.i++;
    globalVariables.j = globalVariables.i + 1;
    globalVariables.minIndex = globalVariables.i;
    //console.log("Despues de finalizar bucle j: i->" + globalVariables.i + " j->" + globalVariables.j + " min->" + globalVariables.minIndex);
  }

  renderBars(); // Actualizar el gráfico
}

/**
 * Función para realizar un paso hacia atrás en el Selection Sort
 */
function prevStep() {
  if (i === 0 && j === i + 1) return; // No retroceder más allá del inicio

  // Retroceder al paso anterior
  if (j === i + 1) { // Si estamos al principio de una pasada
    i--; // Retroceder una iteración externa
    j = data.length - 1; // Posicionar al final de la iteración interna
    minIndex = i;

    // Restaurar el intercambio realizado previamente
    const temp = data[i];
    data[i] = data[minIndex];
    data[minIndex] = temp;
  } else {
    j--; // Retroceder al par anterior

    // Actualizar el índice del mínimo
    if (data[j] < data[minIndex]) {
      minIndex = j;
    }
  }

  sorted = false; // Resetear el estado de ordenado
  renderBars(); // Actualizar el gráfico
}


function insertAsLastChild(padre,nuevoHijo){
    padre.append(nuevoHijo);
}

function insertAsFirstChild(padre,nuevoHijo){
    padre.prepend(nuevoHijo);
}

function renderCódigo(data) {
    let nameAlgoritmo = data.nameAlgoritmo;
    let bloquecódigo = document.createElement("section");
    bloquecódigo.innerHTML = "<code-git data-algoritmo='"+nameAlgoritmo+"'></code-git>";
        
    insertAsLastChild(document.querySelector("main"), bloquecódigo);
    return bloquecódigo;
}

function getParameters(nameParameter){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nameParameter);
}

function addHeadingToMain(nameAlgorithm) {
    const titlePage = nameAlgorithm.charAt(0).toUpperCase() + nameAlgorithm.slice(1);
    const mainElement = document.querySelector("main");
    if (mainElement) {
        const heading = document.createElement("h1");
        heading.textContent = titlePage;
        insertAsFirstChild(mainElement, heading);
    } else {
        console.error("No se encontró el elemento <main> en el DOM.");
    }
}

function addDescriptionToMain(description) {
    const mainElement = document.querySelector("h1");
    if (mainElement) {
        const paragraph = document.createElement("p");
        paragraph.textContent = description;
        insertAsLastChild(mainElement, paragraph);
    } else {
        console.error("No se encontró el elemento <main> en el DOM.");
    }
}

async function init(){
    const name = getParameters("nameAlgoritmo");
    console.log(name);
    let description = "";
    // Cargar los datos del archivo JSON
    cargarJsonAlgoritmos().then(data => {
        algorithmsData = data;
        if (algorithmsData[name]) {
          const selectedAlgorithm = algorithmsData[name];
          console.log(selectedAlgorithm.variables);
          
          // Crear las variables dinámicamente
          selectedAlgorithm.variables.forEach(variable => {
            globalVariables[variable.name] = variable.initialValue;
            colores[variable.name] = variable.color;
          });

          // Devolver el valor description del algoritmo
          description = selectedAlgorithm.description;
        } else {
            alert("Error: El nombre del algoritmo no existe en el archivo JSON.");
            return;
        }
        // console.log(globalVariables.j);
        // console.log(colores);
    });
    
    // Agregar el título del algoritmo al <main>
    addHeadingToMain(name);
    // Agregar la descripción del algoritmo al <main>
    console.log(description);//TODO: Está vacío, ARREGLAR
    addDescriptionToMain(description);
    // Inicializar el gráfico con las barras
    renderBars();
    // Cargar el código del algoritmo
    renderCódigo({nameAlgoritmo: name});
    // Agregar eventos a los botones
    document.getElementById("nextStep").addEventListener("click", nextStep); // Botón de avanzar
    //document.getElementById("prevStep").addEventListener("click", prevStep); // Botón de retroceder
}


document.addEventListener("DOMContentLoaded", init, false);



