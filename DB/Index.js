import express from "express";
import alumnos from "./routers/alumnos.routers.js";
import auth from "./routers/auth.routers.js";
import clases from "./routers/clases.routers.js";
import materia from "./routers/materia.routers.js";
import material from "./routers/material.routers.js";  
import profesores from "./routers/profesores.routers.js";
import reservaciones from "./routers/reservaciones.routers.js";
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

// Rutas de la API
app.use("/alumnos", alumnos);
app.use("/auth", auth);
app.use("/clases", clases);
app.use("/materia", materia);
app.use("/material", material);  // Ruta de material corregida
app.use("/profesores", profesores);
app.use("/reservaciones", reservaciones);

// Rutas de login
app.post('/Alumnos/login', alumnos.login);
app.post('/profesores/login', profesores.loginprof);

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
