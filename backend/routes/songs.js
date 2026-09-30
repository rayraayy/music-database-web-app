const express = require('express');
const router = express.Router();
const controller = require('../controllers/songsController');

router.get('/', controller.getAllSongs);
router.get('/:id', controller.getSongById);
router.post('/', controller.createSong);
router.put('/:id', controller.updateSong);
router.patch('/:id', controller.updateSong);
router.delete('/:id', controller.deleteSong);

module.exports = router;
