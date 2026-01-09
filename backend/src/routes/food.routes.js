const express = require('express')
const router = express.Router();
const foodController = require('../controllers/food.controller.js')
const authMiddleware = require('../middlewares/auth.middleware.js')
const multer = require('multer')


const upload = multer({
    storage : multer.memoryStorage(),
})

// POST /api/food/  [protected]
router.post('/' , 
    authMiddleware.authFoodPartnerMiddleware ,
    upload.single("video") ,
    foodController.createFood)

// GET /api/food/  [protected]
router.get('/' , authMiddleware.authUserMiddleware , foodController.getFoodItems)


router.post('/like' , authMiddleware.authUserMiddleware , foodController.likeFoodItem)

router.post('/save' , authMiddleware.authUserMiddleware , foodController.saveFood)

router.get('/savedFoods' , authMiddleware.authUserMiddleware , foodController.getSavedFood)

module.exports = router;