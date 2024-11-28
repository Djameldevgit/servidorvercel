const mongoose = require('mongoose');

const notifySchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,  // Un identificador único para la notificación (generalmente generado por Mongoose).
    user: { 
        type: mongoose.Types.ObjectId,  // El ID del usuario que genera la notificación.
        ref: 'user'  // Hace referencia al modelo 'user' en la base de datos (es un enlace con el usuario).
    },
    recipients: [mongoose.Types.ObjectId],  // Un arreglo de IDs de los usuarios que reciben la notificación.
    url: String,  // Un enlace relacionado con la notificación (por ejemplo, un enlace a un post o perfil).
    text: String,  // El texto breve de la notificación (puede ser un mensaje corto).
    content: String,  // El contenido detallado de la notificación (generalmente un mensaje más largo).
    image: String,  // Una URL de imagen asociada a la notificación (opcional).
    isRead: { 
        type: Boolean,  // Un campo booleano que indica si la notificación ha sido leída o no.
        default: false  // El valor por defecto es 'false', lo que significa que la notificación está sin leer al principio.
    }
}, {
    timestamps: true  // Mongoose agrega automáticamente dos campos: 'createdAt' y 'updatedAt' para gestionar tiempos.
});

module.exports = mongoose.model('notify', notifySchema);
