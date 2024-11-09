// Menú desplegable en el header
document.getElementById('menubutton').addEventListener('click', function () {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

// Función para buscar profesores
async function buscarProfesores(nombre, apellido) {
    try {
        const response = await fetch(`https://learn-hub-eta.vercel.app/profesores/nombreapellido/${nombre}/${apellido}`);
        const data = await response.json();
        return data.profesores || [];
    } catch (error) {
        console.error('Error en la búsqueda de profesores:', error);
        return [];
    }
}

// Función para buscar materiales
async function buscarMateriales(nombre) {
    try {
        const response = await fetch(`https://learn-hub-eta.vercel.app/Material/${nombre}`);
        const data = await response.json();
        return data.materiales || [];
    } catch (error) {
        console.error('Error en la búsqueda de materiales:', error);
        return [];
    }
}

// Función de búsqueda (Redirección)
function buscaralumno() {
    const query = document.getElementById('búsqueda').value;
    if (query) {
        window.location.href = `resultadosdebusqueda.html?search=${query}`;
    }
}
function buscarprof() {
    const query = document.getElementById('búsqueda').value;
    if (query) {
        window.location.href = `profesorresultadosdebusqueda.html?search=${query}`;
    }
}
function buscaralumnoc() {
    const query = document.getElementById('búsqueda').value;
    if (query) {
        window.location.href = `../resultadosdebusqueda.html?search=${query}`;
    }
}
function buscarprofc() {
    const query = document.getElementById('búsqueda').value;
    if (query) {
        window.location.href = `../profesorresultadosdebusqueda.html?search=${query}`;
    }
}
// Funcionalidad de búsqueda en resultados
document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    const h1Busqueda = document.querySelector('.h1-busqueda');

    if (searchQuery) {
        h1Busqueda.textContent = `Mostrando resultados para: ${searchQuery}`;
        const [nombre, ...apellidoParts] = searchQuery.split(" ");
        const apellido = apellidoParts.join(" ");

        const profesores = await buscarProfesores(nombre, apellido);
        const materiales = await buscarMateriales(searchQuery);

        const articleResultados = document.querySelector('.article-resultados-busqueda');
        articleResultados.innerHTML = ''; // Limpiar resultados anteriores

        // Función para obtener el nombre de la materia usando el ID
        async function obtenerNombreMateria(idMateria) {
            try {
                const response = await fetch(`https://learn-hub-eta.vercel.app/Materia/${idMateria}`);
                const data = await response.json();
                return data.materia || 'Materia desconocida';
            } catch (error) {
                console.error('Error al obtener el nombre de la materia:', error);
                return 'Materia desconocida';
            }
        }

        // Función para obtener el nombre del profesor usando el ID
        async function obtenerNombreProfesor(idProfesor) {
            try {
                const response = await fetch(`https://learn-hub-eta.vercel.app/profesores/${idProfesor}`);
                const data = await response.json();
                return `${data.profesor.nombre} ${data.profesor.apellido}` || 'Profesor desconocido';
            } catch (error) {
                console.error('Error al obtener el nombre del profesor:', error);
                return 'Profesor desconocido';
            }
        }

        // Mostrar profesores si se encuentran
        if (profesores.length > 0) {
            for (const profesor of profesores) {
                const nombreMateria = await obtenerNombreMateria(profesor.idmateria);

                const div = document.createElement('div');
                div.classList.add('div-profesor-busqueda');
                div.innerHTML = `
                    <img src="data:image/jpeg;base64,${profesor.foto}" alt="Foto de ${profesor.nombre} ${profesor.apellido}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;" />
                    <p class="big">${profesor.nombre} ${profesor.apellido}</p>
                    <p class="bold">${nombreMateria}</p>
                    <button class="ver-perfil" data-id="${profesor.ID}">Ver perfil</button>
                `;
                articleResultados.appendChild(div);
            }

            const botonesVerPerfil = document.querySelectorAll('.ver-perfil');
            botonesVerPerfil.forEach(boton => {
                boton.addEventListener('click', function () {
                    const profesorId = boton.getAttribute('data-id');
                    window.location.href = `perfilprofesordesdealumno.html?id=${profesorId}`;
                });
            });
        } else {
            console.log("No se encontraron profesores.");
        }

        // Mostrar materiales si se encuentran
        if (materiales.length > 0) {
            for (const material of materiales) {
                const nombreProfesor = await obtenerNombreProfesor(material.IDprofesor);
                const div = document.createElement('div');
                div.classList.add('div-material-busqueda');
                div.innerHTML = `
                    <p class="big">${material.nombre}</p>
                    <p class="bold">Profesor: ${nombreProfesor}</p>
                    <p>${material.infoguia}</p>
                    <button class="descargar-material" onclick="descargarMaterial('${material.archivo}', '${material.nombre}')">
                        Descargar
                    </button>
                `;
                articleResultados.appendChild(div);
            }
        } else {
            console.log("No se encontraron materiales.");
        }

        // Si no se encuentran ni profesores ni materiales
        if (profesores.length === 0 && materiales.length === 0) {
            h1Busqueda.textContent = "No se han encontrado resultados para este nombre";
        }
    }
});

// Función para descargar el material
function descargarMaterial(base64, nombre) {
    const link = document.createElement('a');
    link.href = `data:application/octet-stream;base64,${base64}`;
    link.download = `${nombre}.pdf`;  // O cualquier extensión del archivo
    link.click();
}

// Evento para el botón de búsqueda
document.addEventListener('DOMContentLoaded', function () {
    const botonBuscar = document.querySelector('.buttonsearch');
    botonBuscar.addEventListener('click', buscar);
});
