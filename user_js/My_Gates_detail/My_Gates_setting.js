gate_sn  = getParam('sn');
console.log(gate_sn);
pagename = "Gates_setting";
ex_setting = new Object();
ex_setting.ioe_frpc=false;
ex_setting.Net_Manager=false;

gate_info(gate_sn);
setInterval(function(){
    gate_info(gate_sn);
},10000);


// 绑定事件，给后台任务调用；
$('.fa-connectdevelop').bind("upload_applist", function(){
    console.log("上传应用列表")
    gate_upload_applist(gate_sn);
});
// 测试按钮
$(".gate-test").click(function(){
    // console.log(ex_setting);
    //
    // if($('.switch').bootstrapSwitch('state')==false){
    //     $('.switch').bootstrapSwitch('toggleState');
    //     $('.switch').bootstrapSwitch('state', true);
    // }else{
    //     $('.switch').bootstrapSwitch('toggleState');
    //     $('.switch').bootstrapSwitch('state', false);
    // }

});





