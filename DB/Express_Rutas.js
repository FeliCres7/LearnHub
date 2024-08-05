import express from "express";
const app = express();
const port = 3000;


import profesores from "./JS/profesores";
import clases from "./JS/clases";
import alumnos from "./JS/alumnos";
import dicta from "./JS/dicta";
import materia from "./JS/materia";
import material from "./JS/material";


app.use(express.json());


app.get("/", (_, res) => {
    res.send("Proyecto Learnhub is working!");
});


//Rutas express!

