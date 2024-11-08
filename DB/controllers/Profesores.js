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


const updateseguridad = async (req,res) => { 
const { ID } = req.params; 
const {email, telefono, contraseña, confirmarContraseña} = req.body  

  // Validar que las contraseñas coincidan
  if (contraseña !== confirmarContraseña) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
  }
  const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
try {
const result =  await pool.query('UPDATE public.profesores SET email=$1, telefono=$2, contraseña=$3 WHERE "ID"= $4 RETURNING *', [email, telefono, hashedPassword, ID]
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
  };

const getperfilprof = async (req, res) => {
    try {
      const ID = req.params.ID;
  
      if (!ID) {
        return res.status(400).json({ error: 'ID es requerido' });
      }
  
      // Consulta para obtener los datos del profesor
      const queryProfesor = `
        SELECT nombre, apellido, foto, fecha_de_nacimiento, pais
        FROM public.profesores 
        WHERE "ID" = $1
      `;
      const { rows: profesorRows } = await pool.query(queryProfesor, [ID]);
  
      if (profesorRows.length === 1) {
        // Consulta para obtener el promedio de valoraciones del profesor
        const queryValoracion = `
          SELECT AVG(valoracion) AS valoracion
          FROM public.valoraciones
          WHERE idprof = $1
        `;
        const { rows: valoracionRows } = await pool.query(queryValoracion, [ID]);
  
        // Valoración promedio
        const valoracion_promedio = valoracionRows[0]?.valoracion_promedio || 0; // Si no tiene valoraciones, se pone en 0
  
        return res.json({
          message: 'Perfil de profesor obtenido con éxito',
          perfil: profesorRows[0],
          valoracion_promedio  // Incluimos la valoración promedio
        });
      } else {
        return res.status(404).json({ error: 'Profesor no encontrado' });
      }
    } catch (err) {
      console.error('Error al obtener el perfil del profesor:', err);
      return res.status(500).json({ error: 'Error al obtener el perfil' });
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
  };

  const getprofbydisponibilidadhoraria = async (req, res) => {
    const { disponibilidad_horaria } = req.params; 
    if (!disponibilidad_horaria) {
        return res.status(400).json({ error: 'La disponibilidad horaria es requerida' });
    }
  
    try {
        const query = `
          SELECT p.*
          FROM public."profesores" p
          JOIN public."DisponibilidadHoraria" dh ON p.idprof = dh.idprof
          WHERE dh.rango = $1
        `;
        const { rows } = await pool.query(query, [disponibilidad_horaria]);
        if (rows.length > 0) {
            return res.json({ message: 'Profesores obtenidos con éxito', profesores: rows });
        } else {
            return res.status(404).json({ error: 'No se encontraron profesores con esa disponibilidad horaria' });
        }
    } catch (err) {
        console.error('Error al obtener profesores por disponibilidad horaria:', err);
        return res.status(500).json({ error: 'Error al obtener los profesores' });
    }
  }  


  const createvaloracionbyclases = async (req, res) => {
    const { idreserva, valoracion, IDalumnos, idprof } = req.body;
  
    // Validar los datos recibidos
    if (!idreserva || !valoracion || !IDalumnos || !idprof) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
  
    try {
      // Verificar si la reserva está completada
      const checkReservaQuery = `
        SELECT estado 
        FROM public."reservaciones" 
        WHERE "ID" = $1
      `;
      const reservaResult = await pool.query(checkReservaQuery, [idreserva]);
  
      if (reservaResult.rows.length === 0 || reservaResult.rows[0].estado !== 'completada') {
        return res.status(400).json({ error: 'La clase no ha sido completada, no se puede valorar.' });
      }
  
      const query = `
        INSERT INTO public."valoraciones" ("idreserva", "valoracion", "IDalumnos", "idprof")
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const values = [idreserva, valoracion, IDalumnos, idprof];
  
      const result = await pool.query(query, values);
  
      // Recalcular el promedio del profesor
      await updateProfessorRating(idprof);
  
      res.status(201).json({
        message: 'Valoración creada con éxito',
        valoracion: result.rows[0]
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  const updatereservacion = async () => {
    try {
      const query = `
        UPDATE public."reservaciones"
        SET estado = 'completada'
        WHERE estado = 'pendiente'
        AND (fecha + hora::time + INTERVAL '1 hour') <= NOW()
        RETURNING *;
      `;
  
      const result = await pool.query(query);
  
      if (result.rows.length > 0) {
        console.log(`Reservas actualizadas a 'completada': ${result.rows.length}`);
      }
    } catch (error) {
      console.error('Error al actualizar el estado de las reservas:', error.message);
    }
  };
  
  
  setInterval(updatereservacion, 5 * 60 * 1000);
  
const profesores = {
  getprof, 
  getprofbyID,
  getprofbymail,
  getDisponibilidadHoraria,
  updateinfopersonal,
  updateperfil,
  updateseguridad,
  updatedisponibilidadhoraria,
  deleteprof,
 getperfilprof,
 getprofbynombreyapellido,
 getprofbymaterias,
 getprofbydisponibilidadhoraria,
 createvaloracionbyclases,
 updatereservacion
};

export default profesores;