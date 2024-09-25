import {client} from '../dbconfig.js'
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'

//const JWT_secret = 'Learnhubtoken'
const secret = process.env.JWT_SECRET



//verificacion profesor
const verificacionprof = async (req, res) => {
  const { fecha_de_nacimiento, telefono, pais, foto } = req.body;


  if (!fecha_de_nacimiento || !telefono || !pais || !foto) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
   
    const { rows } = await client.query(
      `SELECT fecha_de_nacimiento, telefono, pais, foto 
       FROM public.profesores 
       WHERE fecha_de_nacimiento = $1 AND telefono = $2 AND pais = $3 AND foto = $4`,
      [fecha_de_nacimiento, telefono, pais, foto]
    );

    
    if (rows.length > 0) {
      return res.status(409).json({ error: 'El profesor ya está registrado' });
    } else {
      return res.json({
        message: 'Profesor registrado con exito'
      });
    }
  } catch (err) {
    console.error('Error al verificar el profesor:', err);
    return res.status(500).json({ error: 'Error al verificar el profesor' });
  }
};




// Obtener todos los profesores
const getprof = async (_, res) => {
  try {
    const { rows } = await client.query('SELECT * FROM profesores');
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
    const { rows } = await client.query(query, [ID]);

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

const updateprof = async (req, res) => {
  try {
    console.log(req.body);
    const {
      nombre, apellido, fecha_de_nacimiento, email,
      telefono, valoracion, pais, idiomas, foto, descripcion_corta, contraseña, disponibilidad_horaria, dias, ID
    } = req.body;
    
    // Ejecutar la consulta SQL para actualizar el registro del profesor
    const result = await client.query(
      `UPDATE public."profesores"
       SET nombre = $1, apellido = $2, fecha_de_nacimiento = $3, email = $4,
            telefono = $5, valoracion = $6, pais = $7,
           idiomas = $8, foto = $9, descripcion_corta = $10, contraseña = $11, disponibilidad_horaria = $12
       , dias=$13 WHERE "ID" = $14
       RETURNING *`,
      [nombre, apellido, fecha_de_nacimiento, email, telefono, valoracion, pais, idiomas, foto, descripcion_corta, contraseña, disponibilidad_horaria, dias, ID]
    );

    // Verificar el resultado de la actualización
    if (result.rows.length > 0) {
      res.status(200).send(`Profesor actualizado con éxito: ${JSON.stringify(result.rows[0])}`);
    } else {
      res.status(404).send('Profesor no encontrado');
    }
  } catch (err) {
    // Manejar errores que puedan ocurrir durante la consulta
    res.status(500).send(`Error al actualizar el profesor: ${err.message}`);
  }
};



// eliminar profesor
const deleteprof = async (req,res) => {
  const  ID  = req.params.ID;
  const result = await client.query
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
  
      const query = 'SELECT nombre, apellido, foto, fecha_de_nacimiento, pais,valoracion FROM public.profesores WHERE "ID" = $1';
      const { rows } = await client.query(query, [ID]);
  
      if (rows.length === 1) {
        return res.json({
          message: 'Perfil de profesores obtenido con éxito',
          perfil: rows[0]
        });
      } else {
        return res.status(404).json({ error: 'Profesor no encontrado' });
      }
    } catch (err) {
      console.error('Error al obtener el perfil del profesor:', err);
      return res.status(500).json({ error: 'Error al obtener el perfil' });
    }
  };


//obtener las materias de los profesores
  const getdicta = async (_,res) => {
try{
const {rows} = await client.query('SELECT * FROM public.dicta');
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
const result = await client.query(query,values);
 res.status(201).json({
  message: 'materia creada con éxito',
  dicta: result.rows[0]  
});
} catch (err) {
res.status(500).send(err)
}
};






  const getprofbymaterias = async (req,res) => {
  const materias = req.query
  
  //const query = 'SELECT 




  }

  const getprofbynombre = async (_,res) => {
    try {
      const { nombre } = req.params;
  
      if (!nombre) {
        return res.status(400).json({ error: 'El nombre es requerido' });
      }
  
      const query = 'SELECT * FROM public."profesores" WHERE LOWER("nombre") = LOWER($1)'; // lo que hace lower es buscar sin importar mayusculas o minusculas
      const { rows } = await client.query(query, [nombre]);
  
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

// Obtener profesores por disponibilidad horaria
const getprofbydisponibilidadhoraria = async (req, res) => {
  const { disponibilidad_horaria } = req.query; // Suponiendo que la disponibilidad se pasa como un parámetro de consulta

  if (!disponibilidad_horaria) {
      return res.status(400).json({ error: 'La disponibilidad horaria es requerida' });
  }

  try {
      const query = 'SELECT * FROM public."profesores" WHERE "disponibilidad_horaria" = $1';
      const { rows } = await client.query(query, [disponibilidad_horaria]);

      if (rows.length > 0) {
          return res.json({ message: 'Profesores obtenidos con éxito', profesores: rows });
      } else {
          return res.status(404).json({ error: 'No se encontraron profesores con esa disponibilidad horaria' });
      }
  } catch (err) {
      console.error('Error al obtener profesores por disponibilidad horaria:', err);
      return res.status(500).json({ error: 'Error al obtener los profesores' });
  }
};

const profesores = {
  verificacionprof,
  getprof, 
  getprofbyID,
  updateprof,
  deleteprof,
 getperfilprof,
 getprofbynombre,
 getprofbymaterias,
 getprofbydisponibilidadhoraria,
 getdicta,
 createdicta,


};

export default profesores;
  
