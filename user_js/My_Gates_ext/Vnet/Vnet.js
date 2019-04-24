
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
                            $("input.dev_ip").val(req.message[i].pv);
                        }
                        if(req.message[i].name=='router_run'){
                            gate_obj.router_run = req.message[i].pv;
                        }
                        if(req.message[i].name=='bridge_run'){
                            gate_obj.bridge_run = req.message[i].pv;
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
 *	查询本地所有串口
 */
function query_local_coms(connect_falg,client,id){
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
 *	查询本地所有虚拟串口
 */
function query_local_Vcoms(connect_falg,client,id){
    var message = JSON.stringify({"id":id});
    // logMessage("INFO", "Publishing Message: [Topic: ", "v1/vspc/api/list", ", Payload: ", message, ", QoS: ", 0, ", Retain: ", 0, "]");
    if(connect_falg){
        message = new Paho.Message(message);
        message.destinationName = "v1/vspc/api/list_vir";
        message.qos = 0;
        message.retained = false;
        client.send(message);
        action_result_list.push(id);
    }
}


/**
 *	创建本地虚拟串口
 */
function add_local_com(connect_falg, client, message){
    // logMessage("INFO", "Publishing Message: [Topic: ", "v1/vspc/api/list", ", Payload: ", message, ", QoS: ", 0, ", Retain: ", 0, "]");
    var id = message.id;
    if(connect_falg){
        message = new Paho.Message(JSON.stringify(message));
        message.destinationName = "v1/vspc/api/add";
        message.qos = 0;
        message.retained = false;
        client.send(message);
        action_result_list.push(id);
    }
}

/**
 *	删除本地虚拟串口
 */
function remove_local_com(connect_falg,client,message){
    var id = message.id;
    // logMessage("INFO", "Publishing Message: [Topic: ", "v1/vspc/api/list", ", Payload: ", message, ", QoS: ", 0, ", Retain: ", 0, "]");
    if(connect_falg){
        message = new Paho.Message(JSON.stringify(message));
        message.destinationName = "v1/vspc/api/remove";
        message.qos = 0;
        message.retained = false;
        client.send(message);
        action_result_list.push(id);
    }
}


pagename = "Gates_Vnet";
gate_sn_org  = getParam('sn');
gate_sn = gate_sn_org;
mes_subscribed = false;
com_opened = false;
local_coms = null;
valid_com = null;
remote_peer = {};
remote_portmap_array = new Array();
remote_comstate_object = {};
remote_cmapport_object = {};
action_result_list = new Array();
vircom ={};
vnet_cfg = {};
vnet_cfg.net_mode = "bridge";
vnet_cfg.node = "shanghai";
vnet_cfg.net_protocol =  "kcp";
gate_obj = {};



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
    }else{


    }



},1000);

/**
 *	周期获取数据
 */
get_freeioe_Vnet_data(gate_sn);
var mqtt_status_ret= setInterval(function(){
    gate_info(gate_sn);
    get_freeioe_Vnet_data(gate_sn);
},3000);


// $('.message_monitor').click(function () {
//         $("div.message_log").removeClass("hide");
// });


// 选择按钮--VPN启动-----开始
$("button.start_vpn").click(function(){
    vnet_cfg.gate_sn = $("input.gate_sn").val();
    vnet_cfg.tap_ip= $("input.tap_ip").val();
    vnet_cfg.tap_netmask= $("select.tap_netmask").val();
    vnet_cfg.dest_ip= $("input.dev_ip").val();

    console.log(vnet_cfg);

    if($("button.start_vpn").data('running')!==1){

    }
    else{


    }


});
// 选择按钮--VPN启动-----结束


$("button.bridge").click(function(){
    vnet_cfg.net_mode = "bridge";
});


$("button.bridge").click(function(){
    vnet_cfg.net_mode = "router";
});

$("select.com_select").change(function(){
    var key = $(this).val();
    // console.log(key);
    $("span.selected_com").text(key.toUpperCase());
});

$("button.com-reconnect").click(function(){
    if(!mqttc_connected){
        connect();
    }
});

$("button.com_open").click(function(){

    if($("button.com_open").data('opened')==1){

        var id = "remove_local_com/"+ Date.parse(new Date());
        var message = {
            "id":id,
            "by_name": 1,
            "name": vircom.name.toUpperCase()
        };
        remove_local_com(mqttc_connected, mqtt_client, message);

    }else{

        // var com_cfg = {
        //     "serial":$("select[name=port]").val(),
        //     "baudrate":$("select[name=baudrate]").val(),
        //     "databit":$("select[name=data_bits]").val(),
        //     "stopbit":$("select[name=stop_bits]").val(),
        //     "parity":$("select[name=parity]").val()
        // };
        //
        //
        // var Vcom_cfg = {
        //     "by_name": 1,
        //     "name": "COM1",
        //     "peer": {
        //         "type":"tcp_client",
        //         "host": "thingsroot.com",
        //         "port": 26969
        //     }
        // };

        var id = "query_local_coms/"+ Date.parse(new Date());
        query_local_coms(mqttc_connected, mqtt_client, id)

    }

});



$("button.message-clear").click(function(){

});
