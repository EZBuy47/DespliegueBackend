const express = require('express');
const mongoose = require('mongoose');
const MongoCliente = require('mongodb').MongoClient;
const cors = require('cors');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

var corsOptions = {
    credentials: true,
    origin: '*', // Reemplazar con dominio
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

require('dotenv').config()
const User=require("./models/User");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    rol:{
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    googleId: String,
    secret: String,
    alreadyRegistered: { type: Boolean, default: false }
})
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
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
app.use(passport.initialize());
// Conexión a Base de datos
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.ueatq.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
mongoose.connect(uri,
    { useUnifiedTopology: true }
)
    .then(() => console.log('Base de datos conectada'))
    .catch(e => console.log('error db:', e))

// import routes
const authRoutes = require('./routes/auth');
const admin = require('./routes/admin');
const verifyToken = require('./routes/validate-token');
const products = require('./routes/products');
const compras = require('./routes/compras');
const colsuAdmin = require('./routes/colsuAdmin');

// route middlewares
app.use(cookieParser());
app.use('/api/user', authRoutes);
app.use('/api/admin', admin);
app.use('/api/product', products);
app.use('/api/compras', compras);
app.use('/api/colsuAdmin', colsuAdmin);
app.use(cors(corsOptions));

// iniciar server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`servidor andando en: ${PORT}`)
})
app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'funciona!',
        port: PORT
    })
});

const UserGoogle = new mongoose.model("UserGoogle", userSchema);
passport.use(UserGoogle.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
    console.log(user)
});
passport.deserializeUser(function (id, done) {
    UserGoogle.findById(id, function (err, user) {
        done(err, user);
    });
});
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/google/callback",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
    function (accessToken, refreshToken, profile, cb) {
        setCurrentEmail(profile.emails[0].value);
        setCurrentName(profile.displayName);
        UserGoogle.findOrCreate({ googleId: profile.id, username: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));
var Currentemail;
var CurrentName;
function setCurrentEmail(word){
    Currentemail=word;
    console.log(Currentemail);
   }
function setCurrentName(word2){
    CurrentName=word2;
    console.log(CurrentName);
   }

app.get("/obtainnameemail",(req,res)=>{
    res.send({name:CurrentName,email:Currentemail});

})
app.get("/auth/google", passport.authenticate("google", { scope: ['profile', 'email'] }));
var currentUserId = "";

function setCurrentUserId(word) {
    currentUserId = word;
    console.log("PRE TESTING:" + currentUserId);
}
var currentEstado;
function setEstado(word){currentEstado=word;}
app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "http://localhost:3000" }),
    function (req, res) {
        // Successful authentication, redirect secrets.
        /*if(!req.user.alreadyRegistered)res.redirect(`http://localhost:3000/Register/${req.user._id}`);*/
        res.redirect('http://localhost:3000/LoginGoogle');
        
        console.log("Exito")
    });

app.get('/obtainstate',(req,res)=>{
    res.send(currentEstado);
    console.log("ESTADO"+currentEstado)
})

app.get('/currentuserid', (req, res) => {
    res.send(currentUserId);
})