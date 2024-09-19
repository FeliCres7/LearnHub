import express from 'express'
import reservaciones from './controllers/reservaciones.js'
import router from './materia.routers.js';

//reservaciones
router.get('/reservaciones', reservaciones.getreservarclase);
router.post('/reservaciones', reservaciones.createreservarclase);

export default router;