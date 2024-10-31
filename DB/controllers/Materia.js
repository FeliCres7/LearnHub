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


  const getMateriaById = async (_, res) => {
    try {
      const query = `SELECT nombre_materia FROM materias WHERE id = $1`;
      const result = await pool.query(query);
  
      if (result.rows.length > 0) {
        const materia = result.rows[0].nombre_materia;
        res.json({ materia });
      } else {
        res.status(404).json({ error: 'Materia not found' });
      }
    } catch (error) {
      console.error('Error fetching materia:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const materia = {
    getmateria,
    getMateriaById
  }
  
  export default materia;
  