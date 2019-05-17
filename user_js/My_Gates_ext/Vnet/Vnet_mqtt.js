
// Create a client instance
mqtt_client =null;
mqttc_connected = false;


/**
 *	临时兼容IE，去掉可变参数
 */
// function logMessage(type, content) {
//     if (type === "INFO") {
//         console.info(content);
//     } else if (type === "ERROR") {
//         console.error(content);
//     } else {
//         console.log(content);
//     }
// }


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

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

logMessage("INFO", "Starting Eclipse Paho JavaScript Utility.");

// Things to do as soon as the page loads
// document.getElementById("clientIdInput").value = "js-utility-" + makeid();

var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;

    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if(i == len)
        {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if(i == len)
        {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;

    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while(i < len && c1 == -1);
        if(c1 == -1)
            break;

        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while(i < len && c2 == -1);
        if(c2 == -1)
            break;

        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if(c3 == 61)
                return out;
            c3 = base64DecodeChars[c3];
        } while(i < len && c3 == -1);
        if(c3 == -1)
            break;

        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if(c4 == 61)
                return out;
            c4 = base64DecodeChars[c4];
        } while(i < len && c4 == -1);
        if(c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}

function utf16to8(str) {
    var out, i, len, c;

    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        }
    }
    return out;
}

function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = str.length;
    i = 0;
    while(i < len) {
        c = str.charCodeAt(i++);
        switch(c >> 4)
        {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
            // 0xxxxxxx
            out += str.charAt(i-1);
            break;
            case 12: case 13:
            // 110x xxxx   10xx xxxx
            char2 = str.charCodeAt(i++);
            out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
            break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }

    return out;
}

function CharToHex(str) {
    var out, i, len, c, h;

    out = "";
    len = str.length;
    i = 0;
    while(i < len)
    {
        c = str.charCodeAt(i++);
        h = c.toString(16);
        if(h.length < 2)
            h = "0" + h;
        out += h + " ";
        /*                out += "\\x" + h + " ";
                        if(i > 0 && i % 8 == 0)
                            out += "\r\n";*/
    }

    return out;
}

// called when the client connects
function onConnect(context) {
    // Once a connection has been made, make a subscription and send a message.
    var connectionString = context.invocationContext.host + ":" + context.invocationContext.port + context.invocationContext.path;
    logMessage("INFO", "Connection Success ", "[URI: ", connectionString, ", ID: ", context.invocationContext.clientId, "]");
    // var statusSpan = document.getElementById("connectionStatus");
    // statusSpan.innerHTML = "Connected to: " + connectionString + " as " + context.invocationContext.clientId;
    mqttc_connected = true;

}


function onConnected(reconnect, uri) {
    // Once a connection has been made, make a subscription and send a message.
    logMessage("INFO", "Client Has now connected: [Reconnected: ", reconnect, ", URI: ", uri, "]");
    mqttc_connected = true;


}

function onFail(context) {
    logMessage("ERROR", "Failed to connect. [Error Message: ", context.errorMessage, "]");
    // var statusSpan = document.getElementById("connectionStatus");
    // statusSpan.innerHTML = "Failed to connect: " + context.errorMessage;
    mqttc_connected = false;
    log_subscribed = false;
    comm_subscribed = false;

}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    console.log(responseObject);
    if (responseObject.errorCode !== 0) {
        logMessage("INFO", "Connection Lost. [Error Message: ", responseObject.errorMessage, "]");
    }
    mqttc_connected = false;
    log_subscribed = false;
    comm_subscribed = false;
}

// called when a message arrives
function onMessageArrived(message) {
    // console.log(message);
    // var arr_topic = message.destinationName.split("/");
    var dest_reg = RegExp(/DEST_STATUS/);
    var _topic = message.destinationName;
    // logMessage("INFO", "Message Recieved: [Topic: ", message.destinationName, ", Payload: ", message.payloadString, ", QoS: ", message.qos, ", Retained: ", message.retained, ", Duplicate: ", message.duplicate, "]");
    if(message.payloadString!=='null'){
        if(_topic==="v1/vnet/VNET_STATUS/SERVICES"){
            if(message.payloadString){
                var ret = JSON.parse(message.payloadString);
                // console.log("SERVICES: ",ret);
                if(ret.is_running){
                    vnet_obj.is_running = ret.is_running;
                }
                $("span.frpc_Vnet_status").text(ret.frpc_Vnet_service);
                $("span.bridge_status").text(ret['tinc.tofreeioebridge']);
                $("span.router_status").text(ret['tinc.tofreeioerouter']);
            }


        }

        if(_topic==="v1/vnet/VNET_STATUS/CONFIG"){
            if(message.payloadString){
                var ret = JSON.parse(message.payloadString);
                vnet_obj.is_running = ret.is_running;
                if(ret.vnet_cfg){
                    vnet_obj.vnet_cfg =ret.vnet_cfg;
                }
            }


            // console.log("CONFIG: ",ret);
        }

        if(dest_reg.test(_topic)){
            if(message.payloadString){
                var ret = JSON.parse(message.payloadString);
                $("span.ping_devip_result").text(ret.message);
                $("span.ping_devip_delay").text(ret.delay);
                if(ret.message=='online'){
                    $("span.ping_devip_result").addClass('text-success');
                }else{
                    $("span.ping_devip_result").removeClass('text-success');
                }
            }


            // console.log("CONFIG: ",ret);
        }

        if(_topic==="v1/vnet/PROXY_STATUS/LOCAL_PROXY"){

            if(message.payloadString){
                var ret = JSON.parse(message.payloadString);
                $("span.local_link_result").text(ret.status);
                if(ret.status=='running'){
                    $("span.local_link_result").addClass('text-success');
                }else{
                    $("span.local_link_result").removeClass('text-success');
                }
            }

        }

        if(_topic==="v1/vnet/PROXY_STATUS/CLOUD_PROXY"){
            if(message.payloadString){
                var ret = JSON.parse(message.payloadString);
                // console.log("CLOUD_PROXY: ",ret);

                $("span.cloud_tunnel_name").text(ret.name);
                $("span.this_start_time").text(ret.last_start_time);
                $("span.today_Traffic_data").text( Math.ceil((ret.today_traffic_in + ret.today_traffic_out)/1024) + " KB");

                if(ret.cur_conns>0){
                    $("span.cloud_tunnel_status").text('connected');
                    $("span.cloud_tunnel_status").addClass('text-success');
                }else{
                    $("span.cloud_tunnel_status").text('disconnected');
                    $("span.cloud_tunnel_status").removeClass('text-success');
                }
            }


        }

        if(_topic==="v1/update/api/RESULT"){
            var q = action_result_list;
            if(q==null || q.length<1){
                return false;
            }else{
                for (var i = 0; i < q.length; i++) {

                    var ret = JSON.parse(message.payloadString);
                    //console.log(q[i], ret.id);
                    var arr_action = ret.id.split("/");
                    // console.log(arr_action, ret.result);
                    if (ret.id == q[i]) {
                        if(arr_action[0]=='check_version'){
                            var html_version = '已是最新版本！';
                            if(ret.data.update){
                                html_version = '<button type="button" class="btn btn-sm update_lastest" >升级到最新版</button>';
                                freeioe_Rprogramming_lastest = ret.data;
                            }
                            $("span.check_local_version").html(html_version);
                        }


                        if(arr_action[0]=='update_lastest'){
                            console.log("update_lastest", ret);
                                update_status_ret= setInterval(function(){
                                    check_update_status(mqttc_connected, mqtt_client);
                                },1000);
                        }

                        if(arr_action[0]=='check_update_status'){
                            console.log("check_update_status", ret);
                            if(ret.data.status!=='upgrading'){
                                clearInterval(update_status_ret);


                                setTimeout(function(){

                                        $("button.update_lastest").attr('disabled', false);

                                        $("button.update_lastest").addClass('hide');

                                        $("button.start_vpn").removeClass('hide');

                                },6000);

                            }

                        }

                        if(arr_action[0]=='check_servers_list'){
                            console.log("_servers_list::::::", ret.data);
                            if(ret.data!=='no_servers'){
                                $("select.frps_host").empty();

                                $.each(ret.data,function(index,value){
                                    console.log(value)
                                    var html = '<option value="'+ value.host +'" >'+ value.desc + '------' + value.delay +'</option>';

                                    $("select.frps_host").append(html);
                                });

                            }

                        }

                    }

                }
            }
        }

        if(_topic==="v1/vnet/api/RESULT"){
            logMessage("INFO", "Message Recieved: [Topic: ", message.destinationName, ", Payload: ", message.payloadString, ", QoS: ", message.qos, ", Retained: ", message.retained, ", Duplicate: ", message.duplicate, "]");

            var q = action_result_list;
            if(q==null || q.length<1){
                return false;
            }else{
                //console.log(q);
                for (var i = 0; i < q.length; i++) {

                    var ret = JSON.parse(message.payloadString);
                    //console.log(q[i], ret.id);
                    var arr_action = ret.id.split("/");
                    // console.log(arr_action, ret.result);
                    if(ret.id==q[i])
                    {

                        if(arr_action[0]=='check_env'){
                            console.log(ret);
                            vnet_obj.env = true;
                            $.each(ret.data, function(k, v) {
                                // console.log(k,v);
                                if (!(v)){
                                    vnet_obj.env = false;
                                    return false;
                                }
                            });
                            var html_env = '<span class="text-success">运行环境正常</span>';
                            var tap_nic_icon = '<i class="glyphicon glyphicon-remove"></i>';
                            var frpc_bin_icon = '<i class="glyphicon glyphicon-remove"></i>';
                            var frpc_Vnet_service_icon = '<i class="glyphicon glyphicon-remove"></i>';
                            var tinc_bin_icon = '<i class="glyphicon glyphicon-remove"></i>';
                            var tofreeioebridge_icon = '<i class="glyphicon glyphicon-remove"></i>';
                            var tofreeioerouter_icon = '<i class="glyphicon glyphicon-remove"></i>';
                            if(!vnet_obj.env){
                                if(ret.data.tap_nic){
                                    tap_nic_icon = '<i class="glyphicon glyphicon-ok"></i>';
                                }
                                if(ret.data.frpc_bin){
                                    frpc_bin_icon = '<i class="glyphicon glyphicon-ok"></i>';
                                }
                                if(ret.data.frpc_Vnet_service ){
                                    frpc_Vnet_service_icon = '<i class="glyphicon glyphicon-ok"></i>';
                                }
                                if(ret.data.tinc_bin){
                                    tinc_bin_icon = '<i class="glyphicon glyphicon-ok"></i>';
                                }
                                if(ret.data["tinc.tofreeioebridge"]){
                                    tofreeioebridge_icon = '<i class="glyphicon glyphicon-ok"></i>';
                                }
                                if(ret.data["tinc.tofreeioerouter"]){
                                    tofreeioerouter_icon = '<i class="glyphicon glyphicon-ok"></i>';
                                }
                                html_env = '<span class="text-danger">运行环境异常 </span><button type="button" class="btn btn-sm  one_key_repair">一键修复</button>'

                            }
                            //console.log(html_env);
                            $("span.check_env_result").html(html_env);



                        }

                        if(arr_action[0]=='query_taps'){

                        }

                        if(arr_action[0]=='start_vnet'){
                            console.log(ret);

                            var id = "post_gate/"+ Date.parse(new Date());
                            var message = {
                                "id":id,
                                "auth_code":$("span.user-name").data("accesskey"),
                                "output": "vnet_config"
                            };

                            setTimeout(function(){
                                if(mqttc_connected){
                                    post_to_gate(mqttc_connected, mqtt_client, message);
                                }
                            },2000);

                        }


                        if(arr_action[0]=='stop_vnet'){
                            vnet_obj ={};
                            console.log(ret);
                            $("span.service_stop").text('----');
                            if(ret.data.services_start){

                            }
                            if(ret.data.services_stop){
                                var id = "post_gate/"+ Date.parse(new Date());
                                var message = {
                                    "id":id,
                                    "auth_code":$("span.user-name").data("accesskey"),
                                    "output": "vnet_stop"
                                };

                                setTimeout(function(){
                                    if(mqttc_connected){
                                        post_to_gate(mqttc_connected, mqtt_client, message);
                                    }
                                },2000);


                            }

                        }

                        if(arr_action[0]=='fix_env'){
                            console.log(ret);

                            setTimeout(function(){
                                  if(mqttc_connected){
                                    var id = "check_env/"+ Date.parse(new Date());
                                    var message = {
                                        "id":id
                                    };
                                    check_env(mqttc_connected, mqtt_client, message);
                                }else{
                                    $("button.check_env").removeClass('hide');
                                }
                            },3000);

                        }

                        if(arr_action[0]=='post_gate'){
                            console.log(ret);

                        }

                        q.splice(i,1);

                    }
                    else
                    {
                        if(arr_action[0]=='stop_vnet'){
                            vnet_obj ={};
                            console.log(ret);

                        }
                    }


                }

            }
        }

    }




}

function connect() {
    var hostname = "127.0.0.1";
    var port = "7884";
    var clientId = "webclient_vnet";

    var path = "/mqtt";
    // var user = getCookie('usr');
    // var pass = $.cookie('sid');
    // var pass = "Pa88word";
    var keepAlive = 60;
    var timeout = 3;
    var tls = false;
    var reconnect = true;
    var cleanSession = true;
    var lastWillTopic = null;
    var lastWillQos = 0;
    var lastWillRetain = false;
    var lastWillMessage = null;


    if (path.length > 0) {
        mqtt_client =new Paho.Client(hostname, Number(port), path, clientId);
    } else {
        mqtt_client =new Paho.Client(hostname, Number(port), clientId);
    }
    logMessage("INFO", "Connecting to Server: [Host: ", hostname, ", Port: ", port, ", Path: ", mqtt_client.path, ", ID: ", clientId);

    // set callback handlers
    mqtt_client.onConnectionLost = onConnectionLost;
    mqtt_client.onMessageArrived = onMessageArrived;
    mqtt_client.onConnected = onConnected;


    var options = {
        invocationContext: { host: hostname, port: port, path: mqtt_client.path, clientId: clientId },
        timeout: timeout,
        keepAliveInterval: keepAlive,
        cleanSession: cleanSession,
        useSSL: tls,
        reconnect: reconnect,
        onSuccess: onConnect,
        onFailure: onFail
    };



    // if (user.length > 0) {
    //     options.userName = user;
    // }
    //
    // if (pass.length > 0) {
    //     options.password = pass;
    // }

    if (lastWillTopic) {
        var lastWillMessage = new Paho.Message(lastWillMessage);
        lastWillMessage.destinationName = lastWillTopic;
        lastWillMessage.qos = lastWillQos;
        lastWillMessage.retained = lastWillRetain;
        options.willMessage = lastWillMessage;
    }

    // connect the client
    try {
        mqtt_client.connect(options);
    } catch (error) {
        mqttc_connected = false;
        console.log(error);
        $.notify({
            title: "<strong>连接MQTT失败:</strong><br><br> ",
            message: error
        },{
            type: 'warning'
        });

    }

    console.log();


    // var statusSpan = document.getElementById("connectionStatus");
    // statusSpan.innerHTML = "Connecting...";
}

function disconnect() {
    logMessage("INFO", "Disconnecting from Server.");
    mqtt_client.disconnect();
    // var statusSpan = document.getElementById("connectionStatus");
    // statusSpan.innerHTML = "Connection - Disconnected.";
    mqttc_connected = false;
    log_subscribed = false;
    comm_subscribed = false;

}

function publish() {
    var topic = document.getElementById("publishTopicInput").value;
    var qos = document.getElementById("publishQosInput").value;
    var message = document.getElementById("publishMessageInput").value;
    var retain = document.getElementById("publishRetainInput").checked;
    logMessage("INFO", "Publishing Message: [Topic: ", topic, ", Payload: ", message, ", QoS: ", qos, ", Retain: ", retain, "]");
    message = new Paho.Message(message);
    message.destinationName = topic;
    message.qos = Number(qos);
    message.retained = retain;
    mqtt_client.send(message);
}

function subscribe() {
    var topic = document.getElementById("subscribeTopicInput").value;
    var qos = document.getElementById("subscribeQosInput").value;
    logMessage("INFO", "Subscribing to: [Topic: ", topic, ", QoS: ", qos, "]");
    mqtt_client.subscribe(topic, { qos: Number(qos) });
}

function unsubscribe() {
    var topic = document.getElementById("subscribeTopicInput").value;
    logMessage("INFO", "Unsubscribing: [Topic: ", topic, "]");
    mqtt_client.unsubscribe(topic, {
        onSuccess: unsubscribeSuccess,
        onFailure: unsubscribeFailure,
        invocationContext: { topic: topic }
    });
}

function unsubscribeSuccess(context) {
    logMessage("INFO", "Unsubscribed. [Topic: ", context.invocationContext.topic, "]");
}

function unsubscribeFailure(context) {
    logMessage("ERROR", "Failed to unsubscribe. [Topic: ", context.invocationContext.topic, ", Error: ", context.errorMessage, "]");
}

function clearHistory() {
    var table = document.getElementById("incomingMessageTable");
    //or use :  var table = document.all.tableid;
    for (var i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }

}

