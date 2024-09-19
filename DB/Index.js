import express from "express";
import alumnos from "./routers/alumnos.routers.js";
import auth from "./routers/auth.routers.js";
import clases from "./routers/clases.routers.js";
import materia from "./routers/materia.routers.js";
import material from "./routers/material.routers.js";
import profesores from "./routers/profesores.routers.js";
import reservaciones from "./routers/reservaciones.routers.js";
import fs from 'fs'
import { client } from './dbconfig.js'
import cors from "cors"
import multer from "multer";
import { fileURLToPath } from "url";
import {dirname,join} from 'path'
import cloudinary from "cloudinary";
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
const __dirname = dirname(__filename);

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



app.use("/alumnos", alumnos)
app.use("/auth", auth);
app.use("/clases", clases);
app.use("/materia", materia);
app.use("/materia", material)
app.use("/profesores", profesores);
app.use("/reservaciones", reservaciones);



// LOG IN 
app.post('/Alumnos/login',alumnos.login);
app.post('/profesores/login',profesores.loginprof);




