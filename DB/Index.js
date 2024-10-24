import express from "express";
import alumnos from './controllers/Alumnos.js';
import auth from './controllers/auth.js'
import profesores from './controllers/Profesores.js';
//import clases from './controllers/clases.js';
import material from './controllers/Material.js'
//import materia from './controllers/Materia.js'
import reservaciones from "./controllers/reservaciones.js";
import seguir from './controllers/siguen.js'
import fs from 'fs';
import {pool} from './dbconfig.js';
import cors from "cors";
import multer from "multer";
import { verifyAdmin, verifyToken } from "./Middleware/Middleware.js"
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'; 
import { dirname } from 'path'; 
import { join } from 'path';



const app = express();
const port = 3000;

// Conectar a la base de datos
pool.connect();


// Middleware para JSON y CORS
app.use(express.json());
app.use(cors({
  origin: "*", // origen permitido
  methods: ['GET', 'POST', 'OPTIONS']
}));


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = join(__dirname, "../uploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, PNG, JPEG, and JPG files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});


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
app.post('/auth/login', auth.login);

//registrarse
app.post('/auth/register', upload.fields([{ name: 'foto'}, { name: 'certificadoestudio'}]), auth.register)


// SEGUIR 
app.get('/siguen/IDalumno/:IDalumno', seguir.getprofesoresseguidos)
app.post('/siguen', seguir.seguirprofesor);
app.delete('/siguen/:ID', seguir.dejardeseguir);

//Alumnos
app.get('/Alumnos', alumnos.getalumnos);
app.get('/Alumnos/:ID', alumnos.getalumnobyID);
app.put('/Alumnos/seguridad/ID', verifyToken, alumnos.updateseguridadalumno);
app.put('/Alumnos/info/ID', verifyToken, alumnos.updateinfoalumno);
app.delete('/Alumnos/:ID', verifyToken, alumnos.deleteAlumno);
app.get('/Alumnos/:ID/perfilalumno', alumnos.getperfilalumno)

//Profesores
app.get('/profesores', profesores.getprof);
app.get('/profesores/:ID',profesores.getprofbyID);
app.get('/profesores/nombreapellido/:nombre/:apellido', profesores.getprofbynombreyapellido);
app.put('/profesores/updateinfopersonal/ID', verifyToken, verifyAdmin, profesores.updateinfopersonal);
app.put('/profesores/updateperfil/ID', verifyToken, verifyAdmin, profesores.updateperfil);
app.put('/profesores/updateseguridad/ID',verifyToken, verifyAdmin, profesores.updateseguridad);
app.put('/profesores/updatedisponibilidadhoraria', profesores.updatedisponibilidadhoraria);
app.delete('/profesores/:ID', verifyToken, verifyAdmin, profesores.deleteprof);
app.get('/profesores/:ID/perfilprof', profesores.getperfilprof)
app.get('/profesores/Disponibilidad_horaria/:disponibilidad_horaria', profesores.getprofbydisponibilidadhoraria); 
app.get('/profesores/materias/:materias', profesores.getprofbymaterias);
app.get('/profesores/dias/:dias', profesores.getprofbydias);
app.get('/profesores/dicta', profesores.getdicta)
app.post('/profesores/dicta/:ID', profesores.createdicta);
app.post('/profesores/valoraciones', verifyToken, profesores.createvaloracionbyclases)

/* //Clases
app.get('/clases', clases.getClases);
app.get('/Clases/:ID', clases.getClaseByID);
app.post('/Clases', clases.createClase);
app.put('/Clases/ID', clases.updateClase);
app.delete('/Clases/:ID', clases.deleteclase);

//Materia
app.get('/Materia', materia.getmateria);
app.get('/Materia/:ID', materia.getmateriaByID);
app.post('/Materia', materia.createmateria);
app.put('/Materia/ID', materia.updatemateria);
app.delete('/Materia/:ID', materia.deletemateria);
*/

//Material
app.get('/Material', material.getmaterial);
app.get('/Material/:ID', material.getmaterialByID);
app.get('/Material/:nombre', material.getmaterialbynombre);
app.post('/Material',verifyToken, verifyAdmin, upload.fields([{ name: 'archivo' }]), material.creatematerial);
app.put('/Material/ID', verifyToken, verifyAdmin, material.updatematerial);
app.delete('/Material/:ID', verifyToken, verifyAdmin, material.deletematerial);

//reservaciones
app.get('/reservaciones', reservaciones.getreservarclase);
app.post('/reservaciones', reservaciones.createreservarclase);
app.get('/reservaciones/IDalumno/:IDalumno', reservaciones.getreservacionbyalumno);
app.get('/reservaciones/IDprof/:IDprof', reservaciones.getreservacionbyprof);


