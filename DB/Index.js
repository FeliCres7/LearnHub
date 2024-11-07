import express from "express";
import alumnos from './controllers/Alumnos.js';
//import { Server } from "socket.io";
//import { createServer } from "node:http";
import auth from './controllers/auth.js'
import profesores from './controllers/Profesores.js';
//import clases from './controllers/clases.js';
import material from './controllers/Material.js'
import materia from './controllers/Materia.js'
import paises from './controllers/paises.js'
import reservaciones from "./controllers/reservaciones.js";
import seguir from './controllers/siguen.js'
import {pool} from './dbconfig.js';
import cors from "cors";
import { verifyAdmin, verifyToken } from "./Middleware/Middleware.js"
import dotenv from 'dotenv';



const app = express();
const port = 3000;

// Conectar a la base de datos
pool.connect();


// Middleware para JSON y CORS
app.use(express.json());
app.use(cors({
  origin: "*", // origen permitido
  methods: ['GET', 'POST', 'DELETE', 'PUT' , 'OPTIONS']
}));

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Proyecto Learnhub está funcionando!");
});



// Middleware de manejo de errores, para que tire mas info 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

// Iniciar el servidor en el puerto 3000
app.listen(port, () => {
  console.log(`Learnhub escuchando en el puerto ${port}!`);
});


//Rutas express!

// LOG IN 
app.post('/auth/login', auth.login); // terminado

//registrarse
app.post('/auth/register', auth.register) //falta q funcione


// SEGUIR. terminado
app.get('/siguen/IDalumno/:IDalumno', seguir.getprofesoresseguidos)
app.post('/siguen', verifyToken, seguir.seguirprofesor);
app.delete('/siguen/:ID', seguir.dejardeseguir);

//Alumnos. terminado
app.get('/Alumnos/:ID', alumnos.getalumnosbyid)
app.get('/Alumnos/:email', alumnos.getalumnosbymail)
app.put('/Alumnos/seguridad/:ID', verifyToken, alumnos.updateseguridadalumno);
app.put('/Alumnos/info/:ID', verifyToken, alumnos.updateinfoalumno);
app.delete('/Alumnos/:ID', verifyToken, alumnos.deleteAlumno);
app.get('/Alumnos/:ID/perfilalumno', alumnos.getperfilalumno)

//Profesores. terminar algunas cositas chicas
app.get('/profesores', profesores.getprof);
app.get('/profesores/:ID',profesores.getprofbyID);
app.get('/profesores/email/:email', profesores.getprofbymail);
app.get('/profesores/nombreapellido/:nombre/:apellido', profesores.getprofbynombreyapellido);
app.get('/profesores/getdisponibilidadhoraria/:idprof', profesores.getDisponibilidadHoraria)
app.put('/profesores/updateinfopersonal/:ID', verifyToken, verifyAdmin, profesores.updateinfopersonal);
app.put('/profesores/updateperfil/:ID', verifyToken, verifyAdmin, profesores.updateperfil);
app.put('/profesores/updateseguridad/:ID', profesores.updateseguridad);
app.put('/profesores/updatedisponibilidadhoraria/:idprof', profesores.updatedisponibilidadhoraria);
app.delete('/profesores/:ID',profesores.deleteprof);
app.get('/profesores/:ID/perfilprof', profesores.getperfilprof)
app.get('/profesores/Disponibilidad_horaria/:disponibilidad_horaria', profesores.getprofbydisponibilidadhoraria); 
app.get('/profesores/materias/:materias', profesores.getprofbymaterias);
app.post('/profesores/valoraciones', profesores.createvaloracionbyclases);

/* //Clases
app.get('/clases', clases.getClases);
app.get('/Clases/:ID', clases.getClaseByID);
app.post('/Clases', clases.createClase);
app.put('/Clases/ID', clases.updateClase);
app.delete('/Clases/:ID', clases.deleteclase);
*/

//Materia terminado
app.get('/Materia', materia.getmateria);
app.get('/Materia/:ID', materia.getMateriaById);

//paises terminado
app.get('/paises', paises.getpaises);
app.get('/paises/:ID', paises.getpaisesById);

//Material. terminado
app.get('/Material', material.getmaterial);
app.get('/Material/:nombre', material.getmaterialbynombre);
app.get('/Material/ID/:ID', material.getmaterialbyid);
app.get('/Material/idprof/:IDprofesor', material.getmaterialbyidprof);
app.post('/Material/:IDprofesor', verifyToken, verifyAdmin, material.creatematerial);
app.put('/Material/ID/:ID', verifyToken, verifyAdmin, material.updatematerial);
app.delete('/Material/:ID', verifyToken, verifyAdmin, material.deletematerial);

//reservaciones. terminado
app.get('/reservaciones', reservaciones.getreservarclase);
app.post('/reservaciones', verifyToken, reservaciones.createreservarclase);
app.get('/reservaciones/IDalumno/:IDalumno', reservaciones.getreservacionbyalumno);
app.get('/reservaciones/IDprof/:idprof', reservaciones.getreservacionbyprof);