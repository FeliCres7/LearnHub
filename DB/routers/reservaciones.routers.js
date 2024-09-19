import express from 'express'
import reservaciones from '../controllers/reservaciones.js'

const router = express.Router();

//reservaciones
router.get('/reservaciones', reservaciones.getreservarclase);
router.post('/reservaciones', reservaciones.createreservarclase);

export default router;