var mongoose=require('mongoose');
//用户表结构
module.exports = new mongoose.Schema({
    username:String,//用户名
    password:String,//密码
    isAdmin:{//是否是管理员
        type:Boolean,
        default:false
    },
});