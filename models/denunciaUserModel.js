const mongoose = require('mongoose');

const denunciaSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'post', required: true }, // Post denunciado
    usuarioDenunciado: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Usuario denunciado
    usuarioReportante: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Usuario que hace la denuncia
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Usuario propietario del post

    razones: { 
        type: [String], 
        enum: ['Contenido inapropiado', 'Spam', 'Acoso', 'Desinformación', 'Otro'], // Motivos predefinidos
        required: true 
    },
    estado: { type: String, enum: ['pendiente', 'procesado', 'rechazado'], default: 'pendiente' }, // Estado de la denuncia
    fechaDenuncia: { type: Date, default: Date.now }, // Fecha de creación
    fechaDesbloqueo: { type: Date }, // Fecha de desbloqueo si es aplicable
    respuesta: { type: String }, // Respuesta del usuario denunciado (opcional)
});

module.exports = mongoose.model('Denuncia', denunciaSchema);

