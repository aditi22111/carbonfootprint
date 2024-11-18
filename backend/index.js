const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
 const ensureAuthenticated = require('./Middlewares/Auth');  

require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;

// Health check route
app.get('/ping', (req, res) => {
    res.send('PONG');
});

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/auth', AuthRouter);




// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
