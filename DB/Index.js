import express from "express";
import alumnos from './controllers/Alumnos.js';
import profesores from './controllers/Profesores.js';
import {client} from './dbconfig.js'
const app = express();
const port = 3000;

//Servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Learnhub listening on port 3000!");


  app.use(express.json());


  app.get("/", (_, res) => {
    res.send("Proyecto Learnhub is working!");
  });


  //Rutas express!

  //Alumnos
  app.get('/Alumnos', alumnos.getalumnos);
  app.get('/Alumnos/:id', alumnos.getalumnos);
  app.get('/Alumnos', alumnos.createAlumno)
  // app.put('/Alumnos/id', alumnos.updateAlumno);
  // app.delete('/Alumnos', alumnos.deleteAlumno);

  //Profesores
 


 



})
