
var gate_sn  = getParam('sn');
console.log(gate_sn);
var pagename = "Gates_apps";


var table = $('#example1').DataTable({
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
        "sEmptyTable": "网关未安装应用",
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
            searchable: false,
            orderable: false,
            "width": "90px"

        },
        {
            //   指定第最后一列
            targets: 7,
            searchable: false,
            orderable: false,
            width: '12%'
        }],
    "initComplete": function(settings, json) {
        console.log("over")
    }
});

gate_info(gate_sn);
gate_applist(gate_sn, table);
setInterval(function(){
    gate_info(gate_sn);
    gate_applist(gate_sn, table);
    },8000);

$(".applist-refresh").click(function(){
    gate_info(gate_sn);
    $(".app-list-table  tr:not(:first)").empty();
    gate_applist(gate_sn, table);
});

$(".ren_confirm").click(function(){
    var instname = $("input.ren-appname").val();
    var app_action = "app_rename";
    var oldval = 0;
    var task_desc = '应用改名/'+ instname;
    var id = 'app_rename/' + gate_sn + '/'+ instname +'/'+ Date.parse(new Date())
    var _act = {
        "device": gate_sn,
        "data": {"inst": instname},
        "id": id
    };
    // gate_exec_action(app_action, _act, task_desc, inst, app_action, oldval);
});

$(".uninstall_confirm").click(function(){
    var instname = $(".uninstall-appname").text();
    var app_action = "app_uninstall";
    var oldval = 0;
    var task_desc = '卸载应用'+ instname;
    var id = 'app_uninstall/' + gate_sn + '/'+ instname +'/'+ Date.parse(new Date())
    var _act = {
        "device": gate_sn,
        "data": {"inst": instname},
        "id": id
    };
    // gate_exec_action(app_action, _act, task_desc, inst, app_action, oldval);
});

$(".btn-box-tool").click(function(){
    var url = "My_Gates_setting.html?sn="+ gate_sn;
    redirect(url);
});
