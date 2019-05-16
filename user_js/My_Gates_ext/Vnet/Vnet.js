
/**
 *	获取网关状态信息
 */
function gate_info(sn){
    $.ajax({
        url: '/apis/api/method/iot_ui.iot_api.gate_info',
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'get',
        data: {"sn": sn},
        dataType:'json',
        success:function(req){
            // console.log(req);

            if(req.message!=null){
                localStorage.setItem("gate_info/"+ sn, JSON.stringify(req.message));
                set_label(sn);
            }
        },
        error:function(req){
            console.log(req);
        }
    });
}

/**
 *	使用网关状态信息更新标签
 */
function set_label(sn){
    var gateinfo = localStorage.getItem("gate_info/"+ sn);

    if(gateinfo!=null && typeof(gateinfo) != "undefined"){
        gateinfo = JSON.parse(gateinfo);
        $(".gate_status").html(gateinfo.basic.status);

        if(gateinfo.basic.status=="ONLINE"){
            $(".gate_status").addClass("btn-success");
            $(".gate_status").removeClass("btn-warning");

        }else if(gateinfo.basic.status=="OFFLINE"){
            $(".gate_status").addClass("btn-warning");
            $(".gate_status").removeClass("btn-success");
        }else{
            $(".gate_status").addClass("btn-warning");
            $(".gate_status").removeClass("btn-success");
            $(".gate_status").html("OFFLINE");
        }
        $(".gate_sn").html(gateinfo.basic.sn);
        if(!$.isEmptyObject(vnet_obj)){
            if(!vnet_obj.is_running) {
                $('input.gate_sn').val(gateinfo.basic.sn);
            }
        }

        $(".gate_name").html(gateinfo.basic.name);
        $(".gate_desc").html(gateinfo.basic.desc);
        $(".gate_apps_len").html(gateinfo.apps_len);
        $(".gate_devs_len").html(gateinfo.devs_len);
        if(gateinfo.config.data_upload==0){
            sys_enable_data_one_short(sn);
        }
        if(gateinfo.hasOwnProperty("applist")){
            var applist= gateinfo.applist
            if(applist.hasOwnProperty("ioe_frpc")){
                $("li.Gates_vpn").removeClass("hide");
            }else{
                $("li.Gates_vpn").addClass("hide");
            }
            if(applist.hasOwnProperty("Net_Manager")){
                $("li.Gates_NetManager").removeClass("hide");
            }else{
                $("li.Gates_NetManager").addClass("hide");
            }
            if(applist.hasOwnProperty("freeioe_Vserial")){
                $("li.Gates_Vserial").removeClass("hide");
            }else{
                $("li.Gates_Vserial").addClass("hide");
            }
            if(applist.hasOwnProperty("freeioe_Vnet")){
                $("li.Gates_Vnet").removeClass("hide");
            }else{
                $("li.Gates_Vnet").addClass("hide");
            }
        }

    }

}

/**
 *	获取freeioe_Vnet设备数据
 */
function get_freeioe_Vnet_data(sn){
    $.ajax({
        url: '/apis/api/method/iot_ui.iot_api.gate_device_data_array',
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'get',
        data: {"sn": sn,"vsn": sn + '.freeioe_Vnet'},
        dataType:'json',
        success:function(req){
            // console.log(req);
            if(req.message!=null){
                if(req.message.length>0){

                    var reg = RegExp(/net/)

                    for (var i = 0; i < req.message.length; i++) {
                        if(req.message[i].name=='lan_ip'){
                            gate_obj.lan_ip = req.message[i].pv;
                            if(!vnet_obj.is_running){
                                $("input.dev_ip").val(req.message[i].pv);
                            }

                        }
                        if(req.message[i].name=='router_run'){
                            gate_obj.router_run = req.message[i].pv;
                            $("span.gate_router_result").text(req.message[i].pv);
                        }
                        if(req.message[i].name=='bridge_run'){
                            gate_obj.bridge_run = req.message[i].pv;
                            $("span.gate_bridge_result").text(req.message[i].pv);
                        }
                        if(req.message[i].name=='bridge_config'){
                            gate_obj.bridge_config = req.message[i].pv;
                        }
                        if(req.message[i].name=='router_config'){
                            gate_obj.router_config = req.message[i].pv;
                        }

                    }
                }
            }
        },
        error:function(req){
            console.log(req);
        }
    });
}

/**
 *	向freeioe_Vserial提交数据
 */
function post_freeioe_Vnet_data(sn, device_sn, tag_name, output_val){
    var app_action = "send_output";
    var task_desc = '数据下置'+ '/ '+ device_sn  + '/ ' + tag_name + '/'+  output_val;
    var id = 'send_output/' + sn + '/ '+ device_sn  + '/ '+ tag_name + '/'+  output_val + '/'+ Date.parse(new Date());
    var _act = {
        "device": sn,
        "data": {
            "device": device_sn,
            "output": tag_name,
            "value": output_val,
            "prop": "value"
        },
        "id": id
    };

    gate_exec_action(app_action, _act, task_desc, "0", app_action, "0");

}

/**
 *	检查本地运行环境
 */
function check_env(connect_flag,client){
    var id = "check_env/"+ Date.parse(new Date());
    var message = {
        "id":id
    };
    if(connect_flag){
        message = new Paho.Message(JSON.stringify(message));
        message.destinationName = "v1/vnet/api/checkenv";
        message.qos = 0;
        message.retained = false;
        client.send(message);
        action_result_list.push(id);
    }
}

/**
 *	检查本地运行环境版本
 */
function check_version(connect_flag,client){
    var id = "check_version/"+ Date.parse(new Date());
    var message = {
        "id":id
    };
    if(connect_flag){
        message = new Paho.Message(JSON.stringify(message));
        message.destinationName = "v1/update/api/version";
        message.qos = 0;
        message.retained = false;
        client.send(message);
        action_result_list.push(id);
    }
}


/**
 *	检查可用的代理服务器列表
 */
function check_servers_list(connect_flag,client){
    var id = "check_servers_list/"+ Date.parse(new Date());
    var message = {
        "id":id
    };
    if(connect_flag){
        message = new Paho.Message(JSON.stringify(message));
        message.destinationName = "v1/update/api/servers_list";
        message.qos = 0;
        message.retained = false;
        client.send(message);
        action_result_list.push(id);
    }
}


/**
 *	检查本地运行环境
 */
function fix_env(connect_falg,client,message){
    var id = message.id;
    // logMessage("INFO", "Publishing Message: [Topic: ", "v1/vspc/api/list", ", Payload: ", message, ", QoS: ", 0, ", Retain: ", 0, "]");
    if(connect_falg){
        message = new Paho.Message(JSON.stringify(message));
        message.destinationName = "v1/vnet/api/fixenv";
        message.qos = 0;
        message.retained = false;
        client.send(message);
        action_result_list.push(id);
    }
}

/**
 *	查询所有虚拟网卡
 */
function query_taps(connect_falg,client,id){
    var message = JSON.stringify({"id":id});
    // logMessage("INFO", "Publishing Message: [Topic: ", "v1/vspc/api/list", ", Payload: ", message, ", QoS: ", 0, ", Retain: ", 0, "]");
    if(connect_falg){
        message = new Paho.Message(message);
        message.destinationName = "v1/vspc/api/list";
        message.qos = 0;
        message.retained = false;
        client.send(message);
        action_result_list.push(id);
    }
}

/**
 *	启动虚拟网络
 */
function start_Vnet(connect_falg, client, message){
    // logMessage("INFO", "Publishing Message: [Topic: ", "v1/vspc/api/list", ", Payload: ", message, ", QoS: ", 0, ", Retain: ", 0, "]");
    var id = message.id;
    if(connect_falg){
        message = new Paho.Message(JSON.stringify(message));
        message.destinationName = "v1/vnet/api/service_start";
        message.qos = 0;
        message.retained = false;
        client.send(message);
        action_result_list.push(id);
    }
}

/**
 *	停止虚拟网络
 */
function stop_Vnet(connect_falg,client,message){
    var id = message.id;
    // logMessage("INFO", "Publishing Message: [Topic: ", "v1/vspc/api/list", ", Payload: ", message, ", QoS: ", 0, ", Retain: ", 0, "]");
    if(connect_falg){
        message = new Paho.Message(JSON.stringify(message));
        message.destinationName = "v1/vnet/api/service_stop";
        message.qos = 0;
        message.retained = false;
        client.send(message);
        action_result_list.push(id);
    }
}

/**
 *	发送指令到网关
 */
function post_to_gate(connect_falg,client,message){
    var id = message.id;
    // logMessage("INFO", "Publishing Message: [Topic: ", "v1/vspc/api/list", ", Payload: ", message, ", QoS: ", 0, ", Retain: ", 0, "]");
    if(connect_falg){
        message = new Paho.Message(JSON.stringify(message));
        message.destinationName = "v1/vnet/api/post_gate";
        message.qos = 0;
        message.retained = false;
        client.send(message);
        action_result_list.push(id);
    }
}
/**
 *	保持和本地服务的心跳
 */
function keep_alive_local(connect_falg,client){
    var id = "keep_alive/"+ Date.parse(new Date());
    var message = {
        "id":id,
        "enable_heartbeat": true,
        "heartbeat_timeout" : 60,
        "gate_sn": gate_sn,
        "auth_code": $("span.user-name").data("accesskey")
    };
    if(connect_falg){
        message = new Paho.Message(JSON.stringify(message));
        message.destinationName = "v1/vnet/api/keep_alive";
        message.qos = 0;
        message.retained = false;
        client.send(message);
        action_result_list.push(id);
    }
}

/**
 *	检查自动升级状态
 */
function check_update_status(connect_falg,client){
    var id = "check_update_status/"+ Date.parse(new Date());
    var message = {
        "id":id
    };
    if(connect_falg){
        message = new Paho.Message(JSON.stringify(message));
        message.destinationName = "v1/update/api/update_status";
        message.qos = 0;
        message.retained = false;
        client.send(message);
        action_result_list.push(id);
    }
}


/**
 *	延时加载
 */
function delay_load(delay_time){
    setTimeout(function(){
        if(mqttc_connected){
            $("div.vnet_loading").addClass('hide');
            $("button.start_vpn").removeClass('hide');
        }

    },delay_time);
}


pagename = "Gates_Vnet";
gate_sn = getParam('sn');
action_result_list = new Array();
gate_obj = {};
vnet_obj ={};
vnet_cfg = {};
vnet_cfg.net_mode = "bridge";
vnet_cfg.net_protocol = "tcp";
freeioe_Rprogramming_lastest = null;


$(".tunnel_config").attr("disabled",true);

gate_info(gate_sn);

setTimeout(function () {
    connect();
},600);


/**
 *	周期检测mqtt状态
 */
var mqtt_status_ret= setInterval(function(){
    if(mqttc_connected){

        $(".tunnel_config").attr("disabled",false);
        $("button.vnet-reconnect").addClass("hide");
        mqtt_client.subscribe(["v1/vnet/+", "v1/update/+"], {qos: 0});
        $("span.check_local_result").text("服务正常");
        $("span.service_status").html('');

        if(vnet_obj.is_running){
            $("button.start_vpn").data('running', 1);
            $("button.start_vpn").text('停止');
            $("button.start_vpn").addClass('btn-danger');
            $("input.gate_sn").val(vnet_obj.vnet_cfg.gate_sn);
            $("input.tap_ip").val(vnet_obj.vnet_cfg.tap_ip);
            $("select.tap_netmask").val(vnet_obj.vnet_cfg.tap_netmask);
            $("select.frps_host").val(vnet_obj.vnet_cfg.node);
            $("input.dev_ip").val(vnet_obj.vnet_cfg.dest_ip);
            if(vnet_obj.vnet_cfg.net_mode=='router'){
                $("button.router").addClass('btn-primary');
                $("button.bridge").removeClass('btn-primary')
            }else{
                $("button.bridge").addClass('btn-primary');
                $("button.router").removeClass('btn-primary')
            }
            if(vnet_obj.vnet_cfg.net_protocol=='tcp'){
                $("button.protocol_tcp").addClass('btn-primary');
                $("button.protocol_kcp").removeClass('btn-primary')
            }else{
                $("button.protocol_kcp").addClass('btn-primary');
                $("button.protocol_tcp").removeClass('btn-primary')
            }
            $(".tunnel_config").attr("disabled",true);

        }else{
            $("span.service_stop").text('----');
            $("button.start_vpn").data('running', 0);
            $("button.start_vpn").text('启动');
            $("button.start_vpn").removeClass('btn-danger');
        }
    }else{
        $("button.start_vpn").addClass('hide');
        $(".tunnel_config").attr("disabled",true);
        $("button.vnet-reconnect").removeClass("hide");
        $("span.check_local_result").html("服务异常");
        $("span.service_status").html("    未能连接到远程编程服务，请确认freeioe_Rprogramming是否安装并运行。下载  <a href='http://thingscloud.oss-cn-beijing.aliyuncs.com/download/freeioe_Rprogramming.zip'  class='navbar-link'>freeioe_Rprogramming</a>");
    }

},3000);

/**
 *	周期获取数据
 */
get_freeioe_Vnet_data(gate_sn);
var mqtt_status_ret = setInterval(function(){
    gate_info(gate_sn);
    get_freeioe_Vnet_data(gate_sn);
    // console.log(id);

},3000);

/**
 *	周期发送心跳
 */

var keep_alive_ret= setInterval(function() {
    if (mqttc_connected) {
        keep_alive_local(mqttc_connected, mqtt_client);
        check_version(mqttc_connected, mqtt_client);
        check_servers_list(mqttc_connected, mqtt_client);
    }
},20000);


/**
 *	打开时检查本地运行环境
 */
setTimeout(function(){

    var dest_ip = $("input.dev_ip").val();
    if(dest_ip){
        var tempip = dest_ip.split(".",3).join(".") + "." + parseInt(Math.random()*200 + 10, 10);
        $("input.tap_ip").val(tempip);
    }
    if(mqttc_connected){
        check_env(mqttc_connected, mqtt_client);

        check_version(mqttc_connected, mqtt_client);

        check_servers_list(mqttc_connected, mqtt_client);
    }else{
        $("button.check_env").removeClass('hide');
    }

    keep_alive_local(mqttc_connected, mqtt_client);

},3000);

delay_load(8000);

$("button.check_env").click(function(){
    if(mqttc_connected){
        // console.log(id);
        check_env(mqttc_connected, mqtt_client);
        $("button.check_env").addClass('hide');
    }else{
        $("button.check_env").removeClass('hide');
    }
});

$("button.vnet-reconnect").click(function(){
    if(!mqttc_connected){
        connect();
        setTimeout(function(){

            if(mqttc_connected){
                check_env(mqttc_connected, mqtt_client);
                $("button.start_vpn").removeClass('hide');

                check_version(mqttc_connected, mqtt_client);

                check_servers_list(mqttc_connected, mqtt_client);
            }

        },2000);
    }
});

// $("button.start_vpn").text('');

// 选择按钮--VPN启动-----开始
$("button.start_vpn").click(function(){
    vnet_cfg.gate_sn = $("input.gate_sn").val();
    vnet_cfg.tap_ip= $("input.tap_ip").val();
    vnet_cfg.tap_netmask= $("select.tap_netmask").val();
    vnet_cfg.dest_ip= $("input.dev_ip").val();
    if(vnet_cfg.tap_ip=="" || vnet_cfg.tap_ip==null){
        $('.popover-warning-ip').popover('show');
        setTimeout(function () {
            $('.popover-warning-ip').popover('destroy');
        },2000);
        return false;
    }else{
        if(checkIP(vnet_cfg.tap_ip)==false){
            alert("请输入有效的IP地址");
            return false;
        }
    }
    console.log(vnet_cfg);

    if($("button.start_vpn").data('running')!==1){
        var id = "start_vnet/"+ Date.parse(new Date());
        vnet_cfg.node = $("select.frps_host").val();
        var frps_cfg = {"server_addr": $("select.frps_host").val()};
        var message = {
            "id":id,
            "vnet_cfg": vnet_cfg,
            "frps_cfg": frps_cfg
        };
        console.log(message);
        start_Vnet(mqttc_connected, mqtt_client, message);
        $("button.start_vpn").addClass('hide');
        $("div.vnet_loading").text('启动中……');
        $("div.vnet_loading").removeClass('hide');
        delay_load(6000);

    }
    else{

        var id = "stop_vnet/"+ Date.parse(new Date());
        var message = {
            "id":id,
            "vnet_cfg": vnet_cfg
        };
        stop_Vnet(mqttc_connected, mqtt_client, message);
        $("button.start_vpn").addClass('hide');
        $(".tunnel_config").attr("disabled",true);

        $("div.vnet_loading").text('停止中……');
        $("div.vnet_loading").removeClass('hide');
        delay_load(6000);

    }


});
// 选择按钮--VPN启动-----结束

$("span.frps_host").click(function(){
    check_servers_list(mqttc_connected, mqtt_client);
});

$("button.bridge").click(function(){
    vnet_cfg.net_mode = "bridge";
    $("button.bridge").addClass('btn-primary');
    $("button.router").removeClass('btn-primary');
    var dest_ip = $("input.dev_ip").val();
    if(dest_ip){
        var tempip = dest_ip.split(".",3).join(".") + "." + parseInt(Math.random()*200 + 10, 10);
        $("input.tap_ip").val(tempip);
    }
});

$("button.router").click(function(){
    vnet_cfg.net_mode = "router";
    $("button.router").addClass('btn-primary');
    $("button.bridge").removeClass('btn-primary');
    var dest_ip = $("input.dev_ip").val();
    if(dest_ip){
        var tempip = dest_ip.split(".",3).join(".") + ".0";
        $("input.tap_ip").val(tempip);
    }
});

$("button.protocol_tcp").click(function(){
    vnet_cfg.net_protocol = "tcp";
    $("button.protocol_tcp").addClass('btn-primary');
    $("button.protocol_kcp").removeClass('btn-primary')
});

$("button.protocol_kcp").click(function(){
    vnet_cfg.net_protocol = "kcp";
    $("button.protocol_kcp").addClass('btn-primary');
    $("button.protocol_tcp").removeClass('btn-primary')
});

$("select.com_select").change(function(){
    var key = $(this).val();
    // console.log(key);
    $("span.selected_com").text(key.toUpperCase());
});

$("button.vnet-reconnect").click(function(){
    if(!mqttc_connected){
        connect();
    }
});

$("body").on("click", "button.one_key_repair", function () {
    console.log("one_key_repair")
    if(mqttc_connected){
        var id = "fix_env/"+ Date.parse(new Date());
        var message = {
            "id":id
        };
        fix_env(mqttc_connected, mqtt_client, message);
    }
});


$("body").on("click", "button.update_lastest", function () {
    console.log("update_lastest" ,freeioe_Rprogramming_lastest);

    if(freeioe_Rprogramming_lastest){
        var id = "update_lastest/"+ Date.parse(new Date());
        var message = {
            "id":id,
            "update_confirm":freeioe_Rprogramming_lastest.update,
            "new_version":freeioe_Rprogramming_lastest.new_version,
            "new_version_filename":freeioe_Rprogramming_lastest.new_version_filename
        };
        if(mqttc_connected){
            message = new Paho.Message(JSON.stringify(message));
            message.destinationName = "v1/update/api/update";
            message.qos = 0;
            message.retained = false;
            mqtt_client.send(message);
            action_result_list.push(id);
        }
        $(this).text("升级中……");
        $(this).attr('disabled', true);
    }


});