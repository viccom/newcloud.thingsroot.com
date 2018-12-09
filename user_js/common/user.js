isLogin();

/**
 *	判断是否登录
 */
function isLogin(){
    var noLoginArr = ['login','register','find','find2']; // 排除无需登陆的页面板块
    get_NewToken();
    auth_token = getCookie('auth_token');
    if(auth_token!=null){
        if(getCookie('full_name').split(" ").length > 0 ){
            $('.user-name').text(getCookie('full_name').split(" ")[0]);
        }else{
            $('.user-name').text("");
        }
    }


    // console.log("token:::",auth_token);
}

/**
 *	判断是否登录
 */
function isAdmin(){
    $.ajax({
        url: '/apis/api/method/iot_ui.iot_api.company_admin',
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'get',
        dataType:'json',
        success:function(req){
            console.log(req);
            setCookie('isAdmin',req.message.admin);
            if(req.message.admin==true){
                setCookie('companies',req.message.companies[0]);
            }else{
                setCookie('companies',"");
            }
        },
        error:function(req){
            console.log(req);
        }
    });

}

/**
 *	登录
 */
function login(usr ,pwd){
    var data = {"usr":usr, "pwd":pwd};
    $.ajax({
        url: '/apis/api/method/login',
        headers: {
            Accept: "application/json; charset=utf-8",
        },
        type: 'post',
        data: data,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        dataType:'json',
        success:function(req){
            if(req.message == 'Logged In'){
                //console.log('登录成功-----------------------------------------',req);
                setCookie('usr',usr);
                setCookie('full_name',req.full_name);
                isLogin();
                // 检测是否为管理员
                isAdmin();
            }else{

            }
        },
        error:function(req){
            if(req.responseJSON){
                console.log(req.responseJSON.message);
                $.notify({
                    title: "<strong>错误提示:</strong><br><br> ",
                    message: req.responseJSON.message
                },{
                    type: 'warning'
                });
            }
        }
    });
}


/**
 *	退出
 */
function logout(){
    $.ajax({
        url: '/apis/?cmd=logout',
        headers: {
            Accept: "application/json; charset=utf-8",
        },
        type: 'get',
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        dataType:'json',
        success:function(req){
                console.log('用户退出-----------------------------------------',req);
            $.notify({
                title: "<strong>提示:</strong><br><br> ",
                message: "用户退出"
            },{
                type: 'success'
            });
                delCookie('auth_token');
                setTimeout("redirect('login.html')", 1500);
        },
        error:function(req){

        }
    });

}

/**
 *	注册
 */
function register(){
    var email = $(".logoin input[name='email']").val();
    var full_name = $(".logoin input[name='full_name']").val();
    Ajax.call('/', {cmd:"frappe.core.doctype.user.user.sign_up",email:email,full_name:full_name,redirect_to:''}, registerFun, 'POST', 'JSON', 'FORM');
    //var index = loading();
    function registerFun(req){
        if(req.message[0]==0){
            alt(req.message[1],5);
            layer.closeAll(index);
            $('.layui-layer-loading').remove();
            return false;
        }else if(req.message[0]==1){
            alt(req.message[1],1);
            layer.close(index);
            setTimeout("redirect('login.html');", 2000);
            return false;
        }
    }
}

/**
 *	更新 获取token
 */
function get_NewToken() {
    var page_name = document.URL.split("/")[document.URL.split("/").length - 1];
    console.log(page_name);
    $.ajax({
        url: '/apis/api/method/iot_ui.iot_api.get_token?' + Date.parse(new Date()),
        headers: {
            Accept: "application/json; charset=utf-8",
        },
        type: 'get',
        contentType: "application/json; charset=utf-8",
        dataType:'json',
        success:function(req){
            var new_token  =  req.message;
            // console.log("new token:::",new_token);
            setCookie('auth_token',req.message);
            apply_AccessKey();
            if(page_name.search("login") != -1){
                redirect('/');
            }
            else{
                // $('.J_nickname').text(getCookie('full_name'));
            }
        },
        error:function(req){
            // console.log(req);
            if(req.responseJSON._server_messages){
                var err = JSON.parse(JSON.parse(req.responseJSON._server_messages)[0]);
                console.log(err.message)
                if(page_name.search("login") == -1){
                    $.notify({
                        title: "<strong>错误提示:</strong><br><br> ",
                        message: err.message
                    },{
                        type: 'warning'
                    });
                    redirect('login.html');
                }
            }

        }
    });
}

/**
 *	更新获取用户信息
 */
function User_info() {
    var userid = getCookie('usr');
    $.ajax({
        url: '/apis/api/resource/User/'+ userid +'?' + Date.parse(new Date()),
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'get',
        contentType: "application/json; charset=utf-8",
        dataType:'json',
        success:function(req){
            // console.log(req.data);
            $("span.user_nickname").text(req.data.full_name);
            $("span.user_id").text(userid);
            $("span.user_phone").text(req.data.mobile_no);
            $("span.user_email").text(req.data.email);
        },
        error:function(req){
            console.log(req);

        }
    });
}

/**
 *	更新获取用户公司
 */
function user_company() {
    var userid = getCookie('usr');
    $.ajax({
        url: '/apis/api/method/iot_ui.iot_api.user_company?' + Date.parse(new Date()),
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'get',
        contentType: "application/json; charset=utf-8",
        dataType:'json',
        success:function(req){
            // console.log(req);
            $("span.user_company").text(req.message.company);
            $("span.user_role").text("普通用户");
        },
        error:function(req){
            console.log(req);

        }
    });
}