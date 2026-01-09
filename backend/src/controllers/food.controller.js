const foodModle = require("../models/food.model");
const storageSrvice = require('../services/storage.service')
const {v4 : uuid} = require('uuid')
const LikeModel = require("../models/likes.model");
const SaveModel = require("../models/save.model");

async function createFood(req, res) {
    console.log(req.foodPartner);
    console.log(req.body);  
    console.log(req.file);  

    const fileUploadResult = await storageSrvice.uploadFile(req.file.buffer , uuid())
    
    const foodItem = await foodModle.create({
      name : req.body.name,
      description : req.body.description,
      video : fileUploadResult.url,
      foodPartner : req.foodPartner._id
    })

    res.status(201)
    .json({
      message : "Food Created Successfully",
      food : foodItem,
    })

}

async function getFoodItems(req , res) {
  const userId = req.user._id;
  const foodItems = await foodModle.find({})

  // Get all likes and saves for this user
  const userLikes = await LikeModel.find({ user: userId });
  const userSaves = await SaveModel.find({ user: userId });
  
  const likedFoodIds = new Set(userLikes.map(like => like.foodItem.toString()));
  const savedFoodIds = new Set(userSaves.map(save => save.foodItem.toString()));

  // Add isLiked and isSaved flags to each food item
  const foodItemsWithStatus = foodItems.map(item => {
    const itemObj = item.toObject();
    itemObj.isLiked = likedFoodIds.has(item._id.toString());
    itemObj.isSaved = savedFoodIds.has(item._id.toString());
    return itemObj;
  });

  res.status(200)
  .json({
    message: "Food items fetched successfully",
    foodItems: foodItemsWithStatus,
  })
}


async function likeFoodItem(req, res) {
  const { foodId } = req.body;
  const userId = req.user._id;
  
  const isLiked = await  LikeModel.findOne({
    user: userId,
    foodItem: foodId,
  })

  if(isLiked){
    await LikeModel.deleteOne({
      user: userId,
      foodItem: foodId,
    });
    await foodModle.findByIdAndUpdate(foodId, { $inc: { Like: -1 } });
    return res.status(200).json({
      message: "Food item unliked successfully",
    });
  }
  await foodModle.findByIdAndUpdate(foodId, { $inc: { Like: 1 } });
  const like = await LikeModel.create({
    user: userId,
    foodItem: foodId,
  });
  return res.status(201).json({
    message: "Food item liked successfully",
    like,
  });

}


async function saveFood(req , res) {
  
  const foodId = req.body.foodId;
  const userId = req.user._id;

  const isSaved = await SaveModel.findOne({
    user : userId,
    foodItem : foodId,
  })

  if(isSaved){
    await SaveModel.deleteOne({
      user : userId,
      foodItem : foodId,
    });
    await foodModle.findByIdAndUpdate(foodId, { $inc: { Save: -1 } });
    return res.status(200).json({
      message: "Food item unsaved successfully",
    });
  }
  await foodModle.findByIdAndUpdate(foodId, { $inc: { Save: 1 } });
  const save = await SaveModel.create({
    user : userId,
    foodItem : foodId,
  });
  return res.status(201).json({
    message: "Food item saved successfully",
    save,
  });

}

async function getSavedFood(req , res) {
  const userId = req.user._id;
  const savedFoods = await SaveModel.find({ user : userId }).populate('foodItem');
  
  // Get all likes and saves for this user
  const userLikes = await LikeModel.find({ user: userId });
  const userSaves = await SaveModel.find({ user: userId });
  
  const likedFoodIds = new Set(userLikes.map(like => like.foodItem.toString()));
  const savedFoodIds = new Set(userSaves.map(save => save.foodItem.toString()));

  // Map saved foods to include foodItem data with like/save status
  const savedFoodItems = savedFoods
    .filter(saved => saved.foodItem) // Filter out any null populated items
    .map(saved => {
      const itemObj = saved.foodItem.toObject ? saved.foodItem.toObject() : saved.foodItem;
      itemObj.isLiked = likedFoodIds.has(itemObj._id.toString());
      itemObj.isSaved = savedFoodIds.has(itemObj._id.toString());
      return itemObj;
    });

  res.status(200).json({ 
    message : "Saved foods fetched successfully",
    savedFoods: savedFoodItems,
   });
}

module.exports = {
  createFood,
  getFoodItems,
  likeFoodItem,
  saveFood,
  getSavedFood,
};
