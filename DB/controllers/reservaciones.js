import {pool} from '../dbconfig.js'

const getreservarclase = async (_,res) => {
try {
    const { rows } = await pool.query('SELECT * FROM reservaciones');
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
const query = `INSERT INTO public."reservaciones" ("IDclase", "IDalumno", "idprof", "dia", "hora") 
VALUES ($1, $2, $3, $4, $5) RETURNING *;  `

const values = [IDclase, IDalumno, idprof, dia, hora]; 

const result = await pool.query(query, values); 

res.status(201).json({
message: 'Reserva exitosa', 
reservaciones: result.rows [0]
});
} catch (err){
  res.status (500).send(err)
}}

const getreservacionbyalumno = async (req, res) => {
  const { IDalumno } = req.params;

  try {
    const query = ` SELECT "nombremateria" FROM public."clases" WHERE "ID"=$1 INNER JOIN public."reservaciones" WHERE "IDclase" = "ID" ON public."clases", public."alumnos" DSP TERMINARLO  
    `;

    const { rows } = await pool.query(query, [IDalumno]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getreservacionbyprof = async (req, res) => {
  const { idprof } = req.params;


  try {
    const query = ` SELECT "idprof" FROM  DSP HACERLO
      
    `;

    const { rows } = await pool.query(query, [idprof]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const reservaciones = {
   getreservarclase,
   createreservarclase,
   getreservacionbyalumno,
   getreservacionbyprof 
  };
  
  export default reservaciones;