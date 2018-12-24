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


$.ajaxSetup({
    headers: { // 默认添加请求头
        "X-Frappe-CSRF-Token": auth_token
    }
});

$(function () {
    var filter = "online";
    var table_obj = new Object();

    attach = "2";
    if(getCookie("isAdmin")){
        $("button.attach_select").attr("disabled",false);
        $("select.group_select").attr("disabled",false);
    }else{
        $("button.attach_select").attr("disabled",true);
        $("select.group_select").attr("disabled",true);
    }
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
            {"data": null},
            {"data": "device_sn"}
        ],
        "language": {
            "sProcessing": "处理中...",
            "sLengthMenu": "显示 _MENU_ 项结果",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
            "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": "(支持名称、描述、序号)搜索:",
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
                searchable: false,
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
                searchable: false,
                orderable: true,
                width: '8%'
            },
            {
                //   指定第6列
                targets: 5,
                searchable: false,
                orderable: true,
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
                    var gen_html = '<button type="button" class="btn btn-default gate-devsmanager" data-sn="'+ data.device_sn +  '">设备</button>'
                        + '<button type="button" class="btn btn-default gate-appmanager" data-sn="'+ data.device_sn +  '">应用</button>'
                        + '<div class="btn-group">'
                        + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="true">'
                        +     '更多<span class="caret"></span>'
                        +     '<span class="sr-only">Toggle Dropdown</span>'
                        + '</button>'
                        + '<ul class="dropdown-menu" role="menu">'
                        +     '<li><a href="My_Gates_devices_inputs.html?sn='
                        + data.device_sn + '&vsn=' + data.device_sn
                        + '">实时数据</a></li>'
                        +     '<li><a href="My_Gates_detail.html?sn='
                        + data.device_sn
                        + '">网关信息</a></li>'
                        +     '<li><a href="#" class="gate_rename" data-toggle="modal" data-target="#modal-update-gate" data-sn="'+ data.device_sn +  '">更改名称</a></li>'
                        +     '<li><a href="#" class="gate_remove" data-toggle="modal" data-target="#modal-remove-gate" data-sn="'+ data.device_sn +  '">移除网关</a></li>'
                        +     '<li><a href="My_Gates_onlinelog.html?sn=' + data.device_sn + '">在线记录</a></li>'
                        + '</ul>'
                        + '</div>'
                    $("[data-toggle='tooltip']").popover();
                    return gen_html;
                }
            },
            {
                //   指定第6列
                targets: 7,
                visible: false,
                searchable: true,
                orderable: false,
                width: '0%'
            }],
        "initComplete": function(settings, json) {
            console.log("over");
            $("[data-toggle='popover']").popover();
            $("body").on("click", ".on .gate-devsmanager", function() {
                // console.log($(this).data("sn"));
                redirect("My_Gates_devices.html?sn=" + $(this).data("sn"));
            });
            $("body").on("click", ".on .gate-appmanager", function() {
                // console.log($(this).data("sn"));
                redirect("My_Gates_apps.html?sn=" + $(this).data("sn"));
            });
            $("body").on("click", "a.gate_rename", function() {
                var rowdata=table_gates.row($(this).parents('tr')).data();
                $("#device-sn").val(rowdata.device_sn);
                $("#device-name").val(rowdata.device_name);
                $("#device-desc").val(rowdata.device_desc);
                var cuser = getCookie("usr");
                if(cuser==rowdata.device_company){
                    $("select.group_select").attr("disabled",true);
                    $("button.select_personal").addClass("btn-primary");
                    $("button.select_company").removeClass("btn-primary");
                    attach = "1";
                }else{
                    $("select.group_select").attr("disabled",false);
                    $("button.select_personal").removeClass("btn-primary");
                    $("button.select_company").addClass("btn-primary");
                    attach = "2";
                }
            });
            $("body").on("click", "a.gate_remove", function() {
                var rowdata=table_gates.row($(this).parents('tr')).data();
                $("#remove-device-sn").val(rowdata.device_sn);
                $("#remove-device-name").val(rowdata.device_name);
                $("#remove-device-desc").val(rowdata.device_desc);
            });


        }
    });

    // var t_ret = setInterval(function(){
    //     $("[data-toggle='popover']").popover();
    // },1 * 1000);


    /**
     *	更新网关信息
     */
    function update_gate(postdata) {
        $.ajax({
            url: '/apis/api/method/iot_ui.iot_api.update_gate',
            headers: {
                Accept: "application/json; charset=utf-8",
                "X-Frappe-CSRF-Token": auth_token
            },
            type: 'post',
            data: JSON.stringify(postdata),
            contentType: "application/json; charset=utf-8",
            dataType:'json',
            success:function(req){
                // console.log(req);
                if(req.message){
                    $.notify({
                        title: "<strong>更新网关提示</strong><br><br> ",
                        message: "更新网关信息成功"
                    },{
                        newest_on_top: false,
                        type: "success"
                    });
                    table_gates.ajax.url(gates_url).load(null,false);
                }
            },
            error:function(req){
                console.log(req);
                $.notify({
                    title: "<strong>更新网关提示</strong><br><br> ",
                    message: "更新网关信息失败"
                },{
                    newest_on_top: false,
                    type: "warning"
                });
            }
        });

    }

    /**
     *	从当前账户下移除网关
     */
    function remove_gate(postdata) {
        $.ajax({
            url: '/apis/api/method/iot_ui.iot_api.remove_gate',
            headers: {
                Accept: "application/json; charset=utf-8",
                "X-Frappe-CSRF-Token": auth_token
            },
            type: 'post',
            data: JSON.stringify(postdata),
            contentType: "application/json; charset=utf-8",
            dataType:'json',
            success:function(req){
                console.log(req);
                if(req.message){
                    $.notify({
                        title: "<strong>移除网关提示</strong><br><br> ",
                        message: "移除网关成功"
                    },{
                        newest_on_top: false,
                        type: "success"
                    });
                    table_gates.ajax.url(gates_url).load(null,false);
                }
            },
            error:function(req){
                console.log(req);
                $.notify({
                    title: "<strong>移除网关提示</strong><br><br> ",
                    message: "移除网关失败"
                },{
                    newest_on_top: false,
                    type: "warning"
                });
            }
        });

    }


    get_company_groups();

    var g_ret = setInterval(function(){
        $('.popover-destroy').popover('destroy');
        table_gates.ajax.url(gates_url).load(null,false);
        var t_ret = setTimeout(function(){
            $("[data-toggle='popover']").popover();
        },500);
        var t_ret = setTimeout(function(){
            $("[data-toggle='popover']").popover();
        },1 * 1000);
    },10 * 2000);

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

    // 网关归属选择按钮
    $("button.attach_select").click(function(){
        $(this).removeClass("btn-default");
        $(this).addClass("btn-primary");
        $(this).siblings().removeClass("btn-primary");
        $(this).siblings().addClass("btn-default");
        attach = $(this).data("attach");

        if(attach=="1"){
            $("select.group_select").attr("disabled",true);
        }else{
            $("select.group_select").attr("disabled",false);
        }
    });

    // 绑定刷新按钮
    $(".gate-filter-refresh").click(function(){
        $('.popover-destroy').popover('destroy');
        // update_gates_list(table,filter);
        table_gates.ajax.url(gates_url).load(null,false);

    });


    // 网关改名确认
    $("button.rename_confirm").click(function(){
        var userid = getCookie('usr');
        var device_sn = $("#device-sn").val();
        var device_name = $("#device-name").val();
        if(device_name==""){
            $("#device-name:input").data("content", "名称不能为空");
            $('.popover-warning').popover('show');
            setTimeout(function () {
                $('.popover-warning').popover('destroy');
            },2000);
            return false;
        }
        if(device_name.length>32){
            $("#device-name:input").data("content", "名称不错超过32字符");
            $('.popover-warning').popover('show');
            setTimeout(function () {
                $('.popover-warning').popover('destroy');
            },2000);
            return false;
        }

        var device_desc = $("#device-desc").val();
        var group_name = $("select.group_select").val();
        if(attach=="1"){
            group_name = userid
        }
        var owner_type = {
            "1": "User",
            "2": "Cloud Company Group"
        };
        var data = {
            sn:device_sn,
            name:device_name,
            desc:device_desc,
            owner_id: group_name,
            owner_type: owner_type[attach]
        };
        console.log(data);
        update_gate(data);
        $("#modal-update-gate").modal('hide');

    });

    // 网关移除确认
    $("button.remove_confirm").click(function(){
        remove_gate({"sn":[$("#remove-device-sn").val()]});
        $("#modal-remove-gate").modal('hide');
    });

    // 添加ThingsLink按钮
    // $(".add_thingslink").click(function(){
    //     ttips($(this),"暂不支持");
    //     return false;
    // });


    // ThingsLink序列号是否合法
    $("#thingslink-sn:input").blur(function(){
        var arr= ["2-30002"];
        var device_sn = $("#thingslink-sn:input").val();
        if(device_sn==""){
            $("#thingslink-sn:input").data("content", "序列号不能为空");
            $('.popover-warning1').popover('show');
            setTimeout(function () {
                $('.popover-warning1').popover('destroy');
            },2000);
            $("#thingslink-sn:input").focus();
            return false;
        }else{
            if($.inArray(device_sn.substr(0, 7), arr)==-1){

                $("#thingslink-sn:input").data("content", "不支持的网关序列号");
                $('.popover-warning1').popover('show');
                setTimeout(function () {
                    $('.popover-warning1').popover('destroy');
                },2000);
                $("#thingslink-sn:input").focus();
                return false;
            }
            if(device_sn.length!==20){

                $("#thingslink-sn:input").data("content", "网关序列号不完整");
                $('.popover-warning1').popover('show');
                setTimeout(function () {
                    $('.popover-warning1').popover('destroy');
                },2000);
                $("#thingslink-sn:input").focus();
                return false;
            }
        }

    });

    // 添加ThingsLink到当前账户
    $("button.add_thingslink_confirm").click(function(){
        var userid = getCookie('usr');
        var device_sn = $("#thingslink-sn").val();

        if(device_sn==""){
            $("#thingslink-sn:input").data("content", "序列号不能为空");
            $('.popover-warning1').popover('show');
            setTimeout(function () {
                $('.popover-warning1').popover('destroy');
            },2000);
            $("#thingslink-sn:input").focus();
            return false;
        }
        var device_name = $("#thingslink-name").val();
        if(device_name==""){
            $("#thingslink-name:input").data("content", "名称不能为空");
            $('.popover-warning2').popover('show');
            setTimeout(function () {
                $('.popover-warning2').popover('destroy');
            },2000);
            $("#thingslink-name:input").focus();
            return false;
        }
        if(device_name.length>32){
            $("#thingslink-name:input").data("content", "名称不能超过32字符");
            $('.popover-warning2').popover('show');
            setTimeout(function () {
                $('.popover-warning2').popover('destroy');
            },2000);
            $("#thingslink-name:input").focus();
            return false;
        }
        var device_desc = $("#thingslink-desc").val();
        if(device_desc.length>32){
            $("#thingslink-desc:input").data("content", "描述不能超过64字符");
            $('.popover-gatedesc').popover('show');
            setTimeout(function () {
                $('.popover-gatedesc').popover('destroy');
            },2000);
            $("#thingslink-desc:input").focus();
            return false;
        }

        var group_name = $("select.group_select").val();
        if(group_name==null && attach=="2"){
            $('.popover-warning3').popover('show');
            setTimeout(function () {
                $('.popover-warning3').popover('destroy');
            },2000);
            return false;
        }
        if(attach=="1"){
            group_name = userid
        }
        var owner_type = {
            "1": "User",
            "2": "Cloud Company Group"
        };
        var arr= ["2-30002"];
        // console.log(device_sn,arr)
        // console.log($.inArray(device_sn.substr(0, 7), arr))
        if($.inArray(device_sn.substr(0, 7), arr)==-1){

            $("#thingslink-sn:input").data("content", "不支持的网关序列号");
            $('.popover-warning1').popover('show');
            setTimeout(function () {
                $('.popover-warning1').popover('destroy');
            },2000);
            $("#thingslink-sn:input").focus();
            // ttips($(this),"不支持的网关序列号<br>"+dev_sn);
            return false;
        }
        if(device_sn.length!==20){

            $("#thingslink-sn:input").data("content", "网关序列号不完整");
            $('.popover-warning1').popover('show');
            setTimeout(function () {
                $('.popover-warning1').popover('destroy');
            },2000);
            $("#thingslink-sn:input").focus();
            // ttips($(this),"不支持的网关序列号<br>"+dev_sn);
            return false;
        }
        var data = {
            sn:device_sn,
            name:device_name,
            desc:device_desc,
            owner_id: group_name,
            owner_type: owner_type[attach]
        }
        // console.log(data);
        add_new_gate(data);
        $("button.add_thingslink_confirm").attr("disabled", true)
    });


    // 向个人名字增加虚拟测试网关
    $("button.add_new_gate").click(function(){
        redirect("My_Virtual_Gates.html")
    });
    // console.log($("select.group_select").select2("data"))





    /**
     *	添加新网关到当前用户
     */
    function add_new_gate(data){

        $.ajax({
            url: '/apis/api/method/iot_ui.iot_api.add_new_gate',
            headers: {
                Accept: "application/json; charset=utf-8",
                "X-Frappe-CSRF-Token": auth_token
            },
            type: 'post',
            data: data,
            // contentType: "application/json; charset=utf-8",
            dataType:'json',
            success:function(req){
                if(req.message==true){
                    $("button.add_thingslink_confirm").attr("disabled", false);
                    $("#modal-add-thingslink").modal('hide');
                    var t_ret = setTimeout(function(){
                        table_gates.ajax.url(gates_url).load(null,false);
                    },500);
                    $.notify({
                        title: "<strong>添加网关提示</strong><br><br> ",
                        message: data.sn + "添加成功<br>" + "如网关不在线，请在全部网关中查找。"
                    },{
                        newest_on_top: false,
                        delay: 15000,
                        type: "success"
                    });

                }

            },
            error:function(req){
                console.log(req);
            }
        });

    }







})