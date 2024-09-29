import { client } from "../dbconfig.js";


const getprofesoresseguidos = async (_,res) => {







}
const seguirprofesor = async (req,res) => {
try{
const {IDalumno, IDprof} = req.body

if (!IDalumno || !IDprof) {
return res.status(400).json({error: 'se requieren ambas cosas' })
}

const query = 'INSERT INTO public."siguen" ("IDalumno", "IDprof") VALUES ($1, $2) RETURNING*';
const {rows} = await client.query(query, [IDalumno,IDprof]);

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



const seguir = {
seguirprofesor,
getprofesoresseguidos
};
export default seguir;


