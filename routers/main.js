
var express=require('express');
var router=express.Router();


router.get('/',function(req,res){

    res.render('main/index');
    
})
router.get('/admin',function(req,res){

    res.render('main/admin');
    
})
router.get('/shouye',function(req,res){

    res.render('main/shouye');
    
})
module.exports = router;