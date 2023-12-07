const varientDB = require("../models/product_varient");
const asynchandler=require("express-async-handler");
const {
  errorRes,
  internalServerError,
  successRes,
} = require("../utility/index");
const test = async (req, res) => {
  successRes(res, '');
}
const addVariennt = asynchandler(async(req,res)=>{
  const name=req.body.name;
  if(!name){
    errorRes(res,400,"invalid input");
    return;
  }
  const findName=await varientDB.findOne({name:name});
  if(findName){
    errorRes(res,400,"Varient already exists cannot add");
    return;
  }
  const newVarient=new varientDB({
    name:name
  })
  const savedVarient =await newVarient.save();
  if(savedVarient){
    successRes(res,savedVarient);
  }
  else{
    internalServerError(res,"Error in saving the varient"); 
  }


})
const getAllVarient=asynchandler(async(req,res)=>{
  const getAllVarient=await varientDB.find({}).sort('name');
  if(getAllVarient){
    successRes(res,getAllVarient);
  }
  else{
    internalServerError(res,"Error in getting varient");
  }
})

const deleteVarient=asynchandler(async(req,res)=>{
  const id=req.params.id;
  const findName=await varientDB.findOne({_id:id});
  if(findName){
    const deletedVarient=await varientDB.findByIdAndDelete({_id:id});
    if  (deletedVarient){
      successRes(res,deletedVarient);
    }
    else{
      internalServerError(res,"Cannot delete varient");
    }
  }
  else{

    errorRes(res,404,"Cannot find the Varient");
    }
})
module.exports = { test ,addVariennt,getAllVarient,deleteVarient};