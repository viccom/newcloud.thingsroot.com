var gate_sn  = getParam('sn');
console.log(gate_sn);
pagename = "Gates_detail";
ex_setting = new Object();
ex_setting.ioe_frpc=false;
ex_setting.Net_Manager=false;

gate_info(gate_sn);

setInterval(function(){
    gate_info(gate_sn);
},3000);

$(".gate_advanced").click(function(){
    var time_condition = "time > now() - 10m";
    var tag = "mem_used";
    var vt = "int";
    gate_hisdata(gate_sn, gate_sn, vt, tag, time_condition);

});


$(".new_iot_version").click(function(){
    // var url="My_Gates_firmware_upgrade.html?sn=" + gate_sn;
    // redirect(url);
    $('a[href="#upgrade_panel_div"]').tab('show');
});

$(".new_skynet_version").click(function(){
    // var url="My_Gates_firmware_upgrade.html?sn=" + gate_sn;
    // redirect(url);
    $('a[href="#upgrade_panel_div"]').tab('show');
});

$(".gate_setting").click(function(){
    // var url="My_Gates_setting.html?sn=" + gate_sn;
    // redirect(url);
    $('a[href="#advanced_panel_div"]').tab('show');
});

$("a.close-gate-advanced").click(function(){
    // var url="My_Gates_setting.html?sn=" + gate_sn;
    // redirect(url);
    $('a[href="#basic_panel_div"]').tab('show');
});

$("a.close-gate-upgrade").click(function(){
    // var url="My_Gates_setting.html?sn=" + gate_sn;
    // redirect(url);
    $('a[href="#basic_panel_div"]').tab('show');
});

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

$("button.float-gate-list").click(function(){

    if($(this).data("showlist")!="1"){
        $(this).data("showlist","1");
        $(".gate_nav").addClass("hide");
        $(".hide-gate-list").removeClass("hide");
        $(".float-gate-list>i").removeClass("fa-archive");
        $(".float-gate-list>i").addClass("fa-bars");


    }else if($(this).data("showlist")=="1"){
        $(this).data("showlist","0");
        $(".gate_nav").removeClass("hide");
        $(".hide-gate-list").addClass("hide");
        $(".float-gate-list>i").removeClass("fa-bars");
        $(".float-gate-list>i").addClass("fa-archive");
    }

});