const { test, addVariennt, getAllVarient, deleteVarient } = require("../controllers/product_varient.controller");

const router=require("express").Router();



router.get("/product/varient/test",test);
router.post('/product/varient/add',addVariennt); 
router.get('/product/varient/all',getAllVarient); 
router.delete('/product/varient/delete/:id',deleteVarient);




module.exports=router;