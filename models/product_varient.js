const mongoose = require("mongoose");

const productVariationSchmea=mongoose.Schema({
    name:{
        type:String,
        required:true
    }
},{timestamps:true});

const productVariationModel=mongoose.model("ProductVariation",productVariationSchmea)
module.exports=productVariationModel;