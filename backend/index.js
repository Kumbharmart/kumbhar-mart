const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const connectDB = require('./config/db');
const router = require('./routes'); 
const app = express();

require('dotenv').config();

const fs = require('fs');

app.use(cors({
    origin: ['https://kumbharmart.com', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies and other credentials
}));

// router.get('/health', (req, res) => {
//     res.status(200).json({ message: 'Server is healthy' });
// });

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", router); // Mounting the router correctly on the '/api' pat

app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

const PORT = process.env.PORT;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Connected to DB");
        console.log(`Server is running on port ${PORT}`);
    });
    
});
