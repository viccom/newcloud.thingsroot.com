
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
        $('input.gate_sn').val(gateinfo.basic.sn);

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
function check_env(connect_falg,client,message){
    var id = message.id;
    if(connect_falg){
        message = new Paho.Message(JSON.stringify(message));
        message.destinationName = "v1/vnet/api/checkenv";
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

pagename = "Gates_Vnet";
gate_sn = getParam('sn');
action_result_list = new Array();
gate_obj = {};
vnet_obj ={};
vnet_cfg = {};
vnet_cfg.net_mode = "bridge";
vnet_cfg.node = "shanghai";
vnet_cfg.net_protocol = "tcp";




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
        $("button.start_vpn").removeClass('hide');
        $(".tunnel_config").attr("disabled",false);
        $("button.vnet-reconnect").addClass("hide");
        mqtt_client.subscribe(["v1/vnet/+"], {qos: 0});
        $("span.check_local_result").text("服务正常");

        if(vnet_obj.is_running){
            $("button.start_vpn").data('running', 1);
            $("button.start_vpn").text('停止');
            $("button.start_vpn").addClass('btn-danger');
            $("input.gate_sn").val(vnet_obj.vnet_cfg.gate_sn);
            $("input.tap_ip").val(vnet_obj.vnet_cfg.tap_ip);
            $("select.tap_netmask").val(vnet_obj.vnet_cfg.tap_netmask);
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
 *	打开时检查本地运行环境
 */
setTimeout(function(){

        var dest_ip = $("input.dev_ip").val();
        if(dest_ip){
            var tempip = dest_ip.split(".",3).join(".") + "." + parseInt(Math.random()*200 + 10, 10);
            $("input.tap_ip").val(tempip);
        }
        if(mqttc_connected){

            var id = "check_env/"+ Date.parse(new Date());
            var message = {
                "id":id
            };
            // console.log(id);
            check_env(mqttc_connected, mqtt_client, message);
        }else{
            $("button.check_env").removeClass('hide');
        }
},3000);

$("button.check_env").click(function(){
    if(mqttc_connected){

        var id = "check_env/"+ Date.parse(new Date());
        var message = {
            "id":id
        };
        // console.log(id);
        check_env(mqttc_connected, mqtt_client, message);
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
                var id = "check_env/"+ Date.parse(new Date());
                var message = {
                    "id":id
                };
                check_env(mqttc_connected, mqtt_client, message);
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
        var message = {
            "id":id,
            "vnet_cfg": vnet_cfg
        };
        start_Vnet(mqttc_connected, mqtt_client, message);
        $("button.start_vpn").text('启动中……');

    }
    else{

        var id = "stop_vnet/"+ Date.parse(new Date());
        var message = {
            "id":id,
            "vnet_cfg": vnet_cfg
        };
        stop_Vnet(mqttc_connected, mqtt_client, message);
        $("button.start_vpn").text('停止中……');

    }


});
// 选择按钮--VPN启动-----结束


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

$("button.one_key_repair").click(function(){
    if(mqttc_connected){
        var id = "fix_env/"+ Date.parse(new Date());
        var message = {
            "id":id
        };
        fix_env(mqttc_connected, mqtt_client, message);
    }
});
