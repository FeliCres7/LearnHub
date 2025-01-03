import { pool } from '../dbconfig.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

//const JWT_secret = 'Learnhubtoken'
const secret = process.env.JWT_SECRET
const login = async (req, res) => {
  const { usuario, contraseña } = req.body;

  if (!contraseña || contraseña.length <= 3) {
    return res.status(400).send("La contraseña debe tener más de 3 caracteres.");
  }

  try {
    let checkUser;
    let tipoUsuario;

    // Primero, buscamos en la tabla 'alumnos'
    checkUser = await pool.query('SELECT * FROM public.alumnos WHERE "email" = $1', [usuario]);
    tipoUsuario = checkUser.rows.length ? 'alumno' : null;

    // Si no se encuentra en 'alumnos', buscamos en 'profesores'
    if (!checkUser.rows.length) {
      checkUser = await pool.query('SELECT * FROM public.profesores WHERE "email" = $1', [usuario]);
      tipoUsuario = checkUser.rows.length ? 'profesor' : null;

      // Si tampoco se encuentra en 'profesores', devolvemos error
      if (!checkUser.rows.length) {
        return res.status(404).send("Usuario no encontrado.");
      }
    }

    const isValidated = await bcrypt.compare(contraseña, checkUser.rows[0].contraseña);
    if (!isValidated) {
      return res.status(401).send("Contraseña incorrecta.");
    }

    // Generar el token con los permisos adecuados
    const token = jwt.sign(
      { id: checkUser.rows[0].ID, username: checkUser.rows[0].nombre, role: tipoUsuario },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('access_token', token, {
      maxAge: 1000 * 60 * 60, 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production'
    });

    return res.status(200).json({
      usuario: checkUser.rows[0].nombre,
      token,
      tipoUsuario,
      userId: checkUser.rows[0].ID 
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).send(`Error del servidor: ${error.message}`);
  }
};

const register = async (req, res) => { 
  try {
    const { nombre, apellido, email, password, confirmPassword, tipoUsuario, fecha_de_nacimiento, telefono, idpais, colegio, idmateria, foto } = req.body;

    console.log("Datos recibidos:", { nombre, apellido, email, password, confirmPassword, tipoUsuario });

    if (!nombre || !apellido || !email || !password || !confirmPassword || !tipoUsuario) {
      return res.status(400).json({ error: 'Todos los campos son requeridos.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Password encriptado:", hashedPassword);

    if (!foto) {
      return res.status(400).json({ error: 'Se requiere una foto' });
    }

    let query;
    let result;

    if (tipoUsuario === 'alumno') {
      // Insertar el alumno en la base de datos con la foto en base64
      query = `INSERT INTO public.alumnos (nombre, apellido, email, contraseña, fecha_de_nacimiento, telefono, idpais, colegio, foto) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
      result = await pool.query(query, [nombre, apellido, email, hashedPassword, fecha_de_nacimiento, telefono, idpais, colegio, foto]);

    } else if (tipoUsuario === 'profesor') {
      // Insertar el profesor en la base de datos con la foto en base64
      query = `INSERT INTO public.profesores (nombre, apellido, email, contraseña, fecha_de_nacimiento, telefono, idpais, idmateria, foto) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
      result = await pool.query(query, [nombre, apellido, email, hashedPassword, fecha_de_nacimiento, telefono, idpais, idmateria, foto]);

    } else {
      return res.status(400).json({ error: 'Tipo de usuario inválido.' });
    }

    console.log("Resultado de la query:", result.rows[0]);

    const token = jwt.sign({ id: result.rows[0].id, tipoUsuario }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(201).json({
      message: `${tipoUsuario.charAt(0).toUpperCase() + tipoUsuario.slice(1)} registrado con éxito`,
      user: result.rows[0],
      token,
    });
  } catch (err) {
    console.error('Error al registrar:', err);
    return res.status(500).json({ error: 'Ocurrió un error al registrar al usuario.', message: err.message });
  }
};


const auth = {
    login,
    register

}
export default auth;