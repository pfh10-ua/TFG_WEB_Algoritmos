// Función para cargar y mostrar la lista de algoritmos
async function loadAlgorithms() {
    const algorithmCardsContainer = document.getElementById('algorithm-cards');

    try {
        // Cargar datos del archivo JSON
        const response = await fetch('../algoritmos.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar la lista de algoritmos.');
        }

        const algorithms = await response.json();
        console.log(algorithms);

        // Generar tarjetas para cada algoritmo
        algorithms.forEach(algorithm => {
            const card = document.createElement('div');
            card.className = 'card';

            card.innerHTML = `
                <h3>${algorithm.name}</h3>
                <p>${algorithm.description}</p>
                <a href="${algorithm.link}" target="_blank">Ver más</a>
            `;

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