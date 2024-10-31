import { pool } from '../dbconfig.js'


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
  const { email, telefono, contraseña, confirmarContraseña } = req.body;
  const { ID } = req.params;

  if (contraseña !== confirmarContraseña) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
  }

  if (!email || !telefono || !contraseña) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  try {
    const result = await pool.query(
      'UPDATE public.alumnos SET email = $1, telefono = $2, contraseña = $3 WHERE "ID" = $4 RETURNING *',
      [email, telefono, contraseña, ID]
    );

    if (result.rows.length > 0) {
      return res.status(200).json({
        message: 'Datos de seguridad actualizados con éxito',
        alumno: result.rows[0],
      });
    } else {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }
  } catch (err) {
    console.error('Error al actualizar los datos de seguridad:', err.message);
    return res.status(500).json({ error: 'Error al actualizar los datos de seguridad', details: err.message });
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
  updateseguridadalumno,
  updateinfoalumno,
  deleteAlumno,
  getperfilalumno
};

export default alumnos;