const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
    recipients: [{ type: mongoose.Types.ObjectId, ref: 'user' }],  // Los usuarios participantes en la conversación
    text: String,  // El texto del último mensaje o un resumen de la conversación
    media: Array,  // Archivos multimedia compartidos (imágenes, videos, etc.)
    call: Object  // Información sobre una llamada, si la conversación involucra una
}, {
    timestamps: true  // Timestamps para rastrear cuándo fue creada/modificada la conversación
})
module.exports= mongoose.model('conversation',conversationSchema)