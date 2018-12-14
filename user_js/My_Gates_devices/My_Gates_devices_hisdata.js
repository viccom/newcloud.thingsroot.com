$.ajaxSetup({
    headers: { // 默认添加请求头
        "X-Frappe-CSRF-Token": auth_token
    }
});


var gate_sn  = getParam('sn');
var device_sn =  getParam('vsn');
var tag_name  =  getParam('tag_name');
var tag_type  =  getParam('vt');
if(tag_type==null){
    tag_type = "float"
}
var pagename = "Gates_devices_hisdata";
var time_span = '1h';
var time_condition = 'time > now() - '+ time_span;
var value_method = 'raw';
var group_time_span = '5m';
var table_hisdata = new Object();
var hisdata_url=null;

$(".device_sn").html(device_sn);
gate_info(gate_sn);


function creat_histable(his_url) {
    table_hisdata = $('#table_hisdata').DataTable({
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
        "bStateSave": false,
        "PaginationType": "full_numbers",
        "order": [ 3, "desc" ],
        "ajax": {
            "url": his_url,
            "dataSrc": function (d) {
                // console.log(d);
                if($.isEmptyObject(d)){
                    return []
                }else{
                    return d.message
                }}
        },
        "columns": [
            {"data": null},
            {"data": null},
            {"data": "value"},
            {"data": "time"},
            {"data": "quality"}
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
            "sEmptyTable": "无历史数据",
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
                "width": "5%",
                render: function(data, type, row, meta) {
                    // console.log(meta)
                    return meta.row + 1;
                }
            },
            {
                //   指定第最后2列
                targets: 1,
                searchable: false,
                orderable: false,
                width: '20%',
                render: function(data, type, row, meta) {
                    // console.log(meta)
                    return value_method;
                }
            },
            {
                //   指定第最后4列
                targets: 3,
                render: function(data, type, row, meta) {
                    return data.split("+")[0].replace("T", " ");
                }
            },
            {
                //   指定第最后一列
                targets: 4,
                width: '10%',
                render: function(data, type, row, meta) {
                    // console.log(data);
                    if(data==null){
                        return "--"
                    }else{
                        return data
                    }
                }
            }],
        "initComplete": function(settings, json) {
            console.log("over")
        }
    });

}

if(tag_name){
    $("#table_no_tag").addClass("hide");
    $(".selected-tag").val(tag_name);
    time_condition = 'time > now() - '+ time_span;
    hisdata_url="/apis/api/method/iot_ui.iot_api.taghisdata?sn="+ gate_sn + "&vsn=" + device_sn +"&tag=" + tag_name +"&vt=" + tag_type +"&time_condition=" + time_condition +"&value_method=" + value_method +"&group_time_span=" + group_time_span;
    creat_histable(hisdata_url);

}else{
    $(".selected-tag").val("--");
    $("#table_no_tag").removeClass("hide");
}



rtdata_url="/apis/api/method/iot_ui.iot_api.gate_device_data_array?sn="+ gate_sn + "&vsn=" + device_sn;
table_inputs = $('#table_inputs').DataTable({
    "dom":"<f<t>p>",
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
    "bStateSave": false,
    "fnDraw":false,
    "search": {
        "caseInsensitive": false,
        "smart": true
    },
    // "PaginationType": "full_numbers",
    "order": [ 0, "asc" ],
    "ajax": {
        "url": rtdata_url,
        "type": "GET",
        "error": function (e) {
            console.log(e)
        },
        "dataSrc": function (d) {
            if($.isEmptyObject(d)){
                return []
            }else{
                return d.message
            }}
    },
    "columns": [
        {"data": "name"},
        {"data": "desc"}
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
    rowCallback: function(row, data, dataIndex){
        $(row).children('td').eq(0).addClass("gate_hand");
        $(row).children('td').eq(1).addClass("gate_hand");
    },
    columnDefs: [
        {
            //   指定第2列
            targets: [0,1],
            width: '35%',
            searchable: true,
            orderable: false
        }
    ],
    "initComplete": function(settings, json) {
        console.log("inputs over");
        $('#table_inputs tbody').on('click', 'tr', function () {
            var data = table_inputs.row(this).data();
            // console.log(data);
            if(data){

                if(data.vt!=null){
                    if(data.vt=='int'){
                        tag_type = 'int';
                    }else if(data.vt=='string'){
                        tag_type = 'string';
                    }else{
                        tag_type = "float";
                    }
                }else{
                    tag_type = "float";
                }

                if(tag_name==null){
                    tag_name = data.name;
                    $(".selected-tag").val(tag_name);
                    $("#table_no_tag").addClass("hide");
                    time_condition = 'time > now() - '+ time_span;
                    hisdata_url="/apis/api/method/iot_ui.iot_api.taghisdata?sn="+ gate_sn + "&vsn=" + device_sn +"&tag=" + data.name +"&vt=" + tag_type +"&time_condition=" + time_condition +"&value_method=" + value_method +"&group_time_span=" + group_time_span;
                    creat_histable(hisdata_url);
                }
                tag_name = data.name;
                $(".selected-tag").val(tag_name);
                time_condition = 'time > now() - '+ time_span;
                hisdata_url="/apis/api/method/iot_ui.iot_api.taghisdata?sn="+ gate_sn + "&vsn=" + device_sn +"&tag=" + data.name +"&vt=" + tag_type +"&time_condition=" + time_condition +"&value_method=" + value_method +"&group_time_span=" + group_time_span;
                table_hisdata.ajax.url(hisdata_url).load(null,false);
                $(".selected-tag").val(tag_name);
            }

        } );

        // $('#table_inputs tbody').on( 'click', 'tr', function () {
        //     console.log( table_inputs.row( this ).data() );
        // } );
    }
});

$(".hisdata-refresh").click(function(){
    console.log($("select[name='method_select']").val());
    time_condition = 'time > now() - '+ time_span;
    console.log("tag_type:",tag_type)
    hisdata_url="/apis/api/method/iot_ui.iot_api.taghisdata?sn="+ gate_sn + "&vsn=" + device_sn +"&tag=" + tag_name +"&vt=" + tag_type +"&time_condition=" + time_condition +"&value_method=" + value_method +"&group_time_span=" + group_time_span;
    console.log(hisdata_url);
    if(tag_name){
        table_hisdata.ajax.url(hisdata_url).load(null,false);
    }

});

$("select[name='method_select']").on("select2:select", function (event) {
    value_method = event.params.data.id;
    if(event.params.data.id=="raw"){
        $("select[name='span_select']").attr("disabled", true);
    }else{
        $("select[name='span_select']").attr("disabled", false);
    }
});

$("select[name='span_select']").on("select2:select", function (event) {
    group_time_span = event.params.data.id;
});

$("select[name='time_select']").on("select2:select", function (event) {
    time_span = $("select[name='time_select']").val()
});

$(".rtdata-refresh").click(function(){
    table_inputs.ajax.url(rtdata_url).load(null,false);
});
// table_inputs.fnDraw(false);