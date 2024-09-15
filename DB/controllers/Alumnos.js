import {client} from '../dbconfig.js'
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken';

//const JWT_secret = 'Learnhubtoken'
const secret = process.env.JWT_SECRET



//LOG IN O INICIO DE SESION
const login = async (req, res) => {
  const { usuario, contraseña } = req.body;

  // Validación: la contraseña debe tener más de 3 caracteres
  if (!contraseña || contraseña.length <= 3) {
    return res.status(400).send("La contraseña debe tener más de 3 caracteres.");
  }

  try {
    const checkUser = await client.query('SELECT * FROM public.alumnos WHERE "email" = $1', [usuario]);

    if (!checkUser.rows.length) { 
      return res.status(404).send("Usuario no encontrado.");
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
      httpOnly: true, // Accesible solo en el servidor
      sameSite: 'strict', // Solo accesible en el mismo dominio
      maxAge: 1000 * 60 * 60 // Expira en 1 hora
    });

    // Enviar respuesta con el usuario y token
    return res.status(200).json({ usuario: checkUser.rows[0].nombre, token });

  } catch (error) {
    console.error('Error en login:', error.message);
    return res.status(500).send("Error del servidor.");
  }
};


//registrarse 

//Verificacion alumno
const verificacion = async (req, res) => {
  const { fecha_de_nacimiento, telefono, pais, foto } = req.body;

  
  if (!fecha_de_nacimiento || !telefono || !pais || !foto) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    const { rows } = await client.query(
      `SELECT fecha_de_nacimiento, telefono, pais, foto 
       FROM public.alumnos 
       WHERE fecha_de_nacimiento = $1 AND telefono = $2 AND pais = $3 AND foto = $4`,
      [fecha_de_nacimiento, telefono, pais, foto]
    );

    if (rows.length > 0) {
      return res.status(409).json({ error: 'El alumno ya está registrado' });
    } else {
      return res.json({
        message: 'Alumno registrado con exito'
      });
    }
  } catch (err) {
    console.error('Error al verificar el alumno:', err);
    return res.status(500).json({ error: 'Error al verificar el alumno' });
  }
};

//obtener todos los alumnos
const getalumnos = async (_, res) => {
  try {
    const { rows } = await client.query('SELECT * FROM Alumnos');
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
    const { rows } = await client.query(query, [ID]);

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

// Crear un alumno
const createAlumno = async (req, res) => {
  const {nombre, apellido, contraseña, fecha_de_nacimiento, foto, email, telefono, pais, idiomas } = req.body;

  // Verificación de campos requeridos
  if (!nombre || !apellido || !contraseña || !fecha_de_nacimiento || !foto|| !email || !telefono || !pais || !idiomas) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
try {
    const salt = await bcrypt.genSalt(10)
    const hashedContraseña = await bcrypt.hash(contraseña, salt)
    const result = await client.query(
      'INSERT INTO public.alumnos (nombre, apellido, contraseña, fecha_de_nacimiento, foto, email, telefono, pais, idiomas) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [nombre, apellido, hashedContraseña, fecha_de_nacimiento, foto, email, telefono, pais, idiomas]
    );

    res.status(201).json({
      message: 'Alumno creado con éxito',
      alumno: result.rows[0]  
    });
  } catch (err) {
    console.error('Error al crear el alumno:', err.message);
    res.status(500).json({ error: err.message });
  }
};

  // Actualizar un alumno
const updateAlumno = async (req, res) => {

  const {nombre, apellido, contraseña, fecha_de_nacimiento, foto, email, telefono, pais, idiomas, ID} = req.body;
  
  
  try {
    const result = await client.query(
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
const  ID  = req.params.ID;
const result = await client.query
('DELETE from public."alumnos" WHERE "ID" = $1 RETURNING*',
[ID])
if (result.rows.length > 0) {
  res.status(200).send(`Alumno eliminado con éxito: ${JSON.stringify(result.rows[0])}`);
} else {
  res.status(404).send('Alumno no encontrado');
}
};

//obtener las clases de un alumno
/* const getclasebyalumno = async (req, res) => {
  try {
    const ID = req.params.ID;
    const valoracion = req.params.valoracion

    if (!ID) {
      return res.status(400).json({ error: 'ID de alumno es requerido' });
    }

    // Consulta para obtener el arreglo de IDclases desde la tabla "alumnos"
    const queryidclases = 'SELECT "idclases" FROM "alumnos" WHERE "ID" = $1';
    const { rows: idclasesRows } = await client.query(queryidclases, [ID]);

    if (idclasesRows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron clases para el alumno' });
    }

    const idclases = idclasesRows[0].idclases; // Extraer el arreglo de IDs de clases

    // Consulta para obtener los detalles de las clases usando el arreglo de IDs
    const queryclases = 'SELECT * FROM "clases" WHERE "ID" = $1';
    const { rows: clases } = await client.query(queryclases, [idclases]);

    // Consulta para obtener las valoraciones de la clase
    const queryvaloracion = 'SELECT * FROM "valoraciones" WHERE "IDclases"=$1';
    const { rows: valoracion } = await client.query(queryvaloracion, [idclases]);

if (valoraciones.length === 0) {
    return res.status(404).json({ error: 'No se encontraron valoraciones de la clase' });
}
    res.json({
      message: 'Clases obtenidas con éxito',
      clases
    });
  } catch (err) {
    console.error('Error al obtener las clases del alumno:', err);
    res.status(500).json({ error: 'Error al obtener las clases del alumno' });
  }
};
*/

const getperfilalumno = async (req, res) => {
  try {
    const ID = req.params.ID;

    if (!ID) {
      return res.status(400).json({ error: 'ID es requerido' });
    }

    const query = 'SELECT nombre, apellido, foto, fecha_de_nacimiento, pais FROM public.alumnos WHERE "ID" = $1';
    const { rows } = await client.query(query, [ID]);

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
  login,
  verificacion,
  getalumnos,
  getalumnobyID,
  createAlumno,
  updateAlumno,
  deleteAlumno,
 // getclasebyalumno,
  getperfilalumno
};

export default alumnos;

