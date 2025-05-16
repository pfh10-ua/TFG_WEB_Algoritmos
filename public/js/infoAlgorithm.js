import { cargarJsonDirectorio, getLoadFile } from './dataLoader.js';

// Variables globales para almacenar los valores de las variables del algoritmo
let globalVariables = {};
// Copia de las variables globales para reiniciar el algoritmo
let copiaGlobalVariables = {};
// Colores para resaltar las variables en el gráfico obtenidos del archivo JSON
// let colores = {};
// // Datos iniciales del gráfico (valores de las barras)
// let data = [30, 80, 45, 60, 20, 90, 50];
// let copyData = data.slice(); // Copia de los datos iniciales

/**
 * Función para renderizar el gráfico de barras
 */
function renderGraphic(variables, svg, height, barWidth, statusText) {
	// Eliminar las barras previas antes de volver a dibujar
	svg.selectAll("rect").remove();
	svg.selectAll("text").remove();

	// Dibujar las barras
	svg.selectAll("rect")
		.data(variables.data) // Asignar los datos a las barras
		.enter()// Un elemento a cada dato del array
		.append("rect")
		.attr("x", (d, idx) => idx * barWidth) // Posición horizontal de cada barra
		.attr("y", d => height - d) // Posición vertical basada en el valor de la barra
		.attr("width", barWidth - 2) // Ancho de la barra (con separación)
		.attr("height", d => d) // Altura de la barra basada en el valor
		.attr("fill", (d, idx) => {
			// Extraer los valores de variables.indices en un array
			const indicesArray = Object.values(variables.indices);

			// Buscar si el índice actual (idx) está en el array de índices
			const indexInArray = indicesArray.indexOf(idx);

			// Si el índice está en el array, devolver el color correspondiente
			if (indexInArray !== -1) {
				return variables.colors[indexInArray];
			}

			// Si no está en el array, devolver el color base
			return "teal";
	});
	// Agregar etiquetas de texto para los valores
	svg.selectAll("text")
		.data(variables.data)
		.enter()
		.append("text")
		.text(d => d) // Mostrar el valor de la barra
		.attr("x", (d, idx) => idx * barWidth + (barWidth - 2) / 2) // Centrar el texto en la barra
		.attr("y", d => height - d - 5) // Colocar el texto encima de la barra
		.attr("text-anchor", "middle") // Centrar el texto horizontalmente
		.attr("font-size", "12px") // Tamaño del texto
		.attr("fill", "black"); // Color del texto

	// Actualizar el texto del estado del ordenamiento
	if (variables.sortedOrFind) {
		statusText.text("Fin del algoritmo"); // Mostrar mensaje cuando esté ordenado o encontrado
	} 
	else {
		statusText.text(""); // Limpiar el mensaje si no está ordenado
	}
}

/**
 * Función para realizar un paso hacia adelante en el Selection Sort
 */
// function nextStep() {
//   if (sorted) return; // Si ya está ordenado, no hacer nada

//   if (globalVariables.i >= data.length - 1) { // Si ya se completaron todas las iteraciones
// 	sorted = true; // Marcar el arreglo como ordenado
// 	renderGraphic(); // Actualizar el gráfico
// 	return;
//   }

//   // Comparar y actualizar el índice del mínimo
//   if (data[globalVariables.j] < data[globalVariables.minIndex]) {
// 	globalVariables.minIndex = globalVariables.j; // Actualizar el índice del mínimo encontrado 
//   }

//   globalVariables.j++;

//   if (globalVariables.j === data.length) { // Si se completó la iteración interna
// 	// Intercambiar los elementos data[i] y data[minIndex]
// 	const temp = data[globalVariables.i];
// 	data[globalVariables.i] = data[globalVariables.minIndex];
// 	data[globalVariables.minIndex] = temp;

// 	// Avanzar a la siguiente iteración externa
// 	//console.log("Antes de finalizar bucle j: i->" + globalVariables.i + " j->" + globalVariables.j + " min->" + globalVariables.minIndex);
// 	globalVariables.i++;
// 	globalVariables.j = globalVariables.i + 1;
// 	globalVariables.minIndex = globalVariables.i;
// 	//console.log("Despues de finalizar bucle j: i->" + globalVariables.i + " j->" + globalVariables.j + " min->" + globalVariables.minIndex);
//   }

//   renderGraphic(); // Actualizar el gráfico
// }



function insertAsLastChild(padre,nuevoHijo){
	padre.append(nuevoHijo);
}

function insertAsFirstChild(padre,nuevoHijo){
	padre.prepend(nuevoHijo);
}

function renderCódigo(nombre) {
	let bloquecódigo = document.createElement("section");
	bloquecódigo.innerHTML = "<code-git data-algoritmo='"+nombre+"'></code-git>";
		
	insertAsLastChild(document.querySelector("main"), bloquecódigo);
	return bloquecódigo;
}

function getParameters(nameParameter){
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(nameParameter);
}

function addHeadingToMain(titlePage) {
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
	const mainElement = document.querySelector("main");
	if (mainElement) {
		const descriptionAlgorithm = document.createElement("p");
		descriptionAlgorithm.textContent = description;
		descriptionAlgorithm.id = "description";
		insertAsFirstChild(mainElement, descriptionAlgorithm);
	} else {
		console.error("No se encontró el elemento <main> en el DOM.");
	}
}

function mostrarError(){
	const chartDiv = document.getElementById("chart");

	if (chartDiv) {
		const message = document.createElement("p"); // Crear un elemento <p>
		message.textContent = "No existe función para animar gráficamente"; // Establecer el texto
		chartDiv.appendChild(message); // Añadir el mensaje al div
	}
}

let globalLanguage = ""; // Variable global para almacenar el lenguaje

function consigueExtension(){
	const codeElement = document.querySelector("code-git[data-algoritmo]");
	const nombreFichero = codeElement.shadowRoot.querySelector("div").textContent;
	globalLanguage = nombreFichero.substring(nombreFichero.lastIndexOf('.') + 1).toLowerCase();
}

function quitarResaltado(lineas){
	lineas.forEach(linea => {
		if (linea.classList.contains("highlight")) {
			linea.classList.remove("highlight");
		}
	});
}

function resaltarActuales(lineas, lineaActuales){
	lineas.forEach(linea => {
		const lineNumber = linea.querySelector("span").textContent;
		if (Array.isArray(lineaActuales)) {
			for(let i = 0; i < lineaActuales.length; i++){
				if (lineNumber == lineaActuales[i] + "|") {
					linea.classList.add("highlight");
				}
			}
		} else {
			if (lineNumber == lineaActuales + "|") {
				linea.classList.add("highlight");
			}
		}
	});
}

function seleccionaLinea(lineasDestacadas){
	const codeElement = document.querySelector("code-git[data-algoritmo]");
	const codeGit = codeElement.shadowRoot.querySelector("code");
	const lineas = codeGit.querySelectorAll("div");
	quitarResaltado(lineas);
	resaltarActuales(lineas, lineasDestacadas);
}


async function init(){
	// Variable para almacenar los datos del archivo JSON
	let algorithmsData = {};
	const name = getParameters("nameAlgoritmo");//Captura el parámetro de la URL
	let titulo = "";
	let description = "";
	let path = "";

	// Cargar los datos del archivo JSON
	//TODO: Cambiar la ruta para que cargue desde el servidor
  	try {
		algorithmsData = await cargarJsonDirectorio();
		if (algorithmsData[name]) {
			const selectedAlgorithm = algorithmsData[name];
			// Devolver el valor description del algoritmo y la ruta de Github
			titulo = selectedAlgorithm.title;
		  	description = selectedAlgorithm.description;
			path = selectedAlgorithm.pathGithub;
			
		  
		  	// Crear las variables dinámicamente
		  	// selectedAlgorithm.variables.forEach(variable => {
			// 	globalVariables[variable.name] = variable.initialValue;
			// 	copiaGlobalVariables[variable.name] = variable.initialValue;
			// 	colores[variable.name] = variable.color;
			// });

		  	
		} else {
			alert("Error: El nombre del algoritmo no existe en el archivo JSON.");
			return;
		}
	} catch (error) {
		console.error("Error al cargar los datos del JSON:", error);
		return;
	}
		
	// Agregar la descripción del algoritmo al <main>
	addDescriptionToMain(description);
	// Agregar el título del algoritmo al <main>
	addHeadingToMain(titulo);
	if (path !== "") {
		// Cargar el contenido del archivo
		const content = await getLoadFile(path, "nextstep.js");
		if (content) {
			const module = {}; // Objeto para almacenar el módulo
			new Function("module", content)(module); // Ejecutar el código del módulo

			const {variables, nextstep} = module.exports; // Extraer las variables y la función de nextStep
			const copiaVariables = structuredClone(variables); // Copia de las variables de manera superficial
			// Dimensiones del gráfico
			const width = 500; // Ancho total del SVG
			const height = 200; // Alto total del SVG
			const barWidth = width / variables.data.length; // Ancho de cada barra

			// Crear el contenedor SVG para el gráfico de barras
			const svg = d3.select("#chart")
				.append("svg")
				.attr("width", "100%") // Ancho del SVG
				.attr("height", height) // Alto del SVG
				.attr("viewBox", `0 0 ${width} ${height}`)
  				.attr("preserveAspectRatio", "xMidYMid meet");

			// Crear un texto para mostrar el estado del ordenamiento
			const statusText = d3.select(".animation")
				.append("p") // Crear un elemento <p> debajo del gráfico
				.style("text-align", "center")
				.style("font-size", "16px")
				.style("font-weight", "bold")
				.text(""); // Inicialmente vacío
			// Inicializar el gráfico con las barras
			renderGraphic(variables, svg, height, barWidth, statusText);
			// Agregar eventos a los botones
			document.getElementById("nextStep").addEventListener("click", () => {
				consigueExtension();
				variables.language = globalLanguage;
				nextstep.call(module.exports);
				if (variables.lineaActual[globalLanguage]){
					seleccionaLinea(variables.lineaActual[globalLanguage]);
				}
				//if(variables.lineaActual){seleccionaLinea(variables.lineaActual, variables.language);}
				renderGraphic(variables, svg, height, barWidth, statusText);
			}); // Botón de avanzar
			document.getElementById("restart").addEventListener("click", () => { // Botón de reiniciar
				Object.assign(variables, structuredClone(copiaVariables)); // Restaurar los datos originales completamente
				consigueExtension();
				variables.language = globalLanguage;
				if (variables.lineaActual[globalLanguage]){
					seleccionaLinea(variables.lineaActual[globalLanguage]);
				}
				renderGraphic(variables, svg, height, barWidth, statusText); // Volver a renderizar el gráfico
			}); 
		}
		else{
			mostrarError();
		}
	
		
	// Cargar el código del algoritmo
	renderCódigo(name);
	}
}


document.addEventListener("DOMContentLoaded", init, false);
