$.ajaxSetup({
    headers: { // 默认添加请求头
        "X-Frappe-CSRF-Token": auth_token
    }
});

/**
 *	创建设备列表
 */
function creat_devs_list(sn){

    $.ajax({
        url: '/apis/api/method/iot_ui.iot_api.gate_devs_list',
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'get',
        data: {"sn": sn},
        dataType:'json',
        success:function(req){
            console.log(req);
            if(req.message!=null){
                localStorage.setItem("gate_devices/"+ sn, JSON.stringify(req.message));
                var deviceinfo = req.message;
                for (i = 0; i < deviceinfo.length; i++) {
                    var device_name = deviceinfo[i].name;
                    var device_desc = deviceinfo[i].description;
                    var d_sn = deviceinfo[i].sn;
                    var html = '<li class="iot" data-devicesn="'+d_sn+'" data-inst="'+deviceinfo[i].app_inst+'"  data-appid="'+deviceinfo[i].app+'"><a href="javascript:void(0)" ><i class="fa fa-circle-o text-yellow"></i>'+ device_desc + '</a></li>';
                    if(d_sn==device_sn){
                        html = '<li class="active iot" data-devicesn="'+d_sn+'" data-inst="'+deviceinfo[i].app_inst+'" data-appid="'+deviceinfo[i].app+'"><a href="javascript:void(0)" ><i class="fa fa-circle-o text-yellow"></i>'+ device_desc + '</a></li>';
                        $("button.app-monitor").data("inst", deviceinfo[i].app_inst);
                        $("button.app-monitor").data("appid", deviceinfo[i].app);

                    }

                    $("ul.devices_list").append(html);
                }
            }

        },
        error:function(req){
            console.log(req);
        }
    });


}


gate_sn  = getParam('sn');
device_sn =  getParam('vsn');
device_name  =  getParam('device_name');
pagename = "Gates_devices_inputs";
inputs_obj = new Object();
inputsrtdata_obj = new Object();
$(".device_sn").html(device_sn);
$(".device_name").html(device_name);
gate_info(gate_sn);
setInterval(function(){
    gate_info(gate_sn);
},3000);
get_devices_inputs(gate_sn, device_sn);
creat_devs_list(gate_sn);
if(gate_sn){
    record_gate_op(gate_sn);
}

var HtmlUtil = {
    /*1.用浏览器内部转换器实现html转码*/
    htmlEncode:function (html){
        //1.首先动态创建一个容器标签元素，如DIV
        var temp = document.createElement ("div");
        //2.然后将要转换的字符串设置为这个元素的innerText(ie支持)或者textContent(火狐，google支持)
        (temp.textContent != undefined ) ? (temp.textContent = html) : (temp.innerText = html);
        //3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
        var output = temp.innerHTML;
        temp = null;
        return output;
    },
    /*2.用浏览器内部转换器实现html解码*/
    htmlDecode:function (text){
        //1.首先动态创建一个容器标签元素，如DIV
        var temp = document.createElement("div");
        //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
        temp.innerHTML = text;
        //3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
        var output = temp.innerText || temp.textContent;
        temp = null;
        return output;
    },
    /*3.用正则表达式实现html转码*/
    htmlEncodeByRegExp:function (str){
        var s = "";
        if(str.length == 0) return "";
        s = str.replace(/&/g,"&amp;");
        s = s.replace(/</g,"&lt;");
        s = s.replace(/>/g,"&gt;");
        s = s.replace(/ /g,"&nbsp;");
        s = s.replace(/\'/g,"&#39;");
        s = s.replace(/\"/g,"&quot;");
        return s;
    },
    /*4.用正则表达式实现html解码*/
    htmlDecodeByRegExp:function (str){
        var s = "";
        if(str.length == 0) return "";
        s = str.replace(/&amp;/g,"&");
        s = s.replace(/&lt;/g,"<");
        s = s.replace(/&gt;/g,">");
        s = s.replace(/&nbsp;/g," ");
        s = s.replace(/&#39;/g,"\'");
        s = s.replace(/&quot;/g,"\"");
        return s;
    }
};

rtdata_url="/apis/api/method/iot_ui.iot_api.gate_device_data_array?sn="+ gate_sn + "&vsn=" + device_sn;
table_inputs = $('#table_inputs').DataTable({
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
    "order": [ 0, "desc" ],
    "ajax": {
        "url": rtdata_url,
        "type": "GET",
        "error": function (e) {
            console.log(e)
        },
        "dataSrc":  function (d) {
            console.log($.isEmptyObject(d))
            if($.isEmptyObject(d)){
                return []
            }else{
                return d.message
            }

        }
    },
    "columns": [
        {"data": null},
        {"data": "name"},
        {"data": "desc"},
        {"data": null},
        {"data": "pv"},
        {"data": "tm"},
        {"data": "q"},
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
        "sEmptyTable": "设备无数据",
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
            "width": "8%",
            render: function(data, type, row, meta) {
                // console.log(row);
                var tag_vt = "float";
                var device_tags = inputs_obj[device_sn];
                for (i = 0; i < device_tags.length; i++) {
                    // console.log(device_tags[i].name, row.name);
                    if(device_tags[i].name==row.name){
                        if(device_tags[i].vt!=null){
                            tag_vt = device_tags[i].vt;
                        }
                        break;
                    }
                }
                return tag_vt
                // return data.split("+")[0].replace("T", " ");
            }
        },
        {
            //   指定第2列
            targets: 1,
            width: '15%'
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
            searchable: true,
            render: function(data, type, row, meta) {
                // console.log(row);
                var tag_unit = "--";
                var device_tags = inputs_obj[device_sn];
                for (i = 0; i < device_tags.length; i++) {
                    // console.log(device_tags[i].name, row.name);
                    if(device_tags[i].name==row.name){
                        if(device_tags[i].unit!=null){
                            tag_unit = device_tags[i].unit;
                        }
                        break;
                    }
                }
                return tag_unit;
                // return data.split("+")[0].replace("T", " ");
            }
        },
        {
            //   指定第5列
            targets: 4,
            width: '15%',
            render: function(data, type, row, meta) {

                if(row.pv.length > 40){
                    console.log(row.pv);
                    console.log(typeof row.pv);
                    var html = '<button type="button" class="btn popover-destroy" title="完整内容"'
                   + 'data-container="body" data-toggle="popover" data-placement="top" data-content="'
                   +  HtmlUtil.htmlEncodeByRegExp(row.pv) +'">'
                   + '字符长度超限,点击查看'
                   + '</button>'
                    return html
                }else{
                    return row.pv;
                }

                // return data.split("+")[0].replace("T", " ");
            }
        },
        {
            //   指定第6列
            targets: 5,
            searchable: false,
            width: '15%'
        },
        {
            //   指定第7列
            targets: 6,
            searchable: false,
            width: '9%'
        },
        {
            //   指定第最后一列
            targets: 7,
            searchable: false,
            orderable: false,
            width: '10%',
            render: function(data, type, row, meta) {
                // console.log(row);
                var tag_vt = "float";
                if(row.vt!=null){
                    if(row.vt=='int'){
                        tag_vt = 'int';
                    }else if(row.vt=='string'){
                        tag_vt = 'string';
                    }else{
                        tag_vt = "float";
                    }
                }
                var ops = '<a href="My_Gates_devices_hisdata.html?sn='+ gate_sn + '&vsn=' + device_sn +'&tag_name=' + row.name + '&vt=' + tag_vt +'">历史浏览</a>';
                return ops;
                // return data.split("+")[0].replace("T", " ");
            }
        }],
    "initComplete": function(settings, json) {
        console.log("over");
        $("[data-toggle='popover']").popover();
    }
});
// table_inputs.fnDraw(false);

var data_autoupdate=false;
var autortdata_ret = null;
$(".rt-autoupdate").click(function(){
    console.log("111")
    if(data_autoupdate){
        clearInterval(autortdata_ret);
        data_autoupdate=false;
        $(".rt-autoupdate").children("i").eq(0).removeClass("fa-pause");
        $(".rt-autoupdate").children("i").eq(0).addClass("fa-play");
    }else{
        autortdata_ret= setInterval(function(){
            $('.popover-destroy').popover('destroy');
            table_inputs.ajax.url(rtdata_url).load(null,false);
            var t_ret = setTimeout(function(){
                $("[data-toggle='popover']").popover();
            },1 * 1000);
        },2 * 1000);
        data_autoupdate=true;
        $(".rt-autoupdate").children("i").eq(0).removeClass("fa-play");
        $(".rt-autoupdate").children("i").eq(0).addClass("fa-pause");

    }
});
$(".rt-refresh").click(function(){
    console.log("222");
    $('.popover-destroy').popover('destroy');
    table_inputs.ajax.url(rtdata_url).load(null,false);

    var t_ret = setTimeout(function(){
        $("[data-toggle='popover']").popover();
    },1 * 1000);

});


$("body").on("click", "li.iot", function() {
    // console.log($(this).data("devicesn"));
    $('.popover-destroy').popover('destroy');
    $(this).addClass("active");
    $(this).siblings().removeClass("active");
    device_sn =  $(this).data("devicesn");
    var dev_inst = $(this).data("inst");
    var appid = $(this).data("appid");
    $("button.app-monitor").data("inst", dev_inst);
    $("button.app-monitor").data("appid", appid);
    get_devices_inputs(gate_sn, device_sn);
    rtdata_url="/apis/api/method/iot_ui.iot_api.gate_device_data_array?sn="+ gate_sn + "&vsn=" + device_sn;
    var t_ret = setTimeout(function(){
        table_inputs.ajax.url(rtdata_url).load();
    },500);
    $(".device_sn").html(device_sn);

    var t_ret = setTimeout(function(){
        $("[data-toggle='popover']").popover();
    },1 * 1500);

});

$(".devslist-refresh").click(function(){
    $("ul.devices_list").empty();
     creat_devs_list(gate_sn);

});

$("button.app-monitor").click(function(){
    var dev_inst = $(this).data("inst");
    var appid = $(this).data("appid");
    var arr= ["ioe","ioe_frpc"];
    // console.log(dev_inst,arr)
    // console.log($.inArray(dev_inst, arr))
    if($.inArray(dev_inst, arr)!=-1){
        ttips($(this),"不支持监视<br>"+dev_inst);
        return false;
    }
    redirect('/My_Gates_apps_monitor.html?sn='+ gate_sn + '&inst='+ dev_inst +  '&appid='+ appid);

});

// var table_inputs = $('#table_inputs').DataTable({
//     // "dom":"<lf<t>ip>",
//     "filter": true,
//     "info": true,
//     "paging": true,
//     "iDisplayLength" : 20,
//     "lengthMenu": [ 10, 20, 50, 75, 100 ],
//     // "scrollY": true,
//     // "scroller": {
//     //     rowHeight: 10
//     // },
//     "processing": true,
//     "bStateSave": true,
//     "PaginationType": "full_numbers",
//     "order": [[ 0, "asc" ]],
//     "language": {
//         "sProcessing": "处理中...",
//         "sLengthMenu": "显示 _MENU_ 项结果",
//         "sZeroRecords": "没有匹配结果",
//         "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
//         "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
//         "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
//         "sInfoPostFix": "",
//         "sSearch": "搜索:",
//         "sUrl": "",
//         "sEmptyTable": "设备无变量",
//         "sLoadingRecords": "载入中...",
//         "sInfoThousands": ",",
//         "oPaginate": {
//             "sFirst": "首页",
//             "sPrevious": "上页",
//             "sNext": "下页",
//             "sLast": "末页"
//         },
//         "oAria": {
//             "sSortAscending": ": 以升序排列此列",
//             "sSortDescending": ": 以降序排列此列"
//         }
//     },
//     columnDefs: [
//         {
//             //   指定第第1列
//             targets:  0,
//             "width": "8%"
//         },
//
//         {
//             //   指定第最后一列
//             targets: 7,
//             searchable: false,
//             orderable: false,
//             width: '10%'
//         }],
//     "initComplete": function(settings, json) {
//         console.log("over");
//
//     }
// });
//
// gate_devices_inputs(gate_sn, device_sn, table_inputs);
// /**
//  *	周期刷新数据
//  */
// var rtdata_status_ret= setInterval(function(){
//     gate_devices_inputs(gate_sn, device_sn, table_inputs);
// },50000);