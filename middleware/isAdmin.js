// isAdmin.js
const User = require('../models/userModel');

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id); // asumiendo que tienes req.user
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ msg: "No tienes permisos para realizar esta acción." });
        }
        next();
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

module.exports = isAdmin;
