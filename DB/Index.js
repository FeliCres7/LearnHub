import express from "express";
import alumnos from './controllers/Alumnos.js';
import auth from './controllers/auth.js'
import profesores from './controllers/Profesores.js';
import clases from './controllers/clases.js';
import material from './controllers/Material.js'
import materia from './controllers/Materia.js'
import reservaciones from "./controllers/reservaciones.js";
import fs from 'fs';
import { client } from './dbconfig.js';
import cors from "cors";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from 'path';
import cloudinary from "cloudinary";

const app = express();
const port = 3000;

// Conectar a la base de datos
client.connect();


// Middleware para JSON y CORS
app.use(express.json());
app.use(cors({
  origin: "*", // origen permitido
  methods: ['GET', 'POST', 'OPTIONS'] // métodos permitidos
}));

// Definir las rutas estáticas y el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = join(__dirname, "../uploads");

// Asegurarse de que la carpeta existe, si no, crearla
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Filtro para permitir solo archivos PDF, JPEG, PNG y JPG
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


// Manejo de archivos
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('Archivo subido con éxito');
}, (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).send(error.message);
  } else if (error) {
    return res.status(400).send(error.message);
  }
  next();
});

// Middleware de manejo de errores
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
app.post('/auth/login',auth.login);

//registrarse
app.post('/auth/register', upload.single('foto'), auth.register)

//VERIFICACION 
app.post('/Alumnos/verificacion', alumnos.verificacion);
app.post('/profesores/verificacionprof', profesores.verificacionprof);

//Alumnos
app.get('/Alumnos', alumnos.getalumnos);
app.get('/Alumnos/:ID', alumnos.getalumnobyID);
app.post('/Alumnos', alumnos.createAlumno);
app.put('/Alumnos/ID', alumnos.updateAlumno);
app.delete('/Alumnos/:ID', alumnos.deleteAlumno);
//app.get('/Alumnos/:ID/clasebyalumno/:IDclases/',alumnos.getclasebyalumno);
app.get('/Alumnos/:ID/perfilalumno',alumnos.getperfilalumno)

//Profesores
app.get('/profesores', profesores.getprof);
app.get('/profesores/:ID', profesores.getprofbyID);
app.post('/profesores', profesores.createprof);
app.put('/profesores/ID', profesores.updateprof);
app.delete('/profesores/:ID', profesores.deleteprof);
// app.get('/profesores/:ID/clasesbyprof/IDclases', profesores.getclasesbyprof);
app.get('/profesores/:ID/perfilprof',profesores.getperfilprof)
app.get('/profesores/dicta', profesores.getdicta);
app.post('/profesores/dicta/:ID', profesores.createdicta);

//Clases
app.get('/clases', clases.getClases);
app.get('/Clases/:ID', clases.getClaseByID);
app.post('/Clases', clases.createClase);
app.put('/Clases/ID', clases.updateClase);
app.delete('/Clases/:ID', clases.deleteclase);
app.get('/Clases/:ID/valoracionesbyclases', clases.getvaloracionbyclases);
app.post('/Clases/valoracionbyclases', clases.createvaloracionbyclases);
app.delete('/Clases/valoracionbyclases/:IDclases', clases.deletevaloracionbyclases);
app.delete('/Clases/valoracionbyclases/:IDclases/:ID', clases.deletevaloracionbyclases);


//Materia
app.get('/Materia', materia.getmateria);
app.get('/Materia/:ID', materia.getmateriaByID);
app.post('/Materia', materia.createmateria);
app.put('/Materia/ID', materia.updatemateria);
app.delete('/Materia/:ID', materia.deletemateria);

//Material
app.get('/Material', material.getmaterial);
app.get('/Material/:ID', material.getmaterialByID);
app.post('/Material', material.creatematerial);
app.put('/Material/ID', material.updatematerial);
app.delete('/Material/:ID', material.deletematerial);

//reservaciones
app.get('/reservaciones', reservaciones.getreservarclase);