import {pool} from '../dbconfig.js'
import cloudinary from '../upload.js';

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



//Actualizar un profesor 

const updateinfopersonal = async (req, res) => {
  try {
    const {
      nombre, apellido, fecha_de_nacimiento, ID
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
const {foto, materias, descripcion_corta, ID} = req.body

try{
const result = await pool.query ( 'UPDATE public."profesores" SET foto=$1, materias=$2, descripcion_corta=$3 WHERE "ID"= $4 RETURNING *', [foto, materias, descripcion_corta, ID]
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
const {email, telefono, contraseña, confirmarContraseña, ID} = req.body  

  // Validar que las contraseñas coincidan
  if (contraseña !== confirmarContraseña) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
  }

try {
const result =  await pool.query('UPDATE public.profesores SET email=$1, telefono=$2, contraseña=$3 WHERE "ID"= $4 RETURNING *', [email, telefono, contraseña, ID]
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
  const { idprof, lunes, martes, miercoles, jueves, viernes, sabado, domingo } = req.body;
  if (!idprof) {
    return res.status(400).send("El idprof es requerido");
  }

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
        SELECT nombre, apellido, foto, fecha_de_nacimiento, pais, certificadoestudio 
        FROM public.profesores 
        WHERE "ID" = $1
      `;
      const { rows: profesorRows } = await pool.query(queryProfesor, [ID]);
  
      if (profesorRows.length === 1) {
        const { certificadoestudio } = profesorRows[0];
  
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
          valoracion_promedio,  // Incluimos la valoración promedio
          certificadoestudio: `descargar/${certificadoestudio}`
        });
      } else {
        return res.status(404).json({ error: 'Profesor no encontrado' });
      }
    } catch (err) {
      console.error('Error al obtener el perfil del profesor:', err);
      return res.status(500).json({ error: 'Error al obtener el perfil' });
    }


  }
//obtener las materias de los profesores
const getdicta = async (_,res) => {
try{
const {rows} = await pool.query('SELECT * FROM public.dicta');
res.json (rows);
} catch (err){
res.send("materias obtenidas con exito");
res.status(500).json ({ error: err.message });
  }  
}  
 
//crear las materias de los profesores
  const createdicta = async (req,res) => { 
  const {idmateria} = req.body;
 
  if (!idmateria) {
  return res.status(400).json ({ error: 'Todos los campos son requeridos'});
}
try{
const query= `INSERT INTO public."dicta" ("idmateria") VALUES ($1) RETURNING *`;

const values = [idmateria]
const result = await pool.query(query,values);
 res.status(201).json({
  message: 'materia creada con éxito',
  dicta: result.rows[0]  
});
} catch (err) {
res.status(500).send(err)
}
};






  const getprofbymaterias = async (req,res) => {
  const {materias} = req.params
  
  try{
  const query = 'SELECT * FROM public."profesores" WHERE "materias" = $1'
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
    const { disponibilidad_horaria } = req.params; // Suponiendo que la disponibilidad se pasa como un parámetro de consulta
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

const getprofbydias = async (req,res) => {
const {dias} = req.params;

try{
const query= 'SELECT * FROM public.profesores WHERE dias= $1';
const {rows}= await pool.query(query,[dias]);

if (rows.length > 0){
return res.status(200).json({profesores:rows})
}else{
  return res.status(404).json({error:'No se encontraron profesores con esa disponibilidad horaria'})
}
} catch (err) {
  console.error('Error al obtener profesores por disponibilidad horaria:', err);
  return res.status(500).json({ error: 'Error al obtener los profesores' });
}


}

// Crear una valoración
const createvaloracionbyclases = async (req, res) => {
  const { IDclases, valoracion, fecha, IDalumnos, idprof } = req.body;

  // Validar los datos recibidos
  if (!IDclases || !valoracion || !fecha || !IDalumnos || !idprof) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    const query = `
      INSERT INTO public."valoraciones" ("IDclases", "valoracion", "fecha", "IDalumnos", "idprof")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [IDclases, valoracion, fecha, IDalumnos, idprof];

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

const updateProfessorRating = async (idprof) => {
  try {
    const query = `
      SELECT AVG(valoracion) as promedio
      FROM public."valoraciones"
      WHERE idprof = $1
    `;
    const values = [idprof];
    
    const result = await pool.query(query, values);
    const promedio = result.rows[0].promedio;

    // Actualizar el perfil del profesor con el nuevo promedio
    const updateQuery = `
      UPDATE public."profesores"
      SET valoracion = $1
      WHERE idprof = $2
    `;
    const updateValues = [promedio, idprof];

    await pool.query(updateQuery, updateValues);
  } catch (err) {
    console.error('Error al actualizar la valoración promedio del profesor:', err.message);
  }
};

const profesores = {
  getprof, 
  getprofbyID,
  updateinfopersonal,
  updateperfil,
  updateseguridad,
  updatedisponibilidadhoraria,
  deleteprof,
 getperfilprof,
 getprofbynombreyapellido,
 getprofbymaterias,
 getprofbydisponibilidadhoraria,
 getprofbydias,
 getdicta,
 createdicta,
createvaloracionbyclases

};

export default profesores;
  
