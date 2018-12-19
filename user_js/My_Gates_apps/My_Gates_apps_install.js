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


$("body").on("click", "span.app-detail", function() {

    var appid = $(this).data("cloudappid");
    console.log(appid);
    $('#container').waterfall('pause', function() {

    });
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
    console.log(appid);
    $('#container').waterfall('pause', function() {

    });
    app_detail(appid);
    $('a[href="#app_detail_div"]').tab('show');

    $('div.app-detail').addClass("hide");
    $('div.app-install').removeClass("hide");
    $('button.install-switch').data("install","0");
    $('button.install-switch').text("查看应用描述");

    $('#container').waterfall('pause', function() {

    });

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
    var inst = "";
    var appid = "";
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

    // gate_exec_action(action, act_post, task_desc, inst, action_str ,"1")

});