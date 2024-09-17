import express from "express";
import alumnos from './controllers/Alumnos.js';
import profesores from './controllers/Profesores.js';
import clases from './controllers/clases.js';
import material from './controllers/Material.js'
import materia from './controllers/Materia.js'
import reservaciones from "./controllers/reservaciones.js";
import { client } from './dbconfig.js'
import cors from "cors"
import path from "path";
import multer from "multer";
import fs from "fs"
import auth from "./controllers/auth.js";
const app = express();
const port = 3000;


client.connect()

//Servidor en el puerto 3000
app.listen(port, () => {
  console.log(`Learnhub listening on port ${port}!`);
})

//Middleware
app.use(express.json());
app.use(cors({
  origin: "*", // origen permitido
  methods: ['GET', 'POST', 'OPTIONS'] // metodos permitidos 
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = __dirname(__filename);

// Poner la ubicación de la carpeta de Uploads correspondiente, en este caso se ubica dentro del SRC
const uploadDir = join(__dirname, "../uploads");

// Se define donde se va a ubicar el archivo que vamos a subir y el nombre
// El nombre asignado será la fecha de subida junto con el nombre original del archivo
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Filtro para que solo se suban archivos con extensiones PDF, JPEG, PNG y JPG
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

app.get("/", (req, res) => {
  res.send("Proyecto Learnhub esta funcionando!");
});

//Rutas express!

// LOG IN 
app.post('/Alumnos/login',alumnos.login);
app.post('/profesores/login',profesores.loginprof);

//registrarse
app.post('/auth/register', auth.register)

//VERIFICACION 
app.post('/Alumnos/verificacion', alumnos.verificacion);
app.post('/profesores/verificacionprof', profesores.verificacionprof);



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
app.post('/reservaciones', reservaciones.createreservarclase);