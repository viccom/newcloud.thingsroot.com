/**
 *	日志处理
 */
function logMessage(type, ...content) {
    if (type === "INFO") {
        console.info(...content);
    } else if (type === "ERROR") {
        console.error(...content);
    } else {
        console.log(...content);
    }
}

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
 *	获取freeioe_Vserial设备数据
 */
function get_freeioe_Vserial_data(sn){
    $.ajax({
        url: '/apis/api/method/iot_ui.iot_api.gate_device_data_array',
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'get',
        data: {"sn": sn,"vsn": sn + '.freeioe_Vserial'},
        dataType:'json',
        success:function(req){
            console.log(req);
            if(req.message!=null){
                if(req.message.length>0){
                    var reg = RegExp(/mapport/);
                    remote_portmap_array = [];
                    for (var i = 0; i < req.message.length; i++) {
                        if(reg.test(req.message[i].name)){
                            if(req.message[i].pv){
                                remote_portmap_array.push(req.message[i].pv)
                            }

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
function post_freeioe_Vserial_data(sn){
    $.ajax({
        url: '/apis/api/method/iot_ui.iot_api.gate_device_data_array',
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'get',
        data: {"sn": sn,"vsn": sn + '.freeioe_Vserial'},
        dataType:'json',
        success:function(req){
            console.log(req);

            if(req.message!=null){

            }
        },
        error:function(req){
            console.log(req);
        }
    });
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


pagename = "Gates_Verial";
gate_sn_org  = getParam('sn');
gate_sn = gate_sn_org;
mes_subscribed = false;
com_opened = false;
local_coms = null;
valid_com = null;
remote_peer = {};
remote_portmap_array = new Array();
action_result_list = new Array();
vircom ={};


gate_info(gate_sn);

setTimeout(function () {
    connect();
},600);



/**
 *	周期检测mqtt状态
 */
var mqtt_status_ret= setInterval(function(){
    if(mqttc_connected){

        $("span.service_status").text("");
        $("button.com-reconnect").addClass("hide");
        mqtt_client.subscribe(["+/#"], {qos: 0});
        $("button.com_open").attr('disabled', false);
        $("button.message_monitor").attr('disabled', false);

    }else{

        $("span.service_status").text("未能连接到本地串口服务，请确认freeioe_Vserial是否安装并运行。");
        $("button.com-reconnect").removeClass("hide");
        $("button.com_open").attr('disabled', true);
        $("button.message_monitor").attr('disabled', true);

        vircom ={};
    }

    console.log("is null:::::::::",$.isEmptyObject(vircom));
    if($.isEmptyObject(vircom)){
        $("button.com_open").text('开启');
        $("button.com_open").removeClass('btn-danger');
        $("button.com_open").data('opened',0);
        $("select.config_com").attr('disabled',false);

        $("span.local_com").text('');
        $("span.com_parameters").text('');
        $("span.com_status").text('');
        $("span.com_proc").text('');
        $("span.com_peer").text('');
        $("span.com_peer_state").text('');
        $("span.com_received").text('');
        $("span.net_received").text('');

    }else{
        $("button.com_open").text('停止');
        $("button.com_open").addClass('btn-danger');
        $("button.com_open").data('opened',1);
        $("select.config_com").attr('disabled',true);

        $("span.local_com").text(vircom.name);

        $("span.com_parameters").text(vircom.BaudRate+'/'+vircom.DataBits+'/'+vircom.StopBits+'/'+vircom.Parity);
        if(vircom.pid>0){
            $("span.com_status").text('已打开');
        }else{
            $("span.com_status").text('已关闭');
        }

        $("span.com_proc").text(vircom.app_path.split("\\")[vircom.app_path.split("\\").length-1]);
        $("span.com_peer").text(vircom.target_host + ":" + vircom.target_port);
        $("span.com_peer_state").text(vircom.peer_state);
        $("span.com_received").text(vircom.recv_count);
        $("span.net_received").text(vircom.peer_recv_count);

    }


},1000);

/**
 *	周期获取数据
 */
get_freeioe_Vserial_data(gate_sn);
var mqtt_status_ret= setInterval(function(){
    get_freeioe_Vserial_data(gate_sn);
},3000);



// $('.message_monitor').click(function () {
//         $("div.message_log").removeClass("hide");
// });

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

        var com_cfg = {
            "serial":$("select[name=port]").val(),
            "baudrate":$("select[name=baudrate]").val(),
            "databit":$("select[name=data_bits]").val(),
            "stopbit":$("select[name=stop_bits]").val(),
            "parity":$("select[name=parity]").val()
        };

        console.log(com_cfg);



        var Vcom_cfg = {
            "by_name": 1,
            "name": "COM1",
            "peer": {
                "type":"tcp_client",
                "host": "thingsroot.com",
                "port": 26969
            }
        };

        var id = "query_local_coms/"+ Date.parse(new Date());
        query_local_coms(mqttc_connected, mqtt_client, id)

    }


    // var id = "query_local_Vcoms/"+ Date.parse(new Date());
    // query_local_Vcoms(connect_falg,client,id);




    // if(mqttc_connected){
    //     mqtt_client.publish("v1/vspc/api/add", {
    //         onSuccess: unsubscribeSuccess,
    //         onFailure: unsubscribeFailure,
    //         invocationContext: { topic: '' }
    //     });
    // }

/*    if(mqttc_connected){
        if(com_opened){
            mqtt_client.publish("v1/vspc/api/add", {
                onSuccess: unsubscribeSuccess,
                onFailure: unsubscribeFailure,
                invocationContext: { topic: '' }
            });
            com_opened = false;
            $("button.com_open").removeClass("btn-danger");
            $("button.com_open").text("关闭");
        }else{
            try {
                mqtt_client.publish("+/#", {qos: 0});
                com_opened = true;
                $("button.com_open").addClass("btn-danger");
                $("button.com_open").text("开启");

            } catch (error) {
                console.log(error);
                mqttc_connected = false;
                com_opened = false;
                $("button.com_open").removeClass("btn-danger");
                $("button.com_open").text("关闭");
            }
        }

    }*/



});

$("button.message_monitor").click(function(){

    if(mqttc_connected){
        if(mes_subscribed){
            mqtt_client.unsubscribe("+/#", {
                onSuccess: unsubscribeSuccess,
                onFailure: unsubscribeFailure,
                invocationContext: { topic: '' }
            });
            mes_subscribed = false;
            $("button.message_monitor").removeClass("btn-success");
            $("button.message_monitor").text("报文监控");
        }else{
            try {
                    mqtt_client.subscribe("+/#", {qos: 0});
                    mes_subscribed = true;
                    $("button.message_monitor").addClass("btn-success");
                    $("button.message_monitor").text("停止监控");

            } catch (error) {
                console.log(error);
                mqttc_connected = false;
                mes_subscribed = false;
                $("button.message_monitor").removeClass("btn-success");
                $("button.message_monitor").text("报文监控");
            }
        }

    }
});