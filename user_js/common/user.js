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
function register(full_name, email){

    $.ajax({
        url: '/apis/?cmd=frappe.core.doctype.user.user.sign_up&email='+ email + '&full_name='+ full_name + '&redirect_to=',
        headers: {
            Accept: "application/json; charset=utf-8"
        },
        type: 'get',
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        dataType:'json',
        success:function(req){
            console.log('用户注册成功-----------------------------------------',req);
            $(".register:button[name='submit']").attr("disabled", false);
            if(req.message){
                if(req.message[0]==0){

                    $.notify({
                        title: "<strong>提示:</strong><br><br> ",
                        message: '此用户' + req.message[1]
                    },{
                        type: 'warning'
                    });

                }else if(req.message[0]==1){
                    $.notify({
                        title: "<strong>提示:</strong><br><br> ",
                        message: '注册成功，' + req.message[1] + '<br>' + '登录邮箱'+ email + '完成注册'
                    },{
                        type: 'success'
                    });
                }
            }

            delCookie('auth_token');
            // setTimeout("redirect('login.html')", 1500);
        },
        error:function(req){
            console.log('错误-----------------------------------------',req);
            $(".register:button[name='submit']").attr("disabled", false);
        }
    });

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
                if(page_name.search("login") == -1  && page_name.search("register") == -1){
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

/**
 *	获取公司组列表
 */
function get_company_groups() {
    var userid = getCookie('usr');
    var companies = null;
    if(getCookie('isAdmin')){
        companies = getCookie('companies');
    }
    if(companies){
        $.ajax({
            url: '/apis/api/method/iot_ui.iot_api.get_company_groups?company=' + companies,
            headers: {
                Accept: "application/json; charset=utf-8",
                "X-Frappe-CSRF-Token": auth_token
            },
            type: 'get',
            contentType: "application/json; charset=utf-8",
            dataType:'json',
            success:function(req){
                console.log("gret:",req);
                var data= [];
                var t = {};
                for (var i = 0; i < req.message.length; i++) {
                    console.log(i, req.message[i].group_name, req.message[i].name);

                    if(req.message[i].group_name=="root"){
                        t={ id: req.message[i].name, text: req.message[i].group_name, "selected": true };
                    }else{
                        t={ id: req.message[i].name, text: req.message[i].group_name };
                    }

                    data.push(t)
                }

                // data = [{ id: 0, text: 'enhancement',"selected": true }, { id: 1, text: 'bug' }, { id: 2, text: 'duplicate' }, { id: 3, text: 'invalid' }, { id: 4, text: 'wontfix' }];
                $("select.group_select").select2({
                    data: data,
                    placeholder:'请选择',
                    allowClear:true
                })

            },
            error:function(req){
                console.log(req);

            }
        });
    }else{
        $("select.group_select").attr("disabled",true);
        $("button.select_personal").removeClass("btn-default");
        $("button.select_personal").addClass("btn-primary");
        $("button.select_company").removeClass("btn-primary");
        $("button.select_company").addClass("btn-default");
        $("button.select_personal").attr("disabled",true);
        $("button.select_company").attr("disabled",true);
        attach = "1";
    }

}

