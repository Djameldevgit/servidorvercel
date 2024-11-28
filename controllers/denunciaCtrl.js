const Denuncias = require('../models/denunciaUserModel'); // Importar el modelo de BlockUser
const Posts = require('../models/postModel'); // Asegúrate de tener el modelo de Post
const Users = require('../models/userModel'); // Asegúrate de tener el modelo de Post




const denunciaCtrl = {


    crearDenuncia: async (req, res) => {
        try {
            const { razones } = req.body;  // Recibimos las razones del cuerpo de la solicitud
            
            // Verificar si el post existe en la colección de Posts
            const postDenunciado = await Posts.findById(req.params.id);
            if (!postDenunciado) {
                return res.status(404).json({ msg: 'El post no existe.' });
            }

            // Verificar si el usuario ya ha denunciado este post anteriormente
            const denunciaExistente = await Denuncias.findOne({post: req.params.id, user: req.user._id  });

            if (denunciaExistente) {
                return res.status(409).json({ msg: 'Ya has denunciado este post anteriormente.' });
            }

            // Crear la nueva denuncia
            const nuevaDenuncia = new Denuncias({
                post: req.params.id,  // ID del post denunciado
                user: req.user._id,  // Usuario que hace la denuncia
                usuarioDenunciado: postDenunciado.user,  // Dueño del post denunciado
                razones  // Razones seleccionadas por el usuario
            });

            await nuevaDenuncia.save();
            res.status(201).json({ msg: 'Denuncia enviada con éxito.', nuevaDenuncia });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }

    },



    // 2. Obtener todas las denuncias de un post (GET /denuncias/:postId)
    obtenerDenunciasPorPost: async (req, res) => {
        try {
            // Buscar todas las denuncias asociadas al post
            const denuncias = await Denuncias.find({ post: req.params.id })
                .populate('reportedUser', 'username')  // Puedes obtener más detalles del usuario denunciado
                .populate('reportedBy', 'username');  // Puedes obtener más detalles del usuario que denuncia

            if (!denuncias.length) {
                return res.status(404).json({ msg: 'No se encontraron denuncias para este post' });
            }

            res.status(200).json(denuncias);
        } catch (err) {
            res.status(500).json({ msg: 'Error al obtener las denuncias', error: err.message });
        }
    },

    // 3. Actualizar una denuncia (PATCH /denuncias/:id)
    actualizarDenuncia: async (req, res) => {
        try {
            const { id } = req.params;
            const { fechaDesbloqueo, respuesta } = req.body;

            // Actualizar la denuncia con los campos proporcionados
            const denunciaActualizada = await Denuncias.findByIdAndUpdate(
                id,
                { unblockDate: fechaDesbloqueo, response: respuesta },
                { new: true }
            );

            if (!denunciaActualizada) {
                return res.status(404).json({ msg: 'Denuncia no encontrada' });
            }

            res.status(200).json(denunciaActualizada);
        } catch (err) {
            res.status(500).json({ msg: 'Error al actualizar la denuncia', error: err.message });
        }
    },

    // 4. Eliminar una denuncia (DELETE /denuncias/:id)
    eliminarDenuncia: async (req, res) => {
        try {
            // Eliminar la denuncia
            const denunciaEliminada = await Denuncias.findByIdAndDelete(req.params.id);

            if (!denunciaEliminada) {
                return res.status(404).json({ msg: 'Denuncia no encontrada' });
            }

            res.status(200).json({ msg: 'Denuncia eliminada correctamente' });
        } catch (err) {
            res.status(500).json({ msg: 'Error al eliminar la denuncia', error: err.message });
        }
    }
}

module.exports = denunciaCtrl;
