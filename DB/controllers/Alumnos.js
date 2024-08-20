import {client} from '../dbconfig.js'


//obtener todos los alumnos
const getalumnos = async (_, res) => {
  try {
    const { rows } = await client.query('SELECT * FROM Alumnos');
    res.json(rows);
    res.send("Alumnos obtenidos con exito")
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
// OBTENER UN ALUMNO
const getalumnobyID = async (req, res) => {
  
  const  ID  = req.params.ID;

  try {
    const query = 'SELECT * FROM public."alumnos" WHERE "ID" = $1';
    const { rows } = await client.query(query, [ID]);
    if (rows.length === 1) {
      return res.json({ message: 'Alumno obtenido con éxito', alumno: rows[0] });
    } else {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }
  } catch (err) {
    console.error('Error al obtener el alumno:', err);
    return res.status(500).json({ error: 'Error al obtener el alumno' });
  }
};

// Crear un alumno
const createAlumno = async (req, res) => {
  const {nombre, apellido, contraseña, fecha_de_nacimiento, foto, Email, telefono, pais, idiomas} = req.body;
try {
 const result = await client.query(
      "INSERT INTO alumnos (nombre, apellido, contraseña, fecha_de_nacimiento, foto, Email, telefono, pais, idiomas) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [nombre, apellido, contraseña, fecha_de_nacimiento, foto, Email, telefono, pais, idiomas]
    );

    res.status(201).json({
      message: ('Alumno creado con éxito'),
      alumno: result.rows[0]  
    });
  } catch (err) {
    console.error('Error al crear el alumno:', err.message);
    res.status(500).json({ error: err.message });
  }
};
  // Actualizar un alumno
const updateAlumno = async (req, res) => {

  console.log(req.body);
  const {nombre, apellido, contraseña, fecha_de_nacimiento, foto, email, telefono, pais, idiomas, ID} = req.body;
  console.log(nombre, apellido, contraseña, fecha_de_nacimiento, foto, email, telefono, pais, idiomas, ID);
  
  
  // try {
    const result = await client.query(
      'UPDATE alumnos SET nombre = $1, apellido = $2, contraseña = $3, fecha_de_nacimiento = $4, foto = $5, email = $6, telefono = $7, pais = $8, idiomas = $9 WHERE "ID" = $10 RETURNING *',
      [nombre, apellido,  contraseña, fecha_de_nacimiento, foto, email, telefono, pais, idiomas, ID]
    );

    if (result.rows.length > 0) {
      res.status(200).send(`Alumno actualizado con éxito: ${JSON.stringify(result.rows[0])}`);
    } else {
      res.status(404).send('Alumno no encontrado');
    }
  // } catch (err) {
  //   res.status(500).send(`Error al actualizar el alumno: ${err.message}`);
  // }
};

//Eliminar alumno 
const deleteAlumno = async (req, res) => {
const  ID  = req.params.ID;
const result = await client.query
('DELETE from public."alumnos" WHERE "ID" = $1 RETURNING*',
[ID])
if (result.rows.length > 0) {
  res.status(200).send(`Alumno eliminado con éxito: ${JSON.stringify(result.rows[0])}`);
} else {
  res.status(404).send('Alumno no encontrado');
}
};


const alumnos = {
  getalumnos,
  getalumnobyID,
  createAlumno,
  updateAlumno,
  deleteAlumno
};

export default alumnos;

