import {client} from '../dbconfig.js'
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'

//const JWT_secret = 'Learnhubtoken'
const secret = process.env.JWT_SECRET


//LOG IN
const loginprof = async (req, res) => {
  const { usuario, contraseña } = req.body;

  // Validación: la contraseña debe tener más de 3 caracteres
  if (!contraseña || contraseña.length <= 3) {
    return res.status(400).send("La contraseña debe tener más de 3 caracteres.");
  }

  try {
    const checkUser = await client.query('SELECT * FROM public.profesores WHERE "email" = $1', [usuario]);

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
      maxAge: 1000 * 60 * 60 // Expira en 1 hora
    });

    // Enviar respuesta con el usuario y token
    return res.status(200).json({ usuario: checkUser.rows[0].nombre, token });

  } catch (error) {
    console.error('Error en login:', error.message);
    return res.status(500).send("Error del servidor.");
  }
};

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

//Crear un profesor
const createprof = async (req, res) => {
  const {nombre,apellido,fecha_de_nacimiento,email,telefono,valoracion,pais,idiomas,foto,descripcion_corta,contraseña, disponibilidad_horaria,dias} = req.body;
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedContraseña = await bcrypt.hash(contraseña,salt)
    const result = await client.query(
      'INSERT INTO profesores (nombre, apellido, fecha_de_nacimiento, email, telefono, valoracion, pais, idiomas, foto, descripcion_corta,contraseña, disponibilidad_horaria, dias ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
      [nombre, apellido, fecha_de_nacimiento, email, telefono, valoracion, pais, idiomas, foto, descripcion_corta, hashedContraseña, disponibilidad_horaria, dias]
    );
    res.status(201).json({
      message: ('Profesor creado con éxito'),
      profesor: result.rows[0]  
    });
  } catch (err) {
    console.error('Error al crear el profesor:', err.message);
    res.status(500).json({ error: err.message });
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

const profesores = {
  loginprof,
  verificacionprof,
  getprof, 
  getprofbyID,
  createprof,
  updateprof,
  deleteprof,
 getperfilprof,
 getprofbymaterias,
 getdicta,
 createdicta,


};

export default profesores;
  
