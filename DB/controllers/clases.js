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
    if (rows.length == 1) {
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
  const {IDmateria, IDprofesor, horainicio, horafin, idiomas, Link, valoracion} = req.body;

  
  if (!IDmateria || !IDprofesor || !horainicio || !horafin || !idiomas || !Link || !valoracion) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    const query = `
      INSERT INTO clases ("IDmateria", "IDprofesor", "horainicio", "horafin", "idiomas", "Link", "valoracion")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [IDmateria, IDprofesor, horainicio, horafin, idiomas, Link, valoracion];
    
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
const updateClase = async (req, res) => {
  console.log(req.body)
  const { IDmateria, IDprofesor, horainicio, horafin, idiomas, Link, valoracion, ID } = req.body;

  // Validar los datos aquí si es necesario
  if (!ID || !IDmateria || !IDprofesor || !horainicio || !horafin || !idiomas || !Link || !valoracion) {
    return res.status(400).send('Faltan datos necesarios');
  }

  try {
    const result = await client.query(
      'UPDATE public."clases" SET IDmateria = $1, IDprofesor = $2, horainicio = $3, horafin = $4, idiomas = $5, Link = $6, valoracion=$7 WHERE "ID" = $8 RETURNING *',
      [IDmateria, IDprofesor, horainicio, horafin, idiomas, Link, valoracion, ID]
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

// obtener valoracion de las clases
const getvaloracionbyclases = async (req, res) => {
  const { ID } = req.params;

  try {
    const { rows } = await client.query(
      'SELECT * FROM public."valoraciones" WHERE "IDclases" = $1',
      [ID]
    );

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).send('No se encontraron valoraciones para esta clase');
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear una valoración
const createvaloracionbyclases = async (req, res) => {
  const { IDclases, valoracion, fecha } = req.body;

  if (!IDclases || !valoracion || !fecha) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    const query = `
      INSERT INTO public."valoraciones" ("IDclases", "valoracion", "fecha")
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [IDclases, valoracion, fecha];

    const result = await client.query(query, values);
    res.status(201).json({
      message: 'Valoración creada con éxito',
      valoracion: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Eliminar valoraciones por ID de clase
const deletevaloracionbyclases = async(req,res) => {
  const { IDclases } = req.params;

  try {
    const { rowCount } = await client.query(
      'DELETE FROM public."valoraciones" WHERE "IDclases" = $1',
      [IDclases]
    );

    if (rowCount > 0) {
      res.status(200).send(`Valoraciones eliminadas con éxito para la clase con ID ${IDclases}`);
    } else {
      res.status(404).send('No se encontraron valoraciones para eliminar para esta clase');
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




const clases = {
  getClases,
  getClaseByID,
  createClase,
  updateClase,
  deleteclase,
  getvaloracionbyclases,
  createvaloracionbyclases,
  deletevaloracionbyclases
}

export default clases;
