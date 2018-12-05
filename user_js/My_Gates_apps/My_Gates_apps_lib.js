
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
            }else{
                localStorage.setItem("gate_info/"+ sn, JSON.stringify(req.message));
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

    if(gateinfo){
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

    }

}

/**
 *	获取网关已安装应用列表
 */
function gate_applist(sn, tableobj){
    var q = localStorage.getItem(pagename + '_Back_taskslist');
    if(q!==null && JSON.parse(q).length>0){
        return false;
    }else{
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
                localStorage.setItem("gate_apps/"+ sn, JSON.stringify(req.message));
                set_tabel(sn, tableobj);
            },
            error:function(req){
                console.log(req);
            }
        });
    }


}


/**
 *	使用网关应用列表更新表格
 */
function set_tabel(sn, tableobj){
    var appsinfo = localStorage.getItem("gate_apps/"+ sn);
    tableobj.clear().draw();
    if(appsinfo){
        var appsinfo = JSON.parse(appsinfo);
        for (i = 0; i < appsinfo.length; i++){
            // console.log(i, appsinfo[i].info.auto);
            var appico = "<span class=\"info-box-icon bg-green\"><i class=\"fa fa-flag-o\"></i></span>";
            var status = "";
            var runtime = "";
            if(appsinfo[i].info.running){
                status = '<span class="label label-success">running</span>';
                runtime =  new Date(Number(appsinfo[i].info.running)*1000).toLocaleString('chinese', { hour12: false })
            }else{
                status = '<span class="label label-warning">stoped</span>';
            }
            var app_auto = '<span class="hide" id="'+ appsinfo[i].info.inst +'">处理中……</span><div  class="'+ appsinfo[i].info.inst +'" data-on="success" data-off="warning">\n' +
                '<input  data-inst="' + appsinfo[i].info.inst + '" class="switch" type="checkbox"/>\n' +
                '</div>'
            if(String(appsinfo[i].info.auto)=="1"){
                app_auto = '<span class="hide" id="'+ appsinfo[i].info.inst +'">处理中……</span><div  class="'+ appsinfo[i].info.inst +'" data-on="success" data-off="warning">\n' +
                    '<input data-inst="' + appsinfo[i].info.inst + '" class="switch" type="checkbox" checked />\n' +
                    '</div>'
            }
            var ops = '<button type="button" class="btn btn-default app-monitor" data-inst="' + appsinfo[i].info.inst + '">监视</button>'
                + '<button type="button" class="btn btn-default">配置</button>'
                + '<div class="btn-group">'
                + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="true">更多'
                + '<span class="caret"></span>'
                + '<span class="sr-only">Toggle Dropdown</span>'
                + '</button>'
                + '<ul class="dropdown-menu" role="menu">'
                + '<li><a href="My_Gates_apps_upgrade.html">应用升级</a></li>'
                + '<li><a href="#"  data-toggle="modal" data-target="#modal-warning">应用卸载</a></li>'
                + '<li><a href="#"  data-toggle="modal" data-target="#modal-default">更改实例名</a></li>'
                + '</ul>'
                + '</div>'

            var arrayObj = new Array(appico,
                appsinfo[i].info.inst, appsinfo[i].info.name,
                appsinfo[i].info.devs_len,status,
                runtime, app_auto, ops);
            // console.log(arrayObj);
            tableobj.row.add(arrayObj).draw();
            }
        $('.switch').bootstrapSwitch({ onSwitchChange:function(event, state){
                // var inst = $(this).data("inst");
                var inst = $(this).attr("data-inst");
                var action_str = "app_auto";
                // console.log(state);
                // console.log("inst:",inst);
                var table_aaaaa = "."+inst+" div";
                var table_bbbbb = "#"+inst;
                $(table_aaaaa).addClass("hide");
                $(table_bbbbb).removeClass("hide");
                if (state==false){
                    // console.log(0);
                    var auto_act = {
                        "device": sn,
                        "data": {"inst": inst, "option": "auto", "value": 0},
                        "id": 'disable ' + sn + 's '+ inst +' autorun '+ Date.parse(new Date())
                    };

                    var task_desc = '禁止应用'+ inst +'开机自启';
                    gate_exec_action("app_option", auto_act, task_desc, inst, action_str, 1);

                }
                else {
                    // console.log(1);
                    var auto_act = {
                        "device": sn,
                        "data": {"inst": inst, "option": "auto", "value": 1},
                        "id": 'enable ' + sn + '\'s '+ inst +' autorun '+ Date.parse(new Date())
                    };
                    var task_desc = '设置应用'+ inst +'开机自启';
                    gate_exec_action("app_option", auto_act, task_desc, inst, action_str, 0);
                }
            } });

        $(".app-monitor").click(function(){
            var inst = $(this).attr("data-inst");
            redirect("My_gates_apps_monitor.html?sn="+ gate_sn + "&inst=" + inst);
            });


    }
}


/**
 *	获取应用状态信息
 */
function gate_app_detail(sn, inst){
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
            var appinfo = localStorage.getItem("app_info/"+ sn +"/" + inst);
            if(appinfo!=null){
                console.log(req.message);
                localStorage.setItem("app_info/"+ sn +"/" + inst, JSON.stringify(req.message));

            }else{
                localStorage.setItem("app_info/"+ sn +"/" + inst, JSON.stringify(req.message));
            }
            set_app_label(sn, inst);
        },
        error:function(req){
            console.log(req);
        }
    });
}

/**
 *	使用网关APP状态信息更新标签
 */
function set_app_label(sn, inst){
    var appinfo = localStorage.getItem("app_info/"+ sn + "/" + inst);
    if(appinfo) {
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
