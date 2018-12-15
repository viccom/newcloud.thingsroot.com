gate_sn  = getParam('sn');
console.log(gate_sn);
pagename = "Gates_firmware_upgrade";

gate_info(gate_sn);


// /**
//  *	周期检测最新版本
//  */
// var check_status_ret= setInterval(function(){
//         gate_info(gate_sn);
// },5000);


// 给固件升级按钮绑定事件，给后台任务调用；
$('.update_check').bind("updateClick", function(){
    gate_info(gate_sn);
});

// 固件升级按钮
$(".update_check").click(function(){
    var iotbeta = $(".app-skynet").data("iotbeta");
    var skynetid = $(".app-skynet").data("appid");
    var skynetflag = $(".app-skynet").data("skynetflag");
    var freeioeflag = $(".app-freeioe").data("freeioeflag");
    var cloudver = $(".app-skynet").data("cloudver");
    var data_up =$(".app-skynet").data("data_up");
    var data_up_span =$(".app-skynet").data("data_up_span");
    console.log(skynetflag, freeioeflag)
    if(skynetflag=="1" || freeioeflag=="1"){
        console.log("sys_upgrade");
        $('.update_check').attr("disabled",true);
        var pdata = {"no_ack": 1};
        if(skynetflag=="1"){
            pdata = {"no_ack": 1,"skynet": { "version": cloudver }};
        }

        var app_action = "sys_upgrade";
        var task_desc = '固件升级';
        var id = 'sys_upgrade/' + gate_sn + '/ '+ Date.parse(new Date());
        var _act = {
            "device": gate_sn,
            "data": pdata,
            "id": id
            };

        gate_exec_action(app_action, _act, task_desc, "1", app_action, data_up_span);
    }else{
        console.log("check update!");
        gate_info(gate_sn);

    }

});

