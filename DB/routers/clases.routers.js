import express from 'express'
import clases from '../controllers/clases.js';

const router = express.Router();

router.get('/clases', clases.getClases);
router.get('/Clases/:ID', clases.getClaseByID);
router.post('/Clases', clases.createClase);
router.put('/Clases/ID', clases.updateClase);
router.delete('/Clases/:ID', clases.deleteclase);
router.get('/Clases/:ID/valoracionesbyclases', clases.getvaloracionbyclases);
router.post('/Clases/valoracionbyclases', clases.createvaloracionbyclases);
router.delete('/Clases/valoracionbyclases/:IDclases/:ID', clases.deletevaloracionbyclases);

export default router;