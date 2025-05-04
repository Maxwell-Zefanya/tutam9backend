const express = require('express');
require('dotenv').config;

const app = express();
const PORT = process.env.PORT || 3000;

// Cloudinary
const cloudinary =  require("cloudinary");


// CORS
const cors = require("cors");
const corsOptions = {
    methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
});

app.use(express.json());
app.use('/games', require('./src/routes/games.routes'));
app.use('/users', require('./src/routes/users.routes'));
app.use('/library', require('./src/routes/library.routes'));

const server = app.listen(PORT, () => {
    console.log('Run Port', PORT);
});

// NeonDB
const http = require("http");
const { neon } = require("@neondatabase/serverless");
const sql = neon(process.env.DATABASE_URL);

