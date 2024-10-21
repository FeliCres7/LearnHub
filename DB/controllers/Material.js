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

// Obtener un material por ID
const getmaterialByID = async (req, res) => {
  const { ID } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM public."material" WHERE "ID" = $1', [ID]);
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

const creatematerial = async (req, res) => {
  const { IDprofesor, materia, Fecha, infoguia } = req.body;

  if (!IDprofesor || !materia || !Fecha || !infoguia || !req.files || !req.files.archivo || req.files.archivo.length === 0) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    const archivoFile = req.files.archivo[0];
    const extensionesPermitidas = ['pdf', 'doc', 'docx'];
    const extensionArchivo = archivoFile.originalname.split('.').pop().toLowerCase();

    if (!extensionesPermitidas.includes(extensionArchivo)) {
      return res.status(400).send('Error: Extensiones no permitidas. El archivo debe ser PDF o DOC/DOCX.');
    }

    // Subir el archivo a Cloudinary
    const Archivo = await cloudinary.uploader.upload(archivoFile.path, {
      folder: 'materiales',
      resource_type: 'raw'
    });
    const archivoUrl = Archivo.secure_url;

    const query = `
      INSERT INTO public."material" ("IDprofesor", "materia", "Fecha", "infoguia", "archivo")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [IDprofesor, materia, Fecha, infoguia, archivoUrl];
    
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
  console.log(req.body)
  const { IDprofesor, IDalumno, materia, Fecha, infoguia, archivo, ID} = req.body;

  // Validar los datos aquí si es necesario
  if (!ID ||!IDprofesor || !IDalumno ||!materia || !Fecha ) {
    return res.status(400).send('Faltan datos necesarios');
  }

  try {
    const result = await pool.query(
      'UPDATE public."material" SET "IDprofesor" = $1,  "IDalumno"=$2, materia = $3, "Fecha" = $4, "infoguia"= $5, "archivo"=$6 WHERE "ID" = $7 RETURNING *',
      [IDprofesor, IDalumno, materia, Fecha, infoguia, archivo, ID]
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
const result = await pool.query
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
  getmaterialbynombre,
  getmaterialByID,
  creatematerial,
  updatematerial,
  deletematerial
}

export default material;