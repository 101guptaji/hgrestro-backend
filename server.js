const express = require('express');
const app = express();

require("dotenv").config();
const cors = require('cors')

// Initialize the server and connect to the database
require('./db/connection');

// Middleware to parse the request body as JSON
app.use(express.json());

// Middleware to enable CORS (Cross-Origin Resource Sharing) for all requests to the server from client applications
app.use(cors());

app.get('/', (req, res) => {
    res.send("Hello HG");
})

// Use the workout router for all requests to the /api/order path
const orderRouter = require('./route/orderRoute');
app.use("/api/order", orderRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})