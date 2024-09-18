import express from 'express'
import reservaciones from './controllers/reservaciones.js'

//reservaciones
router.get('/reservaciones', reservaciones.getreservarclase);
router.post('/reservaciones', reservaciones.createreservarclase);