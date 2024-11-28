const Users = require('../models/userModel');

const langCtrl = {
  // Actualiza el idioma del usuario en la base de datos de forma dinámica
  updateUserLanguage: async (req, res) => {
    const { language } = req.params; // Obtener el idioma de los parámetros de la ruta (en caso de usar ruta dinámica)
    
    // Lista de idiomas válidos
    const validLanguages = ['en', 'fr', 'ar', 'es'];
    
    if (!validLanguages.includes(language)) {
      return res.status(400).json({ error: 'Idioma no válido' });
    }

    try {
      // Buscar y actualizar el idioma del usuario en la base de datos
      const user = await Users.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      user.language = language; // Actualiza el idioma del usuario
      await user.save();

      res.status(200).json({ message: `Idioma actualizado exitosamente a ${language}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el idioma' });
    }
  }
};

module.exports = langCtrl;
