import { client } from '../dbconfig.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from '../upload.js';

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
  const { nombre, apellido, email, contraseña, tipoUsuario } = req.body;

  // Validaciones de campos requeridos
  if (!nombre || !apellido || !email || !contraseña || !tipoUsuario) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  try {
    // Validar si se subió una imagen
    if (!req.file) {
      return res.status(400).send('Error: No se subió ningún archivo.');
    }

    // Obtener la ruta del archivo subido y verificar la extensión
    const imageFile = req.file.path;
    const extension = imageFile.split('.').pop().toLowerCase();
    const extensionesPermitidas = ['pdf', 'png', 'jpeg', 'jpg'];

    if (!extensionesPermitidas.includes(extension)) {
      return res.status(400).send('Error: Extensión de archivo no permitida. Extensiones admitidas: PDF, PNG, JPEG, y JPG');
    }

    // Subir la imagen a Cloudinary
    const resultImage = await cloudinary.uploader.upload(imageFile, {
      folder: 'analisis',
    });
    const imageUrl = resultImage.secure_url;

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedContraseña = await bcrypt.hash(contraseña, salt);

    // Dependiendo del tipo de usuario, insertar en la tabla correspondiente
    let query;
    if (tipoUsuario === 'alumno') {
      query = "INSERT INTO public.alumnos (nombre, apellido, email, contraseña, foto) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    } else if (tipoUsuario === 'profesor') {
      query = "INSERT INTO public.profesores (nombre, apellido, email, contraseña, foto) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    } else {
      return res.status(400).json({ error: 'Tipo de usuario inválido.' });
    }

    const result = await client.query(query, [nombre, apellido, email, hashedContraseña, imageUrl]);

    // Generar un token JWT
    const token = jwt.sign({ id: result.rows[0].id, tipoUsuario }, JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(201).json({
      message: `${tipoUsuario.charAt(0).toUpperCase() + tipoUsuario.slice(1)} registrado con éxito`,
      user: result.rows[0],
      token,
      imageUrl,
    });
  } catch (err) {
    console.error('Error al registrar:', err.message);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};


const auth = {
  
    register

}
export default auth;


