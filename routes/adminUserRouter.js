const router = require('express').Router();
const adminUserCtrl = require('../controllers/adminUserCtrl'); // Importa los controladores
const auth = require('../middleware/auth'); // Middleware de autenticación
const isAdmin = require('../middleware/isAdmin'); // Middleware para verificar si es administrador

// Ruta para obtener información detallada de los usuarios (como actividad, estado, etc.)
router.get('/admin/users', auth, isAdmin, adminUserCtrl.getUsers);

// Ruta para cambiar el estado del usuario (suspender, reactivar, etc.)
router.patch('/user/:id/status', auth, isAdmin, adminUserCtrl.updateUserStatus);

// Ruta para ver los reportes de un usuario en particular
router.get('/user/:id/reports', auth, isAdmin, adminUserCtrl.getUserReports);

// Ruta para eliminar usuarios (soft delete o eliminación permanente)
router.delete('/user/:id', auth, isAdmin, adminUserCtrl.deleteUser);

// Ruta para obtener estadísticas de la plataforma
router.get('/stats', auth, isAdmin, adminUserCtrl.getPlatformStats);

module.exports = router;
