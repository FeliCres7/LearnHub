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
  const { id } = req.body.id;
  try {
    const { rows } = await client.query('SELECT * FROM alumnos WHERE ID = ?', [id]);
    if (rows.length === 1) {
      res.send("Alumno obtenido con exito: ")
      res.json(rows[0]);
    }
  } catch (err) {
    res.status(404).json({ error: 'alumno no encontrado' });
  }
};

// Crear un alumno
const createAlumno = async (req, res) => {
  const { ID, nombre, apellido, username, clave, fecha_de_nacimiento, foto, Email, telefono, pais, idiomas } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO alumnos (ID, nombre, apellido, username, clave, fecha_de_nacimiento, foto, Email, telefono, pais, idiomas) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 ) " , [valor1, valor2, valor3, valor4, valor5 , valor6 , valor7, valor8 , valor9, valor10 ,valor11]);
    res.send("Alumno creado con exito")
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

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