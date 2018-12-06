gate_sn  = getParam('sn');
inst  = getParam('inst');
pagename = "Gates_apps_upgrade";
var app_versions = new Array();
var gateinfo = localStorage.getItem("gate_info/"+ gate_sn);
if(gateinfo){
    gateinfo = JSON.parse(gateinfo);
}
$(".gate_name").html(gateinfo.basic.name);
$(".app-inst").html(inst);
$(".app-inst").data("iotbeta",gateinfo.basic.iot_beta);

gate_app_detail(gate_sn, inst, pagename);

var appTimeout = setTimeout(function () {
    gate_app_versions()
}, 500);

// 应用升级按钮
$(".update_check").click(function(){
    if($(this).data("flag")=="1"){
        console.log("app upgrade");
        var appid = $(".app-inst").data("appid");
        var app_action = "app_upgrade";
        var task_desc = '升级应用'+ inst;
        var id = 'app_upgrade/' + gate_sn + '/ '+ inst +'/'+ Date.parse(new Date())
        var _act = {
            "device": gate_sn,
            "data": {"inst": inst, "name":appid},
            "id": id
        };

        gate_exec_action(app_action, _act, task_desc, inst, app_action, "1");
    }else{
        console.log("check update!");
        gate_app_detail(gate_sn, inst, pagename);
        var appTimeout = setTimeout(function () {
            gate_app_versions()
        }, 500);
    }

});