const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {
    const token = req.body.cook;
    if(!token) return res.send(false)

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        if(verified.rol=="Admin"){
            res.send(true)
        }
        else{
            res.send({mensaje:false})
        }
    } catch (error) {
        res.send(false)
    }
})

module.exports = router