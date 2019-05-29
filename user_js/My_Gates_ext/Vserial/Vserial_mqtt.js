
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
 *	获取当前时间
 */
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "/";
    var seperator2 = ":";
    var month = date.getMonth() + 1<10? "0"+(date.getMonth() + 1):date.getMonth() + 1;
    var strDate = date.getDate()<10? "0" + date.getDate():date.getDate();
    var sec = date.getSeconds() + 1<10? "0"+(date.getSeconds() + 1):date.getSeconds() + 1;
    var currentdate = date.getFullYear() + seperator1  + month  + seperator1  + strDate
        + " "  + date.getHours()  + seperator2  + date.getMinutes()
        + seperator2 + sec;
    return currentdate;
}

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
    if (responseObject.errorCode !== 0) {
        logMessage("INFO", "Connection Lost. [Error Message: ", responseObject.errorMessage, "]");
    }
    mqttc_connected = false;
    log_subscribed = false;
    comm_subscribed = false;
}

// called when a message arrives
function onMessageArrived(message) {
    // console.log("topic: ",message.destinationName);
    // var arr_topic = message.destinationName.split("/");
    var socket_reg = RegExp(/SOCKET_STREAM/);
    var vspax_reg = RegExp(/VSPAX_STREAM/);
    var vspax_status_reg = RegExp(/VSPAX_STATUS/);
    var vspax_notify_reg = RegExp(/VSPAX_NOTIFY/);

    var vspc_reg = RegExp(/VSPC_STREAM/);
    var vspc_status_reg = RegExp(/VSPC_STATUS/);
    var vspc_notify_reg = RegExp(/VSPC_NOTIFY/);

    var _topic = message.destinationName;
    // logMessage("INFO", "Message Recieved: [Topic: ", message.destinationName, ", Payload: ", message.payloadString, ", QoS: ", message.qos, ", Retained: ", message.retained, ", Duplicate: ", message.duplicate, "]");


    if(_topic==="v1/update/api/RESULT"){
        var q = action_result_list;
        if(q==null || q.length<1){
            return false;
        }else{
            for (var i = 0; i < q.length; i++) {

                var ret = JSON.parse(message.payloadString);
                console.log(q[i], ret.id);
                var arr_action = ret.id.split("/");
                console.log(arr_action, ret.result);
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

    if(_topic==="v1/vspax/api/RESULT"){
        var q = action_result_list;
        if(q==null || q.length<1){
            return false;
        }else{
            for (var i = 0; i < q.length; i++) {
                console.log(q[i]);
                // logMessage("INFO", "Message Recieved: [Topic: ", message.destinationName, ", Payload: ", message.payloadString, ", QoS: ", message.qos, ", Retained: ", message.retained, ", Duplicate: ", message.duplicate, "]");
                var ret = JSON.parse(message.payloadString);
                console.log(ret.id, ret);
                var arr_action = ret.id.split("/");
                if(ret.id==q[i] && ret.result){


                    if(arr_action[0]=='query_local_Vcoms'){
                        if(ret.data.vir){

                        }
                    }

                    if(arr_action[0]=='query_local_coms'){
                        // local_coms = ret.data.phy.concat(ret.data.vir);
                        local_coms = ret.data;
                        console.log("local_coms:::",local_coms);
                        for (var j=1;j<100;j++){
                            if($.inArray("COM"+j, local_coms) == -1){
                                var valid_com  = "COM"+j;
                                console.log("valid_com:::",valid_com);
                                var com_cfg = {
                                    "server_addr":$("select.frps_host").val(),
                                    "serial":$("select[name=port]").val(),
                                    "baudrate":$("select[name=baudrate]").val(),
                                    "databit":$("select[name=data_bits]").val(),
                                    "stopbit":$("select[name=stop_bits]").val(),
                                    "parity":$("select[name=parity]").val()
                                };

                                $("span.remote_action_feedback").text("串口映射服务启动中…");
                                post_freeioe_Vserial_data(gate_sn, gate_sn+'.freeioe_Vserial', 'serial_config', com_cfg);
                                remote_mapport_object = null;
                                var remote_comstate_status_ret= setInterval(function(){

                                if(remote_mapport_object){
                                    var peer = remote_mapport_object.split(":");
                                    console.log('peer::',peer);
                                    if( parseInt(peer[1]) > 0){
                                        var id = "add_local_com/"+ Date.parse(new Date());
                                        var message = {
                                            "id":id,
                                            "by_name": 1,
                                            "name": valid_com.toUpperCase(),
                                            "peer": {
                                                "type":"tcp_client",
                                                "host": peer[0],
                                                "port": parseInt(peer[1]),
                                                "info":{"sn": gate_sn, "com_cfg": com_cfg, "serial_driver":serial_driver}
                                            }
                                        };
                                        console.log(message);
                                        add_local_com(mqttc_connected, mqtt_client, message);
                                        clearInterval(remote_comstate_status_ret);
                                        $("span.remote_action_feedback").text("");
                                    }

                                }


                                },2000);



                                break;
                            }
                        }
                    }

                    if(arr_action[0]=='add_local_com'){

                        console.log(ret);
                    }

                    if(arr_action[0]=='remove_local_com'){
                        vircom ={};
                        console.log(ret);

                        post_freeioe_Vserial_data(gate_sn, gate_sn+'.freeioe_Vserial', 'serial_stop', {"serial":$("select[name=port]").val()});
                    }

                    q.splice(i,1);
                }else{
                    $("span.local_action_feedback").text(ret.error);
                    // if(arr_action[0]=='remove_local_com'){
                    //     vircom ={};
                    //     console.log(ret);
                    //     post_freeioe_Vserial_data(gate_sn, gate_sn+'.freeioe_Vserial', 'serial_stop', {"serial":$("select[name=port]").val()});
                    // }
                }


            }


        }




    }


    if(_topic==="v1/vspc/api/RESULT"){
        var q = action_result_list;
        if(q==null || q.length<1){
            return false;
        }else{
            for (var i = 0; i < q.length; i++) {
                console.log(q[i]);
                // logMessage("INFO", "Message Recieved: [Topic: ", message.destinationName, ", Payload: ", message.payloadString, ", QoS: ", message.qos, ", Retained: ", message.retained, ", Duplicate: ", message.duplicate, "]");
                var ret = JSON.parse(message.payloadString);
                console.log(ret.id, ret);
                var arr_action = ret.id.split("/");
                if(ret.id==q[i] && ret.result){


                    if(arr_action[0]=='query_local_Vcoms'){
                        if(ret.data.vir){

                        }
                    }

                    if(arr_action[0]=='query_local_coms'){
                        local_coms = ret.data.phy.concat(ret.data.vir);
                        // local_coms = ret.data;
                        console.log("local_coms:::",local_coms);
                        for (var j=1;j<100;j++){
                            if($.inArray("COM"+j, local_coms) == -1){
                                var valid_com  = "COM"+j;
                                console.log("valid_com:::",valid_com);
                                var com_cfg = {
                                    "server_addr":$("select.frps_host").val(),
                                    "serial":$("select[name=port]").val(),
                                    "baudrate":$("select[name=baudrate]").val(),
                                    "databit":$("select[name=data_bits]").val(),
                                    "stopbit":$("select[name=stop_bits]").val(),
                                    "parity":$("select[name=parity]").val()
                                };

                                $("span.remote_action_feedback").text("串口映射服务启动中…");
                                post_freeioe_Vserial_data(gate_sn, gate_sn+'.freeioe_Vserial', 'serial_config', com_cfg);
                                remote_mapport_object = null;
                                var remote_comstate_status_ret= setInterval(function(){

                                    if(remote_mapport_object){
                                        var peer = remote_mapport_object.split(":");
                                        console.log('peer::',peer);
                                        if( parseInt(peer[1]) > 0){
                                            var id = "add_local_com/"+ Date.parse(new Date());
                                            var message = {
                                                "id":id,
                                                "by_name": 1,
                                                "name": valid_com.toUpperCase(),
                                                "peer": {
                                                    "type":"tcp_client",
                                                    "host": peer[0],
                                                    "port": parseInt(peer[1]),
                                                    "info":{"sn": gate_sn, "com_cfg": com_cfg, "serial_driver":serial_driver}
                                                }
                                            };
                                            console.log(message);
                                            add_local_com(mqttc_connected, mqtt_client, message);
                                            clearInterval(remote_comstate_status_ret);
                                            $("span.remote_action_feedback").text("");
                                        }

                                    }


                                },2000);



                                break;
                            }
                        }
                    }

                    if(arr_action[0]=='add_local_com'){

                        console.log(ret);
                    }

                    if(arr_action[0]=='remove_local_com'){
                        vircom ={};
                        console.log(ret);

                        post_freeioe_Vserial_data(gate_sn, gate_sn+'.freeioe_Vserial', 'serial_stop', {"serial":$("select[name=port]").val()});
                    }

                    q.splice(i,1);
                }else{
                    $("span.local_action_feedback").text(ret.error);
                    // if(arr_action[0]=='remove_local_com'){
                    //     vircom ={};
                    //     console.log(ret);
                    //     post_freeioe_Vserial_data(gate_sn, gate_sn+'.freeioe_Vserial', 'serial_stop', {"serial":$("select[name=port]").val()});
                    // }
                }


            }


        }




    }



    // else if(socket_reg.test(_topic)){
    //
    //     if($("button.message_monitor").data('monitored')==1){
    //         var topic_arr = _topic.split("/");
    //         var timestamp = Date.parse(new Date());
    //         var device_comm = CharToHex(base64decode(message.payloadString));
    //         // console.log(timestamp);
    //         // console.log(topic_arr);
    //         // console.log(message.payloadString);
    //
    //         var arrayObj = [
    //             new Date(timestamp).toLocaleString('zh',{hour12:false}),
    //             topic_arr[0],
    //             topic_arr[2],
    //             device_comm
    //         ]
    //         table_log.row.add(arrayObj).draw();
    //
    //     }
    // }


        if(vspax_reg.test(_topic)){
            // console.log(message.payloadString)
            // console.log("dddd::::::",($("button.message_monitor").data('monitored')==1 ));
            // console.log("dddd::::::",($("button.message-pause").data('paused')!==1));
            // console.log("dddd::::::",($("button.message_monitor").data('monitored')==1 && $("button.message-pause").data('paused')!==1));
            if($("button.message_monitor").data('monitored')==1 && $("button.message-pause").data('paused')!==1){


                var topic_arr = _topic.split("/");

                if(vircom.name == topic_arr[3]){
                    var timestamp = Date.parse(new Date());
                    var device_comm = CharToHex(base64decode(message.payloadString));
                    var arrayObj = [
                        new Date(timestamp).toLocaleString('zh',{hour12:false}),
                        '串口',
                        topic_arr[4],
                        device_comm
                    ]
                    table_log.row.add(arrayObj).draw();
                }


            }
        }

        if(vspax_status_reg.test(_topic)){
            var ret = JSON.parse(message.payloadString);
            // console.log("topic: ",ret.name);

            if(ret.host+":"+ret.port == remote_mapport_object){
                vircom = ret;
            }
        }

        if(vspax_notify_reg.test(_topic)){
            var ret = JSON.parse(message.payloadString);
            console.log("notify: ",ret);

        }



        if(vspc_reg.test(_topic)){
            // console.log(message.payloadString)
            // console.log("dddd::::::",($("button.message_monitor").data('monitored')==1 ));
            // console.log("dddd::::::",($("button.message-pause").data('paused')!==1));
            // console.log("dddd::::::",($("button.message_monitor").data('monitored')==1 && $("button.message-pause").data('paused')!==1));
            if($("button.message_monitor").data('monitored')==1 && $("button.message-pause").data('paused')!==1){


                var topic_arr = _topic.split("/");

                if(vircom.name == topic_arr[3]){
                    var timestamp = Date.parse(new Date());
                    var device_comm = CharToHex(base64decode(message.payloadString));
                    var arrayObj = [
                        new Date(timestamp).toLocaleString('zh',{hour12:false}),
                        '串口',
                        topic_arr[4],
                        device_comm
                    ]
                    table_log.row.add(arrayObj).draw();
                }


            }
        }

        if(vspc_status_reg.test(_topic)){
            var ret = JSON.parse(message.payloadString);
            // console.log("topic: ",ret.name);

            if(ret.host+":"+ret.port == remote_mapport_object){
                vircom = ret;
            }
        }

        if(vspc_notify_reg.test(_topic)){
            var ret = JSON.parse(message.payloadString);
            console.log("notify: ",ret);

        }






}

function connectionToggle() {

    if (connected) {
        disconnect();
    } else {
        connect();
    }

}


function connect() {
    var hostname = "127.0.0.1";
    var port = "7884";
    var clientId = "webclient-vspc";

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

