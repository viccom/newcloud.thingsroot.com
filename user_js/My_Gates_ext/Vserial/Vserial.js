
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
 *	下置数据到网关
 */
function post_to_gate(act_post){
    $.ajax({
        url: '/apis/api/method/iot.device_api.send_output',
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'post',
        async: false,
        data: JSON.stringify(act_post),
        contentType: "application/json; charset=utf-8",
        dataType:'json',
        success:function(req){
            if(req.message){
                console.log("success", req);
            }else{
                console.log("fail", req);
            }
        },
        error:function(req){
            console.log(req);

        }
    });

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
            // console.log(req);
            if(req.message!=null){
                if(req.message.length>0){

                    // var reg1 = RegExp(/mapport/);
                    // var reg2 = RegExp(/net/);
                    // var reg3 = RegExp(/_config/);
                    for (var i = 0; i < req.message.length; i++) {

                        if(req.message[i].name == 'com_to_net_run'){
                            if(req.message[i].pv){
                                remote_comstate_object = req.message[i].pv;
                            }else{
                                remote_comstate_object = null;
                            }
                        }

                        if(req.message[i].name == 'com_to_net_mapport'){
                            if(req.message[i].pv){
                                remote_mapport_object = req.message[i].pv;
                            }else{
                                remote_mapport_object = null;
                            }
                        }

                        if(req.message[i].name == 'current_com'){
                            if(req.message[i].pv){
                                remote_current_com = req.message[i].pv;
                            }else{
                                remote_current_com = null;
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
function post_freeioe_Vserial_data(sn, device_sn, tag_name, output_val){
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

    // gate_exec_action(app_action, _act, task_desc, "0", app_action, "0");
    post_to_gate(_act)
}


/**
 *	保持和本地服务的心跳
 */
function keep_alive_local(connect_falg,client){
    var id = "keep_alive/"+ Date.parse(new Date());
    var message = {
        "id":id,
        "enable_heartbeat": true,
        "heartbeat_timeout" : 60
    };
    if(connect_falg){
        message = new Paho.Message(JSON.stringify(message));
        message.destinationName = "v1/vspc/api/keep_alive";
        message.qos = 0;
        message.retained = false;
        client.send(message);
        action_result_list.push(id);
    }
}

/**
 *	保持和远程网关的心跳
 */
function keep_alive_remote(){
    // var app_action = "send_output";
    // var tag_name = 'heartbeat_timeout';
    // var output_val = 60;
    // var device_sn = gate_sn+'.freeioe_Vserial';
    // var task_desc = '保持心跳'+ '/ '+ device_sn  + '/ ' + tag_name + '/'+  output_val;
    var id = 'send_output/' + gate_sn + '/ '+ gate_sn+'.freeioe_Vserial'  + '/ '+ 'heartbeat_timeout' + '/'+  60 + '/'+ Date.parse(new Date());
    var _act = {
        "device": gate_sn,
        "data": {
            "device": gate_sn+'.freeioe_Vserial',
            "output": 'heartbeat_timeout',
            "value": 60,
            "prop": "value"
        },
        "id": id
    };

    // gate_exec_action(app_action, _act, task_desc, "0", app_action, "0");
    post_to_gate(_act)

}


/**
 *	查询本地所有串口
 */
function query_local_coms(connect_falg,client,id){
    var message = JSON.stringify({"id":id});
    logMessage("INFO", "Publishing Message: [Topic: ", "v1/vspc/api/list", ", Payload: ", message, ", QoS: ", 0, ", Retain: ", 0, "]");
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

remote_comstate_object = null;
remote_mapport_object = null;
remote_current_com = null;

action_result_list = new Array();
vircom ={};


gate_info(gate_sn);

setTimeout(function () {
    connect();
},600);

$(function () {
    /**
     *	初始化日志表格
     */
    table_log = $('#table_log').DataTable({
        "dom": '',
        "filter": true,
        "info": false,
        // "scrollY":        "50px",
        // "scrollCollapse": true,
        "paging":         false,
        "processing": true,
        "bStateSave": false,
        "order": [[ 0, "asc" ]],
        "language": {
            "sProcessing": "处理中...",
            "sLengthMenu": "显示 _MENU_ 项结果",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
            "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": "搜索:",
            "sUrl": "",
            "sEmptyTable": "消息为空",
            "sLoadingRecords": "载入中...",
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "上页",
                "sNext": "下页",
                "sLast": "末页"
            },
            "oAria": {
                "sSortAscending": ": 以升序排列此列",
                "sSortDescending": ": 以降序排列此列"
            }
        },
        columnDefs: [
            {
                //   指定第第1列
                targets:  0,
                "width": '14%',
                searchable: false,
                orderable: false

            },
            {
                //   指定第第2列
                targets:  1,
                "width": '8%',
                orderable: false
            },
            {
                //   指定第第3列
                targets:  2,
                "width": '8%',
                orderable: false
            },
            {
                //   指定第第4列
                targets:  3,
                "width": '70%',
                searchable: true,
                orderable: false
            }
        ],
        "initComplete": function(settings, json) {
            console.log("table_log init over")
        }
    });

})




/**
 *	打开时检查本地运行环境
 */
setTimeout(function(){
    if(mqttc_connected){

        check_version(mqttc_connected, mqtt_client);

        check_servers_list(mqttc_connected, mqtt_client);
    }else{
        $("button.check_env").removeClass('hide');
    }
},1500);

/**
 *	周期发送心跳
 */

var keep_alive_ret= setInterval(function() {
    if (mqttc_connected) {
        keep_alive_local(mqttc_connected, mqtt_client);
    }
    keep_alive_remote();
},20000);



/**
 *	周期检测mqtt状态
 */
var mqtt_status_ret= setInterval(function(){
    if(mqttc_connected){

        $("span.service_status").text("");
        $("button.com-reconnect").addClass("hide");
        mqtt_client.subscribe(["v1/vspc/#", "v1/update/+"], {qos: 0});
        $("button.com_open").attr('disabled', false);
        $("button.message_monitor").attr('disabled', false);
        $("span.service_status").html(" ");
        $("span.local_status").html("服务正常");

    }else{

        $("span.service_status").html("    未能连接到远程编程服务，请确认freeioe_Rprogramming是否安装并运行。下载  <a href='http://thingscloud.oss-cn-beijing.aliyuncs.com/download/freeioe_Rprogramming.zip'  class='navbar-link'>freeioe_Rprogramming</a>");
        $("span.local_status").html("服务异常");
        $("button.com-reconnect").removeClass("hide");
        $("button.com_open").attr('disabled', true);
        $("button.message_monitor").attr('disabled', true);
        vircom ={};
    }

    // console.log("is null:::::::::",$.isEmptyObject(vircom));
    if($.isEmptyObject(vircom))
        {
            $("button.com_open").text('开启');
            $("button.com_open").removeClass('btn-danger');
            $("button.com_open").data('opened',0);
            $("select.config_com").attr('disabled',false);
            $("button.message_monitor").addClass('hide');

            $("span.related_gate").text('-----');
            $("span.local_com").text('');
            $("span.com_parameters").text('');
            $("span.com_status").text('');
            $("span.com_proc").text('');
            $("span.com_peer").text('');
            $("span.com_peer_state").text('');
            $("span.com_received").text('');
            $("span.net_received").text('');

            $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
            $("div.message_log").addClass('hide');
            $("button.message_monitor").removeClass('btn-danger');
            $("button.message_monitor").text('监视');
            $("button.message_monitor").data('monitored',0);
            $("button.message-pause").data('paused',0);
            $("button.message-pause").text('暂停');
            $("button.message-pause").addClass('btn-warning');
            table_log.clear().draw();
            $("span.message_lens_feedback").text('');

        }
    else
        {
        $("button.com_open").text('停止');
        $("button.com_open").addClass('btn-danger');
        $("button.com_open").data('opened',1);
        $("select.config_com").attr('disabled',true);
        $("button.message_monitor").removeClass('hide');

        $("span.related_gate").text(vircom.info.sn);
        $("span.selected_com").text(vircom.info.com_cfg.serial.toUpperCase());
        $("select[name=port]").val(vircom.info.com_cfg.serial);
        $("select[name=baudrate]").val(vircom.info.com_cfg.baudrate);
        $("select[name=data_bits]").val(vircom.info.com_cfg.databit);
        $("select[name=stop_bits]").val(vircom.info.com_cfg.stopbit);
        $("select[name=parity]").val(vircom.info.com_cfg.parity);

        $("span.local_com").text(vircom.name);


        if(vircom.BaudRate){
            var DataBits = '8';
            var StopBits = '1';
            var Parity = '0';
            var Parity_arr = {'0': "N", "1":"O", "2":"E"};
            if(vircom.DataBits){
                DataBits = vircom.DataBits;

            }
            if(vircom.StopBits){
                StopBits = vircom.StopBits;

            }
            if(vircom.Parity){
                Parity = vircom.Parity;
            }
            $("span.com_parameters").text(vircom.BaudRate+'/'+DataBits+'/'+Parity_arr[Parity]+'/'+StopBits);
        }

        if(vircom.pid>0){
            $("span.com_status").text('已打开');
        }else{
            $("span.com_status").text('已关闭');
        }
        if(vircom.app_path){
            $("span.com_proc").text(vircom.app_path.split("\\")[vircom.app_path.split("\\").length-1]);
        }

        $("span.com_peer").text(vircom.host + ":" + vircom.port);
        $("span.com_peer_state").text(vircom.peer_state);
        $("span.com_received").text(vircom.recv_count+ '/' + vircom.send_count);
        $("span.net_received").text(vircom.peer_recv_count + '/' +vircom.peer_send_count);

    }

    if(remote_current_com){
        $("span.current_com").html('ser2net_'+remote_current_com);
    }

    if(remote_comstate_object){
        $("span.ser2net_status").html(remote_comstate_object);
    }


},1000);

/**
 *	周期获取数据
 */
get_freeioe_Vserial_data(gate_sn);
var mqtt_status_ret= setInterval(function(){
    get_freeioe_Vserial_data(gate_sn);
},3000);

var message_lens_ret= setInterval(function(){
    var lens=table_log.data().length;
    if(lens>500){
        $("button.message-pause").data('paused',1);
        $("button.message-pause").text('恢复');
        $("span.message_lens_feedback").text('报文缓冲区已满');
    }else{

    }

},5000);

setTimeout(function(){
    $("button.com-loading").addClass('hide');
    if(mqttc_connected){
        $("button.com_open").removeClass('hide');
    }

    if (mqttc_connected) {
        keep_alive_local(mqttc_connected, mqtt_client);
    }
    keep_alive_remote();

},2000);

$("select.com_select").change(function(){
    var key = $(this).val();
    // console.log(key);
    $("span.selected_com").text(key.toUpperCase());
});

$("button.com-reconnect").click(function(){
    if(!mqttc_connected){
        connect();
    }
    setTimeout(function(){
        if(mqttc_connected){
            $("button.com_open").removeClass('hide');
        }
    },2000);
});

$("button.com_open").click(function(){

    if($("button.com_open").data('opened')==1){
        console.log("aaaaaaaaaa");
        var id = "remove_local_com/"+ Date.parse(new Date());
        var message = {
            "id":id,
            "by_name": 1,
            "name": vircom.name.toUpperCase()
        };
        remove_local_com(mqttc_connected, mqtt_client, message);

    }else{
        console.log("bbbbbbbbbb");
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


$("span.frps_host").click(function(){
    check_servers_list(mqttc_connected, mqtt_client);
});


$("button.message_monitor").click(function(){

    if($("button.message_monitor").data('monitored')==1){
        $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
        $("div.message_log").addClass('hide');
        $("button.message_monitor").removeClass('btn-danger');
        $("button.message_monitor").text('监视');
        $("button.message_monitor").data('monitored',0);
        $("button.message-pause").data('paused',0);
        $("button.message-pause").text('暂停');
        $("button.message-pause").addClass('btn-warning');
        table_log.clear().draw();
        $("span.message_lens_feedback").text('');
    }else{
        $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
        $("div.message_log").removeClass('hide');
        $("button.message_monitor").addClass('btn-danger');
        $("button.message_monitor").text('停止');
        $("button.message_monitor").data('monitored',1);
    }

});

$("button.message-pause").click(function(){

    if($("button.message-pause").data('paused')==1){
        var lens=table_log.data().length;
        if(lens<500){
            $("button.message-pause").data('paused',0);
            $("button.message-pause").text('暂停');
            $("button.message-pause").addClass('btn-warning');
        }

    }else{

            $("button.message-pause").data('paused',1);
            $("button.message-pause").text('恢复');
            $("button.message-pause").removeClass('btn-warning');

    }

});

$("button.message-clear").click(function(){
    table_log.clear().draw();
    $("span.message_lens_feedback").text('');
});

