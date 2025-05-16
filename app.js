const express = require('express');
//const fetch = require('node-fetch');
const atob = require('atob');

const app = express();
const PORT = process.env.PORT || 4000;

// convierte el cuerpo del mensaje de la petición en JSON al objeto de JavaScript req.body:
app.use(express.json());

// middleware para descodificar caracteres UTF-8 en la URL:
app.use( (req, res, next) => {
    req.url = decodeURI(req.url);
    next();
});

// middleware para las cabeceras de CORS:
app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header("Access-Control-Allow-Headers", "content-type");
    next();
});

// Configuración del token de autenticación
const TOKEN = process.env.GITHUB_TOKEN;
const options = {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${TOKEN}`
    }
};
// Configuración para url de GitHub
const owner = process.env.REPO_OWNER;
const repo = process.env.REPO_NAME;

// Ruta para cargar los archivos de una carpeta específica
app.get('/load-folder', async (req, res) => {
    const { path_algoritmo } = req.query;

    // Validar si se proporcionó el parámetro folder
    if (!path_algoritmo) {
        return res.status(400).json({ error: 'Debe proporcionar una carpeta.' });
    }

    try {
        // Construye la URL a GitHub
        const githubUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path_algoritmo}`;
        console.log('Solicitando a GitHub:', githubUrl);

        // Realiza la petición a GitHub
        const response = await fetch(githubUrl, options);

        if (!response.ok) {
            console.error('Error en la respuesta de GitHub:', response.status, response.statusText);
            return res.status(400).json({ error: `Error en la solicitud a GitHub: ${response.statusText}` });
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            return res.status(400).json({ error: 'La carpeta no contiene archivos o no existe.' });
        }

        // Procesa la lista de archivos
        const files = data.map(item => ({
            name: item.name,
            extension: item.name.substring(item.name.lastIndexOf('.'))
        }));

        res.json(files);
        console.log('Archivos cargados:', files);
    } catch (error) {
        console.error('Error al cargar la carpeta:', error);
        res.status(500).json({ error: 'Error al cargar la carpeta.' });
    }
});

// Ruta para cargar el contenido de un archivo específico
app.get('/load-file', async (req, res) => {
    const { ruta, archivo } = req.query;

    if (!ruta || !archivo) {
        return res.status(400).json({ error: 'Debe proporcionar una ruta y un archivo.' });
    }

    try {
        const githubUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${ruta}${archivo}`;
        const response = await fetch(githubUrl, options);
        const data = await response.json();

        if (!data.content) {
            return res.status(400).json({ error: 'No se pudo obtener el contenido del archivo.' });
        }

        // Decodificar el contenido Base64 como texto UTF-8
        const decodedBytes = Uint8Array.from(atob(data.content), (c) => c.charCodeAt(0)); // Convierte el contenido Base64 en un array de bytes
        const decoder = new TextDecoder("utf-8"); // Crea un decodificador para texto UTF-8
        const content = decoder.decode(decodedBytes); // Decodifica los bytes en una cadena de texto

        if (archivo === "nextstep.js"){ // Verifica si el nextstep.js contiene 'module.exports' 
        // porque es el único que se convierte en función que se ejecuta 
            if (!/module\.exports\s*=/.test(content)) { 
                console.error('Error al analizar el contenido del archivo:')
                return res.status(400).json({ error: "Contenido inválido: no se encontró 'module.exports'." });
            }
            const forbiddenPatterns = ["eval(", "Function(", "require(", "import(", "fetch("];
            for (const pattern of forbiddenPatterns) {
                if (content.includes(pattern)) {
                    return res.status(400).json({ error: `Código prohibido detectado: '${pattern}'` });
                }
            }
        } 

        res.json({ archivo, content });
    } catch (error) {
        console.error('Error al cargar el fichero:', error);
        res.status(500).json({ error: 'Error al cargar el fichero.' });
    }
});

const path = require('path');
const publico = path.join(__dirname, 'public');
// __dirname: directorio del fichero que se está ejecutando

// Middleware para servir ficheros estáticos
app.use('/', express.static(publico));

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});