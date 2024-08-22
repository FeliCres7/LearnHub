import {client} from '../dbconfig.js'


// Obtener todas las clases
const getClases = async (_, res) => {
  try {
    const { rows } = await client.query('SELECT * FROM public."Clases"');
    res.json(rows);

  } catch (err) {
    res.send("Clases obtenidas con éxito");
    res.status(500).json({ error: err.message });
  }
}

// Obtener una clase por ID
const getClaseByID = async (req, res) => {
  const { ID } = req.body;
  try {
    const { rows } = await client.query('SELECT * FROM public."clases" WHERE "ID" = $1', [ID]);
    if (rows.length === 1) {
      res.send("Clase obtenida con éxito: ");
      res.json(rows[0]);
    } else {
      res.status(404).send("Clase no encontrada");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear una clase
const createClase = async (req, res) => {
  const { IDmateria, IDprofesor, horainicio, horafin, idiomas, Link } = req.body;

  // Validación de entrada
  if (!IDmateria || !IDprofesor || !horainicio || !horafin || !idiomas || !Link) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    const query = `
      INSERT INTO clases (IDmateria, IDprofesor, horainicio, horafin, idiomas, Link)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [IDmateria, IDprofesor, horainicio, horafin, idiomas, Link];
    
    const result = await client.query(query, values);

    // Respuesta exitosa
    res.status(201).json({
      message: 'Clase creada con éxito',
      clase: result.rows[0]  
    });
  } catch (err) {
    // Registro de error detallado
    console.error('Error al crear la clase:', err);

    // Respuesta de error
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


// Actualizar una clase
const updateClase = async (req, res) => {
  const {IDmateria, IDprofesor, materias,ID} = req.body;
  
  
  // try {
    const result = await client.query(
      'UPDATE alumnos SET IDmateria = $1, IDprofesor = $2, materias = $3 WHERE "ID" = $4 RETURNING *',
      [IDmateria, IDprofesor, materias,ID]
    );

    if (result.rows.length > 0) {
      res.status(200).send(`Alumno actualizado con éxito: ${JSON.stringify(result.rows[0])}`);
    } else {
      res.status(404).send('Alumno no encontrado');
    }
  // } catch (err) {
  //   res.status(500).send(`Error al actualizar el alumno: ${err.message}`);
  // }
};


// Eliminar clase 

const deleteclase = async (req,res) => {
const ID= req.params.ID
const result = await client.query
('DELETE FROM public."clases" WHERE "ID" = $1 RETURNING*',
[ID])
if (result.rows.length > 0) {
  res.status(200).send(`Clase eliminada con éxito: ${JSON.stringify(result.rows[0])}`);
} else {
  res.status(404).send('Clase no encontrada');
}
};


const clases = {
  getClases,
  getClaseByID,
  createClase,
  updateClase,
  deleteclase
}

export default clases;
