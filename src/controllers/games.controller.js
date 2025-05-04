const gamesRepository = require('../repository/games.repository');
const r = require('../utils/utils');
const cloudinary =  require("cloudinary");
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
});


exports.createGame = async (req, res) => {
    if(!req.file) {
        console.log("Image file is not available. Using default image...");
    }
    try {
        const item = await gamesRepository.createGame(req);
        r.resp(res, true, 200, "Game created", item);
    } catch (error) {
        r.resp(res, false, 500, "Error creating game", error);
    }
}


exports.getAllGame = async (req, res) => {
    try {
        const item = await gamesRepository.getAllGame();
        if (item.length < 1)
        {
            r.resp(res, false, 404, "Game not found", null);
        } else {
            r.resp(res, true, 200, "Game retrieved", item);
        }
    } catch (error) {
        r.resp(res, false, 500, "Error retrieving game", error);
    }
}


exports.getById = async (req, res) => {
    try {
        const item = await gamesRepository.getById(req.params.id);
        if (item.length < 1)
        {
            r.resp(res, false, 404, "Game not found", null);
        } else {
            r.resp(res, true, 200, "Game retrieved", item);
        }
    } catch (error) {
        r.resp(res, false, 500, "Error retrieving game", error);
    }
}



exports.updateGame = async (req, res) => {
    try {
        const item = await gamesRepository.updateGame(req);
        if (!item)
        {
            r.resp(res, false, 404, "Game not found", null);
        } else {
            r.resp(res, true, 200, "Game updated", item);
        }
    } catch (error) {
        r.resp(res, false, 500, "Error updating game", error);
    }
}




exports.deleteGame = async (req, res) => {
    try {
        const item = await gamesRepository.deleteGame(req.params.id);
        if (!item)
        {
            r.resp(res, false, 404, "Game not found", null);
        } else {
            r.resp(res, true, 200, "Game deleted", item);
        }
    } catch (error) {
        r.resp(res, false, 500, "Error deleting game", error);
    }
}


exports.purchaseGame = async (req, res) => {
    try {
        const item = await gamesRepository.purchaseGame(req.body);
        if (item.status === "balance") {
            r.resp(res, false, 401, "Not enough balance", null);
        } else if (item.status === "user") {
            r.resp(res, false, 404, "User not found", null);
        } else if (item.status === "game") {
            r.resp(res, false, 404, "Game not found", null);
        } else {
            r.resp(res, true, 200, "Game purchased", item);
        }
    } catch (error) {
        r.resp(res, false, 500, "Error purchasing game", error);
    }
}


exports.refundGame = async (req, res) => {
    try {
        const item = await gamesRepository.refundGame(req.body);
        if (item.status === "user") {
            r.resp(res, false, 404, "User not found", null);
        } else if (item.status === "game") {
            r.resp(res, false, 404, "Game not found", null);
        } else {
            r.resp(res, true, 200, "Game successfully refunded", item);
        }
    } catch (error) {
        r.resp(res, false, 500, "Error refunding game", error);
    }
}