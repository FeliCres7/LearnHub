import { pool } from '../dbconfig.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from '../upload.js';
import multer from 'multer'
import fs from 'fs'
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

//const JWT_secret = 'Learnhubtoken'
const secret = process.env.JWT_SECRET

const login = async (req, res) => {
  const { usuario, contraseña, tipoUsuario } = req.body;

  if (!tipoUsuario || !['alumno', 'profesor'].includes(tipoUsuario)) {
    return res.status(400).send("El tipo de usuario debe ser 'alumno' o 'profesor'.");
  }

  if (!contraseña || contraseña.length <= 3) {
    return res.status(400).send("La contraseña debe tener más de 3 caracteres.");
  }

  try {
    let checkUser;

    if (tipoUsuario === 'alumno') {
      checkUser = await pool.query('SELECT * FROM public.alumnos WHERE "email" = $1', [usuario]);
    } else if (tipoUsuario === 'profesor') {
      checkUser = await pool.query('SELECT * FROM public.profesores WHERE "email" = $1', [usuario]);
    }

    if (!checkUser.rows.length) {
      return res.status(404).send("Usuario no encontrado.");
    }

    const isValidated = await bcrypt.compare(contraseña, checkUser.rows[0].contraseña);
    if (!isValidated) {
      return res.status(401).send("Contraseña incorrecta.");
    }

    
    const token = jwt.sign(
      { id: checkUser.rows[0].ID, username: checkUser.rows[0].nombre, tipoUsuario },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('access_token', token, {
      maxAge: 1000 * 60 * 60, 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production'
    });

    const destino = tipoUsuario === 'alumno' ? 'alumnohome' : 'profesorhome';
    return res.status(200).json({ usuario: checkUser.rows[0].nombre, token, destino });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).send(`Error del servidor: ${error.message}`);
  }
};


const register = async (req, res) => {
  try {
    const { nombre, apellido, email, password, confirmPassword, tipoUsuario, fecha_de_nacimiento, telefono, idpais, colegio, idmateria } = req.body;

    if (!nombre || !apellido || !email || !password || !confirmPassword || !tipoUsuario) {
      return res.status(400).json({ error: 'Todos los campos son requeridos.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let query;
    let result;

    if (tipoUsuario === 'alumno') {
      const foto = req.files.foto ? req.files.foto[0].path : null;



      if (!foto) {
        return res.status(400).json({ error: 'Se requiere una foto.' });
      }

      const extensionesPermitidas = ['png', 'jpeg', 'jpg'];
      const extensionFoto = foto.split('.').pop();
      if (!extensionesPermitidas.includes(extensionFoto)) {
        return res.status(400).send('Error: Extensión no permitida. La foto debe ser PNG, JPEG o JPG.');
      }

      // Subir la foto a Cloudinary
      const resultFoto = await cloudinary.uploader.upload(foto, { folder: 'alumnos/fotos' });
      const fotoUrl = resultFoto.secure_url;

      // Insertar el alumno en la base de datos
      query = `INSERT INTO public.alumnos (nombre, apellido, email, contraseña, fecha_de_nacimiento, telefono, idpais, colegio, foto) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
      result = await pool.query(query, [nombre, apellido, email, hashedPassword, fecha_de_nacimiento, telefono, idpais, colegio, fotoUrl]);
      
    } else if (tipoUsuario === 'profesor') {
      const { foto, certificadoestudio } = req.files || {};

      const fotoFile = foto ? foto[0].path : null;
      const certificadoFile = certificadoestudio ? certificadoestudio[0].path : null;

      if (!fotoFile || !certificadoFile) {
        return res.status(400).json({ error: 'Se requieren la foto y el certificado de estudio.' });
      }

      const extensionesPermitidas = ['png', 'jpeg', 'jpg'];
      const extensionFoto = fotoFile.split('.').pop();
      const extensionCertificado = certificadoFile.split('.').pop();

      if (!extensionesPermitidas.includes(extensionFoto) || extensionCertificado !== 'pdf') {
        return res.status(400).send('Error: Extensiones no permitidas. La foto debe ser PNG, JPEG o JPG y el certificado debe ser PDF.');
      }

      // Subir la foto y el certificado a Cloudinary
      const resultFoto = await cloudinary.uploader.upload(fotoFile, { folder: 'profesores/fotos' });
      const fotoUrl = resultFoto.secure_url;

      const resultCertificado = await cloudinary.uploader.upload(certificadoFile, { folder: 'profesores/certificados', resource_type: 'raw' });
      const certificadoUrl = resultCertificado.secure_url;

      query = `INSERT INTO public.profesores (nombre, apellido, email, contraseña, fecha_de_nacimiento, telefono, idpais, idmateria, foto, certificadoestudio) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
      result = await pool.query(query, [nombre, apellido, email, hashedPassword, fecha_de_nacimiento, telefono, idpais, idmateria, fotoUrl, certificadoUrl]);

    } else {
      return res.status(400).json({ error: 'Tipo de usuario inválido.' });
    }

    // Crear el token JWT
    const token = jwt.sign({ id: result.rows[0].id, tipoUsuario }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(201).json({
      message: `${tipoUsuario.charAt(0).toUpperCase() + tipoUsuario.slice(1)} registrado con éxito`,
      user: result.rows[0],
      token,
    });
  } catch (err) {
    console.error('Error al registrar:', err);
    return res.status(500).json({ error: 'Ocurrió un error al registrar al usuario.' });
  }
};


const auth = {
    login,
    register

}
export default auth;


