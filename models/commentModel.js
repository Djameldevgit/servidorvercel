const mongoose = require('mongoose')
/*
content: El texto del comentario.
tag: Información adicional sobre el comentario (por ejemplo, menciones o etiquetas).
reply: ID del comentario al que se responde (si es una respuesta).
likes: Lista de IDs de usuarios que han dado "me gusta".
user: ID del usuario que creó el comentario.
postId: ID del post al que pertenece el comentario.
postUserId: ID del usuario que creó el post.
timestamps: Crea automáticamente las fechas de creación y actualización del comentario

*/
const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    tag: Object,
    reply: mongoose.Types.ObjectId,
    likes: [{type: mongoose.Types.ObjectId, ref: 'user'}],
    user: {type: mongoose.Types.ObjectId, ref: 'user'},
    postId: mongoose.Types.ObjectId,
    postUserId: mongoose.Types.ObjectId
}, {
    timestamps: true
})

module.exports = mongoose.model('comment', commentSchema)