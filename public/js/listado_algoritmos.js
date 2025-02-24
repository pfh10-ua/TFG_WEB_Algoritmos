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
        console.log(algorithms);

        // Generar tarjetas para cada algoritmo
        algorithms.forEach(algorithm => {
            const title = formatString(algorithm.title);
            const complexities = algorithm.complexity;
            console.log(complexities);
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
                <a href="showAlgorithm.html?nameAlgoritmo=${title}" target="_blank">Ver más</a>`;

            algorithmCardsContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error al cargar los algoritmos:', error);
        algorithmCardsContainer.innerHTML = '<p>No se pudieron cargar los algoritmos. Inténtalo más tarde.</p>';
    }
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    loadAlgorithms();
});