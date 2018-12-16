gate_sn  = getParam('sn');
console.log(gate_sn);
pagename = "Gates_devices";

gate_info(gate_sn);
if(gate_sn){
    record_gate_op(gate_sn);
}

var table_devices = $('#table_devices').DataTable({
    // "dom": '<if<t>>',
    "filter": false,
    "info": false,
    "paging":   false,
    "processing": true,
    "bStateSave": true,
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
        "sEmptyTable": "网关中尚无设备",
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
            "width": "10%"
        },
        {
            //   指定第第2列
            targets:  1,
            "width": "20%"
        },
        {
            //   指定第第3列
            targets:  2,
            "width": "10%"
        },
        {
            //   指定第第5列
            targets:  4,
            "width": "12%"
        },

        {
            //   指定第最后一列
            targets: 5,
            searchable: false,
            orderable: false,
            width: '20%'
        }],
    "initComplete": function(settings, json) {
        console.log("over")
    }
});

gate_devs_list(gate_sn, table_devices);


setInterval(function(){
    gate_info(gate_sn);
    gate_devs_list(gate_sn, table_devices);
},20000);

$(".devices-refresh").click(function(){
    // console.log("shua")
    gate_info(gate_sn);
    gate_devs_list(gate_sn, table_devices);
});

$(".btn-box-tool").click(function(){
    var url = "My_Gates_setting.html?sn="+ gate_sn;
    redirect(url);
});


$("button.gate-install-app").click(function(){
    // ttips($(this), '功能暂时未实现.')
    var url = "My_Gates_apps_install.html?sn="+ gate_sn;
    redirect(url);

});