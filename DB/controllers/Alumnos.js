import { pool } from '../dbconfig.js'
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken';
import cloudinary from '../upload.js';

const secret = process.env.JWT_SECRET


//Verificacion alumno
const verificacionAlumno = async (req, res) => {
  const { fecha_de_nacimiento, telefono, pais, colegio } = req.body;


  try {
    // Obtener el archivo de foto
    const fotoFile = req.file;

    // Verificar la extensión de la foto
    const extensionesPermitidas = ['png', 'jpeg', 'jpg'];
    const extensionFoto = fotoFile.originalname.split('.').pop().toLowerCase();

    if (!extensionesPermitidas.includes(extensionFoto)) {
      return res.status(400).send('Error: Extensiones no permitidas. La foto debe ser PNG, JPEG o JPG.');
    }

    // Subir la foto a Cloudinary
    const resultFoto = await cloudinary.uploader.upload(fotoFile.path, {
      folder: 'alumnos/fotos',
    });
    const fotoUrl = resultFoto.secure_url;

    // Insertar la información del alumno en la base de datos
    await pool.query(
      `INSERT INTO public.alumnos (fecha_de_nacimiento, telefono, pais, colegio, foto) 
       VALUES ($1, $2, $3, $4, $5)`,
      [fecha_de_nacimiento, telefono, pais, colegio, fotoUrl]
    );

    return res.json({
      message: 'Alumno registrado con éxito',
      foto: fotoUrl,
    });

  } catch (err) {
    console.error('Error al verificar el alumno:', err);
    return res.status(500).json({ error: 'Error al verificar el alumno' });
  }
};


//obtener todos los alumnos
const getalumnos = async (_, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM Alumnos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
// OBTENER UN ALUMNO 
const getalumnobyID = async (req, res) => {
  try {
    const ID = req.params.ID;


    if (!ID) {
      return res.status(400).json({ error: 'ID es requerido' });
    }

    const query = 'SELECT * FROM public."alumnos" WHERE "ID" = $1';
    const { rows } = await pool.query(query, [ID]);

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

// Actualizar un alumno
const updateAlumno = async (req, res) => {

  const { nombre, apellido, contraseña, fecha_de_nacimiento, foto, email, telefono, pais, idiomas, ID } = req.body;


  try {
    const result = await pool.query(
      'UPDATE alumnos SET nombre = $1, apellido = $2, contraseña = $3, fecha_de_nacimiento = $4, foto = $5, email = $6, telefono = $7, pais = $8, idiomas = $9 WHERE "ID" = $10 RETURNING *',
      [nombre, apellido, contraseña, fecha_de_nacimiento, foto, email, telefono, pais, idiomas, ID]
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

//Eliminar alumno 
const deleteAlumno = async (req, res) => {
  const ID = req.params.ID;
  const result = await pool.query
    ('DELETE from public."alumnos" WHERE "ID" = $1 RETURNING*',
      [ID])
  if (result.rows.length > 0) {
    res.status(200).send(`Alumno eliminado con éxito: ${JSON.stringify(result.rows[0])}`);
  } else {
    res.status(404).send('Alumno no encontrado');
  }
};


const getperfilalumno = async (req, res) => {
  try {
    const ID = req.params.ID;

    if (!ID) {
      return res.status(400).json({ error: 'ID es requerido' });
    }

    const query = 'SELECT nombre, apellido, foto, fecha_de_nacimiento, pais FROM public.alumnos WHERE "ID" = $1';
    const { rows } = await pool.query(query, [ID]);

    if (rows.length === 1) {
      return res.json({
        message: 'Perfil de alumno obtenido con éxito',
        perfil: rows[0]
      });
    } else {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }
  } catch (err) {
    console.error('Error al obtener el perfil del alumno:', err);
    return res.status(500).json({ error: 'Error al obtener el perfil del alumno' });
  }
};



const alumnos = {

  verificacionAlumno,
  getalumnos,
  getalumnobyID,
  updateAlumno,
  deleteAlumno,
  getperfilalumno
};

export default alumnos;

