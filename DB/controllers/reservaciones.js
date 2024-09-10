import {client} from '../dbconfig.js'

const getreservarclase = async (_,res) => {
try {
    const { rows } = await client.query('SELECT * FROM reservaciones');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//reservar clase
const createreservarclase = async (req,res) => {
const {IDclase, IDalumno, idprof, dia, hora} = req.body

if ( !IDclase || !IDalumno || !idprof || !dia || !hora){
return res.status(400).json ({error:'todos los campos son requeridos'});
}
try{
const query = `INSERT INTO public.reservaciones ("IDclase", "IDalumno", "idprof", "dia", "hora") 
VALUES ($1, $2, $3, $4, $5) RETURNING *;  `

const values = [IDclase, IDalumno, idprof, dia, hora]; 

const result = await client.query(query, values); 

res.status(201).json({
message: 'Reserva exitosa', 
reservaciones: result.rows [0]
});
} catch (err){
  res.status (500).send(err)
}}

const reservaciones = {
   getreservarclase,
   createreservarclase

  };
  
  export default reservaciones;