import {pool} from '../dbconfig.js'
import bcrypt from 'bcryptjs'

//const JWT_secret = 'Learnhubtoken'
const secret = process.env.JWT_SECRET



// Obtener todos los profesores
const getprof = async (_, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM profesores');
    res.json(rows);
    
  } catch (err) {
    res.send("profesores obtenidos con exito")
    res.status(500).json({ error: err.message });
  }
}

const getprofbymail = async (req,res) => {
  const {email} = req.params
  try{
  const query = 'SELECT * FROM public.profesores WHERE email = $1'
  const {rows} = await pool.query(query, [email]);
  res.json (rows);
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
  }
  

//Obtener un profesor por ID
const getprofbyID = async (req, res) => {
  try {
    const ID = req.params.ID;
    const query = 'SELECT * FROM public."profesores" WHERE "ID" = $1';
    const { rows } = await pool.query(query, [ID]);

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

const getDisponibilidadHoraria = async (req, res) => {
  const { idprof } = req.params;

  if (!idprof) {
    return res.status(400).send("El idprof es requerido");
  }

  try {
    const query = `
      SELECT dh.iddias, dh.rango, d.nombre AS dia
      FROM public."disponibilidadHoraria" dh
      JOIN public."dias" d ON dh.iddias = d.ID
      WHERE dh.idprof = $1
      ORDER BY dh.iddias;
    `;
    
    const result = await pool.query(query, [idprof]);

    const disponibilidad = result.rows.map(row => ({
      dia: row.dia,
      iddias: row.iddias,
      rango: row.rango,
    }));

    return res.status(200).json(disponibilidad);
  } catch (err) {
    console.error('Error al obtener la disponibilidad horaria:', err);
    return res.status(500).send(`Error al obtener la disponibilidad: ${err.message}`);
  }
};

//Actualizar un profesor 

const updateinfopersonal = async (req, res) => {
  try {
    const {ID} = req.params
    const {
      nombre, apellido, fecha_de_nacimiento
    } = req.body;
    
   
    const result = await pool.query(
      `UPDATE public."profesores"
       SET nombre = $1, apellido = $2, fecha_de_nacimiento = $3 WHERE "ID" = $4
       RETURNING *` ,
      [nombre, apellido, fecha_de_nacimiento, ID]
    );


    if (result.rows.length > 0) {
      res.status(200).send(`Profesor actualizado con éxito: ${JSON.stringify(result.rows[0])}`);
    } else {
      res.status(404).send('Profesor no encontrado');
    }
  } catch (err) {
    
    res.status(500).send(`Error al actualizar el profesor: ${err.message}`);
  }
};

const updateperfil = async (req,res) => {
const {ID} = req.params
const {foto, idmateria} = req.body

try{
const result = await pool.query ( 'UPDATE public."profesores" SET foto=$1, idmateria=$2 WHERE "ID"= $3 RETURNING *', [foto, idmateria, ID]
);
if (result.rows.length > 0) {
  res.status(200).send(`Profesor actualizado con éxito: ${JSON.stringify(result.rows[0])}`);
} else {
  res.status(404).send('Profesor no encontrado');
}
} catch (err) {

res.status(500).send(`Error al actualizar el profesor: ${err.message}`);
}
}

const updateseguridad = async (req, res) => {  
  const { ID } = req.params; 
  const { email, telefono, nuevacontraseña, confirmarContraseña, contraseña } = req.body;

  // 1. Validar que las contraseñas coincidan
  if (nuevacontraseña !== confirmarContraseña) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
  }

  try {
    // 2. Buscar al usuario por ID en la base de datos para obtener su contraseña actual hasheada
    const userResult = await pool.query('SELECT * FROM public.profesores WHERE "ID" = $1', [ID]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
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
      'UPDATE public.profesores SET email=$1, telefono=$2, contraseña=$3 WHERE "ID"= $4 RETURNING *', 
      [email, telefono, hashedNewPassword, ID]
    );

    if (updateResult.rows.length > 0) {
      res.status(200).json({ message: `Profesor actualizado con éxito`, data: updateResult.rows[0] });
    } else {
      res.status(404).json({ error: 'No se pudo actualizar al profesor' });
    }
  } catch (err) {
    console.error('Error al actualizar el profesor:', err.message);
    res.status(500).json({ error: `Error al actualizar el profesor: ${err.message}` });
  }
};



const updatedisponibilidadhoraria = async (req, res) => {
  const {idprof} = req.params;
  const {lunes, martes, miercoles, jueves, viernes, sabado, domingo } = req.body;
 

  const dias = [
    { dia: "1", rango: lunes },
    { dia: "2", rango: martes },
    { dia: "3", rango: miercoles },
    { dia: "4", rango: jueves },
    { dia: "5", rango: viernes },
    { dia: "6", rango: sabado },
    { dia: "0", rango: domingo }
  ];

  const diasFiltrados = dias.filter(({ rango }) => rango !== null && rango !== undefined);

  try {
    const deleteQuery = 'DELETE FROM public."DisponibilidadHoraria" WHERE "idprof"=$1';
    await pool.query(deleteQuery, [idprof]);

    const insertQuery = 'INSERT INTO public."DisponibilidadHoraria" (idprof, iddias, rango) VALUES ($1, $2, $3)';
    for (const { dia, rango } of diasFiltrados) {
      try {
        await pool.query(insertQuery, [idprof, dia, rango]);
      } catch (err) {
        console.error(`Error al insertar disponibilidad para el día ${dia}:`, err);
      }
    }

    return res.status(200).send("Disponibilidad actualizada correctamente");
  } catch (err) {
    console.error('Error al actualizar la disponibilidad horaria:', err);
    return res.status(500).send(`Error al actualizar la disponibilidad: ${err.message}`);
  }
};


// eliminar profesor
const deleteprof = async (req,res) => {
  const  ID  = req.params.ID;
  const result = await pool.query
  ('DELETE from public."profesores" WHERE "ID" = $1 RETURNING*',
  [ID])
  if (result.rows.length > 0) {
    res.status(200).send(`profesor eliminado con éxito: ${JSON.stringify(result.rows[0])}`);
  } else {
    res.status(404).send('profesor no encontrado');
  }
}



  

  const getprofbymaterias = async (req,res) => {
  const {materias} = req.params
  
  try{
  const query = 'SELECT * FROM public."profesores" WHERE "idmateria" = $1'
  const {rows} = await pool.query(query, [materias])

  if (rows.length > 0){
  return res.json({profesores:rows, message: 'profesores obtenidos con exito'});
  } else {
  return res.status(400).json({error: 'no hay profesores con esa materia'});
  }
} catch (err) {
  console.error('Error al obtener profesores por materias:', err);
  return res.status(500).json({ error: 'Error al obtener los profesores' });


  }
  }

  const getprofbynombreyapellido = async (req,res) => {
    try {
      const { nombre, apellido } = req.params;
  
      if (!nombre || !apellido) {
        return res.status(400).json({ error: 'El nombre es requerido' });
      }
  
      const query = 'SELECT * FROM public."profesores" WHERE nombre=$1 AND apellido = $2'
      const { rows } = await pool.query(query, [nombre, apellido]);
  
      if (rows.length > 0) {
        return res.json({ message: 'Profesor(es) obtenido(s) con éxito', profesores: rows });
      } else {
        return res.status(404).json({ error: 'Profesor no encontrado' });
      }
    } catch (err) {
      console.error('Error al obtener el profesor por nombre:', err);
      return res.status(500).json({ error: 'Error al obtener el profesor' });
    }
  }
  const createValoracion = async (req, res) => {  
    const { valoracion, IDalumnos } = req.body;
    const { idprof } = req.params;  // Obtener `idprof` desde `req.params`

    // Validar los datos recibidos
    if (!valoracion || !IDalumnos || !idprof) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Verificar que los IDs sean números
    if (isNaN(IDalumnos) || isNaN(idprof)) {
        return res.status(400).json({ error: 'IDalumnos e idprof deben ser números válidos' });
    }

    try {
        // Insertar la nueva valoración
        const insertQuery = `
            INSERT INTO public."valoraciones" ("valoracion", "IDalumnos", "idprof")
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const insertValues = [valoracion, IDalumnos, idprof];
  
        const insertResult = await pool.query(insertQuery, insertValues);

        // Calcular el promedio de las valoraciones del profesor
        const avgQuery = `
            SELECT AVG(valoracion) AS valoracion_promedio
            FROM public."valoraciones"
            WHERE idprof = $1
        `;
        const avgResult = await pool.query(avgQuery, [idprof]);

        const valoracionPromedio = avgResult.rows[0].valoracion_promedio || 0;

        // Responder con la nueva valoración y el promedio actualizado
        res.status(201).json({
            message: 'Valoración creada con éxito',
            valoracion: insertResult.rows[0],
            valoracion_promedio: valoracionPromedio  // Promedio actualizado
        });
    } catch (err) {
        console.error('Error al crear valoración:', err);
        res.status(500).json({ error: 'Error al crear valoración' });
    }
};

  
  

  
const profesores = {
  getprof, 
  getprofbyID,
  getprofbymail,
  updateinfopersonal,
  updateperfil,
  updateseguridad,
  updatedisponibilidadhoraria,
  deleteprof,
 getprofbynombreyapellido,
 getprofbymaterias,
 createValoracion
};

export default profesores;