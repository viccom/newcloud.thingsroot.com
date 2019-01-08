
gate_sn  = getParam('sn');
console.log(gate_sn);
pagename = "Gates_apps";
if(gate_sn){
    record_gate_op(gate_sn);
}
cell_record = new Object();

table = $('#example1').DataTable({
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
    // gate_applist(gate_sn, table);
    },15000);

function set_switch(){
    $('.switch').bootstrapSwitch({ onSwitchChange:function(event, state){
            var self_index = table.cell( $(this).parents('td')).index();
            var next_index = table.cell( $(this).parents('td').next()).index();
            // console.log(self_index, next_index);
            table.cell( self_index ).data("处理中……").draw();
            table.cell( next_index ).data("---").draw();
            var inst = $(this).data("inst");
            var action_str = "app_auto";
            if (state==false){
                // console.log(0);
                var auto_act = {
                    "device": gate_sn,
                    "data": {"inst": inst, "option": "auto", "value": 0},
                    "id": 'disable/' + gate_sn + '/'+ inst +'/autorun/'+ Date.parse(new Date())
                };
                var task_desc = '禁止应用'+ inst +'开机自启';
                gate_exec_action("app_option", auto_act, task_desc, inst, action_str, 1);
            }
            else {
                // console.log(1);
                var auto_act = {
                    "device": gate_sn,
                    "data": {"inst": inst, "option": "auto", "value": 1},
                    "id": 'enable/' + gate_sn + '/'+ inst +'/autorun/'+ Date.parse(new Date())
                };
                var task_desc = '设置应用'+ inst +'开机自启';
                gate_exec_action("app_option", auto_act, task_desc, inst, action_str, 0);
            }
        } });
}

// 给刷新按钮绑定事件，给后台任务调用；
$('.applist-refresh').bind("refreshapp", function(){
    gate_upload_applist(gate_sn);
    setTimeout(function () {
        gate_info(gate_sn);
        $(".app-list-table  tr:not(:first)").empty();
        gate_applist(gate_sn, table);
    },1000);

});

$(".applist-refresh").click(function(){
    gate_info(gate_sn);
    $(".app-list-table  tr:not(:first)").empty();
    gate_applist(gate_sn, table);
});

$(".ren_confirm").click(function(){
    var inst = $("input.ren-appname").val();
    var app_action = "app_rename";
    var oldname = $("input.ren-appname").data("inst");
    var task_desc = '应用改名/'+ oldname;
    var id = 'app_rename/' + gate_sn + '/'+ oldname +'/'+ Date.parse(new Date())
    var _act = {
        "device": gate_sn,
        "data": {"inst": oldname, "new_name": inst},
        "id": id
    };
    gate_exec_action(app_action, _act, task_desc, oldname, app_action, inst);

    var temdata = cell_record[oldname];
    console.log(inst, temdata);
    table.cell( temdata[0] ).data("改名中……").draw();
    table.cell( temdata[2] ).data("--").draw();

    $("#modal-app-rename").modal('hide');

});

$(".ren_cancel").click(function(){

});

$(".uninstall_confirm").click(function(){
    var inst = $(".uninstall-appname").data("inst");
    var app_action = "app_uninstall";
    var oldval = 0;
    var task_desc = '卸载应用'+ inst;
    var id = 'app_uninstall/' + gate_sn + '/'+ inst +'/'+ Date.parse(new Date())
    var _act = {
        "device": gate_sn,
        "data": {"inst": inst},
        "id": id
    };
    gate_exec_action(app_action, _act, task_desc, inst, app_action, oldval);

        var temdata = cell_record[inst];
        console.log(inst, temdata);
        table.cell( temdata[0] ).data("卸载中……").draw();
        table.cell( temdata[2] ).data("--").draw();
    $("#modal-app-uninstall").modal('hide');
});

// $('#modal-app-uninstall').on('hide.bs.modal',
//     function() {
//         var inst = $(".uninstall-appname").data("inst");
//         var temdata = cell_record[inst];
//         console.log(inst, temdata);
//         table.cell( temdata[0] ).data(temdata[1]).draw();
//         table.cell( temdata[2] ).data(temdata[3]).draw();
//
//         set_switch()
//     });

// $('#modal-app-rename').on('hide.bs.modal',
//     function() {
//         var inst = $("input.ren-appname").val();
//         var temdata = cell_record[inst];
//         console.log(inst, temdata);
//         table.cell( temdata[0] ).data(temdata[1]).draw();
//         table.cell( temdata[2] ).data(temdata[3]).draw();
//
//         set_switch()
//     });


// $(".uninstall_cancel").click(function(){
// console.log("取消");
// });


$("button.gate-install-app").click(function(){
    // ttips($(this), '功能暂时未实现.')
    var url = "My_Gates_apps_install.html?sn="+ gate_sn;
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

