const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  
  content: {
    type: String,
    required: true,
    maxlength: 50
  },
   
  optionservice: {
    type: String,
    
  },

  direccion: {
    type: String,
    maxlength: 50
  },

  wilaya: {
    type: String,
    maxlength: 50
  },

  commune: {
    type: String,
    maxlength: 50
  },

  specifications: {
    type: [String], 
   
  },
 

  discripcion: {
    type: String,
    maxlength: 400
  },

  pricesala: {
    type: Number
  },

  negociable: {
    type: String,
    required: false
  },
  nomprenom: {
    type: String,
    required: true,  // Campo requerido como se mencionó en el controlador.
    maxlength: 50
  },

  telefono: {
    type: String,
    required: true,  // Campo requerido como se mencionó en el controlador.
    maxlength: 50
  },

  email: {
    type: String,
    required: true,  // Campo requerido como se mencionó en el controlador.
    maxlength: 50
  },

  web: {
    type: String,
    maxlength: 50
  },

  informacion: {
    type: Boolean,
    default: false
  },

  comentarios: {
    type: Boolean,
    default: false
  },

  images: {
    type: Array,
    required: true,
    validate: {
      validator: function(images) {
        return images.length > 0 && images.length <= 7;
      },
      message: "Vous devez ajouter au moins une photo et un maximum de 7 photos."
    }
  },
  blockUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlockUser' }],
  estado: {
    type: String,
    enum: ['pendiente', 'aprovado', 'eliminado', 'publicado'],  // Agregado 'publicado'
    default: 'pendiente'
  },
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user' 
  }],

  comments: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'comment' 
  }],

  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user' 
  },

  lat: {    
    type: String
  },

  lng: {
    type: String
  }

}, {
  timestamps: true,
});

module.exports = mongoose.model('post', postSchema);
