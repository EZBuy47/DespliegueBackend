const router = require('express').Router();
const User = require('../models/User');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validate = require('./validate-token');

const schemaRegister = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    password: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    rol:Joi.string().required()
})

const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required(),
    password: Joi.string().min(6).max(255).required()
})

router.post('/loginUser', async (req, res) => {
    const { error } = schemaLogin.validate(req.body)

    if (error) {
        return res.send({ error: error.details[0].message })
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.send({error:'El Email no se encuentra registrado'})

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.send({error:'Contraseña no valida'})

    const token = jwt.sign({
        name: user.name,
        id: user._id,
        rol:user.rol
    }, process.env.TOKEN_SECRET);

    res.cookie('auth-token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    });
    res.header('auth-token',token)
    res.send({
        message: "success",
        token:token
    })
});

router.post('/logout',(req,res)=>{
    res.cookie('auth-token','',{
        maxAge:0
    });
    res.send('Success')
});

router.post('/register', async (req, res) => {

    const { error } = schemaRegister.validate(req.body);
    if (error) {
        return res.json(
            { error: error.details[0].message }
        )
    }
    const existeEmail = await User.findOne({ email: req.body.email })
    if (existeEmail) return res.send({ mensaje: false })

    const saltos = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, saltos);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password,
        rol:req.body.rol
    });
    try {
        res.send({ mensaje: true, name: user.name })
        const userDB = await user.save();

    } catch (error) {
        res.status(400).json({ error }).send(error)
    }
})
router.get('/allUsers',async(req,res)=>{
    const allUser = await User.find({});
    res.send(allUser)
});

module.exports = router;