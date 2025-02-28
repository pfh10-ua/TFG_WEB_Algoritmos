// Datos iniciales del gráfico (valores de las barras)
let data = [30, 80, 45, 60, 20, 90, 50];

// Dimensiones del gráfico
const width = 500; // Ancho total del SVG
const height = 200; // Alto total del SVG
const barWidth = width / data.length; // Ancho de cada barra

// Variables para controlar el algoritmo Bubble Sort
let i = 0; // Índice de la iteración externa del Bubble Sort
let j = 0; // Índice de la iteración interna (pares comparados)
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
function renderGraphic() {
  // Eliminar las barras previas antes de volver a dibujar
  svg.selectAll("rect").remove();
  svg.selectAll("text").remove();

  // Dibujar las barras
  svg.selectAll("rect")
    .data(data) // Asignar los datos a las barras
    .enter()
    .append("rect")
    .attr("x", (d, idx) => idx * barWidth) // Posición horizontal de cada barra
    .attr("y", d => height - d) // Posición vertical basada en el valor de la barra
    .attr("width", barWidth - 2) // Ancho de la barra (con separación)
    .attr("height", d => d) // Altura de la barra basada en el valor
    .attr("fill", (d, idx) => (idx === j || idx === j + 1 ? "orange" : "teal")); // Resaltar las barras que se comparan

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
 * Función para realizar un paso hacia adelante en el Bubble Sort
 */
function nextStep() {
  if (sorted) return; // Si ya está ordenado, no hacer nada

  // Comparar y, si es necesario, intercambiar elementos adyacentes
  if (data[j] > data[j + 1]) {
    const temp = data[j];
    data[j] = data[j + 1];
    data[j + 1] = temp;
  }
  console.log(j);
  // Avanzar al siguiente par de elementos
  j++;
  if (j >= data.length - i - 1) { // Si llegamos al final de una pasada
    j = 0; // Reiniciar la comparación interna
    i++; // Avanzar a la siguiente iteración externa
  }

  // Verificar si hemos terminado de ordenar
  if (i >= data.length - 1) {
    sorted = true; // Marcar como ordenado
  }

  renderGraphic(); // Actualizar el gráfico
}

/**
 * Función para realizar un paso hacia atrás en el Bubble Sort
 */
function prevStep() {
  if (i === 0 && j === 0) return; // No retroceder más allá del inicio

  // Retroceder al paso anterior
  if (j === 0) { // Si estamos al principio de una pasada
    i--; // Retroceder una iteración externa
    j = data.length - i - 2; // Posicionar al final de la iteración interna
  } else {
    j--; // Retroceder al par anterior
  }

  // Deshacer el intercambio si se había hecho en el paso anterior
  if (data[j] > data[j + 1]) {
    const temp = data[j];
    data[j] = data[j + 1];
    data[j + 1] = temp;
  }

  sorted = false; // Resetear el estado de ordenado
  renderGraphic(); // Actualizar el gráfico
}

// Inicializar el gráfico con las barras
renderGraphic();

// Agregar eventos a los botones
document.getElementById("nextStep").addEventListener("click", nextStep); // Botón de avanzar
document.getElementById("prevStep").addEventListener("click", prevStep); // Botón de retroceder