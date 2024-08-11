import express from "express";
import alumnos from './controllers/Alumnos.js';
//import profesores from './controllers/Profesores.js';
//import clases from './controllers/clases.js';
import {client} from './dbconfig.js'
const app = express();
const port = 3000;

//Servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Learnhub listening on port 3000!");


  app.use(express.json());


  app.get("/", (req, res) => {
    res.send("Proyecto Learnhub esta funcionando!");
  });


  //Rutas express!

  //Alumnos
  app.get('/Alumnos', alumnos.getalumnos);
  //app.get('/Alumnos/:id', alumnos.getalumnobyID);
  //app.create('/Alumnos', alumnos.createAlumno);
  //app.put('/Alumnos/id', alumnos.updateAlumno);
  // app.delete('/Alumnos', alumnos.deleteAlumno);

  //Profesores
  //app.get('/profesores', profesores.getprofesores);
  //app.get('/profesores/:id', profesores.getprofesores);
  //app.get('/profesores', profesores.createprofesores);
  // app.put('/profesores/id', profesores.updateprofesores);
  // app.delete('/profesores', profesores.deleteprofesores);


 //Clases
  //app.get('/clases', clases.getclases);
  //app.get('/clases/:id', clases.getclases);
 // app.get('/clases', clases.createclases);
  //app.put('/clases/id', clases.updateClase);
  // app.delete('/clases', clases.deleteclases);


   //Materia
  //app.get('/Materia', materia.getmateria);
  //app.get('/Materia/:id', materia.getmateria);
  //app.get('/Materia', materia.createmateria);
  // app.put('/Materia/id', materia.updatemateria);
  // app.delete('/Materia', materia.deletemateria);

 



})
