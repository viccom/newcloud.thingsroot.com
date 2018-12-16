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
        }, error: function () {
            console.log('no')
        }, complete: function () {
            console.log("ss");

        }
    });
}

var testEditor;


$("body").on("click", "span.app-detail", function() {
    console.log("2222222222");
    var appid = $(this).data("cloudappid");
    console.log(appid);
    $('#container').waterfall('pause', function() {

    });
    app_detail(appid);
    $('a[href="#app_detail_div"]').tab('show');


});

$("body").on("click", "a.app-config", function() {
    console.log("3333333333");

    $('a[href="#app_config_div"]').tab('show');
    var appid = $(this).data("cloudappid");
    var appname = $(this).data("appname");
    console.log(appid,appname);
    $('span.app_name_config').html(appname);

    $('#container').waterfall('pause', function() {

    });

});

$('.close-app-detail').click(function() {


    $('a[href="#app_market_div"]').tab('show');
    $('#container').waterfall('resume', function() {

    });

});

$('.close-app-config').click(function() {


    $('a[href="#app_market_div"]').tab('show');
    $('#container').waterfall('resume', function() {

    });


});