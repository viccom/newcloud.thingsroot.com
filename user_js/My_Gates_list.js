function update_gates_list(tableobj, filter) {

    $.ajax({
        url: '/apis/api/method/iot_ui.iot_api.devices_list?filter='+ filter,
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'get',
        contentType: "application/json; charset=utf-8",
        dataType:'json',
        success:function(data){
            localStorage.setItem("gates_list/"+ getCookie("usr"), JSON.stringify(data.message));
            tableobj.clear().draw();
            for (i = 0; i < data.message.length; i++){
                // console.log(i, data.message[i].device_name);
                var arrayObj = new Array(data.message[i].device_name,
                    data.message[i].device_desc, data.message[i].last_updated,
                    data.message[i].device_status,data.message[i].device_apps_num,
                    data.message[i].device_devs_num,"" ,data.message[i].device_sn,
                    data.message[i].beta, data.message[i].iot_beta);
                // console.log(arrayObj);
                tableobj.row.add(arrayObj).draw();
            }
        },
        error:function(data){
            console.log(data);

        }
    });
}


$(function () {
    var filter = "online";
    var table_obj = new Object();




var    gates_url="/apis/api/method/iot_ui.iot_api.devices_list?filter=" + filter;
var    table_gates = $('#table_gates').DataTable({
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
        // "PaginationType": "full_numbers",
        "order": [[ 3, "asc" ]],
        "ajax": {
            "url": gates_url,
            "type": "GET",
            "error": function (e) {
                console.log(e)
            },
            "dataSrc":  function (d) {
                if($.isEmptyObject(d)){
                    return []
                }else{
                    return d.message
                }}
        },
        "columns": [
            {"data": "device_name"},
            {"data": "device_desc"},
            {"data": "last_updated"},
            {"data": "device_status"},
            {"data": "device_apps_num"},
            {"data": "device_devs_num"},
            {"data": null}
        ],
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
            "sEmptyTable": "未找到网关",
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
        rowCallback: function(row, data, dataIndex){
            $("[data-toggle='tooltip']").tooltip();
            // console.log(data.device_status);
            if(data.device_status=="ONLINE"){
                $(row).addClass('on');
                // $(row).children('td').eq(1).addClass('pointer');
                // $(row).children('td').eq(2).addClass('pointer');
            }
            else{
                $(row).addClass('end');
            }
        },
        columnDefs: [
            {
                //   指定第1列
                targets:  0,
                "width": "20%",
                render: function(row, type, data, meta) {
                    return '<span class="popover-destroy" data-toggle="popover" data-placement="top" title="'+ data.device_sn +'">'+row+'</span>'
                    // return data.split("+")[0].replace("T", " ");
                }
            },
            {
                //   指定第3列
                targets: 2,
                width: '15%'
            },
            {
                //   指定第4列
                targets: 3,
                width: '8%',
                render: function(row, type, data, meta) {
                    // console.log(data);
                    if(row=="ONLINE"){
                        // console.log(data, type, row, meta);
                        // $(row).addClass('green');
                        return '<i class="fa fa-circle text-success"></i>' +  '<span class="text-success">  在线</span>';
                    }
                    else if(row=="OFFLINE"){
                        return '<i class="fa fa-circle text-yellow"></i>' +  '<span class="text-yellow">  离线</span>';
                    }
                    else{
                        return '<i class="fa fa-circle text-gray"></i>' +  '<span class="text-gray">  未连接</span>';
                    }
                }
            },
            {
                //   指定第5列
                targets: 4,
                width: '8%'
            },
            {
                //   指定第6列
                targets: 5,
                width: '8%'
            },

            {
                //   指定第最后一列
                targets: 6,
                searchable: false,
                orderable: false,
                width: '10%',
                render: function(row, type, data, meta) {
                    // console.log(data.device_sn);
                    var gen_html = '<button type="button" class="btn btn-default gate-appmanager" data-sn="'+ data.device_sn +  '">查看</button>'
                        + '<div class="btn-group">'
                        + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="true">'
                        +     '更多<span class="caret"></span>'
                        +     '<span class="sr-only">Toggle Dropdown</span>'
                        + '</button>'
                        + '<ul class="dropdown-menu" role="menu">'
                        +     '<li><a href="My_Gates_devices.html?sn='
                        + data.device_sn
                        + '">设备列表</a></li>'
                        +     '<li><a href="My_Gates_detail.html?sn='
                        + data.device_sn
                        + '">网关信息</a></li>'
                        +     '<li><a href="#"  data-toggle="modal" data-target="#modal-default" data-sn="'+ data.device_sn +  '">更改名称</a></li>'
                        + '</ul>'
                        + '</div>'
                    $("[data-toggle='tooltip']").popover();
                    return gen_html;
                }
            }],
        "initComplete": function(settings, json) {
            console.log("over");
            $("[data-toggle='popover']").popover();
            $("body").on("click", ".on .gate-appmanager", function() {
                // console.log($(this).data("sn"));
                redirect("My_Gates_apps.html?sn=" + $(this).data("sn"));
            });

        }
    });

    // var t_ret = setInterval(function(){
    //     $("[data-toggle='popover']").popover();
    // },1 * 1000);


    var g_ret = setInterval(function(){
        $('.popover-destroy').popover('destroy');
        table_gates.ajax.url(gates_url).load(null,false);
        var t_ret = setTimeout(function(){
            $("[data-toggle='popover']").popover();
        },500);
        var t_ret = setTimeout(function(){
            $("[data-toggle='popover']").popover();
        },1 * 1000);
    },10 * 1000);

    // 绑定网关过滤按钮
    $(".gate-filter").click(function(){
        $(this).removeClass("btn-default");
        $(this).addClass("btn-primary");
        $(this).siblings().removeClass("btn-primary");
        $(this).siblings().addClass("btn-default");
        filter = $(this).data("id");
        gates_url="/apis/api/method/iot_ui.iot_api.devices_list?filter=" + filter;
        table_gates.ajax.url(gates_url).load(null,false);

    });

    // 绑定刷新按钮
    $(".gate-filter-refresh").click(function(){
        $('.popover-destroy').popover('destroy');
        // update_gates_list(table,filter);
        table_gates.ajax.url(gates_url).load(null,false);

    });



})