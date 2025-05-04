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
            "SELECT game_id FROM library WHERE user_id = ($1);",
            [id]
        );
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