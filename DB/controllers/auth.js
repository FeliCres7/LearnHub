import { client } from '../dbconfig.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
  const { nombre, apellido, email, contraseña, tipoUsuario } = req.body;

  // Validaciones de campos requeridos
  if (!nombre || !apellido || !email || !contraseña || !tipoUsuario) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  try {
    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedContraseña = await bcrypt.hash(contraseña, salt);

    // Dependiendo del tipo de usuario, insertar en la tabla correspondiente
    let query;
    if (tipoUsuario === 'alumno') {
      query = "INSERT INTO public.alumnos (nombre, apellido, email, contraseña) VALUES ($1, $2, $3, $4) RETURNING *";
    } else if (tipoUsuario === 'profesor') {
      query = "INSERT INTO public.profesores (nombre, apellido, email, contraseña) VALUES ($1, $2, $3, $4) RETURNING *";
    } else {
      return res.status(400).json({ error: 'Tipo de usuario inválido.' });
    }

    const result = await client.query(query, [nombre, apellido, email, hashedContraseña]);

    // Generar un token JWT
    const token = jwt.sign({ id: result.rows[0].id, tipoUsuario }, JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(201).json({
      message: `${tipoUsuario.charAt(0).toUpperCase() + tipoUsuario.slice(1)} registrado con éxito`,
      user: result.rows[0],
      token,
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
