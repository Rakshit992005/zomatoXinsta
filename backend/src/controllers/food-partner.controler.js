const foodPartnerModel = require('../models/foodpartner.model.js');
const foodItemModel = require('../models/food.model.js');

async function getFoodPartnerById(req, res) {
    const foodPartnerId = req.params.id;
    const foodPartner = await foodPartnerModel.findById(foodPartnerId);

    if (!foodPartner) {
        return res.status(404).json({ message: 'Food partner not found' });
    }

    const foodItemsByFoodPartner = await foodItemModel.find({ foodPartner: foodPartnerId });

    res.status(200).json({
        message: 'Food partner fetched successfully',
        foodPartner,
        foodItems: foodItemsByFoodPartner
    });
}

async function getTotalLikesForFoodPartner(req, res) {
    const foodPartnerId = req.params.id;
    const foodPartner = await foodPartnerModel.findById(foodPartnerId);

    if (!foodPartner) {
        return res.status(404).json({ message: 'Food partner not found' });
    }
    const foodItems = await foodItemModel.find({ foodPartner: foodPartnerId });

    let totalLikes = 0;
    for (const item of foodItems) {
        totalLikes += item.Like;
    }  
    res.status(200).json({
        message: 'Total likes fetched successfully',
        totalLikes
    });
}

module.exports = {
    getFoodPartnerById,
    getTotalLikesForFoodPartner,
};