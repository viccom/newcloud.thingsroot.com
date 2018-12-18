
$.ajaxSetup({
    headers: { // 默认添加请求头
        "X-Frappe-CSRF-Token": auth_token
    }
});
gate_sn = getParam('sn');
$(".selected-gate-sn").text(gate_sn);

var    gates_list="/apis/api/method/iot_ui.iot_api.devices_list?filter=online";
var    table_gates_list = $('#table_gates_list').DataTable({
    // "dom":"<lf<t>ip>",
    "dom":"<f<t>p>",
    "filter": true,
    "info": false,
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
    // "order": [[ 1, "asc" ]],
    "ajax": {
        "url": gates_list,
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
        {"data": "device_sn"}
    ],
    "select": {
        style: 'single'
    },
    "language": {
        "sProcessing": "处理中...",
        "sLengthMenu": "显示 _MENU_ 项结果",
        "sZeroRecords": "没有匹配结果",
        "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
        "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
        "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
        "sInfoPostFix": "",
        "sSearch": "(名称|序号)搜索:",
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
        $(row).children('td').eq(0).addClass("gate_hand");

    },
    columnDefs: [
        {
            //   指定第1列
            targets:  0,
            orderable: false,
            "width": "20%",
            render: function(row, type, data, meta) {
                if(data.device_sn==gate_sn){
                    $(".selected-gate").text(data.device_name);
                }
                return '<span class="popover-destroy" data-toggle="popover" data-placement="top" title="'+ data.device_sn +'">'+row+'</span>'
                // return data.split("+")[0].replace("T", " ");
            }
        },
        {
            //   指定第2列
            targets: 1,
            visible: false,
            searchable: true,
            orderable: false,
            width: '0%'
        }],
    "initComplete": function(settings, json) {
        console.log("gates_list over");
        $("[data-toggle='popover']").popover();
        $('#table_gates_list tbody').on('click', 'tr', function () {
            var data = table_gates_list.row(this).data();
            $("[data-toggle='popover']").popover();
            if(data){

                gate_sn = data.device_sn;
                $(".selected-gate").text(data.device_name);
                $(".selected-gate-sn").text(data.device_sn);
                gate_url = "/apis/api/method/iot_ui.trace_api.gate_wanip_his?sn=" + gate_sn;
                table_gates_log1.ajax.url(gate_url).load(null,false);
                table_gates_log2.ajax.url(gate_url).load(null,false);
                table_gates_log3.ajax.url(gate_url).load(null,false);

            }

        } );

    }
});


gate_url = "/apis/api/method/iot_ui.trace_api.gate_wanip_his?sn=" + gate_sn;

var    table_gates_log1 = $('#table_gates_log1').DataTable({
    // "dom":"<lf<t>ip>",
    "dom":"",
    "filter": false,
    "info": false,
    "paging": false,
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
    "order": [[ 0, "asc" ]],
    "ajax": {
        "url": gate_url,
        "type": "GET",
        "error": function (e) {
            console.log(e)
        },
        "dataSrc":  function (d) {
            if($.isEmptyObject(d)){
                return []
            }else{
                return d.message[1].gate_wanip
            }}
    },
    "columns": [
        {"data": "time"},
        {"data": "value"}

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
    columnDefs: [
        {
            //   指定第1列
            targets:  0,
            "width": "30%",
            render: function(data, type, row, meta) {
                return data.split("+")[0].replace("T", " ");
            }
        },
        {
            //   指定第2列
            targets: 1,
            searchable: false,
            orderable: false
        }
        ],
    "initComplete": function(settings, json) {

    }
});



var    table_gates_log2 = $('#table_gates_log2').DataTable({
    // "dom":"<lf<t>ip>",
    "dom":"",
    "filter": false,
    "info": false,
    "paging": false,
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
    "order": [[ 0, "asc" ]],
    "ajax": {
        "url": gate_url,
        "type": "GET",
        "error": function (e) {
            console.log(e)
        },
        "dataSrc":  function (d) {
            if($.isEmptyObject(d)){
                return []
            }else{
                return d.message[2].gate_fault
            }}
    },
    "columns": [
        {"data": "time"},
        {"data": "value"}

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
    columnDefs: [
        {
            //   指定第1列
            targets:  0,
            "width": "30%",
            render: function(data, type, row, meta) {
                return data.split("+")[0].replace("T", " ");
            }
        },
        {
            //   指定第2列
            targets: 1,
            searchable: false,
            orderable: false
        }
        ],
    "initComplete": function(settings, json) {

    }
});



var    table_gates_log3 = $('#table_gates_log3').DataTable({
    // "dom":"<lf<t>ip>",
    "dom":"",
    "filter": false,
    "info": false,
    "paging": false,
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
    "order": [[ 0, "asc" ]],
    "ajax": {
        "url": gate_url,
        "type": "GET",
        "error": function (e) {
            console.log(e)
        },
        "dataSrc":  function (d) {
            if($.isEmptyObject(d)){
                return []
            }else{
                return d.message[3].gate_ipchange
            }}
    },
    "columns": [
        {"data": "time"},
        {"data": "value"}

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
    columnDefs: [
        {
            //   指定第1列
            targets:  0,
            "width": "30%",
            render: function(data, type, row, meta) {
                return data.split("+")[0].replace("T", " ");
            }
        },
        {
            //   指定第2列
            targets: 1,
            searchable: false,
            orderable: false
        }
        ],
    "initComplete": function(settings, json) {

    }
});



