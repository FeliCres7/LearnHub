
//menu desplegable en en header
document.getElementById('menubutton').addEventListener('click', function() {
    var menu = document.getElementById('menu');
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
});

const btn = document.getElementById("btnCheck")
const mainCards = document.getElementsByClassName("lista-misprofesores")

function CreateProfCard (prof) {
    return `
    <div class="profesor-misprofesores">
    <p class="name-profesor">${prof.nombre} ${prof.apellido}</p>
    <div class="content-profesor"><img src="" alt="Martín Melman">
        <div class="datos-profesor">
            <div class="datacontainer">
                <p class="bold">Materia:</p>
                <p> ${prof.materias} </p>
            </div>
            <div class="datacontainer">
                <p class="bold">Días:</p>
                <p> Lunes </p>
            </div>
            <div class="datacontainer">
                <p class="bold">Horarios:</p>
                <p> 13:30-14:30</p>
            </div>
        </div>
        <div class="botones-profesor">
            <button>Materiales de trabajo</button>
            <button>Ir a perfil</button>
            <button>Enviar Mensaje</button>
        </div>
        <div class="valoracion-profesor">
            <p>${prof.valoracion}</p>
        </div>
    </div>
</div>`
}


btn.addEventListener("click", async () => {
    fetch("https://learn-hub-eta.vercel.app/profesores")
    .then(res => res.json())
    .then((data) => {
        console.log(data)
        mainCards.innerHTML = ""
        data.forEach((profesor) => {
            const item = CreateProfCard(profesor)
            mainCards.innerHTML += item
        })
    })
}) 