
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
            var gateinfo = localStorage.getItem("gate_info/"+ sn);
            if(gateinfo!=null){
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
 *	获取网关已安装应用列表
 */
function gate_applist(sn, tableobj){

    $.ajax({
        url: '/apis/api/method/iot_ui.iot_api.gate_applist',
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
                localStorage.setItem("gate_apps/"+ sn, JSON.stringify(req.message));
                set_tabel(sn, tableobj);
            }

        },
        error:function(req){
            console.log(req);
        }
    });



}


/**
 *	使用网关应用列表更新表格
 */
function set_tabel(sn, tableobj){
    var appsinfo = localStorage.getItem("gate_apps/"+ sn);
    tableobj.clear().draw();
    // console.log(typeof appsinfo)
    // console.log(appsinfo)
    if(appsinfo!=null && typeof(appsinfo) != "undefined") {
        appsinfo = JSON.parse(appsinfo);

        for (i = 0; i < appsinfo.length; i++) {
            // console.log(i, appsinfo[i].info.auto);
            var appico = "<span class=\"info-box-icon bg-green\"><i class=\"fa fa-flag-o\"></i></span>";
            var status = "";
            var runtime = "";
            if (appsinfo[i].info.running) {
                status = '<span class="label label-success">running</span>';
                runtime = new Date(Number(appsinfo[i].info.running) * 1000).toLocaleString('zh', {hour12: false})
                // runtime =  new Date(Number(appsinfo[i].info.running)*1000).toLocaleString('zh-Hans-CN', { timeZone: 'Asia/Shanghai' })
                // runtime =  DateFormat.format(new Date(Number(appsinfo[i].info.running)*1000))
            } else {
                status = '<span class="label label-warning">stoped</span>';
            }
            var app_auto = '<div  class="' + appsinfo[i].info.inst + '" data-on="success" data-off="warning">\n' +
                '<input  data-inst="' + appsinfo[i].info.inst + '" class="switch" type="checkbox"/>\n' +
                '</div>'
            if (String(appsinfo[i].info.auto) == "1") {
                app_auto = '<div  class="' + appsinfo[i].info.inst + '" data-on="success" data-off="warning">\n' +
                    '<input data-inst="' + appsinfo[i].info.inst + '" class="switch" type="checkbox" checked />\n' +
                    '</div>'
            }

            var inst_arr = ["ioe_frpc", "Net_Manager"]
            // console.log($.inArray(appsinfo[i].info.inst, inst_arr))
            var ops = '';
            if($.inArray(appsinfo[i].info.inst, inst_arr)){
                console.log(appsinfo[i].info.inst);
                ops = '<button type="button" class="btn btn-default app-monitor" data-inst="' + appsinfo[i].info.inst + '">监视</button>'
                    + '<button type="button" class="btn btn-default">配置</button>'
                    + '<div class="btn-group">'
                    + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="true">更多'
                    + '<span class="caret"></span>'
                    + '<span class="sr-only">Toggle Dropdown</span>'
                    + '</button>'
                    + '<ul class="dropdown-menu" role="menu">'
                    + '<li><a href="My_Gates_apps_upgrade.html?sn=' + gate_sn + '&inst=' + appsinfo[i].info.inst + '">应用升级</a></li>'
                    + '<li><a href="#" class="app_uninstall_btn" data-inst="' + appsinfo[i].info.inst + '" data-toggle="modal" data-target="#modal-app-uninstall">应用卸载</a></li>'
                    + '<li><a href="#" class="app_rename_btn" data-inst="' + appsinfo[i].info.inst + '" data-toggle="modal" data-target="#modal-app-rename">更改实例名</a></li>'
                    + '</ul>'
                    + '</div>'
            }


            var arrayObj = new Array(appico,
                appsinfo[i].info.inst, appsinfo[i].info.name,
                appsinfo[i].info.devs_len, status,
                runtime, app_auto, ops);
            // console.log(arrayObj);
            tableobj.row.add(arrayObj).draw();
        }

        $('.switch').bootstrapSwitch({
            onSwitchChange: function (event, state) {
                // var inst = $(this).data("inst");

                var self_index = table.cell($(this).parents('td')).index();
                var next_index = table.cell($(this).parents('td').next()).index();
                console.log(self_index, next_index);
                table.cell(self_index).data("处理中……").draw();
                table.cell(next_index).data("---").draw();

                var inst = $(this).attr("data-inst");
                var action_str = "app_auto";
                // console.log(state);
                // console.log("inst:",inst);

                // var table_aaaaa = "."+inst+" div";
                // var table_bbbbb = "#"+inst;
                // $(table_aaaaa).addClass("hide");
                // $(table_bbbbb).removeClass("hide");
                if (state == false) {
                    // console.log(0);
                    var auto_act = {
                        "device": sn,
                        "data": {"inst": inst, "option": "auto", "value": 0},
                        "id": 'disable/' + sn + '/' + inst + '/autorun/' + Date.parse(new Date())
                    };

                    var task_desc = '禁止应用' + inst + '开机自启';
                    gate_exec_action("app_option", auto_act, task_desc, inst, action_str, 1);

                }
                else {
                    // console.log(1);
                    var auto_act = {
                        "device": sn,
                        "data": {"inst": inst, "option": "auto", "value": 1},
                        "id": 'enable/' + sn + '/' + inst + '/autorun/' + Date.parse(new Date())
                    };
                    var task_desc = '设置应用' + inst + '开机自启';
                    gate_exec_action("app_option", auto_act, task_desc, inst, action_str, 0);
                }
            }
        });


        $("body").on("click", ".app-monitor", function () {
            var inst = $(this).attr("data-inst");
            redirect("My_Gates_apps_monitor.html?sn=" + gate_sn + "&inst=" + inst);
        });


        $("body").on("click", ".app_uninstall_btn", function () {
            var inst = $(this).data("inst");
            $(".uninstall-appname").text($(this).data("inst"));
            $(".uninstall-appname").data("inst", $(this).data("inst"));
            console.log("卸载", $(this).data("inst"))
            // table.DataTable().row($(this).parents('tr')).data();
            var self_index = table.cell($(this).parents('td')).index();
            var prev_index = table.cell($(this).parents('td').prev()).index();
            cell_record[inst] = [self_index, table.cell(self_index).data(), prev_index, table.cell(prev_index).data()]
            // console.log(self_index, prev_index);
            // console.log(table.cell(self_index).data())
            // console.log(table.cell(prev_index).data())
            // table.cell(self_index).data("卸载中……").draw();
            // table.cell(prev_index).data("---").draw();

            // var data_tnp = table.row($(this).parents('tr')).data();
            // data_tnp[4] = "卸载中……";
            // data_tnp[5] = " ";
            // data_tnp[6] = " ";
            // data_tnp[7] = " ";
            // table.row($(this).parents('tr')).remove().draw();
            // table.row.add( data_tnp ).draw();
            // table.cell( $(this).parents('td') ).data( "卸载中……" ).draw();


        });


        $("body").on("click", ".app_rename_btn", function () {
            var inst = $(this).data("inst");
            $("input.ren-appname").val($(this).data("inst"));
            $("input.ren-appname").data("inst", $(this).data("inst"));
            console.log("改名", $(this).data("inst"));
            var self_index = table.cell($(this).parents('td')).index();
            var prev_index = table.cell($(this).parents('td').prev()).index();
            cell_record[inst] = [self_index, table.cell(self_index).data(), prev_index, table.cell(prev_index).data()]
            console.log(cell_record[inst]);
            // table.cell(self_index).data("改名中……").draw();
            // table.cell(prev_index).data("---").draw();


        });

    }
}


/**
 *	获取应用状态信息
 */
function gate_app_detail(sn, inst, pagename){
    $.ajax({
        url: '/apis/api/method/iot_ui.iot_api.gate_app_detail',
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'get',
        data: {"sn": sn, "inst": inst},
        dataType:'json',
        success:function(req){
            // console.log(req);
            if(req.message!=null){
                localStorage.setItem("app_info/"+ sn +"/" + inst, JSON.stringify(req.message));
            }
            if(pagename=="Gates_apps_monitor"){
                set_app_monitor_label(sn, inst);
            }
            if(pagename=="Gates_apps_upgrade"){
                set_app_upgrade_label(sn, inst);
            }

        },
        error:function(req){
            console.log(req);
        }
    });
}



/**
 *	使用网关APP状态信息app_monitor页面更新标签
 */
function set_app_monitor_label(sn, inst){
    var appinfo = localStorage.getItem("app_info/"+ sn + "/" + inst);
    if(appinfo!=null && typeof(appinfo) != "undefined") {
        appinfo = JSON.parse(appinfo);
        $(".app-inst").html(appinfo.info.inst);
        $(".app-gatever").html(appinfo.info.version);
        if(appinfo.cloud!=null){
            $(".app-cloudver").html(appinfo.cloud.ver);
        }else{
            $(".app-cloudver").html("-");
        }
        if(appinfo.info.running){
            console.log("1");
            $(".app-action:button").text("停止");
            $(".app-action:button").removeClass("btn-info");
            $(".app-action:button").addClass("btn-danger");
        }else{
            console.log("0");
            $(".app-action:button").text("启动");
            $(".app-action:button").removeClass("btn-danger");
            $(".app-action:button").addClass("btn-info");
        }

    }

}


/**
 *	使用网关APP信息更新app_upgrade页面标签
 */
function set_app_upgrade_label(sn, inst){
    var appinfo = localStorage.getItem("app_info/"+ sn + "/" + inst);
    if(appinfo!=null && typeof(appinfo) != "undefined") {
        appinfo = JSON.parse(appinfo);
        $(".app-inst").html(appinfo.info.inst);
        $(".app-gatever").html("v" + appinfo.info.version);
        if(appinfo.cloud!=null){
            $(".app-inst").data("appid",appinfo.cloud.name);
            $(".app-inst").data("cloudver",appinfo.cloud.ver);
            if(Number(appinfo.info.version) < Number(appinfo.cloud.ver)){
                $(".app-cloudver").html("→v" + String(appinfo.cloud.ver));
                $("button.update_check").text("升级更新" );
                $("button.update_check").data("flag","1");
                $(".update_tip").html("可升级到最新版本" + String(appinfo.cloud.ver));
            }else{
                $("button.update_check").text("检查更新" );
                $("button.update_check").data("flag","0");
                $(".update_tip").html("已经是最新版本" );
            }
        }

    }

}


/**
 *	获取应用各版本描述
 */
function gate_app_versions(){
    var iotbeta = $(".app-inst").data("iotbeta");
    var appid = $(".app-inst").data("appid");
    // console.log(appid, iotbeta)
    if(iotbeta!=null && appid!=null){
        $.ajax({
            url: '/apis/api/method/app_center.api.get_versions',
            headers: {
                Accept: "application/json; charset=utf-8",
                "X-Frappe-CSRF-Token": auth_token
            },
            type: 'get',
            data: {"app": appid, "beta": iotbeta},
            dataType:'json',
            success:function(req){
                // console.log(req.message);
                if(req.message!=null){
                    app_versions = req.message;
                    set_app_timeline()
                }

            },
            error:function(req){
                console.log(req);
            }
        });


    }

}


/**
 *	生成应用升级日志
 */
function set_app_timeline(){
    var maxnum = Math.min(4, app_versions.length);
    for (i = 0; i < maxnum; i++){
        // console.log(app_versions[i].modified.split(" ")[1].split(".")[0])
        var html = '<ul class="timeline">'
            + '<li class="time-label">'
            + '<span class="bg-blue ver-data">'
            + app_versions[i].modified.split(" ")[0]
            + '</span>'
            + '</li>'
            + '<li>'
            + '<i class="fa fa-thumbs-up bg-blue"></i>'
            + '<div class="timeline-item">'
            + '<span class="time"><i class="fa fa-clock-o"></i> <span class="ver-time">'
            + app_versions[i].modified.split(" ")[1].split(".")[0]
            + '</span></span>'
            + '<h3 class="timeline-header"><a>升级日志</a></h3>'
            + '<div class="timeline-body ver-comment">'
            + "--V" + app_versions[i].version + '<br />'
            + app_versions[i].comment.replace(/\r\n/gm,"<br>")
            + '</div>'
            + '</div>'
            + '</li>'
            + '</ul>'
        $(".app-change-log").append(html);

    }

}