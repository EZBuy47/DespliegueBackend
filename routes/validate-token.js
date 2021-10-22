const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const verifyToken = (req,res,next) =>{
    console.log(req)
    const token = req.cookies['auth-token'];
    if(!token) return res.send(false)

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next() // continuamos
    } catch (error) {
        res.send('Token no valido')
    }
}

module.exports = verifyToken;