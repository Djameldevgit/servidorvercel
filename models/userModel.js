const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    // Campos existentes
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png'
    },
    role: {
        type: String,
        enum: ['user', 'superuser', 'moderador', 'admin'],
        default: 'user'
    },
    language: {
        type: String,
        enum: ['en', 'fr', 'ar'],
        default: 'ar'
    },
    address: { type: String, default: '' },
    website: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    followers: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    following: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    saved: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },

    

    lastLogin: {
        type: Date,
        default: null, // Inicialmente, podría ser nulo
    },

    // Nuevos campos añadidos para administración
    dateJoined: {
        type: Date,
        default: Date.now  // Fecha de registro del usuario
    },
    lastActivity: {
        type: Date,
        default: Date.now  // Última actividad del usuario
    },
    reportsCount: {
        type: Number,
        default: 0  // Número de reportes que el usuario ha recibido
    },
    status: {
        type: String,
        enum: ['active', 'suspended', 'banned'],
        default: 'active'  // Estado del usuario (activo, suspendido, baneado)
    },
    averageInteractions: {
        type: Number,
        default: 0  // Promedio de likes y comentarios por post
    },
    ipAddresses: [
        {
          ip: String,
          location: {
            country: String,
            city: String,
            region: String,
            lat: Number,
            lon: Number,
            timezone: String
          }
        }
      ],
    suspendedAt: {
        type: Date  // Fecha de suspensión del usuario, si aplica
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('user', userSchema);
