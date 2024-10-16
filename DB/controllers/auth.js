import { pool } from '../dbconfig.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv/config'
import cloudinary from '../upload.js';


//const JWT_secret = 'Learnhubtoken'
const secret = process.env.JWT_SECRET

const login = async (req, res) => {
  const { usuario, contraseña } = req.body;

  // Validación: la contraseña debe tener más de 3 caracteres
  if (!contraseña || contraseña.length <= 3) {
    return res.status(400).send("La contraseña debe tener más de 3 caracteres.");
  }

  try {
    let checkUser;

    // Primero, buscamos en la tabla 'alumnos'
    checkUser = await pool.query('SELECT * FROM public.alumnos WHERE "email" = $1', [usuario]);

    // Si no se encuentra en 'alumnos', buscamos en 'profesores'
    if (!checkUser.rows.length) {
      checkUser = await pool.query('SELECT * FROM public.profesores WHERE "email" = $1', [usuario]);

      // Si tampoco se encuentra en 'profesores', devolvemos error
      if (!checkUser.rows.length) {
        return res.status(404).send("Usuario no encontrado.");
      }
    }

    // Comparar contraseñas
    const isValidated = await bcrypt.compare(contraseña, checkUser.rows[0].contraseña);
    if (!isValidated) {
      return res.status(401).send("Contraseña incorrecta.");
    }

    // Generar JWT
    const token = jwt.sign(
      { id: checkUser.rows[0].ID, username: checkUser.rows[0].nombre },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Establecer cookie con el token
    res.cookie('access_token', token, {
      maxAge: 1000 * 60 * 60, 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production'
    });

    // Enviar respuesta con el usuario y token
    return res.status(200).json({ usuario: checkUser.rows[0].nombre, token });

  }catch (error) {
      console.error('Error en login:', error);
      return res.status(500).send(`Error del servidor: ${error.message}`);
  }
};

const register = async (req, res) => {
  const { nombre, apellido, email, password, confirmPassword, tipoUsuario, fecha_de_nacimiento, telefono, pais, colegio, materias } = req.body;

  console.log(req.body);
  
  // Validaciones de campos requeridos para todos los usuarios
  if (!nombre || !apellido || !email || !password || !confirmPassword || !tipoUsuario) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  // Validar que las contraseñas coincidan
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
  }

  // Encriptar la contraseña
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let query;
  let result;

  // Registro según el tipo de usuario
  if (tipoUsuario === 'alumno') {
    const foto = req.files.foto ? req.files.foto[0] : null;


    console.log('foto del alumno:',foto)

   
    if (!foto) {
      console.error('Error: Se requiere una foto.');
      return res.status(400).json({ error: 'Se requiere una foto.' });
    }

    const extensionesPermitidas = ['png', 'jpeg', 'jpg'];
    const extensionFoto = foto.originalname.split('.').pop().toLowerCase();
    console.log('Extensión de la foto:', extensionFoto);

    if (!extensionesPermitidas.includes(extensionFoto)) {
      console.error('Error: Extensiones no permitidas para la foto.');
      return res.status(400).send('Error: Extensiones no permitidas. La foto debe ser PNG, JPEG o JPG.');
    }


     // Subir la foto a Cloudinary
     const resultFoto = await cloudinary.uploader.upload(foto.path, { folder: 'alumnos/fotos' });
     const fotoUrl = resultFoto.secure_url;
     console.log('URL de la foto subida:', fotoUrl);

    query = `INSERT INTO public.alumnos (nombre, apellido, email, contraseña, fecha_de_nacimiento, telefono, pais, colegio, foto) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
    result = await pool.query(query, [nombre, apellido, email, hashedPassword, fecha_de_nacimiento, telefono, pais, colegio, fotoUrl]);

  } else if (tipoUsuario === 'profesor') {
    const { foto, certificadoestudio } = req.files;
    console.log('Archivos del profesor - Foto:', foto, 'Certificado:', certificadoestudio);

    if (!foto || !certificadoestudio) {
      console.error('Error: Se requieren la foto y el certificado de estudio.');
      return res.status(400).json({ error: 'Se requieren la foto y el certificado de estudio.' });
    }


    const fotoFile = foto[0];
    const certificadoFile = certificadoestudio[0];

    const extensionesPermitidas = ['pdf', 'png', 'jpeg', 'jpg'];
    const extensionFoto = fotoFile.originalname.split('.').pop().toLowerCase();
    const extensionCertificado = certificadoFile.originalname.split('.').pop().toLowerCase();

    if (!extensionesPermitidas.includes(extensionFoto) || extensionCertificado !== 'pdf') {
      return res.status(400).send('Error: Extensiones no permitidas. La foto debe ser PNG, JPEG o JPG y el certificado debe ser PDF.');
    }

    const resultFoto = await cloudinary.uploader.upload(fotoFile.path, { folder: 'profesores/fotos' });
    const fotoUrl = resultFoto.secure_url;

    const resultCertificado = await cloudinary.uploader.upload(certificadoFile.path, { folder: 'profesores/certificados', resource_type: 'raw' });
    const certificadoUrl = resultCertificado.secure_url;

    query = `INSERT INTO public.profesores (nombre, apellido, email, contraseña, fecha_de_nacimiento, telefono, pais, materias, foto, certificadoestudio) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    result = await pool.query(query, [nombre, apellido, email, hashedPassword, fecha_de_nacimiento, telefono, pais, materias, fotoUrl, certificadoUrl]);

  } else {
    return res.status(400).json({ error: 'Tipo de usuario inválido.' });
  }

  const token = jwt.sign({ id: result.rows[0].id, tipoUsuario }, process.env.JWT_SECRET, { expiresIn: '1h' });

  return res.status(201).json({
    message: `${tipoUsuario.charAt(0).toUpperCase() + tipoUsuario.slice(1)} registrado con éxito`,
    user: result.rows[0],
    token,
  });
};



const auth = {
    login,
    register

}
export default auth;


