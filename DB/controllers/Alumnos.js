import {client} from '../dbconfig.js'


//obtener todos los alumnos
const getalumnos = async (req, res) => {
  try {
    const { rows } = await client.query('SELECT * FROM public."Alumnos"');
    res.json(rows);
  } catch (err) {
    res.send("Alumnos obtenidos con exito")
    res.status(500).json({ error: err.message });
  }
}

// Obtener un alumno por ID
const getalumnobyID = async (req, res) => {
  const { id } = req.params;
  try {
    const query= 'SELECT * FROM alumnos WHERE ID = $1'; 
    const { rows } = await client.query( query, [id]);
    if (rows.length === 1) {
      res.json({ message: 'Alumno obtenido con éxito', alumno: rows[0] });
    } else {
      res.status(404).json({ error: 'Alumno no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el alumno' });
  }
};

// Crear un alumno
const createAlumno = async (req, res) => {
  const {
    ID, nombre, apellido, username, clave, fecha_de_nacimiento, foto, Email, telefono, pais, idiomas
  } = req.body;

  try {

    const result = await client.query(
      "INSERT INTO alumnos (ID, nombre, apellido, username, clave, fecha_de_nacimiento, foto, Email, telefono, pais, idiomas) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [ID, nombre, apellido, username, clave, fecha_de_nacimiento, foto, Email, telefono, pais, idiomas]
    );

    res.status(201).json({
      message: 'Alumno creado con éxito',
      alumno: result.rows[0]  
    });
  } catch (err) {
    console.error('Error al crear el alumno:', err.message);
    res.status(500).json({ error: err.message });
  }
};
  // Actualizar un alumno
const updateAlumno = async (req, res) => {
  const { id } = req.body.id; 
  const { nombre, apellido, username, clave, fecha_de_nacimiento, foto, Email, telefono, pais, idiomas } = req.body;

  try {
    const result = await client.query(
      'UPDATE alumnos SET nombre = $1, apellido = $2, username = $3, clave = $4, fecha_de_nacimiento = $5, foto = $6, Email = $7, telefono = $8, pais = $9, idiomas = $10 WHERE ID = $11 RETURNING *',
      [nombre, apellido, username, clave, fecha_de_nacimiento, foto, Email, telefono, pais, idiomas, id]
    );

    if (result.rows.length > 0) {
      res.status(200).send(`Alumno actualizado con éxito: ${JSON.stringify(result.rows[0])}`);
    } else {
      res.status(404).send('Alumno no encontrado');
    }
  } catch (err) {
    res.status(500).send(`Error al actualizar el alumno: ${err.message}`);
  }
};
  


const alumnos = {
  getalumnos,
  getalumnobyID,
  createAlumno,
  updateAlumno
}

export default alumnos;