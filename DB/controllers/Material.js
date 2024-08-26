import {client} from '../dbconfig.js'


// Obtener todas los materiales
const getmaterial = async (_, res) => {
  try {
    const { rows } = await client.query('SELECT * FROM public."material"');
    res.json(rows);

  } catch (err) {
    res.send("materiales obtenidos con éxito");
    res.status(500).json({ error: err.message });
  }
}

// Obtener un material por ID
const getmaterialByID = async (req, res) => {
  const { ID } = req.body;
  try {
    const { rows } = await client.query('SELECT * FROM public."material" WHERE "ID" = $1', [ID]);
    if (rows.length == 1) {
      res.send("material obtenida con éxito: ");
      res.json(rows[0]);
    } else {
      res.status(404).send("material no encontrado");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear un material
const creatematerial = async (req, res) => {
const {IDprofesor, materia, Fecha} = req.body;

  
  if (!IDprofesor || !materia || !Fecha) {
    return res.status(400).json({ error: 'Todos los campos son requeridos'});
  }

  try {
    const query = `
      INSERT INTO public."material" ("IDprofesor", "materia", "Fecha")
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [IDprofesor, materia, Fecha];
    
    const result = await client.query(query, values);

    // Respuesta exitosa
    res.status(201).json({
      message: 'material creado con éxito',
      clase: result.rows[0]  
    });
  } catch (err) {
    res.status(500).send(err)
  }
};


// Actualizar un Material
const updatematerial = async (req, res) => {
  console.log(req.body)
  const { IDprofesor, materia, Fecha, ID} = req.body;

  // Validar los datos aquí si es necesario
  if (!ID ||!IDprofesor || !materia || !Fecha ) {
    return res.status(400).send('Faltan datos necesarios');
  }

  try {
    const result = await client.query(
      'UPDATE public."material" SET IDprofesor = $1, materia = $2, Fecha = $3 WHERE "ID" = $4 RETURNING *',
      [IDprofesor, materia, Fecha, ID]
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
const ID= req.params.ID
const result = await client.query
('DELETE FROM public."material" WHERE "ID" = $1 RETURNING*',
[ID])
if (result.rows.length > 0) {
  res.status(200).send(`Material eliminado con éxito: ${JSON.stringify(result.rows[0])}`);
} else {
  res.status(404).send('material no encontrado');
}
};


const material = {
  getmaterial,
  getmaterialByID,
  creatematerial,
  updatematerial,
  deletematerial
}

export default material;