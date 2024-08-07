import express from "express";
import alumnos from './controllers/Alumnos.js';
import profesores from './controllers/Profesores.js';
import mysql from 'mysql2/promise' 
import dbConfig from './dbconfig.js'
const app = express();
const port = 3000;

//servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Learnhub listening on port 3000!");




app.use(express.json());


app.get("/", (_, res) => {
    res.send("Proyecto Learnhub is working!");
});


//Rutas express!




// Creo una conexión a la base de datos
const db = mysql.createPool(dbConfig.createConection());

//obtengo todos los alumnos
app.get('/Alumnos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM alumnos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Obtener un alumno por ID
app.get('/Alumnos/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await db.query('SELECT * FROM alumnos WHERE ID = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'alumno no encontrado' });
      }
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Crear un nuevo alumno
  app.post('/Alumnos', async (req, res) => {
    const { ID	,Nombre	,Apellido	,Fecha, de, nacimiento	,Email		,Telefono	,Valoracion,	Pais	,Idiomas	,Foto,  } = req.body;
    try {
        const [result] = await db.query('INSERT INTO alumno (ID, Nombre, Apellido, Fecha, de, nacimiento, Email, Telefono, Valoracion, Pais, Idiomas, Foto, )');
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Eliminar un alumno
  app.delete('/Alumnos/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await db.query('DELETE FROM alumno WHERE ID = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'alumno no encontrado' });
      }
      res.json({ message: 'alumno eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }

    // Update alumno
    app.put('/Alumnos/:id', async (req, res) => {
      const { id } = req.params;
      const { Nombre, Apellido, Fecha_de_nacimiento, Email, Telefono, Valoracion, Pais, Idiomas, Foto } = req.body;
    
      try {
        const [result] = await db.query('UPDATE alumnos SET Nombre = ?, Apellido = ?, Fecha_de_nacimiento = ?, Email = ?, Telefono = ?, Valoracion = ?, Pais = ?, Idiomas = ?, Foto = ? WHERE ID = ?', [Nombre, Apellido, Fecha_de_nacimiento, Email, Telefono, Valoracion, Pais, Idiomas, Foto, id]);
    
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Alumno no encontrado' });
        }
    
        res.json({ message: 'Alumno actualizado' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
  });
  
  
// Obtengo todos los profesores
app.get('/´Profesores', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM profesor');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Obtener un profesor por ID
  app.get('/Profesores/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await db.query('SELECT * FROM profesor WHERE ID = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Profesor no encontrado' });
      }
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Crear un nuevo profesor
  app.post('/profesores', async (req, res) => {
    const { Nombre, Apellido, Fecha_de_nacimiento, Email, Materias, Telefono, Valoracion, Pais, Idiomas, Foto, Descripcion_corta } = req.body;
    try {
      const [result] = await db.query('INSERT INTO profesor (Nombre, Apellido, Fecha_de_nacimiento, Email, Materias, Telefono, Valoracion, Pais, Idiomas, Foto, Descripcion_corta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [Nombre, Apellido, Fecha_de_nacimiento, Email, Materias, Telefono, Valoracion, Pais, Idiomas, Foto, Descripcion_corta]);
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Eliminar un profesor
  app.delete('/profesores/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await db.query('DELETE FROM profesor WHERE ID = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Profesor no encontrado' });
      }
      res.json({ message: 'Profesor eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }

  //Update Profesor
  app.put('/profesores/:id', async (req, res) => {
    const { id } = req.params;
    const { Nombre, Apellido, Fecha_de_nacimiento, Email, Materias, Telefono, Valoracion, Pais, Idiomas, Foto, Descripcion_corta } = req.body;
  
    try {
      const [result] = await db.query('UPDATE profesores SET Nombre = ?, Apellido = ?, Fecha_de_nacimiento = ?, Email = ?, Materias = ?, Telefono = ?, Valoracion = ?, Pais = ?, Idiomas = ?, Foto = ?, Descripcion_corta = ? WHERE ID = ?', [Nombre, Apellido, Fecha_de_nacimiento, Email, Materias, Telefono, Valoracion, Pais, Idiomas, Foto, Descripcion_corta, id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Profesor no encontrado' });
      }
  
      res.json({ message: 'Profesor actualizado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })}
  
)})})

