//------------------------IMPORTS-----------------------------------
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const { verifyToken } = require('./src/middlewares/auth-verification');
const auth_routes = require('./src/routes/auth.routes');

// ------------------------------------------------------------------


const mongoDb = 'mongodb+srv://ecommerce:!!d4TnTxmsDCMR2@cluster0.0hlhe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const app = express();

// Using Mongoose to Connect with MongoDb
mongoose.connect(mongoDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true }).then(()=>{
    console.log('Database connected successfully');
})

app.use(bodyParser.urlencoded({
    extended : true
}))

app.use(bodyParser.json({
    limit: "100mb"
}));

// Handle Cors Error
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

app.use(cors());

// **Routes

app.use('/images',express.static(path.join('assets/images')))
app.use('/files',express.static(path.join('assets/files')))

app.use('/api',auth_routes);

// Verify token on every post request
app.post('*',verifyToken,(req,res,next)=>{
    next();
})


module.exports = app;