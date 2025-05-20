import { getLoadFile } from './dataLoader.js';

//Función para renderizar el gráfico de barras
function renderGraphic(variables, svg, height, barWidth, statusText) {
	// Eliminar las barras previas antes de volver a dibujar
	svg.selectAll("rect").remove();
	svg.selectAll("text").remove();

	// Dibujar las barras
	svg.selectAll("rect")
		.data(variables.data)
		.enter()
		.append("rect")
		.attr("x", (d, idx) => idx * barWidth) // Posición horizontal de cada barra
		.attr("y", d => height - d) 			// Posición vertical basada en el valor de la barra
		.attr("width", barWidth - 2) 			// Ancho de la barra (con separación)
		.attr("height", d => d) 				// Altura de la barra basada en el valor
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
		.text(d => d) 												// Mostrar el valor de la barra
		.attr("x", (d, idx) => idx * barWidth + (barWidth - 2) / 2) // Centrar el texto en la barra
		.attr("y", d => height - d - 5) 							// Colocar el texto encima de la barra (Eje Y va de arriba abajo)
		.attr("text-anchor", "middle") 								// Centrar el texto horizontalmente
		.attr("font-size", "12px") 									// Tamaño del texto
		.attr("fill", "black"); 									// Color del texto

	if (variables.sortedOrFind) {
		statusText.text("Fin del algoritmo"); // Mostrar mensaje cuando esté ordenado o encontrado
	} 
	else {
		statusText.text("");
	}
}

function renderLegend(variables, svg, width, height) {
  // Eliminar cualquier grupo de leyenda previo para evitar duplicados
  svg.selectAll(".legend").remove();

  // Se evita mostrar variables sin color asignado
  const keys = Object.keys(variables.indices).filter((_, i) => i < variables.colors.length);

  const legendData = keys.map((key, i) => ({
    label: key,           
    color: variables.colors[i]
  }));

  // Se crea un grupo SVG para contener la leyenda, y posicionarlo en la esquina superior izquierda
  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(0, 30)`);

  // Por cada elemento de legendData, se crea una fila con rectángulo de color y texto descriptivo
  legendData.forEach((d, i) => {
    const row = legend.append("g")
      .attr("transform", `translate(0, ${i * 18})`);

    // Se añade un rectángulo pequeño con el color
    row.append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", d.color)
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    // Se añade la variable al rectángulo que representa el color
    row.append("text")
      .attr("x", 18)
      .attr("y", 10)
      .text(d.label)
      .attr("font-size", "14px")
      .attr("fill", "black");
  });
}

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
		const message = document.createElement("p");
		message.textContent = "No existe función para animar gráficamente";
		message.style.textAlign = "center";
		message.style.width = "100%";
		message.style.margin = "20px 0";
		insertAsLastChild(chartDiv, message);
	}
}

let globalLanguage = ""; // Variable global para almacenar la extensión del fichero actual

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
  	try {
		const contenidoString = await getLoadFile("", "algoritmos.json");
		algorithmsData = JSON.parse(contenidoString);
		if (algorithmsData[name]) {
			const selectedAlgorithm = algorithmsData[name];
			titulo = selectedAlgorithm.title;
		  	description = selectedAlgorithm.description;
			path = selectedAlgorithm.pathGithub;	
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
			const width = 500;
			const height = 200;
			const barWidth = width / variables.data.length;

			// Crear el contenedor SVG para el gráfico de barras
			const svg = d3.select("#chart")
				.append("svg")
				.attr("width", "100%")
				.attr("height", height)
				.attr("viewBox", `0 0 ${width} ${height}`)
  				.attr("preserveAspectRatio", "xMidYMid meet");

			// Crear un texto para mostrar el estado del ordenamiento
			const statusText = d3.select(".animation")
				.append("p")
				.style("text-align", "center")
				.style("font-size", "16px")
				.style("font-weight", "bold")
				.text("");
			// Inicializar el gráfico y la leyenda
			renderGraphic(variables, svg, height, barWidth, statusText);
			renderLegend(variables, svg, width, height);

			// Agregar eventos a los botones
			document.getElementById("nextStep").addEventListener("click", () => {
				consigueExtension();
				variables.language = globalLanguage;
				nextstep.call(module.exports);
				if (variables.lineaActual[globalLanguage]){
					seleccionaLinea(variables.lineaActual[globalLanguage]);
				}
				renderGraphic(variables, svg, height, barWidth, statusText);
				renderLegend(variables, svg, width, height);
			}); 

			document.getElementById("restart").addEventListener("click", () => { 
				Object.assign(variables, structuredClone(copiaVariables)); // Restaurar los datos originales completamente
				consigueExtension();
				variables.language = globalLanguage;
				if (variables.lineaActual[globalLanguage]){
					seleccionaLinea(variables.lineaActual[globalLanguage]);
				}
				renderGraphic(variables, svg, height, barWidth, statusText);
				renderLegend(variables, svg, width, height);
			}); 
		}
		else{
			mostrarError();
		}
	
	renderCódigo(name);
	}
}


document.addEventListener("DOMContentLoaded", init, false);
