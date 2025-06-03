import { getLoadFile } from './dataLoader.js';

// Función para cargar y mostrar la lista de algoritmos en forma de tarjetas
async function loadAlgorithms() {
    const algorithmCardsContainer = document.getElementById('algorithm-cards');

    try {
        const response = await getLoadFile("", "algoritmos.json");
        if (!response) {
            throw new Error('No se pudo cargar la lista de algoritmos.');
        }

        const algorithmsJSON = JSON.parse(response);//Convertir a JSON

        // Generador de tarjetas para cada algoritmo recorriendo el JSON
        Object.entries(algorithmsJSON).forEach(([key, algorithm]) => {
            const complexities = algorithm.complexity;
            const card = document.createElement('div');
            card.className = 'card';

            card.innerHTML = `
                <h3>${algorithm.title}</h3>
                <p>${algorithm.description}</p>
                <p><strong>Sus complejidades son:</strong></p>
                <ul>
                    <li>Mejor caso: ${complexities.best}</li>
                    <li>Caso promedio: ${complexities.average}</li>
                    <li>Peor caso: ${complexities.worst}</li>
                </ul>
                <a href="showAlgorithm.html?nameAlgoritmo=${key}" target="_blank">Ver más</a>`;

            algorithmCardsContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error al cargar los algoritmos:', error);
    }
}

function filterAlgorithms() {
    // Obtiene el valor del campo de búsqueda y convertirlo a minúsculas
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const cardName = card.querySelector('h3').textContent.toLowerCase();

        // Verifica si el nombre incluye el término de búsqueda
        if (cardName.includes(searchTerm)) {
            card.style.display = 'block'; // Mostrar la card si coincide
        } else {
            card.style.display = 'none'; // Ocultar la card si no coincide
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadAlgorithms();
    document.getElementById('searchInput').addEventListener('keyup', filterAlgorithms);
});