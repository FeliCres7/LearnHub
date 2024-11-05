import {pool} from '../dbconfig.js'


// Obtener todas los materiales
const getmaterial = async (_, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM public."material"');
    res.json(rows);

  } catch (err) {
    res.send("materiales obtenidos con éxito");
    res.status(500).json({ error: err.message });
  }
}

// obtener un material por el nombre 

const getmaterialbynombre = async (req,res) => {
const {nombre} = req.params;

try{
const {rows} = await pool.query('SELECT * FROM public.material WHERE nombre = $1', [nombre]);
if (rows.length > 0){
  return res.json({materiales:rows, message: 'materiales obtenidos con exito'});
  } else {
  return res.status(400).json({error: 'no hay materiales con ese nombre'});
  }
} catch (err) {
  console.error('Error al obtener materiales:', err);
  return res.status(500).json({ error: 'Error al obtener los materiales' });
}
};

const getmaterialbyid = async (req,res) => {
  const {ID} = req.params;
  
  try{
  const {rows} = await pool.query('SELECT * FROM public.material WHERE "ID" = $1', [ID]);
  if (rows.length > 0){
    return res.json({materiales:rows, message: 'materiales obtenidos con exito'});
    } else {
    return res.status(400).json({error: 'no hay materiales con ese ID'});
    }
  } catch (err) {
    console.error('Error al obtener materiales:', err);
    return res.status(500).json({ error: 'Error al obtener los materiales' });
  }
  };
  
const creatematerial = async (req, res) => {     
  const {IDprofesor} = req.params  
  const { nombre, infoguia, archivo } = req.body;

  try {
    const query = `
      INSERT INTO public."material" ("IDprofesor" ,"nombre", "infoguia", "archivo")
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [IDprofesor, nombre, infoguia, archivo];
    
    const result = await pool.query(query, values);

    res.status(201).json({
      message: 'Material creado con éxito',
      material: result.rows[0]  
    });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor', details: err.message });
  }
};


// Actualizar un Material

const updatematerial = async (req, res) => {
  const { IDprofesor, infoguia, archivo, nombre } = req.body;
  const { ID } = req.params;

  // Validar los datos aquí si es necesario
  if (!ID || !IDprofesor || !infoguia || !archivo || !nombre) {
    return res.status(400).send('Faltan datos necesarios');
  }

  try {
    const result = await pool.query(
      'UPDATE public."material" SET "IDprofesor" = $1, "infoguia" = $2, "archivo" = $3, nombre = $4 WHERE "ID" = $5 RETURNING *',
      [IDprofesor, infoguia, archivo, nombre, ID]
    );

    if (result.rows.length > 0) {
      res.status(200).send(`Material actualizado con éxito: ${JSON.stringify(result.rows[0])}`);
    } else {
      res.status(404).send('Material no encontrado');
    }
  } catch (err) {
    res.status(500).send(`Error al actualizar el material: ${err.message}`);
  }
};




// Eliminar material

const deletematerial = async (req,res) => {
const ID = req.params.ID
const result = await pool.query
('DELETE FROM public."material" WHERE "ID" = $1 RETURNING*',
[ID])
if (result.rows.length > 0) {
  res.status(200).send(`Material eliminado con éxito: ${JSON.stringify(result.rows[0])}`);
} else {
  res.status(404).send('material no encontrado');
}
};

// Obtener materiales por ID del profesor
const getmaterialbyidprof = async (req, res) => {
  const { IDprofesor } = req.params;

  try {
    const { rows } = await pool.query(
      'SELECT * FROM public."material" WHERE "IDprofesor" = $1',
      [IDprofesor]
    );

    if (rows.length > 0) {
      return res.json({ materiales: rows, message: 'Materiales obtenidos con éxito' });
    } else {
      return res.status(404).json({ error: 'No se encontraron materiales para este profesor' });
    }
  } catch (err) {
    console.error('Error al obtener materiales por ID del profesor:', err);
    return res.status(500).json({ error: 'Error al obtener los materiales' });
  }
};

// Añade la función al objeto de exportación
const material = {
  getmaterial,
  getmaterialbynombre,
  getmaterialbyid,
  getmaterialbyidprof, 
  creatematerial,
  updatematerial,
  deletematerial
};

export default material;