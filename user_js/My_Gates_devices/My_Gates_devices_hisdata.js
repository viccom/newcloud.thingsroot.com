gate_sn  = getParam('sn');
device_sn =  getParam('vsn');
tag_name  =  getParam('tag_name');
tag_type  =  getParam('vt');
pagename = "Gates_devices_hisdata";
time_condition = 'time > now() - 1h';
inputs_obj = new Object();
inputsrtdata_obj = new Object();
$(".device_sn").html(device_sn);
$(".device_name").html(tag_name);

gate_info(gate_sn);
var  hisdata_url=null;
if(tag_name){
    hisdata_url="/apis/api/method/iot_ui.iot_api.taghisdata?sn="+ gate_sn + "&vsn=" + device_sn +"&tag=" + tag_name +"&vt=" + tag_type +"&time_condition=" + time_condition;
}
console.log("hisdata_url:",hisdata_url);

var table_hisdata = $('#table_hisdata').DataTable({
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
        "url": hisdata_url,
        "dataSrc": "message",
    },
    "columns": [
        {"data": null},
        {"data": "name"},
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
            width: '20%'
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
            width: '10%'
        }],
    "initComplete": function(settings, json) {
        console.log("over")
    }
});

$(".hisdata-refresh").click(function(){
    table_hisdata.ajax.url(hisdata_url).load(null,false);
});


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
    "order": [ 0, "desc" ],
    "ajax": {
        "url": rtdata_url,
        "dataSrc": "message"
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
            width: '40%',
            searchable: true,
            orderable: false
        }
    ],
    "initComplete": function(settings, json) {
        console.log("inputs over");
        $('#table_inputs tbody').on('click', 'tr', function () {
            var data = table_inputs.row(this).data();
            // console.log(data);
            var tag_vt = "float";
            if(data.vt!=null){
                if(data.vt=='int'){
                    tag_vt = 'int';
                }else if(data.vt=='string'){
                    tag_vt = 'string';
                }else{
                    tag_vt = "float";
                }
            }

            hisdata_url="/apis/api/method/iot_ui.iot_api.taghisdata?sn="+ gate_sn + "&vsn=" + device_sn +"&tag=" + data.name +"&vt=" + tag_vt +"&time_condition=" + time_condition;;
            table_hisdata.ajax.url(hisdata_url).load(null,false);

        } );

        // $('#table_inputs tbody').on( 'click', 'tr', function () {
        //     console.log( table_inputs.row( this ).data() );
        // } );
    }
});
$(".rtdata-refresh").click(function(){
    table_inputs.ajax.url(rtdata_url).load(null,false);
});
// table_inputs.fnDraw(false);