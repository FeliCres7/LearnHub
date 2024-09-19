import express from 'express'
import alumnos from '../controllers/Alumnos.js';

const router = express.Router();

//Alumnos
router.get('/Alumnos', alumnos.getalumnos);
router.get('/Alumnos/:ID', alumnos.getalumnobyID);
router.post('/Alumnos', alumnos.createAlumno);
router.put('/Alumnos/ID', alumnos.updateAlumno);
router.delete('/Alumnos/:ID', alumnos.deleteAlumno);
//router.get('/Alumnos/:ID/clasebyalumno/:IDclases/',alumnos.getclasebyalumno);
router.get('/Alumnos/:ID/perfilalumno',alumnos.getperfilalumno);

export default router;
