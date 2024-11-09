import { pool } from '../dbconfig.js'
import bcrypt from 'bcryptjs'

const secret = process.env.JWT_SECRET

const getalumnosbyid = async (req, res) => {
  const { ID } = req.params;

  try {
    const query = 'SELECT * FROM public.alumnos WHERE "ID" = $1';
    const { rows } = await pool.query(query, [ID]);

    if (rows.length > 0) {
      res.json({
        message: 'Alumno obtenido con éxito',
        alumno: rows[0]
      });
    } else {
      res.status(404).json({ error: 'Alumno no encontrado' });
    }
  } catch (err) {
    console.error('Error al obtener el alumno por ID:', err.message);
    res.status(500).json({ error: 'Error al obtener el alumno por ID' });
  }
};

const getalumnosbymail = async (req,res) => {
const {email} = req.params
try{
const query = 'SELECT * FROM public.alumnos WHERE email = $1'
const {rows} = await pool.query(query, [email]);
res.json (rows);
}
catch (err) {
  res.status(500).json({ error: err.message });
}
}
const updateinfoalumno = async (req, res) => {
  const { nombre, apellido, fecha_de_nacimiento } = req.body;
  const { ID } = req.params;

  if (!nombre || !apellido || !fecha_de_nacimiento) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  try {
    const result = await pool.query(
      `UPDATE public."alumnos"
       SET nombre = $1, apellido = $2, fecha_de_nacimiento = $3 WHERE "ID" = $4
       RETURNING *`,
      [nombre, apellido, fecha_de_nacimiento, ID]
    );

    if (result.rows.length > 0) {
      return res.status(200).json({
        message: 'Alumno actualizado con éxito',
        alumno: result.rows[0],
      });
    } else {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }
  } catch (err) {
    console.error('Error al actualizar el alumno:', err.message);
    return res.status(500).json({ error: 'Error al actualizar el alumno', details: err.message });
  }
};

// Función para actualizar información de seguridad del alumno
const updateseguridadalumno = async (req, res) => {
  const { email, telefono, nuevacontraseña, confirmarContraseña, contraseña } = req.body;
  const { ID } = req.params;

  // 1. Validar que las contraseñas coincidan
  if (nuevacontraseña !== confirmarContraseña) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
  }

  try {
    // 2. Buscar al usuario por ID en la base de datos para obtener su contraseña actual hasheada
    const userResult = await pool.query('SELECT * FROM public.alumnos WHERE "ID" = $1', [ID]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'alumno no encontrado' });
    }

    const usuario = userResult.rows[0];

    // 3. Comparar la contraseña introducida con la contraseña hasheada en la base de datos
    const passwordMatch = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!passwordMatch) {
      return res.status(400).json({ error: 'La contraseña actual es incorrecta.' });
    }

    // 4. Hashear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(nuevacontraseña, salt);

    // 5. Actualizar el usuario con la nueva contraseña
    const updateResult = await pool.query(
      'UPDATE public.alumnos SET email=$1, telefono=$2, contraseña=$3 WHERE "ID"= $4 RETURNING *', 
      [email, telefono, hashedNewPassword, ID]
    );

    if (updateResult.rows.length > 0) {
      res.status(200).json({ message: `alumno actualizado con éxito`, data: updateResult.rows[0] });
    } else {
      res.status(404).json({ error: 'No se pudo actualizar al alumno' });
    }
  } catch (err) {
    console.error('Error al actualizar el alumno:', err.message);
    res.status(500).json({ error: `Error al actualizar el alumno: ${err.message}` });
  }
};

const updateinforperfilalumno = async (req, res) => {
  const { foto, colegio } = req.body;
  const { ID } = req.params;

  try {
    const result = await pool.query(
      `UPDATE public."alumnos"
       SET foto = $1, colegio = $2 WHERE "ID" = $3
       RETURNING *`,
      [foto, colegio, ID]
    );

    if (result.rows.length > 0) {
      return res.status(200).json({
        message: 'Alumno actualizado con éxito',
        alumno: result.rows[0],
      });
    } else {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }
  } catch (err) {
    console.error('Error al actualizar el alumno:', err.message);
    return res.status(500).json({ error: 'Error al actualizar el alumno', details: err.message });
  }
};

const deleteAlumno = async (req, res) => {
  const { ID } = req.params;
  const { password } = req.body;  // La contraseña que el usuario quiere usar para la validación

  try {
    // Primero, obtenemos el alumno con el ID dado para verificar la contraseña hasheada
    const resultAlumno = await pool.query('SELECT * FROM public."alumnos" WHERE "ID" = $1', [ID]);

    if (resultAlumno.rows.length === 0) {
      return res.status(404).send('Alumno no encontrado');
    }

    const alumno = resultAlumno.rows[0];
    const storedHashedPassword = alumno.password;  // La contraseña hasheada almacenada en la base de datos

    // Comparamos la contraseña proporcionada con la contraseña hasheada
    const match = await bcrypt.compare(password, storedHashedPassword);

    if (!match) {
      return res.status(403).send('Contraseña incorrecta');
    }

    // Si las contraseñas coinciden, eliminamos al alumno
    const result = await pool.query(
      'DELETE from public."alumnos" WHERE "ID" = $1 RETURNING *',
      [ID]
    );

    if (result.rows.length > 0) {
      return res.status(200).send(`Alumno eliminado con éxito: ${JSON.stringify(result.rows[0])}`);
    } else {
      return res.status(404).send('Alumno no encontrado');
    }
    
  } catch (error) {
    console.error('Error al eliminar alumno:', error);
    return res.status(500).send('Error en el servidor');
  }
};


const getperfilalumno = async (req, res) => {
  try {
    const ID = req.params.ID;

    if (!ID) {
      return res.status(400).json({ error: 'ID es requerido' });
    }

    const query = 'SELECT nombre, apellido, foto, fecha_de_nacimiento, pais, colegio FROM public.alumnos WHERE "ID" = $1';
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
  getalumnosbyid,
  getalumnosbymail,
  updateinforperfilalumno,
  updateseguridadalumno,
  updateinfoalumno,
  deleteAlumno,
  getperfilalumno
};

export default alumnos;