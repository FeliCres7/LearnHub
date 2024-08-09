import {client} from '../dbconfig.js'


const getprof = async (_, res) =>{
    try {
        const [rows] = await client.query('SELECT * FROM public."profesores"');
        res.json(rows);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}

const getprofbyID = async (_, res) => {
  const { id } = req.body.id;
  try {
    const { rows } = await client.query('SELECT * FROM profesores WHERE ID = ?', [id]);
    if (rows.length === 1) {
      res.send("Profesor obtenido con exito: ")
      res.json(rows[0]);
    }
  } catch (err) {
    res.status(404).json({ error: 'profesor no encontrado' });
  }
};

const profesores = {
  getprof, 
  getprofbyID
}
export default profesores; 