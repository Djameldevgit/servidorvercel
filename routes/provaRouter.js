const router = require('express').Router()

const provaCtrl = require('../controllers/provaCtrl.');
const auth = require('../middleware/auth')



router.post('/prova', auth, provaCtrl.creatProva)
router.get('/getprovas', auth, provaCtrl.getProvas)
router.patch('/prova/:id',auth, provaCtrl.editProva); // Sin el middleware auth temporalmente

module.exports = router