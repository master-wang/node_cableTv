
function showre(){
    $(".login").eq(0).hide();
    $(".regist").eq(0).show();
}
function showlo(){
    $(".login").eq(0).show();
    $(".regist").eq(0).hide();
}
$(function(){

    var vm=new Vue({
        delimiters: ['${', '}'],
        el:'#app',
        data:{
            lo_re_cp:"login",
            register_userInfo:{
                username:"",
                password:"",
                repassword:""
            },
            login_userInfo:{
                username:"",
                password:"",
                is_ad:"false"
            },
            register_tip:"",
            login_stadus:"",
            userInfo:{},
            cherrtList:[],
            orderCatList:[]
        },
        methods: {
            //注册
            User_resister(){
                var that=this;
                $.ajax({
                    type:'post',
                    url:'/api/user/register',
                    data:that.register_userInfo,
                    dataType:'json',
                    success:function(result){
                        console.log(result)
                        $("#retip").html(result.message);
                        if(!result.code){
                            setTimeout(function(){
                                $(".login").eq(0).show();
                                $(".regist").eq(0).hide();
                            },1000);
                        }
                    }
                });
            },
            //登录
            User_login(){
                var that=this;
                $.ajax({
                    type:'post',
                    url:'/api/user/login',
                    data:that.login_userInfo,
                    dataType:'json',
                    success:function(result){
                        console.log(result);
                        $("#lotip").html(result.message);
                        that.userInfo=result.userInfo;
                        localStorage.setItem('userInfo',JSON.stringify(result.userInfo));
                        if(!result.code){
                            if(result.isAdmin=='true'){
                                window.location.href="/admin"
                            }
                            if(result.isAdmin=='false'){
                                window.location.href="/shouye"
                            }
                        }
                    }
                });
            },
            //退出登录
            login_out(){
                var that=this;
                $.ajax({
                    type:'get',
                    url:'/api/user/logout',
                    success:function(result){
                        console.log(result);
                        that.loginOut_tip=result.message;
                        that.userInfo=null;
                        localStorage.setItem('userInfo',null);
                        if(!result.code){
                            alert("退出登录成功！");
                            setTimeout(function(){
                                
                            },1000);
                        }
                    }
                });
            },
            //网页刷新 先获取本地存储的数据
            getuserInfo_bylocal(){
                this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
                if(this.userInfo){
                    this.login_stadus='ok';
                }else{
                    this.login_stadus='login';
                }
            },
            
        },
        created(){
            // this.getuserInfo_bylocal()
            // this.getCherryList()
        }
    });
});