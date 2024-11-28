const express = require('express');
const router = express.Router();
const denunciaCtrl = require('../controllers/denunciaCtrl');
const auth = require('../middleware/auth');

// Ruta para crear una nueva denuncia// Ruta para crear una nueva denuncia
router.post('/denunciar/:id', auth,denunciaCtrl.crearDenuncia);

// Ruta para obtener todas las denuncias de un post
router.get('/denunciar/:postId', denunciaCtrl.obtenerDenunciasPorPost);

// Ruta para actualizar una denuncia (desbloquear o agregar respuesta)
router.patch('/denunciar/:id', denunciaCtrl.actualizarDenuncia);

// Ruta para eliminar una denuncia
router.delete('/denunciar/:id', denunciaCtrl.eliminarDenuncia);

module.exports = router;
