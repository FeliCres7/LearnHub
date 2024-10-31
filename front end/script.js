// Menú desplegable en el header
document.getElementById('menubutton').addEventListener('click', function () {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});


// Funcionalidad de búsqueda
document.addEventListener('DOMContentLoaded', function () {
    // Obtener el valor de búsqueda de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');

    // Seleccionar el h1 y actualizarlo con el término de búsqueda
    const h1Busqueda = document.querySelector('.h1-busqueda');
    if (searchQuery) {
        h1Busqueda.textContent = `Mostrando resultados para: ${searchQuery}`;

        // Simulación de datos de búsqueda
        const resultados = [
            { tipo: 'material', titulo: 'Matemáticas Básicas', autor: 'Juan Pérez', descripcion: 'Un curso completo sobre matemáticas.' },
            { tipo: 'profesor', nombre: 'Ana López', materias: 'Matemáticas, Física', descripcion: 'Profesora de ciencias exactas con 5 años de experiencia.' },
            // Añade más datos si es necesario
        ];

        // Filtrar los resultados
        const resultadosFiltrados = resultados.filter(item =>
            (item.tipo === 'material' && item.titulo.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.tipo === 'profesor' && item.nombre.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        // Mostrar resultados
        const articleResultados = document.querySelector('.article-resultados-busqueda');
        articleResultados.innerHTML = ''; // Limpiar resultados anteriores

        if (resultadosFiltrados.length > 0) {
            resultadosFiltrados.forEach(resultado => {
                const div = document.createElement('div');
                div.classList.add(resultado.tipo === 'material' ? 'div-material-busqueda' : 'div-profesor-busqueda');

                div.innerHTML = resultado.tipo === 'material' ? `
                    <p class="big">${resultado.titulo}</p>
                    <p class="bold">${resultado.autor}</p>
                    <p>${resultado.descripcion}</p>
                    <button>Descargar</button>
                ` : `
                    <p class="big">${resultado.nombre}</p>
                    <p class="bold">${resultado.materias}</p>
                    <p>${resultado.descripcion}</p>
                    <button>Ver perfil</button>
                `;

                articleResultados.appendChild(div);
            });
        } else {
            h1Busqueda.textContent = "No se han encontrado profesores o materiales de trabajo con ese nombre";
        }
    }
});
