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
    var gate_debug = ["关闭", "开启"];

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
        $(".gate_model").html(gateinfo.basic.model);
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