var gate_sn  = getParam('sn');
var inst = getParam('inst');
var appid = getParam('appid');
console.log(gate_sn, inst);
var pagename = "Gates_apps_monitor";
var log_subscribed = false;
var comm_subscribed = false;
var app_devslist = new Array();
var is_beta = 0;

gate_info(gate_sn);
gate_app_detail(gate_sn, inst, pagename);

setTimeout(function () {
    gate_app_dev_tree(gate_sn, appid);
    connect();
},1000);

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

    /**
     *	初始化报文表格
     */
    table_comm = $('#table_comm').DataTable({
        "dom": '',
        "deferRender": true,
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
        fixedColumns: true,
        columnDefs: [
            {
                //   指定第第1列
                targets:  0,
                searchable: false,
                orderable: false,
                "width": '14%'
            },
            {
                //   指定第第2列
                targets:  1,
                "width": '25%',
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
                "width": '53%',
                searchable: true,
                orderable: false
            }
        ],
        "initComplete": function(settings, json) {
            console.log("table_comm init over")
        }
    });

})

/**
 *	周期检测mqtt状态
 */
var mqtt_status_ret= setInterval(function(){
    $(".log_nums").text(table_log.data().length);
    $(".comm_nums").text(table_comm.data().length);
    if(mqttc_connected){
        $(".appinfo-upload").text("停止");
        $(".appinfo-upload").addClass("btn-warning");
        $(".appinfo-upload").removeClass("btn-primary");
    }else{
        $(".appinfo-upload").text("连接");
        $(".appinfo-upload").addClass("btn-primary");
        $(".appinfo-upload").removeClass("btn-warning");
    }
    if(log_subscribed){
        $(".btn-log-subscribe").text("取消订阅");
        $(".btn-log-subscribe").addClass("btn-success");
    }else{
        $(".btn-log-subscribe").text("日志订阅");
        $(".btn-log-subscribe").removeClass("btn-success");
    }
    if(comm_subscribed){
        $(".btn-comm-subscribe").text("取消订阅");
        $(".btn-comm-subscribe").addClass("btn-success");
    }else{
        $(".btn-comm-subscribe").text("报文订阅");
        $(".btn-comm-subscribe").removeClass("btn-success");
    }
},1000);

/**
 *	周期上传日志报文
 */
var mqtt_upload_ret= setInterval(function(){
    var lens=table_log.data().length+table_comm.data().length;
    if(lens<1000){
        if(mqttc_connected){
            if(log_subscribed){
                var id = "sys_enable_log" + '/' + gate_sn + '/'+ Date.parse(new Date())
                var _act = {
                    "device": gate_sn,
                    "data": 60,
                    "id": id
                };
                gate_upload_mes("sys_enable_log", _act)
            }
            if(comm_subscribed){
                var id = "app_upload_comm" + '/' + gate_sn + '/'+ Date.parse(new Date())
                var _act = {
                    "device": gate_sn,
                    "data": {"inst":inst, "sec":60},
                    "id": id
                };
                gate_upload_mes("app_upload_comm", _act)
            }
        }
    }else{
        mqtt_client.unsubscribe(gate_sn + "/" + "log", {
            onSuccess: unsubscribeSuccess,
            onFailure: unsubscribeFailure,
            invocationContext: { topic: gate_sn + "/" + "log" }
        });
        mqtt_client.unsubscribe(gate_sn + "/" + "comm", {
            onSuccess: unsubscribeSuccess,
            onFailure: unsubscribeFailure,
            invocationContext: { topic: gate_sn + "/" + "comm" }
        });
        log_subscribed = false;
        comm_subscribed = false;
        $.notify({
            title: "<strong>记录数超过接收队列:</strong><br><br> ",
            message: "日志和报文记录数已经超过1000，需清除后才可继续接收！"
        },{
            type: 'warning',
            delay: 29000
        });
    }

},30000);

/**
 *	切换到数据浏览页面
 */
$("a.view-rtdata").click(function(){
    var dst_dev = $(this).data("vsn");
    if(dst_dev){
        redirect("/My_Gates_devices_inputs.html?sn="+ gate_sn +"&vsn=" + dst_dev);
    }else{
        var text = '此应用无设备对象或者应用未启动';
        errorAlert(text)
    }

//
});

/**
 *	切换到代码编辑调试页面
 */
$("a.code-debug").click(function(){
    // console.log(is_beta);
    if(is_beta==0){
        var text = '网关未开启调试模式,请在网关设置中开启网关的"调试模式"';
        errorAlert(text);
        return false;
    }
    var gate_sn = getParam('sn');
    var inst = getParam('inst');
    var appid = getParam('appid');
    var owner_login = getCookie('usr');
    var instver = $("span.app-gatever").text();
    var appinfo = localStorage.getItem("app_info/"+ gate_sn + "/" + inst);
    var app_name = '';
    var fork_app = '';
    var fork_ver = '';
    var ver = '--';
    var cloudver = '';
    var isdebug = 0;
    var localapp  = 1;
    var owner = "";
    if(appinfo!=null && typeof(appinfo) != "undefined") {
        appinfo = JSON.parse(appinfo);
        if(appinfo.cloud!=null){
            appid = appinfo.cloud.name;
            app_name = appinfo.cloud.app_name;
            fork_app  = appinfo.cloud.fork_app;
            fork_ver = appinfo.cloud.fork_ver;
            owner = appinfo.cloud.owner;
            cloudver = appinfo.cloud.ver;
            ver = appinfo.info.version;
            localapp  = 0;
        }
        if(owner==owner_login){
            isdebug = 1;
        }else{
            if(fork_app!=null && cloudver==fork_ver){
                isdebug = 1;
            }
            isdebug = 0;
        }
    }

    if(localapp==1){
        var text = '本地应用无法远程调试';
        errorAlert(text);
        return false;
    }

    if(isdebug==1){
        redirect("/My_APP_Debug.html?app=" + appid + "&gate_sn="+ gate_sn +"&app_inst=" + inst + "&version=" +instver);
    }else{
        $("p.debug_tips").html("您不是" + app_name + "的应用所有者，如要继续远程调试，会将此应用当前版本克隆一份到您的账户下，而且在代码调试页面编辑的是您克隆的代码，在代码调试页面下载应用会将克隆到你名下的应用覆盖网关中的应用！<br>如要继续，点击\"继续\"按钮！");
        $("#modal-coder").modal('show');
    }

});
$("button.coder_confirm").click(function(){
    var gate_sn = getParam('sn');
    var inst = getParam('inst');
    var appid = getParam('appid');
    var instver = $("span.app-gatever").text();
    var data = {"app": appid, "version": instver };
    // return false;
    $.ajax({
        url: '/apis/api/method/app_center.appmgr.get_fork',
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'get',
        data: data,
        success: function (req) {
            console.log(req);

            if(req.message instanceof Array && req.message[0]!=null){
                redirect("/My_APP_Debug.html?app=" + req.message[0] + "&gate_sn="+ gate_sn +"&app_inst=" + inst + "&version=" + req.message[1]);
            }else{
                $.ajax({
                    url: '/apis/api/method/app_center.appmgr.fork',
                    headers: {
                        "Accept": "application/json; charset=utf-8",
                        "X-Frappe-CSRF-Token": auth_token
                    },
                    type: 'post',
                    data: data,
                    success: function (req) {
                        console.log(req);
                        $("#modal-coder").modal('show');
                        if(req.message!=''){
                            console.log(req.message);
                            redirect("/My_APP_Debug.html?app=" + req.message + "&gate_sn="+ gate_sn +"&app_inst=" + inst + "&version=" + instver);
                        }else{
                            var text = 'fork应用遇到错误，请联系开发者';
                            errorAlert(text);
                        }

                    },
                    error:function(req){
                        console.log(req);
                        $("#modal-coder").modal('hide');
                        var text = '服务器返回错误';
                        errorAlert(text);
                        if(req.responseJSON._server_messages){
                            var err = JSON.parse(JSON.parse(req.responseJSON._server_messages)[0]);

                            $.notify({
                                title: "<strong>错误提示:</strong><br><br> ",
                                message: err.message
                            },{
                                type: 'warning'
                            });

                        }

                    }
                });


            }
        },
        error:function(req){
            console.log(req);
            var text = '服务器返回错误';
            errorAlert(text);
            $("#modal-coder").modal('hide');
            if(req.responseJSON._server_messages){
                var err = JSON.parse(JSON.parse(req.responseJSON._server_messages)[0]);

                    $.notify({
                        title: "<strong>错误提示:</strong><br><br> ",
                        message: err.message
                    },{
                        type: 'warning'
                    });

            }
        }
    });


});



/**
 *	应用操作动作
 */
$(".app-action").click(function(){
    var app_action = "app_start";
    var oldval = 0;
    var task_desc = '启动应用'+ inst;
    var id = 'start/' + gate_sn + '/'+ inst +'/'+ Date.parse(new Date())
    if($(".app-action:button").text()=="停止"){
        app_action = "app_stop";
        oldval = 1;
        task_desc = '停止应用'+ inst;
        id = 'stop ' + gate_sn + '\'s '+ inst +' '+ Date.parse(new Date())
    }
    var _act = {
        "device": gate_sn,
        "data": {"inst": inst},
        "id": id
    };

    gate_exec_action(app_action, _act, task_desc, inst, app_action, oldval);
});

$(".app-restart").click(function(){
    var app_action = "app_restart";
    var oldval = 0;
    var task_desc = '重启应用'+ inst;
    var id = 'restart/' + gate_sn + '/'+ inst +'/'+ Date.parse(new Date())
    if($(".app-action:button").text()=="停止"){
        oldval = 1;
    }
    var _act = {
        "device": gate_sn,
        "data": {"inst": inst},
        "id": id
    };
    gate_exec_action(app_action, _act, task_desc, inst, app_action, oldval);
});

/**
 *	开启日志和报文上传功能
 */
$(".appinfo-upload").click(function(){

    var info_map=["sys_enable_log", "app_upload_comm"];
    var topic_map=["log", "comm"];
    var app_action = info_map[$(".nav-tabs li.active").index()];
    var topic = gate_sn + "/" + topic_map[$(".nav-tabs li.active").index()];
    var id = info_map[$(".nav-tabs li.active").index()] + '/' + gate_sn + '/'+ Date.parse(new Date())
    var _act_log = {
        "device": gate_sn,
        "data": 60,
        "id": id
    };
    var _act_comm = {
        "device": gate_sn,
        "data": {"inst":inst, "sec":60},
        "id": id
    };
    var _act = [_act_log, _act_comm]
    if($(".appinfo-upload").text()=="停止"){
        mqtt_client.unsubscribe(gate_sn + "/" + "log", {
            onSuccess: unsubscribeSuccess,
            onFailure: unsubscribeFailure,
            invocationContext: { topic: gate_sn + "/" + "log" }
        });
        mqtt_client.unsubscribe(gate_sn + "/" + "comm", {
            onSuccess: unsubscribeSuccess,
            onFailure: unsubscribeFailure,
            invocationContext: { topic: gate_sn + "/" + "comm" }
        });
        var t=setTimeout(function(){
            disconnect();
        },100);
        return;
    }else{
        table_log.clear().draw();
        $('input.J_keyword').val("");
        table_log.columns( 1 ).search("").draw();
        table_log.columns( 2 ).search("").draw();
        table_log.columns( 3 ).search("").draw();
        table_log.search("").draw();
        // console.log(_act);
        gate_exec_action(app_action, _act[$(".nav-tabs li.active").index()], gate_sn + "/" + info_map[$(".nav-tabs li.active").index()], "", app_action, "");
        if(mqttc_connected == false){
            connect();
            var t=setTimeout(function(){
                if(mqttc_connected){
                    try {
                        mqtt_client.subscribe(topic, {qos: 0});
                        if($(".nav-tabs li.active").index()==0){
                            log_subscribed=true;
                        }else{
                            comm_subscribed=true
                        }
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
                }

            },1000);
        }else{
            try {
                mqtt_client.subscribe(topic, {qos: 0});
                if($(".nav-tabs li.active").index()==0){
                    log_subscribed=true;
                }else{
                    comm_subscribed=true
                }
            } catch (error) {
                console.log(error);
                mqttc_connected = false;

            }
        }
    }

});

$(".btn-log-subscribe").click(function(){
    var lens=table_log.data().length+table_comm.data().length;
    if(mqttc_connected){
        if(log_subscribed){
            mqtt_client.unsubscribe(gate_sn + "/" + "log", {
                onSuccess: unsubscribeSuccess,
                onFailure: unsubscribeFailure,
                invocationContext: { topic: gate_sn + "/" + "log" }
            });
            log_subscribed = false;
            $(".btn-log-subscribe").removeClass("btn-success");
        }else{
            try {
                if(lens<1000){
                    mqtt_client.subscribe(gate_sn + "/" + "log", {qos: 0});
                    log_subscribed = true;
                    $(".btn-log-subscribe").addClass("btn-success");
                    var id = "sys_enable_log" + '/' + gate_sn + '/'+ Date.parse(new Date())
                    var _act = {
                        "device": gate_sn,
                        "data": 60,
                        "id": id
                    };
                    gate_upload_mes("sys_enable_log", _act)
                }else{
                    $.notify({
                        title: "<strong>记录数超过接收队列:</strong><br><br> ",
                        message: "日志和报文记录数已经超过1000，需清除后才可继续接收！"
                    },{
                        delay: 5000
                    });
                }

            } catch (error) {
                console.log(error);
                mqttc_connected = false;
                log_subscribed = false;
                $(".btn-log-subscribe").removeClass("btn-success");
            }
        }

    }
});

$(".btn-comm-subscribe").click(function(){
    var lens=table_log.data().length+table_comm.data().length;
    if(mqttc_connected){
        if(comm_subscribed){
            mqtt_client.unsubscribe(gate_sn + "/" + "comm", {
                onSuccess: unsubscribeSuccess,
                onFailure: unsubscribeFailure,
                invocationContext: { topic: gate_sn + "/" + "comm" }
            });
            comm_subscribed = false;
            $(".btn-comm-subscribe").removeClass("btn-success");
        }else{
            if(lens<1000){
                mqtt_client.subscribe(gate_sn + "/" + "comm", {qos: 0});
                comm_subscribed = true;
                $(".btn-comm-subscribe").addClass("btn-success");
                var id = "app_upload_comm" + '/' + gate_sn + '/'+ Date.parse(new Date())
                var _act = {
                    "device": gate_sn,
                    "data": {"inst":inst, "sec":60},
                    "id": id
                };
                gate_upload_mes("app_upload_comm", _act)
            }else{
                $.notify({
                    title: "<strong>记录数超过接收队列:</strong><br><br> ",
                    message: "日志和报文记录数已经超过1000，需清除后才可继续接收！"
                },{
                    delay: 5000
                });
            }
            try {

            } catch (error) {
                console.log(error);
                mqttc_connected = false;
                comm_subscribed = false;
                $(".btn-comm-subscribe").removeClass("btn-success");
            }
        }

    }
});

// $(".appinfo-stop").click(function(){
//     var topic_map=["log", "comm"];
//     var topic = gate_sn + "/" + topic_map[$(".nav-tabs li.active").index()];
//     mqtt_client.unsubscribe(topic, {
//         onSuccess: unsubscribeSuccess,
//         onFailure: unsubscribeFailure,
//         invocationContext: { topic: topic }
//     });
//     var t=setTimeout(function(){
//         disconnect();
//     },100);
//
// });

$(".appinfo-clear").click(function(){
    var table_map=[table_log, table_comm];
    table_map[$(".nav-tabs li.active").index()].clear().draw();
});

$(".appinfo-query").click(function(){
    var table_map=[table_log, table_comm];
    console.log(mqttc_connected);
    console.log(mqtt_client);
    console.log($(".nav-tabs li.active").index());
    console.log(table_map[$(".nav-tabs li.active").index()].data().length);

});



/**
 *	过滤选择处理-start
 */
$('div.log_filter li').on('click', function(){
    var table_map=[table_log, table_comm];
    $('.search_log').text($(this).text());
    $('input.J_keyword').val("");
    table_map[$(".nav-tabs li.active").index()].columns( 1 ).search("").draw();
    table_map[$(".nav-tabs li.active").index()].columns( 2 ).search("").draw();
    table_map[$(".nav-tabs li.active").index()].columns( 3 ).search("").draw();
    table_map[$(".nav-tabs li.active").index()].search("").draw();

});

$('div.comm_filter li').on('click', function(){
    var table_map=[table_log, table_comm];
    $('.search_comm').text($(this).text());
    $('input.J_keyword').val("");
    table_map[$(".nav-tabs li.active").index()].columns( 1 ).search("").draw();
    table_map[$(".nav-tabs li.active").index()].columns( 2 ).search("").draw();
    table_map[$(".nav-tabs li.active").index()].columns( 3 ).search("").draw();
    table_map[$(".nav-tabs li.active").index()].search("").draw();

});

$('a.go-app-upgrade').on('click', function(){
    var url = "My_Gates_apps_upgrade.html?sn=" + gate_sn + "&inst=" + inst;
    redirect(url);
});


$("input.J_keyword").bind("input propertychange",function(event){
    var table_map=[table_log, table_comm];
    var key = $('input.J_keyword').val();
    var colnum = 3;
    if($(".nav-tabs li.active").index()==0){
        if($('.search_log').text()=="内容"){
            colnum = 3
        }
        if($('.search_log').text()=="ID"){
            colnum = 2
        }
        if($('.search_log').text()=="类型"){
            colnum = 1
        }
    }else{
        if($('.search_comm').text()=="报文"){
            colnum = 3
        }
        if($('.search_comm').text()=="方向"){
            colnum = 2
        }
        if($('.search_comm').text()=="设备ID"){
            colnum = 1
        }
    }

    console.log(colnum, key);
    if(key!=null){
        table_map[$(".nav-tabs li.active").index()].columns( colnum ).search(key).draw();
    }
});

$('button.J_keyword').on( 'keyup click', function () {
    var table_map=[table_log, table_comm];
    var key = $('input.J_keyword').val();
    var colnum = 3;
    if($(".nav-tabs li.active").index()==0){
        if($('.search_log').text()=="内容"){
            colnum = 3
        }
        if($('.search_log').text()=="ID"){
            colnum = 2
        }
        if($('.search_log').text()=="类型"){
            colnum = 1
        }
    }else{
        if($('.search_comm').text()=="报文"){
            colnum = 3
        }
        if($('.search_comm').text()=="方向"){
            colnum = 2
        }
        if($('.search_comm').text()=="设备ID"){
            colnum = 1
        }
    }
    console.log("过滤", key, colnum);
    table_map[$(".nav-tabs li.active").index()].columns( colnum ).search(key, false, true).draw();
} );
/**
 *	过滤选择处理-end
 */

$('a[data-toggle="tab"]').on('click', function (e) {
    console.log("!!!!!!!!!!!!!!!!");
    console.log($(this).text());
    if($(this).text()=="运行日志"){
        $('.log_li').removeClass("hide");
        $('.log-subscribe').removeClass("hide");
        $('.comm_li').addClass("hide");
        $('.comm-subscribe').addClass("hide");
    }else if($(this).text()=="通讯报文"){
        $('.comm_li').removeClass("hide");
        $('.comm-subscribe').removeClass("hide");
        $('.log_li').addClass("hide");
        $('.log-subscribe').addClass("hide");
    }

});