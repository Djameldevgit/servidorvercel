

const Provas = require('../models/provaModel'); // Cambié el nombre para mayor claridad




const provaCtrl = {
    creatProva: async (req, res) => {
        try {
            const { nombre, email } = req.body;

            // Crear y guardar nuevo documento
            const prova = new Provas({ nombre, email, user: req.user._id  }); // Usa el modelo correctamente
        await prova.save();

        res.status(201).json({
            success: true,
            message: 'Prova creada con éxito',
            prova,
        });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
},

    getProvas: async (req, res) => {
        try {
            const provas = await Provas.find().sort('-createdAt'); // Usa el modelo Prova
            res.json({ provas });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

        editProva: async (req, res) => {
            try {
                console.log('Params ID:', req.params.id);
                console.log('Body:', req.body);

                const { nombre, email } = req.body;
                const newProva = await Provas.findOneAndUpdate(
                    { _id: req.params.id },
                    { nombre, email },
                    { new: true } // Devuelve el documento actualizado
                );

                if (!newProva) {
                    return res.status(404).json({ msg: 'Prova no encontrada' });
                }

                res.json({ msg: 'Prova actualizada', newProva });
            } catch (error) {
                return res.status(500).json({ msg: error.message });
            }
        },
   
    
}

module.exports = provaCtrl