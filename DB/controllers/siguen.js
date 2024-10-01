import {pool} from "../dbconfig.js";


const getprofesoresseguidos = async (req,res) => {
const {IDalumno} = req.body

try{
const query = 'SELECT * FROM public."siguen" JOIN public."profesores terminar el join preguntarle a vigi'
const {rows} = await pool.query(query, [IDalumno])

if (rows.length === 0) {
  return res.status(404).json({ message: 'El alumno no sigue a ningún profesor' });
}

return res.status(200).json({message: 'profesores obtenidos con exito', profesores: rows});

} catch (err) {
  console.error('Error al obtener los profesores seguidos:', err);
  return res.status(500).json({ error: 'Error al obtener los profesores seguidos' });
}
};


const seguirprofesor = async (req,res) => {
try{
const {IDalumno, IDprof} = req.body

if (!IDalumno || !IDprof) {
return res.status(400).json({error: 'se requieren ambas cosas' })
}

const query = 'INSERT INTO public."siguen" ("IDalumno", "IDprof") VALUES ($1, $2) RETURNING*';
const {rows} = await pool.query(query, [IDalumno,IDprof]);

if (rows.length === 0) {
    return res.status(409).json({ message: 'El alumno ya sigue a este profesor' });
  }

  return res.json({
    message: 'Profesor seguido con éxito',
    seguimiento: rows[0], // Devuelve la relación insertada
  });

} catch (err) {
  console.error('Error al seguir al profesor:', err);
  return res.status(500).json({ error: 'Error al seguir al profesor' });
}
};


const dejardeseguir = async (req,res) => {
const {IDalumno, IDprof}= req.body 

try{
const query ='DELETE FROM public.siguen WHERE "IDalumno"= $1 AND "IDprof"=$2 RETURNING *';
const {rows} = await pool.query(query,[IDalumno, IDprof]);


return res.status(200).json({message: 'exito' , seguimiento:rows[0]})
}catch (err) {
return res.status(500).json({err}) 
  }
};

const seguir = {
seguirprofesor,
getprofesoresseguidos,
dejardeseguir
};
export default seguir;


