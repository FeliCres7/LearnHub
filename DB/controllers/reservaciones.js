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
const {IDalumno, idprof, dia, hora} = req.body

if (!IDalumno || !idprof || !dia || !hora){
return res.status(400).json ({error:'todos los campos son requeridos'});
}
try{
   const horaNum = parseInt(hora, 10);

const query = `INSERT INTO public."reservaciones" ("IDalumno", "idprof", "dia", "hora") 
VALUES ($1, $2, $3, $4) RETURNING *;  `

const values = [IDalumno, idprof, dia, horaNum]; 

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
    const query = ` SELECT a."nombre" AS alumno, p."nombre" AS profesor, r."dia", r."hora"
      FROM public."reservaciones" r
      JOIN public."alumnos" a ON r."IDalumno" = a."ID"
      JOIN public."profesores" p ON r."idprof" = p."ID"
      WHERE r."IDalumno" = $1
      ORDER BY r."dia", r."hora";
  `

    const { rows } = await pool.query(query, [IDalumno]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getreservacionbyprof = async (req, res) => {
  const { idprof } = req.params;


  try {
    const query = ` SELECT a."nombre" AS alumno, p."nombre" AS profesor, r."dia", r."hora"
      FROM public."reservaciones" r
      JOIN public."alumnos" a ON r."IDalumno" = a."ID"
      JOIN public."profesores" p ON r."idprof" = p."ID"
      WHERE r."idprof" = $1
      ORDER BY r."dia", r."hora";
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