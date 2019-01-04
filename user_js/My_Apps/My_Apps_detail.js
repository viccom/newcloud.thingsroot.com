//获取token

$.ajaxSetup({
    headers: { // 默认添加请求头
        "X-Frappe-CSRF-Token": auth_token
    }
});
//获取用户信息
var user = getCookie('usr');
var appid  = getParam('appid');
var testEditor;


get_app_detail();
function get_app_detail(){
    $.ajax({
        url: "/apis/api/method/app_center.api.app_detail",
        type: "GET",
        data: {app:appid},
        success: function (data) {
            // $('.app_img').attr("src",data.message.icon_image);
            $('#formAppId').val(data.message.name);
            $('.app_name').text(data.message.app_name); //应用名称
            $('.app_owner').text(data.message.owner);
            if(data.message.owner!==user){
                $('.notowner').addClass("hide");
            }else{
                $('.notowner').removeClass("hide");
            }

            if(data.message.fork_from == null){      //主分支，判断是否有主分支
                $('div.fork_from').addClass("hide");
            }else{
                $('div.fork_from').removeClass("hide");
                $('a.fork_from').val(data.message.fork_from);
            }
            $('.edit').val(data.message.name);   //name
            $('.app_category').text(data.message.category);   //应用类别
            $('.device_supplier').text(data.message.device_supplier);   //设备厂家
            if(data.message.license_type == "Open"){
                $('.license_type').text("免费")
            }
            $('.app_protocol').text(data.message.protocol);   //通讯协议
            console.log(data.message.protocol)
            $('.device_serial').text(data.message.device_serial);   //适配型号
            $('.app_img').src = data.message.icon_image;    //app图片
            $('#test-editormd>textarea').val(data.message.description);  //Markdown内容
        }, error: function () {
            console.log('no')
        }, complete: function () {

            testEditor = editormd.markdownToHTML("test-editormd", {
                htmlDecode: "style,script,iframe",  // you can filter tags decode
                emoji: true,
                taskList: true,
                tex: true,  // 默认不解析
                flowChart: true,  // 默认不解析
                sequenceDiagram: true  // 默认不解析
            });
        }
    });
}
