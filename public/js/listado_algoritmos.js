function formatString(str) {
    return str.toLowerCase().replace(/\s+/g, '');
}

// Función para cargar y mostrar la lista de algoritmos
async function loadAlgorithms() {
    const algorithmCardsContainer = document.getElementById('algorithm-cards');

    try {
        // Cargar datos del archivo JSON
        const response = await fetch('../algoritmos.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar la lista de algoritmos.');
        }

        const algorithmsJSON = await response.json();
        const algorithms = Object.values(algorithmsJSON);

        // Generar tarjetas para cada algoritmo
        algorithms.forEach(algorithm => {
            const title = formatString(algorithm.title);
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
                <a href="showAlgorithm.html?nameAlgoritmo=${title}" target="_blank">Ver más</a>`;

            algorithmCardsContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error al cargar los algoritmos:', error);
    }
}

function filterAlgorithms() {
    // Obtener el valor del campo de búsqueda y convertirlo a minúsculas
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    // Obtener todas las cards
    const cards = document.querySelectorAll('.card');

    // Iterar sobre cada card
    cards.forEach(card => {
        // Obtener el nombre del algoritmo (atributo data-name) y convertirlo a minúsculas
        const cardName = card.querySelector('h3').textContent.toLowerCase();

        // Verificar si el nombre coincide con el término de búsqueda
        if (cardName.includes(searchTerm)) {
            card.style.display = 'block'; // Mostrar la card si coincide
        } else {
            card.style.display = 'none'; // Ocultar la card si no coincide
        }
    });
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    loadAlgorithms();
    filterAlgorithms();
});