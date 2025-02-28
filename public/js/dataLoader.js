export async function cargarJsonImg() {
    try {
        const response = await fetch('../extensiontoImg.json'); // Ruta al archivo JSON
        if (!response.ok) {
            throw new Error(`Error al cargar JSON: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al cargar el archivo JSON:", error);
    }
}

export async function cargarJsonDirectorio() {
    try {
        const response = await fetch('../algoritmos.json'); // Ruta al archivo JSON
        if (!response.ok) {
            throw new Error(`Error al cargar JSON: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al cargar el archivo JSON:", error);
    }
}

export async function getLoadFolder(nameAlgoritm) {
    try {
        const response = await fetch(`/load-folder?algoritmo=${nameAlgoritm}`);
        if (!response.ok) {
            throw new Error(`Error al cargar la carpeta: ${response.statusText}`);
        }
        return await response.json(); // Retorna la lista de archivos
    } catch (error) {
        console.error('Error al cargar la carpeta:', error);
    }
}

export async function getLoadFile(ruta, archivo) {
    try {
        const response = await fetch(`/load-file?ruta=${ruta}&archivo=${archivo}`);
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo: ${response.statusText}`);
        }
        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error('Error al cargar el archivo:', error);
    }
}