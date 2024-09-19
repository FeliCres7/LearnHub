import express from 'express'
import materia from '../controllers/materia.js'


const router = express.Router();

router.get('/Materia', materia.getmateria);
router.get('/Materia/:ID', materia.getmateriaByID);
router.post('/Materia', materia.createmateria);
router.put('/Materia/ID', materia.updatemateria);
router.delete('/Materia/:ID', materia.deletemateria);

export default router;