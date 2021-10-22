const router = require('express').Router();
const Joi = require('@hapi/joi');
const Product = require('../models/product')

const ProductSchema = Joi.object({
    name: Joi.string().required(),
    reference: Joi.string().required(),
    price: Joi.string().required(),
    description: Joi.string().required(),
    cuantity: Joi.string().required(),
    idUser: Joi.string().required(),
    nameU: Joi.string().required()
});

router.post('/addproduct', async (req, res) => {
    
    const { error } = ProductSchema.validate(req.body);
    if (error) {
        return res.json(
            { error: error.details[0].message },
            console.log(error)
        )
    }
    console.log("Aqui...")
    const product = new Product({
        name: req.body.name,
        reference: req.body.reference,
        price: req.body.price,
        description: req.body.description,
        cuantity: req.body.cuantity,
        idUser: req.body.idUser,
        nameU:req.body.nameU
    });
    try {
        res.send({ mensaje: true })
        const productDB = await product.save();
    } catch (error) {
        res.status(400).json({ error }).send(error)
    }
    console.log(product)
})
router.post('/myProducts', async (req, res) => {
    const myproducts = await Product.find({ idUser: req.body.idUser });
    console.log(myproducts)
    res.send(myproducts)
});
router.put('/update/:id', async (req, res) => {
    const idProduct = req.params.id;
    const product = await Product.findOneAndUpdate({ _id: idProduct },
        {
            $set: {
                name: req.body.name,
                reference: req.body.reference,
                price: req.body.price,
                description: req.body.description,
                cuantity: req.body.cuantity,
                idUser: req.body.idUser
            }
        }).then(result=>{
            console.log("Actualizacion Completa")
            res.send({mensaje:true})
        })
});
router.get('/product/:id', async(req,res)=>{
    const idProduct = req.params.id;
    const product = await Product.findOne({_id:idProduct})
    console.log(product)
    res.send(product);
});
router.delete('/delete/:id', async(req,res)=>{
    const idProduct = req.params.id;
    const product = await Product.findOneAndDelete({_id:idProduct})
    res.send({mensaje:true})
});
router.get('/allProducts', async(req,res)=>{
    const allProducts = await Product.find({});
    res.send(allProducts)
});
module.exports = router;