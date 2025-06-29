// This file initializes the Express app, sets up middleware, and connects to the PostgreSQL database.

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./db/connection');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
const PORT = process.env.APPLICATION_PORT || 3000;

app.use(cors());

// Middleware
app.use(bodyParser.json());

// Connect to the database
connectDB();

// Set up routes
app.use('/', todoRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});