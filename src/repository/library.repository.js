const db = require('../database/pg.database');

exports.getAllLibraries = async() => {
    try {
        const res = await db.query("SELECT * FROM library;");
        return res.rows;
    } catch (error) {
        console.log("Error qry ", error);
    }
}

exports.getLibraryByUser = async(id) => {
    try {
        const res = await db.query(
            "SELECT users.id, games.id, username, games.name, image_url FROM library INNER JOIN users ON users.id = ($1) INNER JOIN games on games.id = game_id;",
            [id]
        );
        console.log(res.rows);
        return res.rows;
    } catch (error) {
        console.log("Error qry ", error);
    }
}


exports.deleteLibraryByUser = async(id) => {
    try {
        const res = await db.query(
            "DELETE FROM library WHERE user_id = ($1) RETURNING *;",
            [id]
        );
        return res.rows[0];
    } catch (error) {
        console.log("Error qry ", error);
    }
}