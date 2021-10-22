const express = require('express');
const mongoose = require('mongoose');
const MongoCliente = require('mongodb').MongoClient;
const cors = require('cors');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');

var corsOptions = {
    credentials:true,
    origin: '*', // Reemplazar con dominio
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

require('dotenv').config()

const app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
// capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Conexión a Base de datos
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.ueatq.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
mongoose.connect(uri,
    {useUnifiedTopology: true }
)
.then(() => console.log('Base de datos conectada'))
.catch(e => console.log('error db:', e))

// import routes
const authRoutes = require('./routes/auth');
const admin = require('./routes/admin');
const verifyToken = require('./routes/validate-token');
const products = require('./routes/products');
const compras= require('./routes/compras');
const colsuAdmin = require ('./routes/colsuAdmin');

// route middlewares
app.use(cookieParser());
app.use('/api/user',authRoutes);
app.use('/api/admin', admin);
app.use('/api/product', products);
app.use('/api/compras', compras);
app.use('/api/colsuAdmin', colsuAdmin);
app.use(cors(corsOptions));

// iniciar server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`servidor andando en: ${PORT}`)
})
app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'funciona!',
        port:PORT
    })
});