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

  const getpaisesById = async (_, res) => {
    try {
      const query = `SELECT nombre FROM paises WHERE id = $1`;
      const result = await pool.query(query);
  
      if (result.rows.length > 0) {
        const pais = result.rows[0].nombre;
        res.json({ pais });
      } else {
        res.status(404).json({ error: 'pais not found' });
      }
    } catch (error) {
      console.error('Error fetching pais:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  const paises = {
    getpaises,
    getpaisesById
  }
  
  export default paises;
  
