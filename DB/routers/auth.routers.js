import express from 'express'
import auth from ',/controllers/auth.js'
import alumnos from './controllers/Alumnos.js';
import profesores from './controllers/Profesores.js';

router.post('/auth/register', upload.single('file'), auth.register);

router.post('/Alumnos/verificacion', alumnos.verificacion);
router.post('/profesores/verificacionprof', profesores.verificacionprof);