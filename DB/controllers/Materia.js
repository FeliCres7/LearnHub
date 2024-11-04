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


  const getMateriaById = async (req, res) => {
    const ID= req.params.ID; 
    try {
      const query = `SELECT nombre_materia FROM materias WHERE "ID" = $1`;
      const result = await pool.query(query, [ID]); 
    
      if (result.rows.length > 0) {
        const materia = result.rows[0].nombre_materia;;
        res.json({ materia });
      } else {
        res.status(404).json({ error: 'materia not found' });
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
  