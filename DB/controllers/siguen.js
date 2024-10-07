import {pool} from "../dbconfig.js";


const getprofesoresseguidos = async (req,res) => {
const {IDalumno} = req.params

try{
const query = `
            SELECT profesores.* 
            FROM public."siguen", public."profesores" 
            WHERE "siguen"."IDprof" = "profesores"."ID" 
            AND "siguen"."IDalumno" = $1
        `;
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
const ID= req.params.ID;

try{
const query ='DELETE FROM public."siguen" WHERE "ID" = $1 RETURNING *';
const {rows} = await pool.query(query,[ID]);

 if (rows.length > 0) {
    return res.status(200).json({ message: 'Éxito', seguimiento: rows[0] });
} else {
    return res.status(200).json({ message: 'No se encontró ningún seguimiento para eliminar.' });
}
} catch (err) {
console.error('Error al dejar de seguir:', err);
return res.status(500).json({ error: 'Error del servidor' });
}
};

const seguir = {
seguirprofesor,
getprofesoresseguidos,
dejardeseguir
};
export default seguir;


