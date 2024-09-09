import {client} from '../dbconfig.js'

const getreservarclase = async (_,res) => {
try {
    const { rows } = await client.query('SELECT * FROM reservaciones');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}






const reservaciones = {
   getreservarclase,
  
  };
  
  export default reservaciones;