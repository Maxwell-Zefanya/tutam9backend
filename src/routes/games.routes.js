const express = require('express');
const multer = require('multer');
const gamesController = require('../controllers/games.controller');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/create', upload.single('image'), gamesController.createGame);
router.get('/', gamesController.getAllGame);
router.get('/byId/:id', gamesController.getById);
router.put('/',upload.single('image'), gamesController.updateGame);
// router.delete('/:id', gamesController.deleteGame);
router.post('/purchase', gamesController.purchaseGame);
router.delete('/refund', gamesController.refundGame);

module.exports = router;