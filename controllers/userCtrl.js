const Users = require("../models/userModel");
//const axios =require('axios')
const Posts = require('../models/postModel')
const Comments = require('../models/commentModel')
class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const userCtrl = {
    // Controlador para obtener la cuenta total de usuarios
    getUsersCount: async (req, res) => {
        try {
            const counttotal = await Users.countDocuments(); // Solo cuenta los documentos (usuarios)
            res.json({ counttotal }); // Envía la cuenta como respuesta
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },




    getActiveUsersLast24h: async (req, res) => {
        try {
            // Obtenemos usuarios que se han logueado en las últimas 24 horas
            const features = new APIfeatures(
                Users.find({ lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
                req.query
            ).paginating();

            // Ordenamos por la fecha de último inicio de sesión
            const users = await features.query
                .sort('-lastLogin')  // Ordena por el último login en lugar de 'createdAt'
                .populate("user likes", "avatar username followers");

            // Enviamos la cantidad de usuarios y la lista
            res.json({
                count: users.length, // Cantidad de usuarios obtenidos
                users // Lista de usuarios activos
            });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },



    getActiveUsersLast3h: async (req, res) => {
        try {
            // Obtenemos usuarios que se han logueado en las últimas 24 horas
            const features = new APIfeatures(
                Users.find({ lastLogin: { $gte: new Date(Date.now() - 3 * 60 * 60 * 1000) } }),
                req.query
            ).paginating();

            // Ordenamos por la fecha de último inicio de sesión
            const users = await features.query
                .sort('-lastLogin')  // Ordena por el último login en lugar de 'createdAt'
                .populate("user likes", "avatar username followers");

            // Enviamos la cantidad de usuarios y la lista
            res.json({
                count: users.length, // Cantidad de usuarios obtenidos
                users // Lista de usuarios activos
            });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    /* //solo obtiene los likes y posts y comments que tiene sobre sus postss
    getUsers: async (req, res) => {
        try {
            // Crear la paginación y los filtros para obtener los usuarios
            const features = new APIfeatures(Users.find(), req.query).paginating();
    
            // Obtener la lista de usuarios
            const users = await features.query
                .sort('-createdAt')
                .populate("user likes", "avatar username followers") // Popula los datos relacionados con el usuario
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                });
    
            // Para cada usuario, obtener los posts, likes y comentarios
            const usersWithDetails = await Promise.all(users.map(async (user) => {
                // Obtener los posts del usuario
                const posts = await Posts.find({ user: user._id })
                    .sort('-createdAt')
                    .populate("likes comments") // Popula los likes y comments de cada post
                    .populate({
                        path: "comments",
                        populate: {
                            path: "user likes", // Popula el usuario y los likes de cada comentario
                            select: "-password"
                        }
                    });
    
                // Calcular el total de likes y comentarios
                const totalLikes = posts.reduce((acc, post) => acc + post.likes.length, 0);
                const totalComments = posts.reduce((acc, post) => acc + post.comments.length, 0);
    
                return {
                    ...user.toObject(),  // Convertir el documento de Mongoose a un objeto plano
                    posts,               // Posts del usuario
                    totalLikes,          // Total de likes en los posts
                    totalComments        // Total de comentarios en los posts
                };
            }));
    
            // Devolver la respuesta con los usuarios, posts, likes y comentarios
            res.json({
                msg: 'Success!',
                result: usersWithDetails.length,
                users: usersWithDetails
            });
    
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    
*/

    /*
    
        getUsers: async (req, res) => {
    
    
            try {
                const features = new APIfeatures(Users.find(), req.query).paginating()
    
                const users = await features.query.sort('-createdAt')
                    .populate("user likes", "avatar username   followers")
                    .populate({
                        path: "comments",
                        populate: {
                            path: "user likes",
                            select: "-password"
                        }
                    })
    
                res.json({
                    msg: 'Success!',
                    result: users.length,
                    users
                })
    
            } catch (err) {
                return res.status(500).json({ msg: err.message })
            }
        },
    
    /*
        getUsers: async (req, res) => {
            try {
                // Crear la paginación y los filtros para obtener los usuarios
                const features = new APIfeatures(Users.find(), req.query).paginating();
        
                // Obtener la lista de usuarios, con los campos que has especificado
                const users = await features.query
                    .sort('-createdAt')
                    .populate("user likes", "avatar username followers") // Popula los datos relacionados con el usuario
                    .populate({
                        path: "comments",
                        populate: {
                            path: "user likes",
                            select: "-password"
                        }
                    });
        
                // Ahora para cada usuario, obtener los posts que ha creado
                const usersWithPosts = await Promise.all(users.map(async (user) => {
                    // Obtener los posts de cada usuario por su ID
                    const posts = await Posts.find({ user: user._id }).sort('-createdAt');
    
                    return {
                        ...user.toObject(), // Convertir el documento de Mongoose a un objeto para agregar nuevos campos
                        posts // Agregar los posts al objeto del usuario
                    };
                }));
        
                // Devolver la respuesta con los usuarios y sus posts
                res.json({
                    msg: 'Success!',
                    result: usersWithPosts.length,
                    users: usersWithPosts
                });
        
            } catch (err) {
                return res.status(500).json({ msg: err.message });
            }
        },
        *//*
    getUsers: async (req, res) => {
        try {
            const features = new APIfeatures(Users.find(), req.query).paginating();
            const users = await features.query
                .sort('-createdAt')
                .populate("user likes", "avatar username followers")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                });
    
            const usersWithDetails = await Promise.all(users.map(async (user) => {
                // Obtener los posts creados por el usuario
                const posts = await Posts.find({ user: user._id }).sort('-createdAt');
                const totalLikesReceived = posts.reduce((acc, post) => acc + post.likes.length, 0);
                const totalCommentsReceived = posts.reduce((acc, post) => acc + post.comments.length, 0);
    
                // Obtener los likes que el usuario ha dado en otros posts
                const likesGiven = await Posts.countDocuments({ likes: user._id });
                
                // Obtener los comentarios que el usuario ha hecho en otros posts
                const commentsMade = await Comments.countDocuments({ user: user._id });
    
                return {
                    ...user.toObject(),
                    posts,
                    totalLikesReceived,  // Likes recibidos en sus posts
                    totalCommentsReceived,  // Comentarios recibidos en sus posts
                    likesGiven,  // Likes dados a otros posts
                    commentsMade  // Comentarios hechos en otros posts
                };
            }));
    
            res.json({
                msg: 'Success!',
                result: usersWithDetails.length,
                users: usersWithDetails
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    
*/
    getUsers: async (req, res) => {
        try {
            // Crear la paginación y los filtros para obtener los usuarios
            const features = new APIfeatures(Users.find(), req.query).paginating();

            // Obtener la lista de usuarios, con los campos que has especificado
            const users = await features.query
                .sort('-createdAt')
                .populate("user likes", "avatar username followers following") // Popula seguidores y siguiendo
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                });

            // Para cada usuario, obtenemos sus posts y contaremos likes, comentarios, etc.
            const usersWithDetails = await Promise.all(users.map(async (user) => {
                // Obtener los posts creados por el usuario
                const posts = await Posts.find({ user: user._id }).sort('-createdAt');

                // Contar los likes y comentarios recibidos en sus posts
                const totalLikesReceived = posts.reduce((total, post) => total + post.likes.length, 0);
                const totalCommentsReceived = posts.reduce((total, post) => total + post.comments.length, 0);

                // Conteo de seguidores y seguidos
                const totalFollowers = user.followers.length;  // Cantidad de seguidores
                const totalFollowing = user.following.length;  // Cantidad de personas a las que sigue

                // Obtener los likes hechos por el usuario en otros posts
                const likesGiven = await Posts.countDocuments({ likes: user._id });

                // Obtener los comentarios hechos por el usuario en otros posts
                const commentsMade = await Comments.countDocuments({ user: user._id });

                return {
                    ...user.toObject(),
                    posts,
                    totalLikesReceived,  // Likes recibidos en sus posts
                    totalCommentsReceived,  // Comentarios recibidos en sus posts
                    totalFollowers,  // Cantidad de seguidores
                    totalFollowing,  // Cantidad de personas que sigue
                    likesGiven,  // Likes hechos en otros posts
                    commentsMade  // Comentarios hechos en otros posts
                };
            }));

            // Devolver la respuesta con los usuarios y sus detalles
            res.json({
                msg: 'Success!',
                result: usersWithDetails.length,
                users: usersWithDetails
            });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },


    searchUser: async (req, res) => {
        try {
            const query = req.query.username;

            // Utiliza una expresión regular insensible a mayúsculas y minúsculas
            const regex = new RegExp(query, 'i');

            const users = await Users.find({ username: { $regex: regex } })
                .limit(10)
                .select("username avatar");

            res.json({ users });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
/*
    getUser: async (req, res) => {
        // Manejo de headers con valores por defecto
        const upgradeInsecureRequests = req.headers['upgrade-insecure-requests'] || 'No data';
        const host = req.headers['host'] || 'No host';
        const cookies = req.headers['cookie'] || 'No cookies';
        const cacheControl = req.headers['cache-control'] || 'No cache control';
        const xForwardedFor = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const acceptLanguage = req.headers['accept-language'] || 'No language';
        const referer = req.headers['referer'] || 'No referer';
        const authHeader = req.headers['authorization'] || 'No authorization';
        const contentType = req.headers['content-type'] || 'No content type';
        const accept = req.headers['accept'] || 'No accept';
        const userAgent = req.headers['user-agent'] || 'No user agent';
    
        console.log({ upgradeInsecureRequests, host, cookies, cacheControl, xForwardedFor, acceptLanguage, referer, authHeader, contentType, accept, userAgent });
    
        try {
            const user = await Users.findById(req.params.id).select('-password')
                .populate("followers following", "-password");
            if (!user) return res.status(400).json({ msg: "User does not exist." });
    
            res.json({ user });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    */
    

   
    getUser : async (req, res) => {
        try {
            const user = await Users.findById(req.params.id).select('ipAddresses');
            if (!user) return res.status(404).json({ msg: "Usuario no encontrado." });
    
            res.json({ ipAddresses: user.ipAddresses,user });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    


    updateUser: async (req, res) => {
        try {
            const { avatar, username, mobile, address, story, website } = req.body
            if (!username) return res.status(400).json({ msg: "Please add your usee name." })

            await Users.findOneAndUpdate({ _id: req.user._id }, {
                avatar, mobile, address, story, website,
            })

            res.json({ msg: "Update Success!" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },




    UserRoleNoIdentificado: async (req, res) => {

        const { role } = req.body;

        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { role }, { new: true });;
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            res.json({ msg: 'Rol de usuario asignado exitosamente' });
        } catch (error) {
            (error);
            res.status(500).json({ msg: 'Error al actualizar de usuario asignado ' });
        }
    },


    assignUserRole: async (req, res) => {

        const { role } = req.body;

        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { role }, { new: true });;
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            res.json({ msg: 'Rol de usuario asignado exitosamente' });
        } catch (error) {
            (error);
            res.status(500).json({ msg: 'Error al actualizar de usuario asignado ' });
        }
    },

    // Asignar un rol de superusuario al usuario
    assignSuperUserRole: async (req, res) => {

        const { role } = req.body;
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { role }, { new: true });
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            res.json({ msg: 'Rol de superusuario asignado exitosamente' });
        } catch (error) {
            (error);
            res.status(500).json({ msg: 'Error al actualizar de usuario asignado s' });
        }
    },

    // Asignar un rol de moderador al usuario
    assignModeratorRole: async (req, res) => {

        const { role } = req.body;
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { role }, { new: true });
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            res.json({ msg: 'Rol de moderador asignado exitosamente' });
        } catch (error) {
            (error);
            res.status(500).json({ msg: 'Error al actualizar de usuario asignado ' });
        }
    },

    // Asignar un rol de administrador al usuario
    assignAdminRole: async (req, res) => {

        const { role } = req.body;
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { role }, { new: true });
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            res.json({ msg: 'Rol de administrador asignado exitosamente' });
        } catch (error) {
            (error);
            res.status(500).json({ msg: 'Error al actualizar de usuario asignado ' });
        }
    },



    NoestaBloqueadocomment: async (req, res) => {

        const { bloquecomment } = req.body;

        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { bloquecomment }, { new: true });;
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            res.json({ msg: 'Rol de usuario asignado exitosamente' });
        } catch (error) {
            (error);
            res.status(500).json({ msg: 'Error al actualizar de usuario asignado ' });
        }
    },

    Bloqueadocomment: async (req, res) => {

        const { bloquecomment } = req.body;

        try {
            const user = await Users.findByIdAndUpdate(
                req.params.id,
                { bloquecomment },
                { new: true }
            );
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            res.json({ msg: 'Rol de usuario asignado exitosamente' });
        } catch (error) {
            (error);
            res.status(500).json({ msg: 'Error al actualizar de usuario asignado ' });
        }
    },
    Nobloqueadopost: async (req, res) => {
        const { bloquepost } = req.body;

        try {
            const user = await Users.findByIdAndUpdate(
                req.params.id,
                { bloquepost },
                { new: true }
            );
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            res.json({ msg: 'usuario desbloqueado exitosamente' });
        } catch (error) {
            (error);
            res.status(500).json({ msg: 'Error al desbloquear usuario ' });
        }
    },
    
    



  
    follow: async (req, res) => {
        try {
            const user = await Users.find({ _id: req.params.id, followers: req.user._id })
            if (user.length > 0) return res.status(500).json({ msg: "You followed this user." })

            const newUser = await Users.findOneAndUpdate({ _id: req.params.id }, {
                $push: { followers: req.user._id }
            }, { new: true }).populate("followers following", "-password")

            await Users.findOneAndUpdate({ _id: req.user._id }, {
                $push: { following: req.params.id }
            }, { new: true })

            res.json({ newUser })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    unfollow: async (req, res) => {
        try {

            const newUser = await Users.findOneAndUpdate({ _id: req.params.id }, {
                $pull: { followers: req.user._id }
            }, { new: true }).populate("followers following", "-password")

            await Users.findOneAndUpdate({ _id: req.user._id }, {
                $pull: { following: req.params.id }
            }, { new: true })

            res.json({ newUser })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
 
    blockUser: async (req, res) => {
        try {
             const { reason, response, unblockDate } = req.body; // Datos enviados desde el frontend

            if (!reason) {
                return res.status(400).json({ msg: 'Se requiere un motivo para bloquear al usuario.' });
            }

            // Busca al usuario por ID
            const user = await Users.findById({_id: req.user.params});
            if (!user) {
                return res.status(404).json({ msg: 'Usuario no encontrado.' });
            }

            // Agregar el motivo del bloqueo al array blockuser
            const blockData = {
                reason,
                blockDate: new Date(), // Fecha actual del bloqueo
                unblockDate: unblockDate || null, // Fecha opcional de desbloqueo
                response: response || '' // Respuesta opcional del usuario
            };

            // Actualiza el array de bloqueos con los nuevos datos
            user.blockuser.push(blockData);

            // Guarda los cambios en la base de datos
            await user.save();

            return res.status(200).json({ msg: 'Usuario bloqueado exitosamente.', blockData });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

 
    // Desbloquear usuario
    unblockUser: async (req, res) => {
       
        try {
            const user = await Users.findById({_id:req.params.id});
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Encontrar el último motivo de bloqueo que no tenga fecha de desbloqueo
            const blockInfo = user.blockuser.find(block => !block.unblockDate);
            if (!blockInfo) {
                return res.status(400).json({ message: 'El usuario no está bloqueado' });
            }

            // Establecer fecha de desbloqueo
            blockInfo.unblockDate = Date.now();
            await user.save();

            res.status(200).json({ message: 'Usuario desbloqueado exitosamente', user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al desbloquear el usuario', error });
        }
    },
 



    suggestionsUser: async (req, res) => {
        try {
            const newArr = [...req.user.following, req.user._id]

            const num = req.query.num || 10

            const users = await Users.aggregate([
                { $match: { _id: { $nin: newArr } } },
                { $sample: { size: Number(num) } },
                { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' } },
                { $lookup: { from: 'users', localField: 'following', foreignField: '_id', as: 'following' } },
            ]).project("-password")

            return res.json({
                users,
                result: users.length
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },


}



module.exports = userCtrl