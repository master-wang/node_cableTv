var express=require('express');
var router=express.Router();
var User=require('../models/user');
var Faultorm=require('../models/faultform');
var responData;
//上传图片的 multer 配置
const multer = require('multer');
const path = require('path');
const lastdir = path.resolve(__dirname, '..');
var Bod_imgs = [];
var B_path = '/public/upimgs/';

var imgpath = '/public/upimgs/';
var user_img = ''
var storage = multer.diskStorage({
    destination: path.join(lastdir,'/public/upimgs'),

    filename: function (req, file, cb) {
        var str = file.originalname.split('.');
        var imgname = Date.now()+'.'+str[1];
        //处理单张图片
        user_img = imgname;
        //imgpath = imgpath + imgname;
        //处理多张图片
        B_path = B_path + imgname;
        Bod_imgs.push(B_path);
        B_path = '/public/upimgs/';

        cb(null, imgname);
    }
})
var upload = multer({ storage: storage });//存储器

router.use(function(req,res,next){
    responData={
        code:0,
        message:''
    }
    next();
})

router.post('/user/register',function(req,res){
    var username = req.body.username;
    var password= req.body.password;
    var repassword = req.body.repassword;
    console.log(username+"---"+password+"--"+repassword);
    if(username == ''){
        responData.code=1;
        responData.message='账号不能为空';
        res.json(responData);
        return;
    }
    if(password == ''){
        responData.code=2;
        responData.message='密码不能为空';
        res.json(responData);
        return;
    }
    if(password != repassword){
        responData.code=3;
        responData.message='2次密码不一致';
        res.json(responData);
        return;
    }

    User.findOne({
        username:username
    }).then(function(userInfo){
        if(userInfo){
            responData.code=4;
            responData.message='用户已被注册';
            res.json(responData);
        return;
        }
        var user = new User({
            username:username,
            password:password
        });
        return user.save();
    }).then(function(newUserInfo){
        
        responData.message='注册成功,即将返回登录界面';
        res.json(responData);
    })


    
});
router.post('/user/login',function(req,res){
    var username = req.body.username;
    var password= req.body.password;
    var is_ad = req.body.is_ad;
    console.log(username + '--'+password+'========'+is_ad);
    if(username == '' || password == ''){
        responData.code = 1;
        responData.message = '用户名和密码不能为空';
        res.json(responData);
        return;
    }
    console.log(is_ad)
    console.log(is_ad=='true')
    if(is_ad=='true'){
        console.log("后台登录")
        User.findOne({
            username:username,
            password:password,
            isAdmin:true
        }).then(function(userInfo){
            if(!userInfo){
                responData.code = 2;
                responData.message = '用户名或密码错误';
                res.json(responData);
                return;
            }
            responData.message = '登陆后台成功';
            responData.userInfo=userInfo;
            responData.isAdmin='true'
            //登录成功设置cookies
            req.cookies.set('userInfo',JSON.stringify(
                {
                    _id:userInfo._id,
                    username:userInfo.username,
                }
            ));
            console.log(req.cookies.get('userInfo'));
            res.json(responData);
            return
        })
    }
    User.findOne({
        username:username,
        password:password
    }).then(function(userInfo){
        if(!userInfo){
            responData.code = 2;
            responData.message = '用户名或密码错误';
            res.json(responData);
            return;
        }
        responData.message = '首页登陆成功';
        responData.userInfo=userInfo;
        responData.isAdmin='false'
        //登录成功设置cookies
        req.cookies.set('userInfo',JSON.stringify(
            {
                _id:userInfo._id,
                username:userInfo.username,
            }
        ));
        console.log(req.cookies.get('userInfo'));
        res.json(responData);
    })

})

//获取所有的用户的信息
router.get('/user/getAllList',function(req,res){
    User.find().sort({_id:-1}).then(function(usersList){
        console.log(usersList,"11111111111111111111");
        responData.message = '请求公告数据成功！';
        responData.usersList = usersList;
        res.json(responData);
    })
})
router.get('/user/logout',function(req,res){
    req.cookies.set('userInfo',null);
    responData.message = '退出成功！';
    res.json(responData);
})
//删除user
router.get('/user/delete',function(req,res){
    var id=req.query._id || '';
    console.log(id);
    User.remove({
        _id:id
    }).then(function(){
        return User.find().sort({_id:-1});
    }).then(function(usersList){
        console.log(usersList,"11111111111111111111");
        responData.message = '删除成功，获取新的用户列表';
        responData.usersList = usersList;
        res.json(responData);
    })
    
})


//
router.post('/fault/add',function(req,res){
    var title = req.body.title
    var type = req.body.type
    var desc = req.body.desc
    var phone = req.body.phone
    var u_id = req.body.u_id
    new Faultorm({
        u_id:u_id,
        title:title,
        type:type,
        desc:desc,
        phone:phone,
    }).save().then(function(newUserInfo){
        console.log(newUserInfo)
        responData.message='添加成功！';
        res.json(responData);
    })
})
router.get('/fault/getList',function(req,res){
    Faultorm.find().sort({_id:-1}).populate('u_id').then(function(faultformlist){
        console.log(faultformlist,"11111111111111111111");
        responData.message = '请求故障列表成功';
        responData.faultformlist = faultformlist;
        res.json(responData);
    })
})
router.get('/fault/delete',function(req,res){
    var id=req.query._id || '';
    console.log(id);
    Faultorm.remove({
        _id:id
    }).then(function(){
        return Faultorm.find().sort({_id:-1}).populate('u_id');
    }).then(function(faultformlist){
        console.log(faultformlist,"11111111111111111111");
        responData.message = '删除成功，获取新的用户列表';
        responData.faultformlist = faultformlist;
        res.json(responData);
    })
    
})
router.get('/fault/toTrue',function(req,res){
    var id=req.query._id || '';
    console.log(id);
    Faultorm.findOne({
        _id:id
    }).populate('u_id').then(function(info){
        info.is_fixed=true;
        return info.save();
    }).then(function(newInfo){
        console.log(newInfo);
        responData.message = '修改成功';
        res.json(responData);
    })
    
})
router.get('/fault/toFalse',function(req,res){
    var id=req.query._id || '';
    console.log(id);
    Faultorm.findOne({
        _id:id
    }).populate('u_id').then(function(info){
        info.is_fixed=false;
        return info.save();
    }).then(function(newInfo){
        console.log(newInfo);
        responData.message = '修改成功';
        res.json(responData);
    })
    
})
router.get('/fault/total',function(req,res){
    Faultorm.find({
        is_fixed:true
    }).count().then(count=>{
        console.log(count)
        responData.fixed=count
        return Faultorm.find({
            is_fixed:false
        }).count()
    }).then(count=>{
        console.log(count)
        responData.nofixed=count
        responData.message = '请求成功';
        res.json(responData);
    })
})



module.exports = router;