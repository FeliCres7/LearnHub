import {pool} from '../dbconfig.js'

const getreservarclase = async (_,res) => {
try {
    const { rows } = await pool.query('SELECT * FROM reservaciones');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const createreservarclase = async (req, res) => { 
  const { IDalumno, idprof, dia, hora, fecha } = req.body;

  // Validar que todos los campos estén presentes
  if (!IDalumno || !idprof || !dia || !hora || !fecha) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    // Inserta la reserva en la base de datos
    const queryInsert = `
      INSERT INTO public."reservaciones" ("IDalumno", "idprof", "dia", "hora", "fecha") 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *;
    `;
    const valuesInsert = [IDalumno, idprof, dia, hora, fecha]; 
    const resultInsert = await pool.query(queryInsert, valuesInsert);
    const reserva = resultInsert.rows[0];

    // Obtén el nombre y apellido del alumno y profesor usando el campo ID
    const queryInfo = `
      SELECT 
        (SELECT nombre FROM alumnos WHERE "ID" = $1) AS nombre_alumno,
        (SELECT apellido FROM alumnos WHERE "ID" = $1) AS apellido_alumno,
        (SELECT nombre FROM profesores WHERE "ID" = $2) AS nombre_profesor,
        (SELECT apellido FROM profesores WHERE "ID" = $2) AS apellido_profesor
    `;
    const valuesInfo = [IDalumno, idprof];
    const resultInfo = await pool.query(queryInfo, valuesInfo);
    const info = resultInfo.rows[0];

    // Enviar respuesta con todos los datos
    res.status(201).json({
      message: 'Reserva exitosa',
      reservacion: {
        ...reserva,
        fecha: reserva.fecha, 
        alumno: {
          nombre: info.nombre_alumno,
          apellido: info.apellido_alumno
        },
        profesor: {
          nombre: info.nombre_profesor,
          apellido: info.apellido_profesor
        }
      }
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

const getreservacionbyalumno = async (req, res) => {
  const { IDalumno } = req.params;

  try {
    const query = ` SELECT a."nombre" AS alumno, p."nombre" AS profesor, r."dia", r."hora", r."fecha"
      FROM public."reservaciones" r
      JOIN public."alumnos" a ON r."IDalumno" = a."ID"
      JOIN public."profesores" p ON r."idprof" = p."ID"
      WHERE r."IDalumno" = $1
      ORDER BY r."dia", r."hora", r."fecha";
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
    const query = ` SELECT a."nombre" AS alumno, p."nombre" AS profesor, r."dia", r."hora", r."fecha"
      FROM public."reservaciones" r
      JOIN public."alumnos" a ON r."IDalumno" = a."ID"
      JOIN public."profesores" p ON r."idprof" = p."ID"
      WHERE r."idprof" = $1
      ORDER BY r."dia", r."hora", r."fecha" ;
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