import {client} from '../dbconfig.js'

const getprof = async (_, res) =>{
    try {
        const [rows] = await client.query('SELECT * FROM alumnos');
        res.json(rows);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}

const profesores = {
  getprof, 
}
export default profesores; 