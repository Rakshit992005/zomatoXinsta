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
  const foodItems = await foodModle.find({})

  res.status(200)
  .json({
    message: "Food items fetched successfully",
    foodItems,
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
      message: "Food item saved successfully",
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

module.exports = {
  createFood,
  getFoodItems,
  likeFoodItem,
  saveFood,
};
