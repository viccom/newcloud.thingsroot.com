$.ajaxSetup({
    headers: { // 默认添加请求头
        "X-Frappe-CSRF-Token": auth_token
    }
});

function app_detail(appid) {

    $.ajax({
        url: "/apis/api/method/app_center.api.app_detail",
        type: "GET",
        data: {app:appid},
        async:false,
        success: function (data) {
            // $('.app_img').attr("src",data.message.icon_image);
            if(data.message.has_conf_template) {
                templ_conf = $.parseJSON(data.message.conf_template);
            }
            if(data.message){
                $('#formAppId').val(data.message.name);
                $('.app_name').text(data.message.app_name); //应用名称
                $('.app_owner').text(data.message.owner);
                if(data.message.fork_from == null){      //主分支，判断是否有主分支
                    $('.fork_from').css('display','none');
                }else{
                    $('.fork_from').css('display','inline-block');
                    $('.fork_from').val(data.message.fork_from);
                }
                $('.edit').val(data.message.name);   //name
                $('.app_category').text(data.message.category);   //应用类别
                $('.device_supplier').text(data.message.device_supplier);   //设备厂家
                if(data.message.license_type == "Open"){
                    $('.license_type').text("免费")
                }
                $('.app_protocol').text(data.message.protocol);   //通讯协议

                $('.device_serial').text(data.message.device_serial);   //适配型号
                $('.app_img').src = data.message.icon_image;    //app图片
                // console.log(data.message.description);
                // $('#test-editormd>textarea').val(data.message.description);  //Markdown内容
                $('#test-editormd').html('<textarea id="my-editormd-markdown-doc" name="my-editormd-markdown-doc" style="display:;"></textarea>');
                $('#my-editormd-markdown-doc').val(data.message.description);
                testEditor = editormd.markdownToHTML("test-editormd", {
                    htmlDecode: "style,script,iframe",  // you can filter tags decode
                    emoji: true,
                    taskList: true,
                    tex: true,  // 默认不解析
                    flowChart: true,  // 默认不解析
                    sequenceDiagram: true  // 默认不解析
                });
            }

        }, error: function () {
            console.log('no')
        }, complete: function () {
            console.log("ss");

        }
    });
}

var testEditor;
templ_list = null;
templ_list_obj = null;
templ_conf = null;

$("body").on("click", "span.app-detail", function() {

    var appid = $(this).data("cloudappid");
    var appname = $(this).data("appname");

    $('button.app-install-to-gate').data("cloudappid",appid)
    $('button.app-install-to-gate').data("appname",appname)


    console.log(appid, appname);
    $('#container').waterfall('pause', function() {

    });
    list_app_conf(appid);
    app_detail(appid);

    $('a[href="#app_detail_div"]').tab('show');
    $('a[href="#app-description"]').tab('show');
    $('div.app-detail').removeClass("hide");
    $('div.app-install').addClass("hide");
    $('button.install-switch').data("install","1");
    $('button.install-switch').text("安装到网关");


});

//初始化对象
json_editor = ace.edit("json_editor");

//设置风格和语言（更多风格和语言，请到github上相应目录查看）
json_editor.setTheme("ace/theme/clouds");
json_editor.getSession().setMode("ace/mode/javascript");

//字体大小
json_editor.setFontSize(18);

//设置只读（true时只读，用于展示代码）
json_editor.setReadOnly(false);

//自动换行,设置为off关闭
json_editor.setOption("wrap", "free")

//启用提示菜单
ace.require("ace/ext/language_tools");
json_editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});
// editor.setValue("the new text here");

// console.log("config:::", appconfigs[$(".shade .J_oneAppInfo").attr('data-inst')]);
// json_editor.setValue(JSON.stringify(appconfigs[$(".shade .J_oneAppInfo").attr('data-inst')], null, 4));
json_editor.setValue('{}');
var session = json_editor.getSession();

$("body").on("click", "a.app-config", function() {
    var appid = $(this).data("cloudappid");
    var appname = $(this).data("appname");
    $('button.app-install-to-gate').data("cloudappid",appid)
    $('button.app-install-to-gate').data("appname",appname)
    console.log(appid, appname);
    $('#container').waterfall('pause', function() {
    });
    list_app_conf(appid);
    app_detail(appid);
    $('a[href="#app_detail_div"]').tab('show');

    $('div.app-detail').addClass("hide");
    $('div.app-install').removeClass("hide");
    $('button.install-switch').data("install","0");
    $('button.install-switch').text("查看应用描述");

    if(templ_conf){
        create_appconfig_panel(templ_conf)
    }

    // list_app_conf(appid);
    // get_app_detail(appid);


});

$('.close-app-detail').click(function() {


    $('a[href="#app_market_div"]').tab('show');
    $('#container').waterfall('resume', function() {

    });

});

$('button.install-switch').click(function() {
    if($(this).data("install")=="1"){
        $('div.app-detail').addClass("hide");
        $('div.app-install').removeClass("hide");
        $(this).data("install","0");
        $(this).text("查看应用描述");
    }else{
        $('div.app-detail').removeClass("hide");
        $('div.app-install').addClass("hide");
        $(this).data("install","1");
        $(this).text("安装到网关");
    }
});

$('button.app-install-to-gate').click(function() {
    var appid = $(this).data("cloudappid");
    var appname = $(this).data("appname");
    var inst = $('#gate_inst_1').val();

    if(checkinst(inst)){
        var appcfg = JSON.parse(json_editor.getValue());
        console.log(typeof appcfg);
        var id = 'app_install/' + gate_sn + '/'+ inst +'/'+ Date.parse(new Date());
        var act_post = {
            "device": gate_sn,
            "id": id,
            "data": {
                "inst": inst,
                "name": appid,
                "version":'latest',
                "conf": appcfg
            }
        };
        var action = "app_install";
        var task_desc = '应用配置'+ inst;


    }


    // gate_exec_action(action, act_post, task_desc, inst, action_str ,"1")

});




function isUsername(inst) {
    // console.log(typeof username);
    if (/^\d.*$/.test(inst)) {
        return 1;
    }
    if (!/^.{3,10}$/.test(inst)) {
        return 2;
    }
    // if (!/^[\w_]*$/.test(username)) {
    //     return 3;
    // }
    if (!/^\w+$/.test(inst)) {
        return 3;
    }
    return 0;
}

function checkinst(inst) {

    if (inst == "" || inst == null) {

        $('#gate_inst_1').data("content", "实例名不能为空");
        $('.popover-name').popover('show');
        setTimeout(function () {
            $('.popover-name').popover('destroy');
        },2000);
        return false;
    }
    console.log(inst, isUsername(inst));
    switch (isUsername(inst)) {
        case 0:
            break;
        case 1:
        {
            $('#gate_inst_1').data("content", "实例名不能以数字开头");
            $('.popover-name').popover('show');
            setTimeout(function () {
                $('.popover-name').popover('destroy');
            },2000);
            return false;
        }
        case 2:
        {
            $('#gate_inst_1').data("content", "实例名合法长度为3-10个字符");
            $('.popover-name').popover('show');
            setTimeout(function () {
                $('.popover-name').popover('destroy');
            },2000);
            return false;
        }
        case 3:
        {
            $('#gate_inst_1').data("content", "实例名只能包含_,英文字母，数字");
            $('.popover-name').popover('show');
            setTimeout(function () {
                $('.popover-name').popover('destroy');
            },2000);
            return false;
        }
        // case 4:
        // {
        //     $(".register:input[name='full_name']").data("content", "用户名只能包含_,英文字母，数字");
        //     $('.popover-name').popover('show');
        //     setTimeout(function () {
        //         $('.popover-name').popover('destroy');
        //     },2000);
        //     return false;
        // }
    }
    return true;
}






/**
 *	获取应用模板配置信息
 */
function list_app_conf(app) {

    $.ajax({
        url: "/apis/api/method/conf_center.api.list_app_conf",
        type: "GET",
        async: false,
        data: {app:app,limit:100},
        success: function (req) {

            if(req.message){
                templ_list = req.message;
                for (var n=0;n<templ_list.length;n++){

                    console.log(templ_list[n].name, templ_list[n].conf_name)
                    // templ_list_obj[templ_list[n].conf_name]=templ_list[n].name
                }

            }

            // console.log(req)
            // if(list){
            //     for(var i=0;i<list.length;i++){
            //         var html = '<tr>';
            //         html += '<td>'+list[i].conf_name+'</td><td>'+list[i].description+'</td><td>'+list[i].name+'</td><td><button class="add_single">添加</button></td></tr>'
            //         $('#select_template table').append(html);
            //     }
            // }
        }, error: function (req) {
            console.log(req)
        }

    });
}






/**
 *	创建应用配置面板
 */
function create_appconfig_panel(data) {
    $('.c_content').empty();
    for (var i=0;i<data.length;i++){
        if(data[i].type=="dropdown"){
            var val_list = data[i].value;
            var val_html = '<option selected>'+ val_list[0] + '</option>';
            for (var n=1;n<val_list.length;n++){
                val_html = val_html + '<option>' + val_list[n]  + '</option>';
            }

            var head_html = '<div class="col-md-12" style="padding: 0">' +
                '<form class="form-horizontal" onsubmit="return false;">' +
                '<div class="form-group">' +
                '<label class="col-sm-2 control-label config-label">'+ data[i].desc + '：</label>' +
                '<div class="col-sm-3">' +
                '<select id="'+ data[i].name +'" data-depends=\'{"Modbus TCP":"tcp_section","Modbus RTU":"serial_section"}\' class="form-control config_panel">' +
                val_html +
                '</select>' +
                '</div>' +
                '</div>' +
                '</form>' +
                '</div>'
            $('.c_content').append(head_html);
        }


        if(data[i].type=="section"){
            if(data[i].name=="serial_section"){
                var head_html = '<div id="' + data[i].name +'" class="col-md-12" style="padding: 0"><p>| ' + data[i].desc + '</p></div>'
                $('.c_content').append(head_html);

                var child = data[i].child;
                for (var j=0;j<child.length;j++){
                    if(child[j].type=="dropdown"){
                        var val_html = '<option selected>' + child[j].value[0]  + '</option>';
                        for (var k=1;k<child[j].value.length;k++){
                            val_html = val_html + '<option>' + child[j].value[k]  + '</option>';
                        }
                        var _html =  '<div class="col-md-6">'
                            + '<form class="form-horizontal" onsubmit="return false;">'
                            + '<div class="form-group">'
                            + '<label class="col-sm-4 control-label config-label">'+ child[j].desc +'：</label>'
                            + '<div class="col-sm-8">'
                            + '<select id="'+ child[j].name +'" class="form-control config_panel">'
                            + val_html
                            + '</select>'
                            + '</div>'
                            + '</div>'
                            + '</form>'
                            + '</div>'

                        $('#'+data[i].name).append(_html);

                    }

                    if(child[j].type=="text"){

                        var _html =  '<div class="col-md-6">'
                            + '<form class="form-horizontal" onsubmit="return false;">'
                            + '<div class="form-group">'
                            + '<label class="col-sm-4 control-label config-label">'+ child[j].desc +'：</label>'
                            + '<div class="col-sm-8">'
                            + '<input name="' + child[j].name +'" type="text" class="form-control config_panel">'
                            + '</div>'
                            + '</div>'
                            + '</form>'
                            + '</div>'
                        $('#'+data[i].name).append(_html);
                    }

                    if(child[j].type=="number"){

                        var _html =  '<div class="col-md-6">'
                            + '<form class="form-horizontal" onsubmit="return false;">'
                            + '<div class="form-group">'
                            + '<label class="col-sm-4 control-label config-label">'+ child[j].desc +'：</label>'
                            + '<div class="col-sm-8">'
                            + '<input name="' + child[j].name +'" type="number" class="form-control config_panel">'
                            + '</div>'
                            + '</div>'
                            + '</form>'
                            + '</div>'
                        $('#'+data[i].name).append(_html);
                    }

                    if(child[j].type=="boolean"){

                        var _html =  '<div class="col-md-6">'
                            + '<form class="form-horizontal" onsubmit="return false;">'
                            + '<div class="form-group">'
                            + '<label class="col-sm-4 control-label config-label">'+ child[j].desc +'：</label>'
                            + '<div class="col-sm-8">'
                            + '<div class="checkbox"><label><input id="'+ child[j].name +'" type="checkbox"></label></div>'
                            + '</div>'
                            + '</div>'
                            + '</form>'
                            + '</div>'
                        $('#'+data[i].name).append(_html);
                    }

                }





            }

            if(data[i].name=="tcp_section"){
                var head_html = '<div id="' + data[i].name +'" class="col-md-12" style="padding: 0"><p>| ' + data[i].desc + '</p></div>'
                $('.c_content').append(head_html);
                var child = data[i].child;
                for (var j=0;j<child.length;j++){
                    if(child[j].type=="text"){
                        console.log(child[j])

                        var _html =  '<div class="col-md-6">'
                            + '<form class="form-horizontal" onsubmit="return false;">'
                            + '<div class="form-group">'
                            + '<label class="col-sm-4 control-label config-label">'+ child[j].desc +'：</label>'
                            + '<div class="col-sm-8">'
                            + '<input name="' + child[j].name +'" type="text" class="form-control config_panel">'
                            + '</div>'
                            + '</div>'
                            + '</form>'
                            + '</div>'
                        $('#'+data[i].name).append(_html);
                    }

                    if(child[j].type=="number"){
                        console.log(child[j])

                        var _html =  '<div class="col-md-6">'
                            + '<form class="form-horizontal" onsubmit="return false;">'
                            + '<div class="form-group">'
                            + '<label class="col-sm-4 control-label config-label">'+ child[j].desc +'：</label>'
                            + '<div class="col-sm-8">'
                            + '<input name="' + child[j].name +'" type="number" class="form-control config_panel">'
                            + '</div>'
                            + '</div>'
                            + '</form>'
                            + '</div>'
                        $('#'+data[i].name).append(_html);
                    }

                    if(child[j].type=="boolean"){
                        console.log(child[j])

                        var _html =  '<div class="col-md-6">'
                            + '<form class="form-horizontal" onsubmit="return false;">'
                            + '<div class="form-group">'
                            + '<label class="col-sm-4 control-label config-label">'+ child[j].desc +'：</label>'
                            + '<div class="col-sm-8">'
                            + '<div class="checkbox"><label><input id="'+ child[j].name +'" type="checkbox"></label></div>'
                            + '</div>'
                            + '</div>'
                            + '</form>'
                            + '</div>'
                        $('#'+data[i].name).append(_html);
                    }


                }

            }

            if(data[i].name=="template_section"){

                var child = data[i].child[0];
                // console.log(data[i].desc);
                // console.log(child);
                if(child.type=="templates"){

                    var head_html = '<div id="' + data[i].name + '_' + child.type + '" class="col-md-12" style="padding: 0"><p><span>| '+ data[i].desc +' </span></p>' +
                        '<div class="table-responsive" style="padding-bottom: 20px">' +
                        '<table class="table table-bordered nowrap ' + data[i].name  + '_' + child.type +  '">' +
                        '<tr>' +
                        '<th  data-class="disabled bg-gray-light" style="width: 25%">名称</th>' +
                        '<th  data-class="disabled bg-gray-light" style="width: 35%">描述</th>' +
                        '<th  data-class="disabled bg-gray-light" style="width: 25%">模板ID</th>' +
                        '<th  style="width: 15%">操作</th>' +
                        '</tr>' +
                        // '<tr>' +
                        // '<td>11</td><td>22</td><td>33</td><td>44</td>' +
                        // '</tr>' +
                        // '<tr>' +
                        // '<td>aa</td><td>bb</td><td>cc</td><td>dd</td>' +
                        // '</tr>' +
                        '</table>' +
                        '<button type="button" class="btn add_templ templates"  data-toggle="modal" data-target="#modal-add-templ">增加模板</button>   ' +
                        '</div>' +
                        '</div>'
                    $('.c_content').append(head_html);

                }

                if(child.type=="table"){
                    var child = data[i].child[0];
                    var val_html = '';
                    var td_html = '';
                    for (var m=0;m<child.cols.length;m++){
                        val_html = val_html + '<th style="width: 20%"  data-name="' + child.cols[m].name +'" data-class="'+ child.cols[m].type + '" data-type="'+ child.cols[m].type + '">' + child.cols[m].desc + '</th>'
                        td_html = td_html+'<td>--</td>'
                    }
                    val_html += '<th>操作</th>'
                    td_html += '<td><button class="delete_device_list">刪除</button></td>'

                    var head_html = '<div id="' + data[i].name +'_'+ child.name + '" class="col-md-12" style="padding: 0"><p><span>| '+ data[i].desc +' </span></p>' +
                        '<div class="table-responsive" style="padding-bottom: 20px">' +
                        '<table class="table table-bordered nowrap ' + data[i].name  + '_' + child.type + '">' +
                        '<tr>' +
                        val_html +
                        '</tr>' +
                        // '<tr>'+
                        // td_html+
                        // '</tr>' +
                        '</table>' +
                        '<button type="button" class="btn add_device addRows ' + data[i].name + '   popover-device"  data-placement="top" data-content="">增加设备</button>' +
                        '</div>' +
                        '</div>'

                    $('.c_content').append(head_html);
                }

            }

        }

    }

    // $("#sel  option[value='s2'] ").attr("selected",true)

    var sel_list = $("select.config_panel");
    for (var i=0;i<sel_list.length;i++){
        if(sel_list[i].dataset){
            if(sel_list[i].dataset.depends){
                var depends = JSON.parse(sel_list[i].dataset.depends);
                console.log(depends);
                // return false
                var key = sel_list[i].value;
                // $("div#"+depends[sel_list[i].value]);
                $.each(depends, function(i, val){
                    // console.log(i,val);
                    if(i!=key){
                        $("div#"+ val).addClass("hide");
                    }else{
                        $("div#"+ val).removeClass("hide");
                    }

                });

                $(sel_list[i]).change(function(){
                    var key = $(this).val();

                    $.each(depends, function(i, v){

                        if(i!=key){
                            $("div#"+ v).addClass("hide");
                        }else{
                            $("div#"+ v).removeClass("hide");
                        }

                    });
                });

            }

        }
    }



    //表格添加行
    $('button.addRows').click(function () {
        console.log("添加行");
        var templates_row1 = get_table_row1(".template_section_templates.table");
        if(templates_row1.length<1){

            $('button.addRows').data("content", "需先添加模板到设备模板");
            $('.popover-device').popover('show');
            setTimeout(function () {
                $('.popover-device').popover('destroy');
            },2000);
            return false;
            return false;
        }
        var table = $(this).parent().find($('table>tbody'));
        var tr_len = $(this).parent().find($('table th')).length;
        var html = '<tr class="sj">';
        for (var n=0;n<tr_len-1;n++){
            var tdclass = "";
            if($(this).parent().find($('table th:nth-child('+(n+1)+')')).data('class')){
                tdclass = $(this).parent().find($('table th:nth-child('+(n+1)+')')).data('class');
            }
            var inputtype = 'text';
            if($(this).parent().find($('table th:nth-child('+(n+1)+')')).data('type')){
                inputtype = $(this).parent().find($('table th:nth-child('+(n+1)+')')).data('type');
            }
            if($(this).parent().find($('table th:nth-child('+(n+1)+')')).data('type')=="template"){

                // console.log(templates_row1);

                var opt_html = '<select class="form-control select_templ"><option selected>'+ templates_row1[0] + '</option>';
                for (var i=1;i<templates_row1.length;i++){
                    opt_html += '<option>' + templates_row1[i]  + '</option>';
                }
                opt_html += '</select>'
                html += '<td class="bj ' + tdclass +  '" name="'+ inputtype +'">' + opt_html + '</td>';
            }else{
                html += '<td class="bj ' + tdclass +  '" name="'+ inputtype +'"></td>';
            }

        }
        html += '<td><button class="delete_device_list">刪除</button></td></tr>';
        table.append(html);
        // if(!list){
        //     $('.tpl').text('————');
        //     $('.tpl').addClass('disabled');
        // }
        //点击td进行编辑
        $("body").on("click", "table>tbody>tr .bj", function () {
            // console.log($(this).text());
            // console.log(!$(this).is('.input'));
            // console.log(!$(this).is('.disabled'));
            if( !$(this).is('.input') ){
                if( !$(this).is('.disabled') ){
                    var oldval = $(this).text();
                    var templates_row1 = get_table_row1(".template_section_templates.table");
                    // console.log(templates_row1);
                    var html;
                    if(!$(this).hasClass('template')){
                        html = '<input type="'+ $(this).attr('name') +'" value="' + oldval + '" />'
                    }
                    $(this).addClass('input')
                        .click(function () {
                            // console.log($(this).text());
                        })
                        .html(html)
                        .find('input')
                        .focus()
                        .blur(function(){
                            console.log($(this).val(),oldval)
                            if($(this).val()=="" && oldval!=""){
                                $(this).parent().removeClass('input').html(oldval);
                            }else if($(this).val()!=""){
                                $(this).parent().removeClass('input').html($(this).val() );
                            }else if($(this).val()=="" && oldval==""){
                                $.notify({
                                    title: "<strong>提示:</strong><br><br> ",
                                    message: "不能为空！"
                                },{
                                    type: 'warning',
                                    delay: 2000
                                });
                            }


                            $('.visualize').trigger('visualizeRefresh');
                        });
                    if($(this).hasClass('template')){
                        if(templates_row1){

                        }
                    }
                }
            }

            // $(".select_templ").change(function(){
            //     console.log($(this).parent().val());
            //     $(this).parent().removeClass('input').html($(this).val() )
            // });

            // $("body").on("click", "table>tbody>tr .bj.template", function() {
            //     var oldval = $(this).text();
            //     console.log(oldval)
            //     var templates_row1 = get_table_row1(".template_section_templates.table");
            //     var html;
            //
            //     var opt_html = '<option selected>' + templates_row1[0] + '</option>';
            //     for (var n = 1; n < templates_row1.length; n++) {
            //         opt_html += '<option>' + templates_row1[n] + '</option>';
            //     }
            //     html = '<select class="form-control select_templ">'
            //         + opt_html
            //         + '</select>'
            //     $(this).html(html);
            // });


        });
        //删除行
        $('.delete_device_list').click(function () {
            $(this).parent().parent().remove()
        })

    });


    //点击按钮
    $('.creat_templ').click(function () {

        var rowdat = get_table_row1(".template_section_templates");
        console.log(rowdat)
    })


    
}





$('#modal-add-templ').on('show.bs.modal', function () {
    create_templ_select();

});



/**
 *	获取表格第一列数据
 */
function get_table_row1(id){
    var trlist = $(id + ".table>tbody>tr").find("td:eq(0)");
    // console.log(trlist);
    // console.log(typeof trlist);
    var row1data = new Array();
    if(trlist.length>0){
        for(var i=0;i<trlist.length;i++){
            row1data.push(trlist[i].innerText)
        }

        return row1data;
    }else{
        return []
    }
}

/**
 *	获取表格第2列数据
 */
function get_table_row2(){
    var trlist = $(".template_section_table.table>tbody>tr").find("td:eq(1)");
    console.log(trlist);
    // console.log(typeof trlist);
    var row1data = new Array();
    if(trlist.length>0){
        for(var i=0;i<trlist.length;i++){
            row1data.push($(trlist[i]).find("select").select()[0].value)
        }

        return row1data;
    }else{
        return []
    }
}


/**
 *	获取表格所有数据
 */
function get_table_data(id){
    var table_set = [];
    $("."+ id + '.table tr').each(function() {
        var row = [];
        $(this).find('td').each(function() {
            var v = $(this).text();
            if($(this).hasClass('template')){
                // console.log($(this).find("select").select()[0].value);
                v = $(this).find("select").select()[0].value
                }
            row.push(v);
        });
        row.pop();
        table_set.push(row);
    });
    table_set.shift();
    return table_set
}

/**
 *	创建设备模板选择表单
 */
function create_templ_select(){
    var templates_row1 = get_table_row1(".template_section_templates.table");
    var templ_select = $("#select_templ_list");
    $("#select_templ_list  tr:not(:first)").empty("");
    for (var n=0;n<templ_list.length;n++){
        var html = '<tr>';

        html += '<td>' + templ_list[n].conf_name + '</td>';
        html += '<td>' + templ_list[n].description + '</td>';
        html += '<td>' + templ_list[n].name + '</td>';
        console.log(templ_list[n].conf_name, templates_row1)
        if($.inArray(templ_list[n].conf_name, templates_row1)==-1){
            html += '<td><button class="add_templ_toapp">添加</button></td></tr>';
        }else{
            html += '<td>已添加</td></tr>';
        }
        templ_select.append(html);
    }

    //点击添加按钮
    $('.add_templ_toapp').click(function () {

        var templates_table = $(".template_section_templates.table");


        var valx = $(this).parent().parent().find("td");
        var valy = valx.eq(3).text()
        // console.log(valx)
        // console.log(valy)
        var html = '<tr>';
        for (var n=0;n<valx.length -1 ;n++){
            html += '<td class="disabled bg-gray-light">' + valx.eq(n).text() + '</td>';
        }
        html += '<td class="disabled bg-gray-light"><button class="delete_templates_col">刪除</button></td></tr>';
        templates_table.append(html);

        $(this).parent().html('已添加');

        $('.delete_templates_col').click(function () {
            $(this).parent().parent().remove()
        })
    })



}