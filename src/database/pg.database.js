require("dotenv").config();

const { Pool } = require("pg");

// Ganti sesuai db
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },

});

const query = async (texts, params, mode = -1) => {
    let client;
    try {
        // Koneksi mulai saat query saja dan dilepas setelah query selesai
        // Tipe data mode adalah integer & digunakan oleh function repository yang memanggil query() berkali-kali
        // -1 = Mulai query pertama (default value)
        // 0 = Mulai query kedua dst.
        // 1 = Mulai query terakhir
        if(mode === -1) {
            client = await pool.connect();
        }
        const res = await pool.query(texts, params);
        return res;
    } catch (error) {
        console.error("Query error.", error);
    } finally {
        if(client && (mode !== 0)) {
            client.release();
        }
    }
}

module.exports = {
    query
}