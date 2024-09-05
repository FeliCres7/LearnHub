import {client} from '../dbconfig.js'
import bcrypt from "bcryptjs"

//LOG IN
const loginprof = async (req, res) => {
  const { usuario, contraseña } = req.body;

  try {
    const checkUser = await client.query('SELECT * FROM public.profesores WHERE "email" = $1', [usuario]);

    if (!checkUser.rows.length) { // Cambié checkUser a checkUser.rows.length
      return res.status(404).send("Not found");
    } else {
      const isValidated = await bcrypt.compare(contraseña, checkUser.rows[0].contraseña); // Cambié checkUser.contraseña a checkUser.rows[0].contraseña
      if (isValidated) {
        return res.status(200).send("Logged in!");
      } else {
        return res.status(200).send("Wrong password");
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message }); // Enviando el error como un objeto JSON
  }
};
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
  const {nombre,apellido,fecha_de_nacimiento,email,materias,telefono,valoracion,pais,idiomas,foto,descripcion_corta,contraseña} = req.body;
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedContraseña = await bcrypt.hash(contraseña,salt)
    const result = await client.query(
      'INSERT INTO profesores (nombre, apellido, fecha_de_nacimiento, email, materias, telefono, valoracion, pais, idiomas, foto, descripcion_corta,contraseña ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
      [nombre, apellido, fecha_de_nacimiento, email, materias, telefono, valoracion, pais, idiomas, foto, descripcion_corta, hashedContraseña]
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

const updateprof = async (req, res) => {
  try {
    // Imprimir los datos recibidos en el cuerpo de la solicitud
    console.log(req.body);
    const {
      nombre, apellido, fecha_de_nacimiento, email, materias,
      telefono, valoracion, pais, idiomas, foto, descripcion_corta, contraseña, ID
    } = req.body;
    console.log(nombre, apellido, fecha_de_nacimiento, email, materias, telefono, valoracion, pais, idiomas, foto, descripcion_corta, contraseña, ID);

    // Ejecutar la consulta SQL para actualizar el registro del profesor
    const result = await client.query(
      `UPDATE public."profesores"
       SET nombre = $1, apellido = $2, fecha_de_nacimiento = $3, email = $4,
           materias = $5, telefono = $6, valoracion = $7, pais = $8,
           idiomas = $9, foto = $10, descripcion_corta = $11, contraseña = $12
       WHERE "ID" = $13
       RETURNING *`,
      [nombre, apellido, fecha_de_nacimiento, email, materias, telefono, valoracion, pais, idiomas, foto, descripcion_corta, contraseña, ID]
    );

    // Verificar el resultado de la actualización
    if (result.rows.length > 0) {
      res.status(200).send(`Profesor actualizado con éxito: ${JSON.stringify(result.rows[0])}`);
    } else {
      res.status(404).send('Profesor no encontrado');
    }
  } catch (err) {
    // Manejar errores que puedan ocurrir durante la consulta
    res.status(500).send(`Error al actualizar el profesor: ${err.message}`);
  }
};



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
  loginprof,
  getprof, 
  getprofbyID,
  createprof,
  updateprof,
  deleteprof,
 //getperfilprof

};

export default profesores;
