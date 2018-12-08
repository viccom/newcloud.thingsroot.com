gate_sn  = getParam('sn');
console.log(gate_sn);
pagename = "Gates_setting";

gate_info(gate_sn);

$('.switch').bootstrapSwitch({ onSwitchChange:function(event, state){
        // var inst = $(this).data("inst");
        var inst = $(this).attr("data-inst");
        console.log(state);
        console.log("inst:",inst);
        var action = "";
        var id = "";
        var post_data ={};

        if(inst=="one"){
            action = "enable_beta";
            var data = 1;
            if (state==false){
                var task_desc = '关闭网关'+ gate_sn +'调试模式';
                id = 'disable/' + gate_sn + '/beta/'+ Date.parse(new Date());
                data = 0;
            }else{
                var task_desc = '开启网关'+ gate_sn +'调试模式';
                id = 'enable/' + gate_sn + '/beta/'+ Date.parse(new Date());
                data = 1;
            }
            post_data = {
                "device": gate_sn,
                "id": id,
                "data": data
            };
        }else if(inst=="two"){
            action = "sys_enable_data";
            var data = 1;
            if (state==false){
                var task_desc = '关闭网关'+ gate_sn +'数据上传';
                id = 'disable/' + gate_sn + '/data_upload/'+ Date.parse(new Date());
                data = 0;
            }else{
                var task_desc = '开启网关'+ gate_sn +'数据上传';
                id = 'enable/' + gate_sn + '/data_upload/'+ Date.parse(new Date());
                data = 1;
            }
            post_data = {
                "device": gate_sn,
                "id": id,
                "data": data
            };
        }else if(inst=="three"){
            action = "sys_enable_stat";
            var data = 1;
            if (state==false){
                var task_desc = '关闭网关'+ gate_sn +'统计上传';
                id = 'disable/' + gate_sn + '/stat_upload/'+ Date.parse(new Date());
                data = 0;
            }else{
                var task_desc = '开启网关'+ gate_sn +'统计上传';
                id = 'enable/' + gate_sn + '/stat_upload/'+ Date.parse(new Date());
                data = 1;
            }
            post_data = {
                "device": gate_sn,
                "id": id,
                "data": data
            };
        }else if(inst=="four"){
            var data = 1;
            if (state==false){
                action = "app_uninstall";
                var task_desc = '关闭网关'+ gate_sn +'网络管理';
                id = 'disable/' + gate_sn + '/net_manager/'+ Date.parse(new Date())
            }else{
                action = "app_install";
                var task_desc = '开启网关'+ gate_sn +'网络管理';
                id = 'enable/' + gate_sn + '/net_manager/'+ Date.parse(new Date())
            }
            var data = {
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
        }else if(inst=="five"){

            if (state==false){
                action = "app_uninstall";
                var task_desc = '关闭网关'+ gate_sn +'点对点VPN';
                id = 'disable/' + gate_sn + '/p2p_vpn/'+ Date.parse(new Date())
            }else{
                action = "app_install";
                var task_desc = '开启网关'+ gate_sn +'点对点VPN';
                id = 'enable/' + gate_sn + '/p2p_vpn/'+ Date.parse(new Date())
            }
        }


        // var table_aaaaa = "."+inst+" div";
        // var table_bbbbb = "#"+inst;
        // $(table_aaaaa).addClass("hide");
        // $(table_bbbbb).removeClass("hide");
        if (state==false){
            console.log(0);
            var beta_act = {
                "device": gate_sn,
                "id": 'disable/' + gate_sn + '/beta/'+ Date.parse(new Date())
            };

            var task_desc = '开启网关'+ gate_sn +'调试模式';
            // gate_exec_action("enable_beta", beta_act, task_desc, inst, action_str, 1);

        }
        else {
            console.log(1);
            var beta_act = {
                "device": gate_sn,
                "id": 'enable/' + gate_sn + '/beta/'+ Date.parse(new Date())
            };
            var task_desc = '关闭网关'+ gate_sn +'调试模式';
            // gate_exec_action("enable_beta", beta_act, task_desc, inst, action_str, 0);
        }
    } });