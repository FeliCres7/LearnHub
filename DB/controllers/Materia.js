import {pool} from '../dbconfig.js'


// Obtener todas las materia
const getmateria = async (_, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM public."materias"');
      res.json(rows);
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  const materia = {
    getmateria
  }
  
  export default materia;
  