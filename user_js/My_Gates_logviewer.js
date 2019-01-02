var gate_sn  = getParam('sn');
var pagename = "Gates_logviewer";
var log_subscribed = false;
var app_devslist = new Array();
var is_beta = 0;
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
        "order": [[ 0, "desc" ]],
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
                orderable: true

            },
            {
                //   指定第第2列
                targets:  1,
                "width": '8%'
            },
            {
                //   指定第第3列
                targets:  2,
                "width": '8%'
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
 *	周期检测mqtt状态
 */
var mqtt_status_ret= setInterval(function(){
    $(".log_nums").text(table_log.data().length);
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

},1000);

/**
 *	周期上传日志报文
 */
var mqtt_upload_ret= setInterval(function(){
    var lens=table_log.data().length;
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

        }
    }else{
        mqtt_client.unsubscribe(gate_sn + "/" + "log", {
            onSuccess: unsubscribeSuccess,
            onFailure: unsubscribeFailure,
            invocationContext: { topic: gate_sn + "/" + "log" }
        });

        log_subscribed = false;

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
 *	开启日志和报文上传功能
 */
$(".appinfo-upload").click(function(){
    var topic = gate_sn + "/log" ;
    var id = "sys_enable_log" + '/' + gate_sn + '/'+ Date.parse(new Date());
    var _act_log = {
        "device": gate_sn,
        "data": 60,
        "id": id
    };
    if($(".appinfo-upload").text()=="停止"){
        mqtt_client.unsubscribe(gate_sn + "/" + "log", {
            onSuccess: unsubscribeSuccess,
            onFailure: unsubscribeFailure,
            invocationContext: { topic: gate_sn + "/" + "log" }
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
        gate_exec_action("sys_enable_log", _act_log, gate_sn + "/" + "sys_enable_log", "", "sys_enable_log", "");
        if(mqttc_connected == false){
            connect();
            var t=setTimeout(function(){
                if(mqttc_connected){
                    try {
                        mqtt_client.subscribe(topic, {qos: 0});
                            log_subscribed=true;
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
                log_subscribed=true;

            } catch (error) {
                console.log(error);
                mqttc_connected = false;

            }
        }
    }

});

$(".btn-log-subscribe").click(function(){
    var lens=table_log.data().length;
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


$(".appinfo-clear").click(function(){
    table_log.clear().draw();
});




/**
 *	过滤选择处理-start
 */
$('div.log_filter li').on('click', function(){
    $('.search_log').text($(this).text());
    $('input.J_keyword').val("");
    table_log.columns( 1 ).search("").draw();
    table_log.columns( 2 ).search("").draw();
    table_log.columns( 3 ).search("").draw();
    table_log.search("").draw();

});


$('a.go-app-upgrade').on('click', function(){
    var url = "My_Gates_apps_upgrade.html?sn=" + gate_sn + "&inst=" + inst;
    redirect(url);
});


$("input.J_keyword").bind("input propertychange",function(event){
    var key = $('input.J_keyword').val();
    var colnum = 3;

    if($('.search_log').text()=="内容"){
        colnum = 3
    }
    if($('.search_log').text()=="ID"){
        colnum = 2
    }
    if($('.search_log').text()=="类型"){
        colnum = 1
    }

    console.log(colnum, key);
    if(key!=null){
        table_log.columns( colnum ).search(key).draw();
    }
});

$('button.J_keyword').on( 'keyup click', function () {
    var key = $('input.J_keyword').val();
    var colnum = 3;

    if($('.search_log').text()=="内容"){
        colnum = 3
    }
    if($('.search_log').text()=="ID"){
        colnum = 2
    }
    if($('.search_log').text()=="类型"){
        colnum = 1
    }


    table_log.columns( colnum ).search(key, false, true).draw();
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
    }else if($(this).text()=="通讯报文"){
        $('.log_li').addClass("hide");
        $('.log-subscribe').addClass("hide");
    }

});