import express from "express";
import alumnos from './controllers/Alumnos.js';
import profesores from './controllers/Profesores.js';
import clases from './controllers/clases.js';
import { client } from './dbconfig.js'
const app = express();
const port = 3000;


client.connect()
const res = await client.query("SELECT * FROM alumnos")

console.log(res.rows)


//Servidor en el puerto 3000
app.listen(port, () => {
  console.log(`Learnhub listening on port ${port}!`);
})

app.use(express.json());


app.get("/", (req, res) => {
  res.send("Proyecto Learnhub esta funcionando!");
});

//Rutas express!

//Alumnos

app.get('/Alumnos', alumnos.getalumnos);
app.get('/Alumnos/:ID', alumnos.getalumnobyID);
app.post('/Alumnos', alumnos.createAlumno);
app.put('/Alumnos/ID', alumnos.updateAlumno);
app.delete('/Alumnos/:ID', alumnos.deleteAlumno);

//Profesores

app.get('/profesores', profesores.getprof);
app.get('/profesores/:ID', profesores.getprofbyID);
app.post('/profesores', profesores.createprof);
app.put('/profesores/id', profesores.updateprof);
app.delete('/profesores', profesores.deleteprof);
// app.get('/profesores/:id/clases', profesores.getclasesbyprof)

//Clases
//app.get('/clases', clases.getclases);
//app.get('/clases/:id', clases.getclases);
//app.post('/clases', clases.createclases);
//app.put('/clases/id', clases.updateClase);
//app.delete('/clases', clases.deleteclases);

//Materia
//app.get('/Materia', materia.getmateria);
//app.get('/Materia/:id', materia.getmateria);
//app.get('/Materia', materia.createmateria);
// app.put('/Materia/id', materia.updatemateria);
// app.delete('/Materia', materia.deletemateria);