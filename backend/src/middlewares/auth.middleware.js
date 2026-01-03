const foodPartnerModle = require('../models/foodpartner.model.js')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model.js')

async function authFoodPartnerMiddleware(req , res , next) {
    const token = req.cookies.token;

    if(!token){
        return res.status(401)
        .json({
            message : " Pleas login as a food partner"
        })
    }

    try {
        
        const decoded = jwt.verify(token , process.env.JWT_SECRET)

        const foodPartner = await foodPartnerModle.findById(decoded.id)

        req.foodPartner = foodPartner

        next();


    } catch (error) {
        return res.status(401)
        .json({
            message : "Invalid User"
        })
    }

}

async function authUserMiddleware(req , res , next) {
    const token = req.cookies.token;

    if(!token){
        return res.status(401)
        .json({
            message: "Please login first",
        })
    }

    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        req.user = user;
        next();

    } catch (error) {
        return res.status(401)
        .json({
            message: "Invalid Token",
        })
    }
}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware,

}