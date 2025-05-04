const libraryController = require('../controllers/library.controller');
const express = require('express');
const router = express.Router();

router.get('/getAll', libraryController.getAllLibraries);
router.get('/:id', libraryController.getLibraryByUser);
router.delete('/:id', libraryController.deleteLibraryByUser);

module.exports = router;