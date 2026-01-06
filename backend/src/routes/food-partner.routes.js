const express = require('express')
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware.js')
const foodPartnerController = require('../controllers/food-partner.controler.js')

// /api/food-partner/:id
router.get('/:id' ,
    authMiddleware.authUserMiddleware ,
    foodPartnerController.getFoodPartnerById
)

module.exports = router;