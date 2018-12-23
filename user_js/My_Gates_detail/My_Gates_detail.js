var gate_sn  = getParam('sn');
console.log(gate_sn);
pagename = "Gates_detail";

gate_info(gate_sn);



$(".gate_advanced").click(function(){
    var time_condition = "time > now() - 10m";
    var tag = "mem_used";
    var vt = "int";
    gate_hisdata(gate_sn, gate_sn, vt, tag, time_condition);

});


$(".new_iot_version").click(function(){
    var url="My_Gates_firmware_upgrade.html?sn=" + gate_sn;
    redirect(url);
});

$(".new_skynet_version").click(function(){
    var url="My_Gates_firmware_upgrade.html?sn=" + gate_sn;
    redirect(url);
});

$(".gate_setting").click(function(){
    var url="My_Gates_setting.html?sn=" + gate_sn;
    redirect(url);
});

$(".ex-gate").click(function(){
    var url = "My_Gates_setting.html?sn="+ gate_sn;
    redirect(url);
});

$("button.float-gate-list").click(function(){

    if($(this).data("showlist")!="1"){
        $(this).data("showlist","1");
        $(".gate_nav").addClass("hide");
        $(".hide-gate-list").removeClass("hide");
        $(".float-gate-list>i").removeClass("fa-archive");
        $(".float-gate-list>i").addClass("fa-bars");


    }else if($(this).data("showlist")=="1"){
        $(this).data("showlist","0");
        $(".gate_nav").removeClass("hide");
        $(".hide-gate-list").addClass("hide");
        $(".float-gate-list>i").removeClass("fa-bars");
        $(".float-gate-list>i").addClass("fa-archive");
    }

});