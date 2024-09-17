import express from 'express'
import auth from ',/controllers/auth.js'


router.post('/auth/register', auth.register)
router.post("/auth/register", upload.single('file'), auth.register);
