const router = require('express').Router()
const postCtrl = require('../controllers/postCtrl');
const provaCtrl = require('../controllers/provaCtrl.');
const auth = require('../middleware/auth')

router.post('/crearpostpendiente', auth, postCtrl.createPostPendiente);
router.get('/countpostspendientes', auth, postCtrl.countPostsPendientes)
router.get('/countposts', auth, postCtrl.countPosts)
router.get('/getpostspendientes', auth, postCtrl.getPostsPendientesss);


router.get('/user/:id/count-posts', auth, postCtrl.counTotalPostsUserCtrl);

router.patch('/aprovarpost/:id/aprovado', auth, postCtrl.aprovarPostPendiente);
router.route('/posts')

    .get(auth, postCtrl.getPosts)

router.route('/post/:id')
    .patch(auth, postCtrl.updatePost)
    .get(auth, postCtrl.getPost)
    .delete(auth, postCtrl.deletePost)

router.patch('/post/:id/like', auth, postCtrl.likePost)

router.patch('/post/:id/unlike', auth, postCtrl.unLikePost)

router.get('/user_posts/:id', auth, postCtrl.getUserPosts)

router.get('/post_discover', auth, postCtrl.getPostsDicover)

router.patch('/savePost/:id', auth, postCtrl.savePost)

router.patch('/unSavePost/:id', auth, postCtrl.unSavePost)

router.get('/getSavePosts', auth, postCtrl.getSavePosts)
router.get('/prova', auth, provaCtrl.creatProva)

module.exports = router