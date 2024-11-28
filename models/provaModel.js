const mongoose = require('mongoose')
const provashema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true,
        trim: true,

        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,

        unique: true
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user' 
      },

}, { timestamps: true }
)
module.exports = mongoose.model('prova', provashema)