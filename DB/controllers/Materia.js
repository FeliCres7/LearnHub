import {pool} from '../dbconfig.js'
/*

// Obtener todas las materia
const getmateria = async (_, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM public."materias"');
    res.json(rows);

  } catch (err) {
    res.send("materias obtenidas con éxito");
    res.status(500).json({ error: err.message });
  }
}

// Obtener una materia por ID
const getmateriaByID = async (req, res) => {
  const {ID} = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM public."materias" WHERE "ID" = $1', [ID]);
    if (rows.length === 1) {
      res.send("materia obtenida con éxito: ");
      res.json(rows[0]);
    } else {
      res.status(404).send("materia no encontrada");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear una materia
const createmateria = async (req, res) => {
  const {nombre_materia} = req.body;

  
  if (!nombre_materia) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    const query = `
      INSERT INTO public.materias ("nombre_materia")
      VALUES ($1)
      RETURNING *
    `;
    const values = [nombre_materia];
    
    const result = await pool.query(query, values);

    // Respuesta exitosa
    res.status(201).json({
      message: 'materia creada con éxito',
      materia: result.rows[0]  
    });
  } catch (err) {
    res.status(500).send(err)
  }
};


// Actualizar una materia
const updatemateria = async (req, res) => {
  const { nombre_materia, ID } = req.body;

  // Validar los datos aquí si es necesario
  if (!ID || !nombre_materia) {
    return res.status(400).send('Faltan datos necesarios');
  }

  try {
    const result = await pool.query(
      'UPDATE public.materias SET nombre_materia = $1 WHERE "ID"= $2 RETURNING *',
      [ID, nombre_materia]
    );

    if (result.rows.length > 0) {
      res.status(200).send(`materia actualizada con éxito: ${JSON.stringify(result.rows[0])}`);
    } else {
      res.status(404).send('materia no encontrada');
    }
  } catch (err) {
    res.status(500).send(`Error al actualizar la materia: ${err.message}`);
  }
};



// Eliminar materia 

const deletemateria = async (req,res) => {
const ID= req.params.ID
const result = await pool.query
('DELETE FROM public."materias" WHERE "ID" = $1 RETURNING*',
[ID])
if (result.rows.length > 0) {
  res.status(200).send(`materia eliminada con éxito: ${JSON.stringify(result.rows[0])}`);
} else {
  res.status(404).send('materia no encontrada');
}
};


const materia = {
  getmateria,
  getmateriaByID,
  createmateria,
  updatemateria,
  deletemateria
}

export default materia;

*/