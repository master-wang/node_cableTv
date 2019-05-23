
$(function(){
    var vm=new Vue({
        delimiters: ['${', '}'],
        el:'#app',
        data:{
            cab:3,
            userInfo:{},
            usersList:[],
            faultformlist:[]
        },
        methods: {
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
                                window.location.href="/"
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
                    alert("你好！还未登录，请先登录！")
                    window.location.href="/"
                }
            },
            getuserList(){
                this.cab=1
                var that = this;
                axios.get('/api/user/getAllList')
                    .then(data=>{
                        console.log(data);
                        that.usersList=data.data.usersList
                    })
                    .catch(err=>console.log(err));
            },
            deleteUserById(_id){
                var that = this;
                if(confirm("确定要删除吗？")){
                axios.get('/api/user/delete?_id='+_id)
                    .then(data=>{
                        console.log(data);
                        that.usersList=data.data.usersList
                    })
                    .catch(err=>console.log(err));
                }
            },
            getFaultList(){
                this.cab=2
                var that = this;
                axios.get('/api/fault/getList')
                    .then(data=>{
                        console.log(data);
                        that.faultformlist=data.data.faultformlist
                    })
                    .catch(err=>console.log(err));
            },
            deleteFormById(_id){
                var that = this;
                if(confirm("确定要删除吗？")){
                axios.get('/api/fault/delete?_id='+_id)
                    .then(data=>{
                        console.log(data);
                        that.faultformlist=data.data.faultformlist
                    })
                    .catch(err=>console.log(err));
                }
            },
            formTotrue(_id){
                var that = this;
                if(confirm("确定要将其改为已修理吗？")){
                axios.get('/api/fault/toTrue?_id='+_id)
                    .then(data=>{
                        console.log(data);
                        that.getFaultList();
                    })
                    .catch(err=>console.log(err));
                }
            },
            formTofalse(_id){
                var that = this;
                if(confirm("确定要将其改为未修理吗？")){
                axios.get('/api/fault/toFalse?_id='+_id)
                    .then(data=>{
                        console.log(data);
                        that.getFaultList();
                    })
                    .catch(err=>console.log(err));
                }
            },
            getTuxinghua(){
                var myChart = echarts.init(document.getElementById('chartmain')); 
                axios.get('/api/fault/total')
                    .then(data=>{
                        console.log(data);
                        var option = {
                            tooltip: {
                                show: true
                            },
                            legend: {
                                data:['已修理','未修理']
                            },
                            xAxis : [
                                {
                                    type : 'category',
                                    data : []
                                }
                            ],
                            yAxis : [
                                {
                                    type : 'value'
                                }
                            ],
                            series : [
                                {
                                    "name":"已修理",
                                    "type":"bar",
                                    "data":[]
                                },
                                {
                                    "name":"未修理",
                                    "type":"bar",
                                    "data":[]
                                }
                            ]
                        };
                        option.series[0].data.push(data.data.fixed)
                        option.series[1].data.push(data.data.nofixed)
                        console.log(option.series)
                        // 为echarts对象加载数据 
                        myChart.setOption(option); 
                    })
                    .catch(err=>console.log(err));
            }
        },
        created(){
            this.getuserInfo_bylocal()
            //this.getTuxinghua()
        },
        mounted() {
            this.getTuxinghua()
        },
    });
});