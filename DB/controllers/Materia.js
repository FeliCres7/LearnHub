import {client} from '../dbconfig.js'


// Obtener todas las materia
const getmaterial = async (_, res) => {
  try {
    const { rows } = await client.query('SELECT * FROM public."material"');
    res.json(rows);

  } catch (err) {
    res.send("materiales obtenidos con éxito");
    res.status(500).json({ error: err.message });
  }
}

// Obtener una materia por ID
const getmaterialByID = async (req, res) => {
  const { ID } = req.body;
  try {
    const { rows } = await client.query('SELECT * FROM public."materia" WHERE "ID" = $1', [ID]);
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
const creatematerial = async (req, res) => {
  const {IDmateria, IDprofesor, horainicio, horafin, idiomas, Link } = req.body;

  
  if (!IDmateria || !IDprofesor || !horainicio || !horafin || !idiomas || !Link) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    const query = `
      INSERT INTO materia ("IDmateria", "IDprofesor", "horainicio", "horafin", "idiomas", "Link")
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
    res.status(500).send(err)
  }
};


// Actualizar una clase
const updatematerial = async (req, res) => {
  console.log(req.body)
  const { IDmateria, IDprofesor, horainicio, horafin, idiomas, Link, ID } = req.body;

  // Validar los datos aquí si es necesario
  if (!ID || !IDmateria || !IDprofesor || !horainicio || !horafin || !idiomas || !Link) {
    return res.status(400).send('Faltan datos necesarios');
  }

  try {
    const result = await client.query(
      'UPDATE public."clases" SET IDmateria = $1, IDprofesor = $2, horainicio = $3, horafin = $4, idiomas = $5, Link = $6 WHERE "ID" = $7 RETURNING *',
      [IDmateria, IDprofesor, horainicio, horafin, idiomas, Link, ID]
    );

    if (result.rows.length > 0) {
      res.status(200).send(`Clase actualizada con éxito: ${JSON.stringify(result.rows[0])}`);
    } else {
      res.status(404).send('Clase no encontrada');
    }
  } catch (err) {
    res.status(500).send(`Error al actualizar la clase: ${err.message}`);
  }
};



// Eliminar materia 

const deletematerial = async (req,res) => {
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
  getmaterial,
  getmaterialByID,
  creatematerial,
  updatematerial,
  deletematerial
}

export default clases;