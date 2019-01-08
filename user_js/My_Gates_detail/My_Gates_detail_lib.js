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
                var gate_skynet_ver = req.message.config.skynet_version;
                var gate_freeioe_ver = req.message.config.iot_version;
                var data_up = req.message.config.data_upload;
                var data_up_span = req.message.config.data_upload_period;
                var skynet_appid = req.message.config.platform + "_skynet";
                var gate_beta = req.message.basic.iot_beta;

                $.get("/apis/api/method/app_center.api.get_latest_version", {"app":"freeioe","beta":gate_beta},function(result){
                    if(pagename=="Gates_detail"){
                        if(result.message>gate_freeioe_ver){
                            console.log("升级gate_freeioe");
                            $(".new_iot_version").removeClass("hide");
                        }else{
                            $(".new_iot_version").addClass("hide");
                        }
                        if(result.message>gate_freeioe_ver){
                            $(".app-freeioe").data("freeioeflag", "1");
                            $(".freeioe-cloudver").html("→"+ result.message);
                            $(".freeioe_update_tip").html("可升级到最新版");
                            $(".update_check").html("升级更新");
                            $('.update_check').attr("disabled",false);
                        }else{
                            $(".app-freeioe").data("freeioeflag", "0");
                            $(".freeioe-cloudver").html("");
                            $(".freeioe_update_tip").html("已经是最新版");
                            $('.update_check').attr("disabled",false);
                        }

                    }else if(pagename=="Gates_firmware_upgrade"){
                        console.log("设置！！！！")
                        if(result.message>gate_freeioe_ver){
                            $(".app-freeioe").data("freeioeflag", "1");
                            $(".freeioe-cloudver").html("→"+ result.message);
                            $(".freeioe_update_tip").html("可升级到最新版");
                            $(".update_check").html("升级更新");
                        }else{
                            $(".app-freeioe").data("freeioeflag", "0");
                            $(".freeioe_update_tip").html("已经是最新版");

                        }

                    }
                });


                $.get("/apis/api/method/app_center.api.get_latest_version",{"app":skynet_appid,"beta":gate_beta}, function(result){
                    if(pagename=="Gates_detail"){
                        if(result.message>gate_skynet_ver){
                            console.log("升级gate_skynet");
                            $(".new_skynet_version").removeClass("hide");
                        }else{
                            $(".new_skynet_version").addClass("hide");
                        }

                        $(".app-skynet").data("iotbeta", gate_beta);
                        $(".app-skynet").data("appid", skynet_appid);
                        $(".app-skynet").data("cloudver", result.message);
                        $(".app-skynet").data("data_up", data_up);
                        $(".app-skynet").data("data_up_span", data_up_span);
                        gate_firmware_detail();
                        if(result.message>gate_skynet_ver){
                            $(".app-skynet").data("skynetflag", "1");
                            $(".skynet-cloudver").html("→"+ result.message);
                            $(".skynet_update_tip").html("可升级到最新版");

                        }else{
                            $(".app-skynet").data("skynetflag", "0");
                            $(".skynet-cloudver").html("");
                            $(".skynet_update_tip").html("已经是最新版");

                        }

                    }else if(pagename=="Gates_firmware_upgrade"){
                        $(".app-skynet").data("iotbeta", gate_beta);
                        $(".app-skynet").data("appid", skynet_appid);
                        $(".app-skynet").data("cloudver", result.message);
                        $(".app-skynet").data("data_up", data_up);
                        $(".app-skynet").data("data_up_span", data_up_span);
                        gate_firmware_detail();
                        if(result.message>gate_skynet_ver){
                            $(".app-skynet").data("skynetflag", "1");
                            $(".skynet-cloudver").html("→"+ result.message);
                            $(".skynet_update_tip").html("可升级到最新版");

                        }else{
                            $(".app-skynet").data("skynetflag", "0");
                            $(".skynet_update_tip").html("已经是最新版");

                        }

                    }

                });


                if(pagename=="Gates_detail"){
                    set_label(sn);
                    switch_setting();
                    set_firmware_label(sn);
                }else if(pagename=="Gates_firmware_upgrade"){
                    set_firmware_label(sn);
                }else if(pagename=="Gates_setting"){
                    switch_setting();

                }
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
    var debug_on = '<span class="text-yellow">开启</span>';
    var debug_off = '<span>关闭</span>';
    var datau_on = '<span class="text-green">开启</span>';
    var datau_off = '<span class="text-yellow">关闭</span>';
    var statu_on = '<span class="text-green">开启</span>';
    var statu_off = '<span class="text-yellow">关闭</span>';

    var gate_debug = [debug_off, debug_on];
    var data_upload = [datau_off, datau_on];
    var stat_upload = [statu_off, statu_on];

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

        var Cts = "2-30002";
        var gate_model = "unknown";
        if(gateinfo.basic.sn.indexOf(Cts) >= 0 ) {
            console.log(true)
            gate_model = gateinfo.basic.model;
        }
        $(".gate_sn").html(gateinfo.basic.sn);
        $(".gate_name").html(gateinfo.basic.name);
        $(".gate_desc").html(gateinfo.basic.desc);
        $(".gate_model").html(gate_model);
        $(".gate_apps_len").html(gateinfo.apps_len);
        $(".gate_devs_len").html(gateinfo.devs_len);

        $(".gate_cpu").html(gateinfo.config.cpu);
        $(".gate_ram").html(gateinfo.config.ram);
        $(".gate_rom").html(gateinfo.config.rom);
        $(".gate_os").html(gateinfo.config.os);
        $(".gate_skynet_version").html(gateinfo.config.skynet_version);
        $(".gate_iot_version").html(gateinfo.config.iot_version);
        $(".gate_public_ip").html(gateinfo.config.public_ip);
        $(".gate_iot_beta").html(gate_debug[gateinfo.basic.iot_beta]);
        $(".gate_data_upload").html(data_upload[gateinfo.config.data_upload]);
        $(".gate_stat_upload").html(stat_upload[gateinfo.config.stat_upload]);
        $(".gate_event_upload").html(gateinfo.config.event_upload);

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
 *	获取网关中某个测点的历史数据
 */
function gate_hisdata(sn, vsn, vt, tag, time_condition){

    $.ajax({
        url: '/apis/api/method/iot_ui.iot_api.taghisdata',
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'get',
        data: {"sn": sn, "vsn":vsn, "vt":vt, "tag":tag, "time_condition":time_condition},
        dataType:'json',
        async: true,
        success:function(req){
            console.log(req);

        },
        error:function(req){
            console.log(req);
        }
    });
}


/**
 *	使用网关状态信息更新固件升级页面标签
 */
function set_firmware_label(sn){
    var gateinfo = localStorage.getItem("gate_info/"+ sn);
    var gate_debug = ["关闭", "开启"];
    var gate_upload = ["关闭", "开启"];

    if(gateinfo){
        gateinfo = JSON.parse(gateinfo);
        // $(".gate_status").html(gateinfo.basic.status);
        // if(gateinfo.basic.status=="ONLINE"){
        //     $(".gate_status").addClass("btn-success");
        //     $(".gate_status").removeClass("btn-warning");
        //
        // }else if(gateinfo.basic.status=="OFFLINE"){
        //     $(".gate_status").addClass("btn-warning");
        //     $(".gate_status").removeClass("btn-success");
        // }else{
        //     $(".gate_status").addClass("btn-warning");
        //     $(".gate_status").removeClass("btn-success");
        //     $(".gate_status").html("OFFLINE");
        // }

        $(".gate_name").html(gateinfo.basic.name);

        $(".skynet-gatever").html(gateinfo.config.skynet_version);
        $(".freeioe-gatever").html(gateinfo.config.iot_version);

    }
}


/**
 *	获取固件最新版本描述
 */
function gate_firmware_detail(){

    var iotbeta = $(".app-skynet").data("iotbeta");
    var skynetid = $(".app-skynet").data("appid");
    var freeioeid = "freeioe";
    console.log(skynetid, freeioeid, iotbeta);

    if(iotbeta!=null) {

        /**
         *    获取skynet升级日志
         */
        $.ajax({
            url: '/apis/api/method/app_center.api.get_versions',
            headers: {
                Accept: "application/json; charset=utf-8",
                "X-Frappe-CSRF-Token": auth_token
            },
            type: 'get',
            data: {"app": skynetid, "beta": iotbeta},
            dataType: 'json',
            success: function (req) {
                // console.log(req.message);
                if (req.message != null) {
                    if(req.message!=null){
                        var app_detail = req.message;
                        var label = $(".skynet-change-log");
                        set_firmware_timeline(label, app_detail)
                    }
                }

            },
            error: function (req) {
                console.log(req);
            }
        });

        /**
         *	获取freeioe升级日志
         */

        $.ajax({
            url: '/apis/api/method/app_center.api.get_versions',
            headers: {
                Accept: "application/json; charset=utf-8",
                "X-Frappe-CSRF-Token": auth_token
            },
            type: 'get',
            data: {"app": freeioeid, "beta": iotbeta},
            dataType:'json',
            success:function(req){
                // console.log(req.message);
                if(req.message!=null){
                    var app_detail = req.message;
                    var label = $(".freeioe-change-log");
                    set_firmware_timeline(label, app_detail)
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
function set_firmware_timeline(label, app_detail){
    var skynetflag = $(".app-skynet").data("skynetflag");
    var freeioeflag = $(".app-freeioe").data("freeioeflag");
    if(skynetflag=="1" || freeioeflag=="1"){
        $(".update_check").html("升级更新");
    }else{
        $(".update_check").html("检查更新");
    }
    var maxnum = Math.min(4, app_detail.length);
    label.empty();
    for (i = 0; i < maxnum; i++){
        // console.log(app_versions[i].modified.split(" ")[1].split(".")[0])
        var isbeta= "";
        if(app_detail[i].beta==1){
            isbeta=" --【beta】"
        }

        var html = '<ul class="timeline">'
            + '<li class="time-label">'
            + '<span class="bg-blue ver-data">'
            + app_detail[i].modified.split(" ")[0]
            + '</span>'
            + '</li>'
            + '<li>'
            + '<i class="fa fa-thumbs-up bg-blue"></i>'
            + '<div class="timeline-item">'
            + '<span class="time"><i class="fa fa-clock-o"></i> <span class="ver-time">'
            + app_detail[i].modified.split(" ")[1].split(".")[0]
            + '</span></span>'
            + '<h3 class="timeline-header"><a>升级日志</a></h3>'
            + '<div class="timeline-body ver-comment">'
            + "--V" + app_detail[i].version + isbeta + '<br />'
            + app_detail[i].comment.replace(/\r\n/gm,"<br>")
            + '</div>'
            + '</div>'
            + '</li>'
            + '</ul>'
        label.append(html);

    }

}



/**
 *	生成应用升级日志
 */
function switch_setting(){
    var gateinfo = localStorage.getItem("gate_info/"+ gate_sn);
    if(gateinfo) {
        gateinfo = JSON.parse(gateinfo);
        $(".gate_sn").html(gateinfo.basic.sn);
        $(".gate_name").html(gateinfo.basic.name);
        $(".gate_desc").html(gateinfo.basic.desc);
        ex_setting.iot_beta=gateinfo.basic.iot_beta;
        ex_setting.data_upload=gateinfo.config.data_upload;
        ex_setting.stat_upload=gateinfo.config.stat_upload;
        // ex_app.iot_beta=gateinfo.basic.iot_beta;
        if(gateinfo.hasOwnProperty("applist")){
            var applist= gateinfo.applist
            if(applist.hasOwnProperty("ioe_frpc")){
                ex_setting.ioe_frpc=true;
            }else{
                ex_setting.ioe_frpc=false;
            }
            if(applist.hasOwnProperty("Net_Manager")){
                ex_setting.Net_Manager=true;
            }else{
                ex_setting.Net_Manager=false;
            }
        }


        if (gateinfo.basic.status == "ONLINE") {
            $(".gate_status").addClass("text-success");
            $(".gate_status").removeClass("text-warning");
            $(".gate_status").html("ONLINE");

        } else if (gateinfo.basic.status == "OFFLINE") {
            $(".gate_status").addClass("text-warning");
            $(".gate_status").removeClass("text-success");
            $(".gate_status").html("OFFLINE");
        } else {
            $(".gate_status").addClass("text-warning");
            $(".gate_status").removeClass("text-success");
            $(".gate_status").html("OFFLINE");
        }

        console.log(ex_setting);

        var html = '';
        if(ex_setting.iot_beta==1){
            html = '<input data-inst="iot_beta" class="switch" type="checkbox" checked />\n'
        }else{
            html = '<input  data-inst="iot_beta" class="switch" type="checkbox"/>\n'
        }
        $("div.iot_beta").html(html);


        if(ex_setting.data_upload==1){
            html = '<input data-inst="data_upload" class="switch" type="checkbox" checked />\n'
        }else{
            html = '<input  data-inst="data_upload" class="switch" type="checkbox"/>\n'
        }
        $("div.data_upload").html(html);

        if(ex_setting.stat_upload==1){
            html = '<input data-inst="stat_upload" class="switch" type="checkbox" checked />\n'
        }else{
            html = '<input  data-inst="stat_upload" class="switch" type="checkbox"/>\n'
        }
        $("div.stat_upload").html(html);


        if(ex_setting.Net_Manager){
            html = '<input data-inst="Net_Manager" class="switch" type="checkbox" checked />\n'
        }else{
            html = '<input  data-inst="Net_Manager" class="switch" type="checkbox"/>\n'
        }
        $("div.Net_Manager").html(html);

        if(ex_setting.ioe_frpc){
            html = '<input data-inst="ioe_frpc" class="switch" type="checkbox" checked />\n'
        }else{
            html = '<input  data-inst="ioe_frpc" class="switch" type="checkbox"/>\n'
        }
        $("div.ioe_frpc").html(html);

    }


    $('.switch').bootstrapSwitch({ onSwitchChange:function(event, state){
            // var inst = $(this).data("inst");

            var inst = $(this).attr("data-inst");
            console.log(state);
            console.log("inst:",inst);
            var action = "";
            var task_desc = "";
            var id = "";
            var post_data ={};
            var data = 1;

            if(inst=="iot_beta"){
                action = "sys_enable_beta";
                if (state==false){
                    task_desc = '关闭网关'+ gate_sn +'调试模式';
                    id = 'disable/' + gate_sn + '/beta/'+ Date.parse(new Date());
                    data = 0;
                }else{
                    task_desc = '开启网关'+ gate_sn +'调试模式';
                    id = 'enable/' + gate_sn + '/beta/'+ Date.parse(new Date());
                    data = 1;

                    $.ajax({
                        url: '/apis/api/method/iot_ui.iot_api.enable_beta?sn='+ gate_sn,
                        headers: {
                            Accept: "application/json; charset=utf-8",
                            "X-Frappe-CSRF-Token": auth_token
                        },
                        type: 'post',
                        contentType: "application/json; charset=utf-8",
                        dataType:'json',
                        error:function(req){
                            console.log(req);
                        }
                    });

                }
                post_data = {
                    "device": gate_sn,
                    "id": id,
                    "data": data
                };
            }else if(inst=="data_upload"){
                action = "sys_enable_data";
                if (state==false){
                    task_desc = '关闭网关'+ gate_sn +'数据上传';
                    id = 'disable/' + gate_sn + '/data_upload/'+ Date.parse(new Date());
                    data = 0;
                }else{
                    task_desc = '开启网关'+ gate_sn +'数据上传';
                    id = 'enable/' + gate_sn + '/data_upload/'+ Date.parse(new Date());
                    data = 1;
                }
                post_data = {
                    "device": gate_sn,
                    "id": id,
                    "data": data
                };
            }else if(inst=="stat_upload"){
                action = "sys_enable_stat";
                if (state==false){
                    task_desc = '关闭网关'+ gate_sn +'统计上传';
                    id = 'disable/' + gate_sn + '/stat_upload/'+ Date.parse(new Date());
                    data = 0;
                }else{
                    task_desc = '开启网关'+ gate_sn +'统计上传';
                    id = 'enable/' + gate_sn + '/stat_upload/'+ Date.parse(new Date());
                    data = 1;
                }
                post_data = {
                    "device": gate_sn,
                    "id": id,
                    "data": data
                };
            }else if(inst=="Net_Manager"){

                if (state==false){
                    action = "app_uninstall";
                    task_desc = '关闭网关'+ gate_sn +'网络管理';
                    id = 'uninstall/' + gate_sn + '/net_manager/'+ Date.parse(new Date())
                    data = 0;
                }else{
                    action = "app_install";
                    task_desc = '开启网关'+ gate_sn +'网络管理';
                    id = 'install/' + gate_sn + '/net_manager/'+ Date.parse(new Date())
                    data = 1;
                }
                post_data = {
                    "device": gate_sn,
                    "id": id,
                    "data": {
                        "inst": "Network",
                        "name": "network_uci",
                        "version":'latest'
                    }
                };

            }else if(inst=="ioe_frpc"){

                if (state==false){
                    action = "app_uninstall";
                    task_desc = '关闭网关'+ gate_sn +'点对点VPN';
                    id = 'uninstall/' + gate_sn + '/p2p_vpn/'+ Date.parse(new Date());
                    data = 0;
                }else{
                    action = "app_install";
                    task_desc = '开启网关'+ gate_sn +'点对点VPN';
                    id = 'install/' + gate_sn + '/p2p_vpn/'+ Date.parse(new Date())
                    data = 1;
                }
                post_data = {
                    "device": gate_sn,
                    "id": id,
                    "data": {
                        "inst": "ioe_frpc",
                        "name": "frpc",
                        "from_web": 1,
                        "conf": {
                            "enable_web": true,
                            "token": "BWYJVj2HYhVtdGZL",
                            "auto_start": true
                        },
                        "version":'latest'
                    }}
            }


            var obj_aaaaa = "div."+inst;
            var obj_bbbbb = "span."+inst;
            $(obj_aaaaa).addClass("hide");
            $(obj_bbbbb).removeClass("hide");
            console.log(action, post_data, task_desc, inst, action, data);
            gate_exec_action(action, post_data, task_desc, inst, action, data);
        } });

}