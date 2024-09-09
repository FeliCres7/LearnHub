import express from "express";
import alumnos from './controllers/Alumnos.js';
import profesores from './controllers/Profesores.js';
import clases from './controllers/clases.js';
import material from './controllers/Material.js'
import materia from './controllers/Materia.js'
import { client } from './dbconfig.js'
import cors from "cors"
const app = express();
const port = 3000;
//const jwt = require('jsonwebtoken');


client.connect()

//Servidor en el puerto 3000
app.listen(port, () => {
  console.log(`Learnhub listening on port ${port}!`);
})

//Middleware
app.use(express.json());
app.use(cors())

app.get("/", (req, res) => {
  res.send("Proyecto Learnhub esta funcionando!");
});

//Rutas express!

// LOG IN 
app.post('/Alumnos/login',alumnos.login);
app.post('/profesores/login',profesores.loginprof);

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


//Clases
app.get('/clases', clases.getClases);
app.get('/Clases/:ID', clases.getClaseByID);
app.post('/Clases', clases.createClase);
app.put('/Clases/ID', clases.updateClase);
app.delete('/Clases/:ID', clases.deleteclase);
app.get('/Clases/:ID/valoracionesbyclases', clases.getvaloracionbyclases);
app.post('/Clases/valoracionbyclases', clases.createvaloracionbyclases);
app.delete('/Clases/valoracionbyclases/:IDclases', clases.deletevaloracionbyclases);


//Materia
//app.get('/Materia', materia.getmateria);
//app.get('/Materia/:ID', materia.getmateriaByID);
//app.post('/Materia', materia.createmateria);
// app.put('/Materia/ID', materia.updatemateria);
// app.delete('/Materia/:ID', materia.deletemateria);

//Material
app.get('/Material', material.getmaterial);
app.get('/Material/:ID', material.getmaterialByID);
app.post('/Material', material.creatematerial);
app.put('/Material/ID', material.updatematerial);
app.delete('/Material/:ID', material.deletematerial);