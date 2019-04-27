
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
            if(req.message!=null){
                localStorage.setItem("gate_info/"+ sn, JSON.stringify(req.message));
                setTimeout(function () {
                    set_label(sn);
                },200);
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
        if(gateinfo.config.data_upload==1){
            $("span.data_upload_status").removeClass("hide");
        }else{
            $("span.data_upload_status").addClass("hide");
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
 *	获取网关已创建的设备列表
 */
function gate_devs_list(sn, tableobj){
    $.ajax({
        url: '/apis/api/method/iot_ui.iot_api.gate_devs_list',
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
                localStorage.setItem("gate_devices/"+ sn, JSON.stringify(req.message));
                setTimeout(function () {
                    set_table(sn, tableobj);
                },200);
            }else{
                tableobj.clear().draw();
            }

        },
        error:function(req){
            console.log(req);
        }
    });

}

/**
 *	使用网关设备列表更新表格
 */
function set_table(sn, tableobj){
    var deviceinfo = localStorage.getItem("gate_devices/"+ sn);
    // console.log(deviceinfo);
    tableobj.clear().draw();
    if(deviceinfo){
        var deviceinfo = JSON.parse(deviceinfo);

        for (i = 0; i < deviceinfo.length; i++) {
            var device_name = deviceinfo[i].inst;
            var device_desc = deviceinfo[i].description;
            var device_sn = deviceinfo[i].sn;
            var device_inst = deviceinfo[i].app;
            if(deviceinfo[i].hasOwnProperty("app_inst")){
                device_inst = deviceinfo[i].app_inst;
            }
            var inputs_len = 0;
                if(deviceinfo[i].inputs){
                    inputs_len = deviceinfo[i].inputs
                }
            var outputs_len = 0;
            if(deviceinfo[i].outputs){
                outputs_len = deviceinfo[i].outputs
            }
            var commands_len = 0;
            if(deviceinfo[i].commands){
                commands_len = deviceinfo[i].commands;
            }
            var tags = String(inputs_len)+ "/" + String(outputs_len) +  "/" + String(commands_len);

            var outputs_btn = '';
            if(outputs_len>0){
                outputs_btn = '<li><a href="My_Gates_devices_outputs.html?sn='+ gate_sn + '&vsn=' + device_sn +'">数据下置</a></li>'
            }
            var command_btn = '';
            if(commands_len>0){
                command_btn ='<li><a href="My_Gates_devices_commands.html?sn='+ gate_sn + '&vsn=' + device_sn +'">指令下置</a></li>'
            }

            var ops = '<button type="button" class="btn btn-default device-inputs" data-vsn="' + device_sn + '" data-devname="\' + device_name + \'">浏览</button>'
                // + '<button type="button" class="btn btn-default">配置</button>'
                + '<div class="btn-group">'
                + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="true">更多'
                + '<span class="caret"></span>'
                + '<span class="sr-only">Toggle Dropdown</span>'
                + '</button>'
                + '<ul class="dropdown-menu" role="menu">'
                + outputs_btn
                // + command_btn
                + '<li><a href="My_Gates_devices_hisdata.html?sn='+ gate_sn + '&vsn=' + device_sn +'">历史浏览</a></li>'
                + '</ul>'
                + '</div>'

            var arrayObj = new Array(
                device_name, device_desc, tags, device_sn, device_inst,  ops
            );
            // console.log(arrayObj);
            tableobj.row.add(arrayObj).draw();

        }
        $(".device-inputs").click(function(){
            var vsn = $(this).attr("data-vsn");
            var device_name = $(this).attr("device_name");
            redirect("My_Gates_devices_inputs.html?sn="+ gate_sn + "&vsn=" + vsn + "&device_name=" + device_name);
        });

        return false;

    }
}


/**
 *	获取网关中某个设备的实时数据
 */
function get_devices_inputs(sn, vsn){

    $.ajax({
        url: '/apis/api/method/iot_ui.iot_api.gate_device_cfg',
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'get',
        data: {"sn": sn, "vsn":vsn},
        dataType:'json',
        async: false,
        success:function(req){
            // console.log(req);
            if(req.message!==null){
                if($.isEmptyObject(req.message)===false) {
                    localStorage.setItem("gate_devices_inputs/"+ vsn, JSON.stringify(req.message.inputs));
                    inputs_obj[vsn]=req.message.inputs;
                }
            }

        },
        error:function(req){
            console.log(req);
        }
    });
}

/**
 *	获取网关中某个设备的下置点表
 */
function get_devices_outputs(sn, vsn){

    $.ajax({
        url: '/apis/api/method/iot_ui.iot_api.gate_device_cfg',
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'get',
        data: {"sn": sn, "vsn":vsn},
        dataType:'json',
        async: false,
        success:function(req){
            // console.log(req);
            if(req.message.outputs!==null){
                localStorage.setItem("gate_devices_outputs/"+ vsn, JSON.stringify(req.message.outputs));
                outputs_obj[vsn]=req.message.outputs;
            }
        },
        error:function(req){
            console.log(req);
        }
    });
}



/**
 *	获取网关中某个设备的实时数据
 */
function get_devices_rtdata(sn, vsn){

    $.ajax({
        url: '/apis/api/method/iot_ui.iot_api.gate_device_data_array',
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'get',
        data: {"sn": sn, "vsn":vsn},
        dataType:'json',
        async: false,
        success:function(req){
            // console.log(req);
            // localStorage.setItem("gate_devices_inputs_rtdata/"+ vsn, JSON.stringify(req.message));
            inputsrtdata_obj[vsn]=req.message;
        },
        error:function(req){
            console.log(req);
        }
    });
}




/**
 *	获取网关中某个设备的实时数据
 */
function gate_devices_inputs_ex(sn, vsn, tableobj){

    $.ajax({
        url: '/apis/api/method/iot_ui.iot_api.gate_device_cfg',
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'get',
        data: {"sn": sn, "vsn":vsn},
        dataType:'json',
        async: false,
        success:function(req){
            // console.log(req);
            if(req.message.inputs!==null){
                // localStorage.setItem("gate_devices_inputs/"+ vsn, JSON.stringify(req.message.inputs));
                inputs_obj[vsn]=req.message.inputs;
            }
            $.ajax({
                url: '/apis/api/method/iot_ui.iot_api.gate_device_data_array',
                headers: {
                    Accept: "application/json; charset=utf-8",
                    "X-Frappe-CSRF-Token": auth_token
                },
                type: 'get',
                data: {"sn": sn, "vsn":vsn},
                dataType:'json',
                success:function(req){
                    // console.log(req);
                    // localStorage.setItem("gate_devices_inputs_rtdata/"+ vsn, JSON.stringify(req.message));
                    inputsrtdata_obj[vsn]=req.message;
                    set_table_inputs(sn, vsn, tableobj);
                },
                error:function(req){
                    console.log(req);
                }
            });
        },
        error:function(req){
            console.log(req);
        }
    });
}



/**
 *	使用设备实时数据列表更新表格
 */
function set_table_inputs(sn, vsn, tableobj){
    var device_tags = inputs_obj[vsn];
    var device_datas = inputsrtdata_obj[vsn];
    // console.log(deviceinfo);
    tableobj.clear().draw();
    if(device_tags){
        for (i = 0; i < device_tags.length; i++) {
            var tag_type = "float";
            if(device_tags[i].vt!==null){
                tag_type = device_tags[i].vt
            }
            var tag_name = device_tags[i].name;
            var tag_desc = device_tags[i].desc;
            var tag_unit = "--";
            if(device_tags[i].unit!==null){
                tag_unit = device_tags[i].unit
            }
            var tag_value = "--";
            var tag_time = "--";
            var tag_qulity = "--";
            var ops = "--";
            if(device_datas){
                for (j = 0; j < device_datas.length; j++){

                    if(device_datas[j].name==tag_name){
                        tag_value = device_datas[j].pv;
                        tag_time = device_datas[j].tm;
                        tag_qulity = device_datas[j].q;
                        ops = '<a href="My_Gates_devices_hisdata.html?sn='+ gate_sn + '&vsn=' + device_sn +'&tag_name=' + tag_name + '&vt=' + tag_type +'">历史浏览</a>';
                    }
                }
            }

            var arrayObj = new Array(
                tag_type, tag_name, tag_desc, tag_unit, tag_value, tag_time, tag_qulity, ops
            );
            // console.log(arrayObj);
            tableobj.row.add(arrayObj).draw();
        }


        return false;

    }
}


/**
 *	获取网关中某个设备的下置点表
 */
function gate_devices_outputs(sn, vsn, tableobj){

    $.ajax({
        url: '/apis/api/method/iot_ui.iot_api.gate_device_cfg',
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'get',
        data: {"sn": sn, "vsn":vsn},
        dataType:'json',
        async: false,
        success:function(req){
            // console.log(req);
            if(req.message.outputs!==null){
                // localStorage.setItem("gate_devices_inputs/"+ vsn, JSON.stringify(req.message.inputs));
                outputs_obj[vsn]=req.message.outputs;
                // set_table_outputs(sn, vsn, tableobj);
                $.ajax({
                    url: '/apis/api/method/iot_ui.iot_api.gate_device_data_array',
                    headers: {
                        Accept: "application/json; charset=utf-8",
                        "X-Frappe-CSRF-Token": auth_token
                    },
                    type: 'get',
                    data: {"sn": sn, "vsn":vsn},
                    dataType:'json',
                    success:function(req){
                        inputsrtdata_obj[vsn]=req.message;
                        set_table_outputs(sn, vsn, tableobj);
                    },
                    error:function(req){
                        console.log(req);
                    }
                });
            }
        },
        error:function(req){
            console.log(req);
        }
    });
}


/**
 *	使用设备下置点表列表更新下置表格
 */
function set_table_outputs(sn, vsn, tableobj){
    var device_tags = outputs_obj[vsn];
    var device_datas = inputsrtdata_obj[vsn];
    // console.log(deviceinfo);
    tableobj.clear().draw();
    if(device_tags){
        for (i = 0; i < device_tags.length; i++) {
            var tag_type = "float";
            console.log(device_tags[i].vt);
            if(device_tags[i].hasOwnProperty("vt")){
                if(device_tags[i].vt!==null){
                    tag_type = device_tags[i].vt
                }
            }
            var tag_name = device_tags[i].name;
            var tag_desc = device_tags[i].desc;
            var tag_unit = "--";
            if(device_tags[i].hasOwnProperty("unit")){
                if(device_tags[i].unit!=null){
                    tag_unit = device_tags[i].unit
                }
            }
            var tag_value = "--";
            var tag_time = "--";
            if(device_datas){
                for (j = 0; j < device_datas.length; j++){

                    if(device_datas[j].name==tag_name){
                        tag_value = device_datas[j].pv;
                        tag_time = device_datas[j].tm;
                    }
                }
            }

            var ops = '<button type="button" class="btn btn-default tag-output" data-toggle="modal" data-backdrop="static"  data-target="#modal-output" data-tagname="' + tag_name + '">下置</button>';
            var arrayObj = new Array(
                tag_type, tag_name, tag_desc, tag_unit, tag_value, tag_time, ops
            );
            // console.log(arrayObj);
            tableobj.row.add(arrayObj).draw(false);
        }
        $(".tag-output").click(function(){
            var tag_name = $(this).data("tagname");
            $("#tag_output_name").val(tag_name);
            console.log(gate_sn, device_sn, tag_name, "开始下置数据");
        });
        return false;
    }
}

