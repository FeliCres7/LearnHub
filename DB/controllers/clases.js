import {client} from '../dbconfig.js'


// Obtener todas las clases
const getClases = async (req, res) => {
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
  const { id } = req.body;
  try {
    const { rows } = await client.query('SELECT * FROM clases WHERE ID = $1', [id]);
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
  const { ID, nombre, apellido, username, clave, fecha_de_nacimiento, foto, Email, telefono, pais, idiomas } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO clases (ID, nombre, apellido, username, clave, fecha_de_nacimiento, foto, Email, telefono, pais, idiomas) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [ID, nombre, apellido, username, clave, fecha_de_nacimiento, foto, Email, telefono, pais, idiomas]
    );
    res.send("Clase creada con éxito");
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Actualizar una clase
const updateClase = async (req, res) => {
  const { id } = req.body;
  const { nombre, apellido, username, clave, fecha_de_nacimiento, foto, Email, telefono, pais, idiomas } = req.body;

  try {
    const result = await client.query(
      'UPDATE clases SET nombre = $1, apellido = $2, username = $3, clave = $4, fecha_de_nacimiento = $5, foto = $6, Email = $7, telefono = $8, pais = $9, idiomas = $10 WHERE ID = $11 RETURNING *',
      [nombre, apellido, username, clave, fecha_de_nacimiento, foto, Email, telefono, pais, idiomas, id]
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

const clases = {
  getClases,
  getClaseByID,
  createClase,
  updateClase
}

export default clases;
