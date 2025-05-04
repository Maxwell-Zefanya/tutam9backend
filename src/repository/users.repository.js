const db = require('../database/pg.database');

exports.registerUser = async(user) => {
    try {
        const search = await db.query(
            "SELECT username FROM users WHERE email = ($1) OR username = ($2);",
            [user.email, user.name]
        );
        if(search.rows.length !== 0) {
            return search.rows[0];
        }
        const res = await db.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;",
            [user.name, user.email, user.password]
        );
        return res.rows[0];
    } catch (error) {
        console.log("Error qry ", error);
    }
}

exports.loginUser = async(email) => {
    try {
        const res = await db.query(
            "SELECT password FROM users WHERE email = ($1);",
            [email]
        );
        return res.rows[0];
    } catch (error) {
        console.log("Error qry ", error);
    }
}

exports.getEmail = async(email) => {
    try {
        const res = await db.query(
            "SELECT id, username, email, join_date, balance, profile_picture FROM users WHERE email = ($1);",
            [email]
        );
        return res.rows[0];
    } catch (error) {
        console.log("Error qry ", error);
    }
}

exports.updateUser = async(user) => {
    try {
        const search = await db.query(
            "SELECT username FROM users WHERE username = ($2);",
            [user.email, user.name]
        );
        if(search.rows.length !== 0) {
            return search.rows[0];
        }
        const res = await db.query(
            "UPDATE users SET username = ($1), email = ($2), password = ($3) WHERE id = ($4) RETURNING *;",
            [user.name, user.email, user.password, user.id]
        );
        return res.rows[0];
    } catch (error) {
        console.log("Error qry ", error);
    }
}

exports.deleteUser = async(id) => {
    try {
        const res = await db.query(
            "DELETE FROM users WHERE id = ($1) RETURNING *;",
            [id]
        );
        return res.rows[0];
    } catch (error) {
        console.log("Error qry ", error);
    }
}

exports.topUpUser = async(user) => {
    try {
        const res = await db.query(
            "UPDATE users SET balance = balance + ($1) WHERE id = ($2) RETURNING *;",
            [user.amount, user.id]
        );
        return res.rows[0];
    } catch (error) {
        console.log("Error qry ", error);
    }
}