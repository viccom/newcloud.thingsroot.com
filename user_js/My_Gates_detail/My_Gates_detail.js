gate_sn  = getParam('sn');
console.log(gate_sn);
pagename = "Gates_detail";

gate_info(gate_sn);

$(".gate_advanced").click(function(){
    var time_condition = "time > now() - 10m";
    var tag = "mem_used";
    var vt = "int";
    gate_hisdata(gate_sn, gate_sn, vt, tag, time_condition);

});