const Posts = require('../models/postModel')
const Comments = require('../models/commentModel')
const Users = require('../models/userModel')

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

const postCtrl = {
    createPostPendiente: async (req, res) => {
        try {
            const {
                content,
                optionservice,
                direccion,
                wilaya,
                commune,
                specifications,
                discripcion,
                pricesala,
                negociable,
                nomprenom,
                telefono,
                email,
                web,
                informacion,
                comentarios, lat,
                lang,
                images


            } = req.body;

            // Verificar que se haya seleccionado el contenido (Salle de fête o Servicio)
            if (!content) {
                return res.status(400).json({ msg: "Veuillez sélectionner un contenu pour l'annonce (Salle ou Service)." });
            }

            // Verificar que se haya añadido al menos una imagen
            if (images.length === 0) {
                return res.status(400).json({ msg: "Veuillez ajouter une photo." });
            }

            // Verificar que se haya proporcionado la dirección
            if (!direccion) {
                return res.status(400).json({ msg: "Veuillez fournir une adresse." });
            }

            // Verificar que se haya proporcionado el nom et prénom
            if (!nomprenom) {
                return res.status(400).json({ msg: "Veuillez fournir le nom et prénom du propriétaire." });
            }

            // Verificar que se haya proporcionado el teléfono
            if (!telefono) {
                return res.status(400).json({ msg: "Veuillez fournir un numéro de téléphone." });
            }

            // Verificar que se haya proporcionado el email
            if (!email) {
                return res.status(400).json({ msg: "Veuillez fournir une adresse e-mail." });
            }

            // Crear nuevo post con el estado 'pendiente'
            const newPost = new Posts({
                estado: 'pendiente',
                content,
                optionservice,
                direccion,
                wilaya,
                commune,
                specifications,
                discripcion,
                pricesala,
                negociable,
                nomprenom,
                telefono,
                email,
                web,
                informacion,
                comentarios,
                images,
                user: req.user._id,
                lat,
                lang
            });

            // Guardar el post con writeConcern para asegurar la escritura
            await newPost.save({ writeConcern: { w: "majority" } });

            res.json({
                msg: "Votre publication 'Salle des fêtes' a été créée et envoyée aux administrateurs pour validation. Vous recevrez une notification une fois approuvée.",
                newPost: {
                    ...newPost._doc,
                    user: req.user,
                }
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },


    countPosts: async (req, res) => {
        try {
            const countposts = await Posts.countDocuments()
            res.json({
                msg: "liste des publication general",
                result: countposts.length,
                countposts
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    countPostsPendientes: async (req, res) => {
        try {
            const countpostspendientes = await Posts.countDocuments({ estado: 'pendiente' })
            res.json({
                msg: "liste des publication en attend.",
                result: countpostspendientes.length,
                countpostspendientes
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },


    getPostsPendientesss: async (req, res) => {


        try {
            const features = new APIfeatures(Posts.find({ estado: 'pendiente' }), req.query).paginating();

            const posts = await features.query
                .sort('-createdAt')
                .populate("user likes", "avatar username followers")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                });

            res.json({
                msg: "Votre publication a été publiée avec succès.",
                result: posts.length,
                posts
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },




    aprovarPostPendiente: async (req, res) => {
        try {
            const post = await Posts.findById(req.params.id);
            if (!post) return res.status(404).json({ msg: 'Publicación no encontrada' });

            post.estado = 'aprovado';
            await post.save();
            // Envia el _id del post aprobado en la respuesta
            res.json({ msg: 'Poste approuvé!', _id: post._id });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    getPosts: async (req, res) => {
        try {

            const {
                ventalocation, content, wilaya, commune, minpriciosala, maxpriciosala,
            } = req.query;

            let query = { estado: 'aprovado' }; // Agregar la condición del ID de usuario



            if (ventalocation) {
                query.salaservicio = ventalocation;
            }
            if (content) {
                query.content = { $regex: new RegExp(content, 'i') }; // Expresión regular para buscar contenido
            }

            if (minpriciosala && maxpriciosala) {
                query.pricesala = { $gte: minpriciosala, $lte: maxpriciosala };
            }


            if (wilaya) {
                query.wilaya = wilaya.toUpperCase(); // o toLowerCase()
            }

            if (commune) {
                query.commune = commune.toUpperCase(); // o toLowerCase()
            }







            const features = new APIfeatures(Posts.find(query), req.query).paginating()//(user:  req.user._id)

            const posts = await features.query

                .sort('-createdAt')
                .populate("user likes", "avatar username   followers")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                });

            res.json({
                msg: 'Success!',
                result: posts.length,
                posts
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    updatePost: async (req, res) => {
        try {
            const {

                content,
                optionservice,
                direccion,
                wilaya,
                commune,
                specifications,
                discripcion,
                pricesala,
                negociable,
                nomprenom,
                telefono,
                email,
                web,
                informacion,
                comentarios,

                lat,
                lang, images } = req.body

            const post = await Posts.findOneAndUpdate({ _id: req.params.id }, {
                content,
                optionservice,
                direccion,
                wilaya,
                commune,
                specifications,
                discripcion,
                pricesala,
                negociable,
                nomprenom,
                telefono,
                email,
                web,
                informacion,
                comentarios,
                estado: 'pendiente',
                lat,
                lang, images
            }).populate("user likes", "avatar username  ")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                })

            res.json({
                msg: "su publicacion ha sido actualizada y enviada de nuevo a revision!",
                newPost: {
                    ...post._doc,
                    content, images
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    likePost: async (req, res) => {
        try {

            const post = await Posts.find({ _id: req.params.id, likes: req.user._id })
            if (post.length > 0) return res.status(400).json({ msg: "You liked this post." })

            const like = await Posts.findOneAndUpdate({ _id: req.params.id }, { $push: { likes: req.user._id } }, { new: true }  
          
           
                );


if (!like) return res.status(400).json({ msg: 'This post does not exist.' })

res.json({ msg: 'Liked Post!' })

        } catch (err) {
    return res.status(500).json({ msg: err.message })
}
    },
unLikePost: async (req, res) => {
    try {

        const like = await Posts.findOneAndUpdate({ _id: req.params.id }, { $pull: { likes: req.user._id } }, { new: true })

        if (!like) return res.status(400).json({ msg: 'This post does not exist.' })

        res.json({ msg: 'UnLiked Post!' })

    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
},
    getUserPosts: async (req, res) => {
        try {
            const features = new APIfeatures(Posts.find({ user: req.params.id }), req.query)
                .paginating()
            const posts = await features.query.sort("-createdAt")

            res.json({
                posts,
                result: posts.length
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
        getPost: async (req, res) => {
            try {
                const post = await Posts.findById(req.params.id)
                    .populate("user likes", "avatar username   followers")
                    .populate({
                        path: "comments",
                        populate: {
                            path: "user likes",
                            select: "-password"
                        }
                    })

                if (!post) return res.status(400).json({ msg: 'This post does not exist.' })

                res.json({
                    post
                })

            } catch (err) {
                return res.status(500).json({ msg: err.message })
            }
        },
            getPostsDicover: async (req, res) => {
                try {

                    const newArr = [...req.user.following, req.user._id]

                    const num = req.query.num || 9

                    const posts = await Posts.aggregate([
                        { $match: { user: { $nin: newArr } } },
                        { $sample: { size: Number(num) } },
                    ])

                    return res.json({
                        msg: 'Success!',
                        result: posts.length,
                        posts
                    })

                } catch (err) {
                    return res.status(500).json({ msg: err.message })
                }
            },
                deletePost: async (req, res) => {
                    try {
                        const post = await Posts.findOneAndDelete({ _id: req.params.id, user: req.user._id })
                        await Comments.deleteMany({ _id: { $in: post.comments } })

                        res.json({
                            msg: 'Deleted Post!',
                            newPost: {
                                ...post,
                                user: req.user
                            }
                        })

                    } catch (err) {
                        return res.status(500).json({ msg: err.message })
                    }
                },
                    savePost: async (req, res) => {
                        try {
                            const user = await Users.find({ _id: req.user._id, saved: req.params.id })//_id: req.user._id  estás comprobando si el ID del usuario que hace la solicitud coincide con el _id de algún documento en la colección Users.
                            if (user.length > 0) return res.status(400).json({ msg: "You saved this post." })

                            const save = await Users.findOneAndUpdate({ _id: req.user._id }, {
                                $push: { saved: req.params.id }
                            }, { new: true })

                            if (!save) return res.status(400).json({ msg: 'This user does not exist.' })

                            res.json({ msg: 'Saved Post!' })

                        } catch (err) {
                            return res.status(500).json({ msg: err.message })
                        }
                    },
                        unSavePost: async (req, res) => {
                            try {
                                const save = await Users.findOneAndUpdate({ _id: req.user._id }, {
                                    $pull: { saved: req.params.id }
                                }, { new: true })

                                if (!save) return res.status(400).json({ msg: 'This user does not exist.' })

                                res.json({ msg: 'unSaved Post!' })

                            } catch (err) {
                                return res.status(500).json({ msg: err.message })
                            }
                        },
                            getSavePosts: async (req, res) => {
                                try {
                                    const features = new APIfeatures(Posts.find({
                                        _id: { $in: req.user.saved }
                                    }), req.query).paginating()

                                    const savePosts = await features.query.sort("-createdAt")

                                    res.json({
                                        savePosts,
                                        result: savePosts.length
                                    })

                                } catch (err) {
                                    return res.status(500).json({ msg: err.message })
                                }
                            },






                                counTotalPostsUserCtrl: async (req, res) => {
                                    try {
                                        const counTotalPostsUser = await Posts.countDocuments({ user: req.user.id });
                                        db.posts.find({ user: ObjectId("67150d64bf067216641eb3b9") })

                                        // Verificar si se está encontrando algo

                                        res.json({
                                            msg: "Número de posts por usuario",
                                            counTotalPostsUser
                                        });

                                    } catch (err) {
                                        return res.status(500).json({ msg: err.message });
                                    }
                                }











}

module.exports = postCtrl