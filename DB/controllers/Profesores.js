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
    const query = 'SELECT * FROM public."profesores" WHERE "ID" = $1';
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

//Actualizar un profesor 

const updateprof = async (req,res) => {

console.log(req.body);
const {nombre, apellido, fecha_de_nacimiento, email, materias, telefono, valoracion, pais, idiomas, foto, descripcion_corta, ID} = req.body;
console.log( nombre, apellido, fecha_de_nacimiento, email, materias, telefono, valoracion, pais, idiomas, foto, descripcion_corta, ID);


// try {
  const result = await client.query(
    'UPDATE profesores SET nombre = $1, apellido = $2, fecha_de_nacimiento = $3, email = $4, materias = $5, telefono = $6, valoracion = $7, pais = $8, idiomas = $9, foto =$10, descripcion_corta=$11 WHERE "ID" = $12 RETURNING *',
    [nombre, apellido, fecha_de_nacimiento, email, materias, telefono, valoracion, pais, idiomas, foto, descripcion_corta, ID]
  );

  if (result.rows.length > 0) {
    res.status(200).send(`profesor actualizado con éxito: ${JSON.stringify(result.rows[0])}`);
  } else {
    res.status(404).send('profesor no encontrado');
  }
// } catch (err) {
//   res.status(500).send(`Error al actualizar el alumno: ${err.message}`);
// }
}

// eliminar profesor
const deleteprof = async (req,res) => {
  const  ID  = req.params.ID;
  const result = await client.query
  ('DELETE from public."profesores" WHERE "ID" = $1 RETURNING*',
  [ID])
  if (result.rows.length > 0) {
    res.status(200).send(`profesor eliminado con éxito: ${JSON.stringify(result.rows[0])}`);
  } else {
    res.status(404).send('profesor no encontrado');
  }
  };
  




const profesores = {
  getprof, 
  getprofbyID,
  createprof,
  updateprof,
  deleteprof
};

export default profesores;
