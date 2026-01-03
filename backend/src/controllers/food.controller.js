const foodModle = require("../models/food.model");
const storageSrvice = require('../services/storage.service')
const {v4 : uuid} = require('uuid')

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

module.exports = {
  createFood,
  getFoodItems,

};
