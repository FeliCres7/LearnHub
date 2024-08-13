import {client} from '../dbconfig.js'


//obtener todos los alumnos
const getalumnos = async (_, res) => {
  try {
    const { rows } = await client.query('SELECT * FROM public."Alumnos"');
    res.json(rows);
  } catch (err) {
    res.send("Alumnos obtenidos con exito")
    res.status(500).json({ error: err.message });
  }
}
// OBTENER UN ALUMNO
const getalumnobyID = async (req, res) => {
  // Accede directamente a req.params.id
  const { id } = req.params;

  try {
    // Asegúrate de que la consulta SQL esté bien escrita
    const query = 'SELECT * FROM public."Alumnos" WHERE ID = $1';
    const { rows } = await client.query(query, [id]);

    // Verifica si se encontró el alumno
    if (rows.length === 1) {
      return res.json({ message: 'Alumno obtenido con éxito', alumno: rows[0] });
    } else {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }
  } catch (err) {
    // el console.error para que me tire el error 500, dsp de resolverlo, borrarlo
    console.error('Error al obtener el alumno:', err);
    return res.status(500).json({ error: 'Error al obtener el alumno' });
  }
};

// Crear un alumno
const createAlumno = async (req, res) => {
  const {
    ID, nombre, apellido, clave, fecha_de_nacimiento, foto, Email, telefono, pais, idiomas
  } = req.body;

  try {

    const result = await client.query(
      "INSERT INTO alumnos (ID, nombre, apellido, clave, fecha_de_nacimiento, foto, Email, telefono, pais, idiomas) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,) RETURNING *",
      [ID, nombre, apellido, clave, fecha_de_nacimiento, foto, Email, telefono, pais, idiomas]
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
  const { nombre, apellido, clave, fecha_de_nacimiento, foto, Email, telefono, pais, idiomas } = req.body;

  try {
    const result = await client.query(
      'UPDATE alumnos SET nombre = $1, apellido = $2, clave = $3, fecha_de_nacimiento = $4, foto = $5, Email = $6, telefono = $7, pais = $8, idiomas = $9 WHERE ID = $10 RETURNING *',
      [nombre, apellido,  clave, fecha_de_nacimiento, foto, Email, telefono, pais, idiomas, id]
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