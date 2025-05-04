const db = require('../database/pg.database');
const cloudinary =  require("cloudinary");
cloudinary.config({ 
    cloud_name: 'drm5dmz1y', 
    api_key: '324884558852625', 
    api_secret: 'I0ofYtglG27-NqszhcDVXk_IvsE'
});
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();

exports.createGame = async(req) => {
    try {
        if(req.file) {
            const image = req.file;
            const imageBase64 = "data:"+image.mimetype+";base64,"+image.buffer.toString('base64');
            const i = imageBase64.toString();
            const file64 = parser.format(i, req.file.buffer);
            const result = await cloudinary.v2.uploader.upload(file64.content);
            const res = await db.query(
                "INSERT INTO games (name, price, image_url, stock, store_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
                [req.body.name, req.body.price, result.url, req.body.stock, req.body.store_id]
            );
            return res.rows[0];
        } else {
            const res = await db.query(
                "INSERT INTO games (name, price, stock, store_id) VALUES ($1, $2, $3, $4) RETURNING *;",
                [req.body.name, req.body.price, req.body.stock, req.body.store_id]
            );
            return res.rows[0];
        }
    } catch (error) {
        console.log("Error qry ", error);
    }
}


exports.getAllGame = async() => {
    try {
        const res = await db.query(
            "SELECT * FROM games;"
        );
        return res.rows;
    } catch (error) {
        console.log("Error qry ", error);
    }
}


exports.getById = async(id) => {
    try {
        const res = await db.query(
            "SELECT * FROM games WHERE id = ($1);",
            [id]
        );
        console.log(res.rows.length);
        return res.rows;
    } catch (error) {
        console.log("Error qry ", error);
    }
}


exports.updateGame = async(req) => {
    try {
        if(req.file) {
            const image = req.file;
            const imageBase64 = "data:"+image.mimetype+";base64,"+image.buffer.toString('base64');
            const i = imageBase64.toString();
            const file64 = parser.format(i, req.file.buffer);
            const result = await cloudinary.v2.uploader.upload(file64.content);
            const res = await db.query(
                "UPDATE games SET name = ($1), price = ($2), image_url = ($3), stock = ($4), store_id = ($5) WHERE id = ($6) RETURNING *;",
                [req.body.name, req.body.price, result.url, req.body.stock, req.body.store_id, req.body.id]
            );
            return res.rows[0];
        } else {
            const res = await db.query(
                "UPDATE games SET name = ($1), price = ($2), image_url = ($3), stock = ($4), store_id = ($5) WHERE id = ($6) RETURNING *;",
                [req.body.name, req.body.price, result.url, req.body.stock, req.body.store_id, req.body.id]
            );
            return res.rows[0];
        }
    } catch (error) {
        console.log("Error qry ", error);
    }
}


exports.deleteGame = async(id) => {
    try {
        const res = await db.query(
            "DELETE FROM games WHERE id = ($1) RETURNING *;",
            [id]
        );
        return res.rows;
    } catch (error) {
        console.log("Error qry ", error);
    }
}


exports.purchaseGame = async(i) => {
    try {
        const game = await db.query(
            "SELECT price FROM games where id = ($1);",
            [i.game_id]
        );
        if(!game) {
            return {status:"game"}
        };

        const user = await db.query(
            "SELECT balance FROM users where id = ($1);",
            [i.user_id]
        );
        if(!user) {
            return {status:"user"}
        };

        if(game.rows[0].price > user.rows[0].balance) {
            return {status: "balance"}
        }

        const balance = await db.query(
            "UPDATE users SET balance = balance - ($1) WHERE id = ($2) RETURNING *;",
            [game.rows[0].price, i.user_id]
        );

        const res = await db.query(
            "INSERT INTO library (user_id, game_id) VALUES ($1, $2) RETURNING *;",
            [i.user_id, i.game_id]
        );
        return res.rows[0];
    } catch (error) {
        console.log("Error qry ", error);
    }
}


exports.refundGame = async(i) => {
    try {
        const game = await db.query(
            "SELECT price FROM games where id = ($1);",
            [i.game_id]
        );
        if(!game) {
            return {status:"game"}
        };

        const user = await db.query(
            "SELECT balance FROM users where id = ($1);",
            [i.user_id]
        );
        if(!user) {
            return {status:"user"}
        };

        let refund = Math.round(game.rows[0].price*0.8);


        const balance = await db.query(
            "UPDATE users SET balance = balance + ($1) WHERE id = ($2) RETURNING *;",
            [refund, i.user_id]
        );
        
        const res = await db.query(
            "DELETE FROM library WHERE user_id = ($1) AND game_id = ($2) RETURNING *;",
            [i.user_id, i.game_id]
        );
        return res.rows[0];
    } catch (error) {
        console.log("Error qry ", error);
    }
}