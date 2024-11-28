const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
 const axios = require('axios')
const authCtrl = {
    register: async (req, res) => {
        try {
            const {   username, email, password } = req.body
            let newUserName = username.toLowerCase().replace(/ /g, '')

            const user_name = await Users.findOne({username: newUserName})
            if(user_name) return res.status(400).json({msg: "This user name already exists."})

            const user_email = await Users.findOne({email})
            if(user_email) return res.status(400).json({msg: "This email already exists."})

            if(password.length < 6)
            return res.status(400).json({msg: "Password must be at least 6 characters."})

            const passwordHash = await bcrypt.hash(password, 12)

            const newUser = new Users({
                  username: newUserName, email, password: passwordHash 
            })


            const access_token = createAccessToken({id: newUser._id})
            const refresh_token = createRefreshToken({id: newUser._id})

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30*24*60*60*1000 // 30days
            })

            await newUser.save()

            res.json({
                msg: 'Register Success!',
                access_token,
                user: {
                    ...newUser._doc,
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
    
            // Buscar al usuario por email
            const user = await Users.findOne({ email })
                .populate("followers following", "avatar username followers following");
    
            if (!user) return res.status(400).json({ msg: "This email does not exist." });
    
            // Comparar contraseñas
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." });
    
            // Obtener la IP pública del cliente
         /*   const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
            // Verificar si la IP es local o reservada
            if (ipAddress.startsWith('127.') || ipAddress === '::1' || ipAddress.startsWith('192.168.') || ipAddress.startsWith('10.') || ipAddress.startsWith('172.16.')) {
                console.log("IP local o reservada detectada: No se puede obtener geolocalización");
                return res.status(200).json({
                    msg: 'Login Success!',
                    location: 'Ubicación no disponible para IP reservada o local'
                });
            }
    
            // Consultar la API de geolocalización con la IP del cliente
            const geoResponse = await axios.get(`http://ip-api.com/json/${ipAddress}`);
    
            // Si la API falla
            if (geoResponse.data.status === "fail") {
                console.error("API error:", geoResponse.data.message);
                return res.status(500).json({ msg: "Error en la API de geolocalización" });
            }
    */
            // Almacenar la fecha, hora y ubicación actual en lastLogin
         //   const location = geoResponse.data;
            await Users.findByIdAndUpdate(user._id, { lastLogin: new Date()});//, location 
    
            // Crear tokens de acceso y refresco
            const access_token = createAccessToken({ id: user._id });
            const refresh_token = createRefreshToken({ id: user._id });
    
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
            });
    
            // Responder con los datos del usuario, tokens y ubicación
            res.json({
                msg: 'Login Success!',
                access_token,
                user: {
                    ...user._doc,
                    password: '',  // Excluye la contraseña
                 //   location       // Incluye la ubicación obtenida
                }
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    
    
    
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {path: '/api/refresh_token'})
            return res.json({msg: "Logged out!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    generateAccessToken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if(!rf_token) return res.status(400).json({msg: "Please login now."})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async(err, result) => {
                if(err) return res.status(400).json({msg: "Please login now."})

                const user = await Users.findById(result.id).select("-password")
                .populate('followers following', 'avatar username  followers following')

                if(!user) return res.status(400).json({msg: "This does not exist."})

                const access_token = createAccessToken({id: result.id})

                res.json({
                    access_token,
                    user
                })
            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}


const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '30d'})
}

module.exports = authCtrl