var gate_sn  = getParam('sn');
console.log(gate_sn);
pagename = "Gates_detail";
ex_setting = new Object();
ex_setting.ioe_frpc=false;
ex_setting.Net_Manager=false;
event_upload_input = false;
data_upload_period_input = false;
data_upload_cov_ttl_input = false;

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


$(".data_upload_period input").focus( function(){

    data_upload_period_input = true;
    $("button.set_data_upload_period").removeClass('hide');
    $("button.set_data_upload_period").data("value",$("input[name=data_upload_period]").val())

} );
$(".data_upload_period input").blur( function(){

    var oval = $("button.set_data_upload_period").data("value");
    var nval = $("input[name=data_upload_period]").val();
    console.log(oval,nval,oval==nval)
    if(oval==nval){
        $("button.set_data_upload_period").addClass('hide');
        data_upload_period_input = false;
    }
} );

$("button.set_data_upload_period").click( function(){

    var data_upload_period = Number($("input[name=data_upload_period]").val());

    if(data_upload_period < 1 ){

        $("input[name=data_upload_period]").data("content", "有效范围>1");
        $('.popover-data_upload_period').popover('show');
        setTimeout(function () {
            $('.popover-data_upload_period').popover('destroy');
        },2000);
        return false;
    }

    var action = "sys_cloud_conf";
    var task_desc = '更改数据上传配置'+ gate_sn ;
    var id = 'sys_cloud_conf/' + gate_sn + '/'+ Date.parse(new Date());
    var post_data = {
        "device": gate_sn,
        "id": id,
        "data": {"DATA_UPLOAD_PERIOD": data_upload_period}
    };

    gate_exec_action(action, post_data, task_desc, action, action, data_upload_period);
    $("button.set_data_upload_period").attr('disabled', true);
    setTimeout(function () {
        $("button.set_data_upload_period").addClass('hide');
        data_upload_period_input = false;
        $("button.set_data_upload_period").attr('disabled', false);
    }, 8000);

} );




$(".data_upload_cov_ttl input").focus( function(){

    data_upload_cov_ttl_input = true;
    $("button.set_data_upload_cov_ttl").removeClass('hide');
    $("button.set_data_upload_cov_ttl").data("value",$("input[name=data_upload_cov_ttl]").val())

} );
$(".data_upload_cov_ttl input").blur( function(){

    var oval = $("button.set_data_upload_cov_ttl").data("value");
    var nval = $("input[name=data_upload_cov_ttl]").val();

    if(oval==nval){
        $("button.set_data_upload_cov_ttl").addClass('hide');
        data_upload_cov_ttl_input = false;
    }
} );

$("button.set_data_upload_cov_ttl").click( function(){

    var data_upload_cov_ttl = Number($("input[name=data_upload_cov_ttl]").val());

    if(data_upload_cov_ttl < 10 ){

        $("input[name=data_upload_cov_ttl]").data("content", "有效范围>10");
        $('.popover-data_upload_cov_ttl').popover('show');
        setTimeout(function () {
            $('.popover-data_upload_cov_ttl').popover('destroy');
        },2000);
        return false;
    }

    var action = "sys_cloud_conf";
    var task_desc = '更改数据上传配置'+ gate_sn ;
    var id = 'sys_cloud_conf/' + gate_sn + '/'+ Date.parse(new Date());
    var post_data = {
        "device": gate_sn,
        "id": id,
        "data": {"COV_TTL": data_upload_cov_ttl}
    };

    gate_exec_action(action, post_data, task_desc, action, action, data_upload_cov_ttl);

    $("button.set_data_upload_cov_ttl").attr('disabled', true);
    setTimeout(function () {
        $("button.set_data_upload_cov_ttl").addClass('hide');
        data_upload_cov_ttl_input = false;
        $("button.set_data_upload_cov_ttl").attr('disabled', false);
    }, 8000);

} );





$(".event_upload input").focus( function(){

    event_upload_input = true;
    $("button.set_event_upload").removeClass('hide');
    $("button.set_event_upload").data("value",$("input[name=event_upload]").val())

} );
$(".event_upload input").blur( function(){

    var oval = $("button.set_event_upload").data("value");
    var nval = $("input[name=event_upload]").val();

    if(oval==nval){
        $("button.set_event_upload").addClass('hide');
        event_upload_input = false;
    }
} );

$("button.set_event_upload").click( function(){

    var event_level = Number($("input[name=event_upload]").val());

    if(event_level>99 || event_level < 0){

        $("input[name=event_upload]").data("content", "有效范围0~99");
        $('.popover-warning').popover('show');
        setTimeout(function () {
            $('.popover-warning').popover('destroy');
        },2000);
        return false;
    }

    var action = "sys_enable_event";
    var task_desc = '更改事件上传等级'+ gate_sn ;
    var id = 'sys_enable_event/' + gate_sn + '/'+ Date.parse(new Date());
    var post_data = {
        "device": gate_sn,
        "id": id,
        "data": event_level
    };

    gate_exec_action(action, post_data, task_desc, action, action, event_level);
    $("button.set_event_upload").attr('disabled', true);
    setTimeout(function () {
        $("button.set_event_upload").addClass('hide');
        event_upload_input = false;
        $("button.set_event_upload").attr('disabled', false);
    }, 10000);

} );


$("button.FreeIOE_restart").click( function(){
    sys_restart(gate_sn);
} );

$("button.thingslink_restart").click( function(){
    sys_reboot(gate_sn);
} );



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
    // console.log(skynetflag, freeioeflag)
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
