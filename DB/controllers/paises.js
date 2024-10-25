import {pool} from '../dbconfig.js'


// Obtener todas las paises
const getpaises = async (_, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM public."paises"');
      res.json(rows);
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  const paises = {
    getpaises
  }
  
  export default paises;
  
