const Users = require("../models/userModel")
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")//const Users = require("../models/userModel")
        const jwt = require('jsonwebtoken')
      //  El token es suficiente para que el servidor autentique la solicitud y extraiga el ID del usuario. Luego, el middleware busca al usuario en la base de datos utilizando este ID y lo adjunta a la solicitud como req.user, que puede ser utilizado por los controladores para realizar operaciones específicas del usuario.
        const auth = async (req, res, next) => {
            try {
                const token = req.header("Authorization")
        
                if(!token) return res.status(400).json({msg: "Invalid Authentication."})//Verificación de la Presencia del Token:
        
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)//Verifica el token utilizando jwt.verify y la clave secreta.
                if(!decoded) return res.status(400).json({msg: "Invalid Authentication."})//Si el token es válido, decodifica el token para obtener el ID del usuario.
        
                const user = await Users.findOne({_id: decoded.id})//Con el ID del usuario decodificado, el middleware busca al usuario en la base de datos.
                
                req.user = user//Si se encuentra el usuario, se asigna al objeto req.user.
                next()
            } catch (err) {
                return res.status(500).json({msg: err.message})
            }
        }
        
        
        module.exports = auth

        if(!token) return res.status(400).json({msg: "Invalid Authentication."})

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if(!decoded) return res.status(400).json({msg: "Invalid Authentication."})

        const user = await Users.findOne({_id: decoded.id})
        
        req.user = user
        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}


module.exports = auth