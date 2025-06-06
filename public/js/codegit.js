import { cargarJsonImg, getLoadFolder, getLoadFile } from './dataLoader.js';

(()=> {
    const element = document.createElement("template");
    element.innerHTML = `
    <style>
        pre {
            background-color: black;
            color: white; /* Asegura que el texto sea visible sobre el fondo negro */
            padding: 10px;
            border-radius: 5px;
            max-height: 300px; /* Altura máxima del contenedor */
            overflow-y: auto; /* Muestra un scroll vertical si el contenido excede la altura */
            overflow-x: auto; /* Muestra un scroll horizontal si el contenido es muy ancho */
            white-space: pre-wrap; /* Permite que el texto se ajuste dentro del pre sin romper palabras */
            word-wrap: break-word; /* Ajusta las palabras si son muy largas */
            font-family: monospace; /* Asegura un estilo adecuado para código */
        }
        #titulo-archivo{
            font-weight: bold; /* Estilo para el nombre del archivo */
            margin-bottom: 10px; /* Espacio entre el nombre del archivo y el código */
            color: #00ff00; /* Color verde para el nombre del archivo */
        }
        .numero-linea {
            display: inline-block;
            width: 3ch; /* Ajusta a 2ch, 3ch o más si hay muchas líneas */
            color: gray;
            text-align: right;
            margin-right: 0.5ch;
            font-family: monospace;
        }
        code {
            font-family: monospace;
            white-space: pre;
        }
        .highlight {
            background-color: #ffff00; /* Bright yellow */
            color: #000000; /* Black text */
            font-weight: bold; /* Optional: Make the text bold for better emphasis */
        }
        .image-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); /* Diseño responsive */
            gap: 10px; /* Espaciado entre imágenes */
            margin-top: 20px;
        }
        .image-container div {
            text-align: center;
        }
        .image-container img {
            max-width: 100%; /* Asegura que las imágenes no excedan su contenedor */
            height: auto; /* Mantiene la proporción de las imágenes */
            border-radius: 5px;
            cursor: pointer; /* Cambia el cursor para indicar que es interactivo */
            transition: transform 0.2s ease; /* Efecto al pasar el ratón */
        }
        .image-container img:hover {
            transform: scale(1.1); /* Agranda ligeramente la imagen */
        }
        .image-container p {
            margin-top: 5px;
            font-size: 0.9rem;
            color: #555;
        }
    </style>
    <pre><code></code></pre>
    <div class="image-container"></div>`;


    class Codigo extends HTMLElement {
        static get observedAttributes() { return ['data-algoritmo']; }
        constructor(){
            super();
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(element.content.cloneNode(true));
            this.extensionToImage = {};
            this.directorios = {}; // Donde se almacena el JSON cargado
        }
        async connectedCallback() {   
            this.algoritmo = this.hasAttribute('data-algoritmo') ? this.getAttribute('data-algoritmo') : 0;
            this.extensionToImage = await cargarJsonImg(); // Se carga el JSON de las imágenes al iniciar el componente
           
        }
        async attributeChangedCallback(name, viejo, nuevo){
            if (name === "data-algoritmo") {
                if (nuevo != viejo){
                    this.algoritmo = nuevo.toLowerCase();
                    try {
                        // Comprobación el contenido del JSON almacenado
                        if (Object.keys(this.directorios).length === 0) {
                            const contenidoAlgoritmosJSON = await getLoadFile("", "algoritmos.json");
                            this.directorios = JSON.parse(contenidoAlgoritmosJSON);
                        }
                        const algoritmoData = this.directorios[this.algoritmo];
                        if (!algoritmoData) {
                            throw new Error(`El algoritmo "${this.algoritmo}" no existe en el JSON.`);
                        }
                        // Obtención de ficheros almacenados en la carpeta indicada
                        const path = algoritmoData.pathGithub;
                        const contentFolder = await getLoadFolder(path);
                        if (!contentFolder || contentFolder.length === 0) {
                            console.error('La carpeta está vacía o no se pudo cargar.');
                            return;
                        }
                        // Se filtran los ficheros mostrando solamente el contenido
                        // si su nombre coincide con el nombre del parámetro/algoritmo
                        const archivosCoincidentes = contentFolder.filter(file => file.name.toLowerCase().includes(this.algoritmo.toLowerCase()));
                        const archivo = archivosCoincidentes[0].name;
                        const content = await getLoadFile(path, archivo);
                        this.insertarCodigo(content, archivo);
                        this.mostrarImagenes(path, contentFolder, this.algoritmo);
        
                    } catch (error) {
                        console.error('Error al procesar la carpeta o los archivos:', error);
                    }
                }
            }
        }
        // Escapa <, >, y & para evitar creación de etiquetas HTML no deseadas.
        escapeHtml(texto) {
            return texto.replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;');
        }

        insertarCodigo(codigo, archivo){
            const code = this.shadowRoot.querySelector('code');
            const codigoSinEspeciales = this.escapeHtml(codigo);
            const lineas = codigoSinEspeciales.split('\n');
            //Añade el número de línea a cada una
            const codigoConDivs = lineas.map((linea, index) =>{
                 return `<div><span class="numero-linea">${index + 1}|</span> ${linea}</div>`}).join(''); 
            code.innerHTML = codigoConDivs;
            // Inserción del nombre del archivo en la parte superior
            const titulo = document.createElement('div');
            titulo.id = "titulo-archivo";
            titulo.textContent = `${archivo}`;
            const pre = this.shadowRoot.querySelector('pre');
            const existingTitle = this.shadowRoot.querySelector('#titulo-archivo');
            if (existingTitle) {
                pre.removeChild(existingTitle);
            }
            pre.insertBefore(titulo, pre.firstChild);
        }
        mostrarImagenes(path, files, nameAlgorithm){
            const imageContainer = this.shadowRoot.querySelector('.image-container');
            imageContainer.innerHTML = ''; // Limpia las imágenes existentes

            files.forEach(async file => {
                const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "").toLowerCase();
                if(fileNameWithoutExtension === nameAlgorithm.toLowerCase()){
                    const extension = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();

                    if (this.extensionToImage[extension]) {
                        const { image, language } = this.extensionToImage[extension];
                        const div = document.createElement('div');

                        const img = document.createElement('img');
                        img.src = image;
                        img.alt = language;
                        img.title = `Ver contenido de ${file.name}`;
                        img.style.maxWidth = "100px";
                        img.style.height = "auto";
                        // Añade el nombre del lenguaje
                        const caption = document.createElement('p');
                        caption.textContent = language;

                        // Evento para cargar el contenido del archivo del lenguaje correspondiente 
                        // al hacer clic en la imagen
                        img.addEventListener('click', async () => {
                            const content = await getLoadFile(path, file.name);
                            this.insertarCodigo(content, file.name);
                        });

                        div.appendChild(img);
                        div.appendChild(caption);
                        imageContainer.appendChild(div);
                    }
                }
            });
        }        
    }

    customElements.define('code-git', Codigo);
})();