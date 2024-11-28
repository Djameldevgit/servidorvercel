const Users = require("../models/userModel");
const Posts = require('../models/postModel')
 
const adminUserCtrl = {

    // Obtener la lista de usuarios con detalles importantes (estado, actividad, reportes, etc.)
    getUsers: async (req, res) => {
        try {
            const users = await Users.find({})
                .select('username email role status lastActivity reportsCount') // Selecciona solo los campos relevantes
                .sort({ lastActivity: -1 }); // Ordena por la actividad más reciente
            res.json({ users });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    // Actualizar el estado del usuario (suspender, activar, banear)
    updateUserStatus: async (req, res) => {
        try {
            const { status } = req.body;
            const user = await Users.findByIdAndUpdate(req.params.id, { status }, { new: true });

            if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

            res.json({ msg: `Estado de usuario actualizado a ${status}`, user });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    // Obtener los reportes de un usuario
    getUserReports: async (req, res) => {
        try {
            const user = await User.findById(req.params.id)
                .select('username reportsCount status');

            if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

            // Aquí podrías agregar lógica para mostrar detalles específicos de los reportes si los tienes almacenados en otro lugar
            res.json({ user, reports: user.reportsCount });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    // Eliminar usuario (soft delete o permanente)
    deleteUser: async (req, res) => {
        try {
            const user = await Users.findByIdAndDelete(req.params.id);

            if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

            res.json({ msg: "Usuario eliminado", user });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    // Obtener estadísticas generales de la plataforma
    getPlatformStats: async (req, res) => {
        try {
            const usersCount = await Users.countDocuments(); // Número total de usuarios
            const postsCount = await Posts.countDocuments(); // Número total de posts
            const activeUsers = await Users.countDocuments({ status: 'active' }); // Usuarios activos

            // Puedes agregar más estadísticas según lo que necesites
            res.json({ usersCount, postsCount, activeUsers });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
};

module.exports = adminUserCtrl;
