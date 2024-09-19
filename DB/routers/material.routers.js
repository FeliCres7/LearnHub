import express from 'express'
import material from'../controllers/material.js'

const router = express.Router();

router.get('/Material', material.getmaterial);
router.get('/Material/:ID', material.getmaterialByID);
router.post('/Material', material.creatematerial);
router.put('/Material/ID', material.updatematerial);
router.delete('/Material/:ID', material.deletematerial);

export default router;