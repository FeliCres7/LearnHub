import {client} from '../dbconfig.js'


// Obtener todos los profesores
const getprof = async (_, res) => {
  try {
    const { rows } = await client.query('SELECT * FROM profesores');
    res.json(rows);
  } catch (err) {
    res.send("profesores obtenidos con exito")
    res.status(500).json({ error: err.message });
  }
}


const getprofbyID = async (req, res) => {
  const { id } = req.params.id;
  try {
    const { rows } = await client.query('SELECT * FROM profesores WHERE ID = ?', [id]);
    if (rows.length === 1) {
      res.send("Profesor obtenido con exito: ")
      res.json(rows[0]);
    }
  } catch (err) {
    res.status(404).json({ error: 'profesor no encontrado' });
  }
};

const createprof = async (req, res) => {
  const { ID, nombre, apellido, username, clave, fecha_de_nacimiento, foto, Email, disponibilidadhoraria, telefono, pais, idiomas } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO alumnos (ID, nombre, apellido, username, clave, fecha_de_nacimiento, foto, Email, disponibilidadhoraria, telefono, pais, idiomas) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 ) RETURNING *',
      [ID, nombre, apellido, username, clave, fecha_de_nacimiento, foto, Email, disponibilidadhoraria, telefono, pais, idiomas]
    );
    res.send("Profesor creado con exito")
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}

const profesores = {
  getprof, 
  getprofbyID,
  createprof
};

export default profesores;
