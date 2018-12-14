$.ajaxSetup({
    headers: { // 默认添加请求头
        "X-Frappe-CSRF-Token": auth_token
    }
});

var gate_sn  = getParam('sn');
var device_sn =  getParam('vsn');
var device_name  =  getParam('device_name');
var pagename = "Gates_devices_inputs";
var outputs_obj = new Object();
var inputsrtdata_obj = new Object();
$(".device_sn").html(device_sn);
$(".device_name").html(device_name);

gate_info(gate_sn);


var table_outputs = $('#table_outputs').DataTable({
    // "dom":"<lf<t>ip>",
    "filter": true,
    "info": true,
    "paging": true,
    "iDisplayLength" : 10,
    "lengthMenu": [ 10, 20, 50, 75, 100 ],
    // "scrollY": true,
    // "scroller": {
    //     rowHeight: 10
    // },
    "processing": false,
    "bStateSave": true,
    "fnDraw":false,
    "search": {
        "caseInsensitive": false,
        "smart": true
    },
    "order": [[ 0, "asc" ]],
    "language": {
        "sProcessing": "处理中...",
        "sLengthMenu": "显示 _MENU_ 项结果",
        "sZeroRecords": "没有匹配结果",
        "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
        "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
        "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
        "sInfoPostFix": "",
        "sSearch": "搜索:",
        "sUrl": "",
        "sEmptyTable": "设备无变量",
        "sLoadingRecords": "载入中...",
        "sInfoThousands": ",",
        "oPaginate": {
            "sFirst": "首页",
            "sPrevious": "上页",
            "sNext": "下页",
            "sLast": "末页"
        },
        "oAria": {
            "sSortAscending": ": 以升序排列此列",
            "sSortDescending": ": 以降序排列此列"
        }
    },
    columnDefs: [
        {
            //   指定第第1列
            targets:  0,
            "width": "8%"
        },
        {
            //   指定第最后一列
            targets: 6,
            searchable: false,
            orderable: false,
            width: '10%'
        }],
    "initComplete": function(settings, json) {
        console.log("over");

    }
});


gate_devices_outputs(gate_sn, device_sn, table_outputs);
/**
 *	周期检测是否下置成功并刷新
 */
var output_ret= setInterval(function(){
    if($(".output_result").data("flag")=="1"){
        gate_devices_outputs(gate_sn, device_sn, table_outputs);
    }
},1000);



$(".outputs-refresh").click(function(){
    gate_devices_outputs(gate_sn, device_sn, table_outputs);
});

$(".tag_output_ok").click(function(){
    var tag_name = $("#tag_output_name").val();
    var output_val = $("#tag_output_val").val();
    if(output_val.length>0){
        console.log(typeof Number(output_val));
        console.log(gate_sn, device_sn, tag_name, Number(output_val), "开始下置数据");

        var app_action = "send_output";
        var task_desc = '数据下置'+ '/ '+ device_sn  + '/ ' + tag_name + '/'+  output_val;
        var id = 'send_output/' + gate_sn + '/ '+ device_sn  + '/ '+ tag_name + '/'+  output_val + '/'+ Date.parse(new Date());
        var _act = {
            "device": gate_sn,
            "data": {
                "device": device_sn,
                "output": tag_name,
                "value": Number(output_val),
                "prop": "value"
            },
            "id": id
        };

        gate_exec_action(app_action, _act, task_desc, "0", app_action, "0");

        $('#modal-output').modal('hide');
    }else{
        $.notify({
            title: "<strong>输入提示:</strong><br><br> ",
            message: "必须是数字且不能为空！"
        },{
            type: 'warning',
            delay: 3000
        });
    }


});