/**
 * @file            add_back_task.js
 * @description     监控一些执行任务结果。
 * @author          thingsroot Team ( http://www.thingsroot.com/ )
 * @date            2018-11-08 thingsroot
 **/

/**
 *	添加任务
 */
crontab_list = new Array();
function addCrontab(arr){
    // var crontab_tmp = localStorage.getItem(pagename + '_Back_taskslist'); // 任务列表
    console.log("后台任务1：", crontab_list)
    // if(crontab_tmp!==null){
    //     var p = JSON.parse(crontab_tmp);
    //     console.log("后台任务2：", p)
    //     if(p.length>0){
    //         crontab_list = p
    //     }
    // }
    crontab_list.push(arr);
    console.log("后台任务2：", crontab_list)
    localStorage.setItem(pagename + '_Back_taskslist',JSON.stringify(crontab_list));

}



// function addCrontab(arr){
//     var crontab_list = new Array();
//     var crontab_tmp = localStorage.getItem(pagename + '_Back_taskslist'); // 任务列表
//     console.log("后台任务1：", crontab_tmp)
//     if(crontab_tmp!==null){
//         var p = JSON.parse(crontab_tmp);
//         console.log("后台任务2：", p)
//         if(p.length>0){
//             crontab_list = p
//         }
//     }
//     crontab_list.push(arr);
//     console.log("后台任务3：", crontab_list)
//     localStorage.setItem(pagename + '_Back_taskslist',JSON.stringify(crontab_list));
//     return ;
// }

/**
 *	任务执行结果提示
 */
function action_result_tips(title, content, infotype){
    $.notify({
        title: "<strong>" + title + ":</strong><br><br> ",
        message: content
    },{
        newest_on_top: false,
        type: infotype
    });
}

function app_auto_result_response(result, inst, oldvalue){
    console.log("刷新应用列表");
    gate_upload_applist(gate_sn);
    setTimeout(function () {
        $('.applist-refresh').trigger("refreshapp");
    },1000);

}

function app_rename_result_response(result, inst, oldvalue){
    console.log("刷新应用列表");
    gate_upload_applist(gate_sn);
    setTimeout(function () {
        $('.applist-refresh').trigger("refreshapp");
    },1000);

}

function app_uninstall_result_response(result, inst, oldvalue){
    console.log("刷新应用列表");
    gate_upload_applist(gate_sn);
    setTimeout(function () {
        $('.applist-refresh').trigger("refreshapp");
    },1000);

}
function app_auto_result_response_bak(result, inst, oldvalue){
    var _aaaaa = "."+inst+" div";
    var _bbbbb = "#"+inst;
    var html = "";
    if(oldvalue==0){
        html = '<input  data-inst="' + inst + '" class="switch" type="checkbox"/>\n'
    }else{
        html = '<input data-inst="' + inst + '" class="switch" type="checkbox" checked />\n'
    }
    if(result){
        $(_aaaaa).removeClass("hide");
        $(_bbbbb).addClass("hide");
    }else{
        $(_aaaaa).html(html);
        $(_aaaaa).removeClass("hide");
        $(_bbbbb).addClass("hide");
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
                        "device": gate-sn,
                        "data": {"inst": inst, "option": "auto", "value": 0},
                        "id": 'disable ' + gate-sn + 's '+ inst +' autorun '+ Date.parse(new Date())
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
    }

}


function app_start_result_response(result, inst, oldvalue){
    if(result){
        gate_upload_applist(gate_sn);
        $(".app-action:button").text("停止");
        $(".app-action:button").removeClass("btn-info");
        $(".app-action:button").addClass("btn-danger");
    }else{
        $(".app-action:button").text("启动");
        $(".app-action:button").removeClass("btn-danger");
        $(".app-action:button").addClass("btn-info");
    }

}


function app_stop_result_response(result, inst, oldvalue){
    if(result){
        gate_upload_applist(gate_sn);
        $(".app-action:button").text("启动");
        $(".app-action:button").removeClass("btn-danger");
        $(".app-action:button").addClass("btn-info");
    }else{
        $(".app-action:button").text("停止");
        $(".app-action:button").removeClass("btn-info");
        $(".app-action:button").addClass("btn-danger");
    }
}

function app_restart_result_response(result, inst, oldvalue){
    if(result){
        gate_upload_applist(gate_sn);
        $(".app-action:button").text("停止");
        $(".app-action:button").removeClass("btn-info");
        $(".app-action:button").addClass("btn-danger");
    }else{
        $(".app-action:button").text("启动");
        $(".app-action:button").removeClass("btn-danger");
        $(".app-action:button").addClass("btn-info");
    }
}


function app_upgrade_result_response(result, inst, oldvalue){
    if(result){
        gate_upload_applist(gate_sn);
        $("button.update_check").text("检查更新" );
        $("button.update_check").data("flag","0");
        $(".update_tip").html("已经是最新版本" );
        var newver = $(".app-inst").data("cloudver");
        $(".app-gatever").html("v" + newver);
        $(".app-cloudver").html("");
    }else{

    }
}


function send_output_result_response(result, inst, oldvalue){
    if(result){
        $(".output_result").data("flag","1");
    }else{
        $(".output_result").data("flag","0");
    }
}


function sys_upgrade_result_response(result, inst, oldvalue){
    if(result){
        console.log("升级完成");
        $(".app-freeioe").data("freeioeflag", "0");
        $(".app-skynet").data("skynetflag", "0");
        sys_data_query(gate_sn, gate_sn);
        setTimeout(function () {
            $('.update_check').trigger("updateClick");
            $('.update_check').attr("disabled",true);
            action_result_tips("升级提示：", "如升级状态未刷新，请60秒后点击检查更新", "info");
            sys_data_query(gate_sn, gate_sn);
        }, 3000);
        setTimeout(function () {
            $('.update_check').trigger("updateClick");
            $('.update_check').attr("disabled",false);
        }, 55000);

    }else{
        console.log("升级失败");
        $('.update_check').attr("disabled",false);
        gate_info(gate_sn);
    }
}


function gate_setting_result_response(result, inst, oldvalue){
    var _aaaaa = "div."+inst;
    var _bbbbb = "span."+inst;
    var html = "";
    if(oldvalue==0){
        html = '<input  data-inst="' + inst + '" class="switch" type="checkbox"/>\n'
    }else{
        html = '<input data-inst="' + inst + '" class="switch" type="checkbox" checked />\n'
    }
    if(result){

        setTimeout(function () {
            $(_aaaaa).removeClass("hide");
            $(_bbbbb).addClass("hide");
            $('.fa-connectdevelop').trigger("upload_applist");
            console.log("刷新")
            gate_info(gate_sn);

        }, 2000);

    }else{
        setTimeout(function () {
            $(_aaaaa).html(html);
            $(_aaaaa).removeClass("hide");
            $(_bbbbb).addClass("hide");
        }, 2000);

    }

}




// 监控开机启动关闭的执行结果
function doCrontab(){
    var q = crontab_list;
    if(q==null || q.length<1){
        console.log(pagename + '_Back_taskslist is null');
        return false;
    }
    console.log(Date.parse(new Date()),q);
    if(q && q.length>0){
        for (var i = 0; i < q.length; i++) {
            console.log(q[i]);
            $.ajax({
                url: '/apis/api/method/iot.device_api.get_action_result',
                headers: {
                    Accept: "application/json; charset=utf-8",
                    "X-Frappe-CSRF-Token": auth_token
                },
                async: false,
                type: 'get',
                data: {"id": q[i].id},
                contentType: "application/json; charset=utf-8",
                dataType:'json',
                timeout: 3000,
                success:function(req){
                    // console.log(req);
                    if(req.message && typeof req.message!=='undefined'){
                        if(req.message.result==true){
                            action_result_tips(q[i].title + "执行成功", q[i].id, 'success');
                            if(q[i].action=="app_auto"){
                                app_auto_result_response(true, q[i].inst, q[i].value)
                            }else if(q[i].action=="app_start"){
                                app_start_result_response(true, q[i].inst, q[i].value)
                            }else if(q[i].action=="app_stop"){
                                app_stop_result_response(true, q[i].inst, q[i].value)
                            }else if(q[i].action=="app_restart"){
                                app_restart_result_response(true, q[i].inst, q[i].value)
                            }else if(q[i].action=="app_upgrade"){
                                app_upgrade_result_response(true, q[i].inst, q[i].value)
                            }else if(q[i].action=="send_output"){
                                send_output_result_response(true, q[i].inst, q[i].value)
                            }else if(q[i].action=="sys_upgrade"){
                                sys_upgrade_result_response(true, q[i].inst, q[i].value)
                            }else if(pagename=="Gates_detail"){
                                gate_setting_result_response(true, q[i].inst, q[i].value)
                            }else if(q[i].action=="app_rename"){
                                app_rename_result_response(true, q[i].inst, q[i].value)
                            }else if(q[i].action=="app_uninstall"){
                                app_uninstall_result_response(true, q[i].inst, q[i].value)
                            }else if(q[i].action=="app_install"){
                                    gate_upload_applist(gate_sn);
                            }


                            q.splice(i,1);// 删除任务
                        }else if(req.message.result==false) {
                            action_result_tips(q[i].title + "执行失败", q[i].id + "<br/>返回信息：" + req.message.message, 'warning')
                            if(q[i].action=="app_auto"){
                                app_auto_result_response(false, q[i].inst, q[i].value)
                            }else if(q[i].action=="app_start"){
                                app_start_result_response(false, q[i].inst, q[i].value)
                            }else if(q[i].action=="app_stop"){
                                app_stop_result_response(false, q[i].inst, q[i].value)
                            }else if(q[i].action=="app_restart"){
                                app_restart_result_response(false, q[i].inst, q[i].value)
                            }else if(q[i].action=="app_upgrade") {
                                app_upgrade_result_response(false, q[i].inst, q[i].value)
                            }else if(q[i].action=="send_output"){
                                send_output_result_response(false, q[i].inst, q[i].value)
                            }else if(q[i].action=="sys_upgrade"){
                                sys_upgrade_result_response(false, q[i].inst, q[i].value)
                            }else if(pagename=="Gates_detail"){
                                gate_setting_result_response(false, q[i].inst, q[i].value)
                            }else if(q[i].action=="app_rename"){
                                app_rename_result_response(false, q[i].inst, q[i].value)
                            }else if(q[i].action=="app_uninstall"){
                                app_uninstall_result_response(false, q[i].inst, q[i].value)
                            }else if(q[i].action=="app_install"){
                                gate_upload_applist(gate_sn);
                            }

                            q.splice(i, 1);// 删除任务
                        }
                        sys_data_snapshot(gate_sn);
                    }else{
                        q[i].times--;
                        if(q[i].times==0){ // 十次查询完毕还未成功，表明失败。
                            action_result_tips("等待超时", req, 'warning')
                            if(q[i].action=="app_auto"){
                                app_auto_result_response(false, q[i].inst, q[i].value)
                            }else if(q[i].action=="app_start"){
                                app_start_result_response(false, q[i].inst, q[i].value)
                            }else if(q[i].action=="app_stop"){
                                app_stop_result_response(false, q[i].inst, q[i].value)
                            }else if(q[i].action=="app_restart"){
                                app_restart_result_response(false, q[i].inst, q[i].value)
                            }else if(q[i].action=="app_upgrade") {
                                app_upgrade_result_response(false, q[i].inst, q[i].value)
                            }else if(q[i].action=="send_output"){
                                send_output_result_response(false, q[i].inst, q[i].value)
                            }else if(q[i].action=="sys_upgrade"){
                                sys_upgrade_result_response(false, q[i].inst, q[i].value)
                            }else if(pagename=="Gates_detail"){
                                gate_setting_result_response(false, q[i].inst, q[i].value)
                            }else if(q[i].action=="app_rename"){
                                app_rename_result_response(false, q[i].inst, q[i].value)
                            }else if(q[i].action=="app_uninstall"){
                                app_uninstall_result_response(false, q[i].inst, q[i].value)
                            }else if(q[i].action=="app_install"){
                                gate_upload_applist(gate_sn);
                            }
                            q.splice(i,1);
                        }
                    }

                },

                error:function(req){
                    console.log(req);
                    q.splice(i,1);
                    action_result_tips("请求错误", req, 'warning')
                }
            });
        }
    }
    localStorage.setItem(pagename + '_Back_taskslist',JSON.stringify(q));
}



$(function(){
    // 周期监控执行结果
    setInterval(function(){

        doCrontab();
    }, 2000);
})