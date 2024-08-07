import {conn} from '../dbconfig.js'


const getalumnos = async (_, res) =>{
    try {
        const [rows] = await conn.query('SELECT * FROM alumnos');
        res.json(rows);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
const getalumnosbyID = async (_, res) => {
    const { id } = req.params;
    try {
      const [rows] = await conn.query('SELECT * FROM alumnos WHERE ID = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'alumno no encontrado' });
      }
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

const alumnos = {
  getalumnos,
  getalumnosbyID
};

export default alumnos;

  