import express from 'express'
import auth from '../controllers/auth.js'
import alumnos from '../controllers/Alumnos.js';
import profesores from '../controllers/profesores.js';

const router = express.Router();

router.post('/auth/register',auth.register);

router.post('/Alumnos/verificacion', alumnos.verificacion);
router.post('/profesores/verificacionprof', profesores.verificacionprof);

export default router