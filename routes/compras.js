const router = require('express').Router();
const compras = require('../models/compras');
const Compra = require('../models/compras');

router.post('/addCompra',async(req,res)=>{
    console.log(req.body)
    const compra = new Compra({
        nameVendedor:req.body.nameVendedor,
        idVendedor:req.body.idVendedor,
        idProduct:req.body.idProduct,
        nameComprador:req.body.nameComprador,
        idComprador:req.body.idComprador,
        CantidadComprada: req.body.CantidadComprada,
        TotalPago: req.body.TotalPago
    });
    try {
        res.send({ mensaje: true })
        const compraDB = await compra.save();
    } catch (error) {
        res.status(400).json({ error }).send(error)
    }
});
router.post('/misCompras',async(req,res)=>{
    const misCompras = await compras.find({ idComprador: req.body.idUser });
    console.log(misCompras)
    res.send(misCompras) 
});
router.get('/allCompras',async(req,res)=>{
    const allCompras = await compras.find({});
    res.send(allCompras)
});


module.exports = router;