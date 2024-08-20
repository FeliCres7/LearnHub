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

//Obtener un profesor por ID
const getprofbyID = async (req, res) => {
  try {
    const ID = req.params.ID;

    
    if (!ID) {
      return res.status(400).json({ error: 'ID es requerido' });
    }

    const query = 'SELECT * FROM public."Profesores" WHERE "ID" = $1';
    const { rows } = await client.query(query, [ID]);

    if (rows.length === 1) {
      return res.json({ message: 'profesor obtenido con éxito', profesor: rows[0] });
    } else {
      return res.status(404).json({ error: 'profesor no encontrado' });
    }
  } catch (err) {
    console.error('Error al obtener el profesor:', err);
    return res.status(500).json({ error: 'Error al obtener el profesor' });
  }
};

//Crear un profesor
const createprof = async (req, res) => {
  const {nombre,apellido,fecha_de_nacimiento,email,materias,telefono,valoracion,pais,idiomas,foto,descripcion_corta } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO profesores (nombre, apellido, fecha_de_nacimiento, email, materias, telefono, valoracion, pais, idiomas, foto, descripcion_corta ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [nombre, apellido, fecha_de_nacimiento, email, materias, telefono, valoracion, pais, idiomas, foto, descripcion_corta ]
    );
    res.status(201).json({
      message: ('Profesor creado con éxito'),
      profesor: result.rows[0]  
    });
  } catch (err) {
    console.error('Error al crear el profesor:', err.message);
    res.status(500).json({ error: err.message });
  }
};

const profesores = {
  getprof, 
  getprofbyID,
  createprof
};

export default profesores;
