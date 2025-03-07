const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/reset-password', authController.resetPassword);
router.get('/verify-session', authController.verifySession);

// Rutas protegidas
router.use(authMiddleware); // Aplicar middleware de autenticación
router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);
router.put('/update-password', authController.updatePassword);
router.post('/signout', authController.signOut);

module.exports = router; 