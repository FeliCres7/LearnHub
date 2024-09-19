import express from 'express'
import profesores from '../controllers/profesores.js'

const router = express.Router();

//Profesores
router.get('/profesores', profesores.getprof);
router.get('/profesores/:ID', profesores.getprofbyID);
router.post('/profesores', profesores.createprof);
router.put('/profesores/ID', profesores.updateprof);
router.delete('/profesores/:ID', profesores.deleteprof);
// router.get('/profesores/:ID/clasesbyprof/IDclases', profesores.getclasesbyprof);
router.get('/profesores/:ID/perfilprof',profesores.getperfilprof)
router.get('/profesores/dicta', profesores.getdicta);
router.post('/profesores/dicta/:ID', profesores.createdicta);

export default router;