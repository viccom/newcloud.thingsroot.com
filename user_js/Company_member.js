
var _groupid = "";
var table_members_url = '/apis/api/method/iot_ui.iot_api.list_group_member?groupid=' + _groupid;
var table_members = null;

$(function () {
    // 公司增加新组
    $("button.add_company_group").click(function(){
        var group_name = $("#group_name:input").val();
        // console.log(group_name);
        if(check_group_name(group_name)){
            add_company_group(group_name);
            $("button.add_company_group").attr("disabled", true);
        }
    });

    // 点击公司时触发
    $("body").on("click", "div.company", function() {
        $("ul.group_list>li").removeClass("active");
        $("button.group-add-member").addClass("hide");
        $("button.company-add-member").removeClass("hide");
        $("div.company").addClass("bg-gray");
        if(table_members){
            _groupid = $(this).data("groupid");
            console.log("@@@@@@@",  _groupid);
            table_members_url = '/apis/api/method/iot_ui.iot_api.list_group_member?groupid=' + _groupid;
            table_members.ajax.url(table_members_url).load(null,false);
        }

        // console.log("@@@@@@@",  group_id);
    });


    // 选择组时触发
    $("body").on("click", "li.select_group", function() {
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
        $("button.group-add-member").removeClass("hide");
        $("button.company-add-member").addClass("hide");
        $("div.company").removeClass("bg-gray");
        if(table_members){
            _groupid = $(this).data("groupid");
            console.log("@@@@@@@",  _groupid);
            table_members_url = '/apis/api/method/iot_ui.iot_api.list_group_member?groupid=' + _groupid;
            table_members.ajax.url(table_members_url).load(null,false);
        }

    });

    // 删除组按钮触发
    $("body").on("click", "span.del_group_info", function() {
        var group_name = $(this).data("groupname");
        var group_id = $(this).data("groupid");
        // console.log("@@@@@@@", group_name, group_id);
        $("span.del_group_name").text(group_name);
        $("span.del_group_id").text(group_id);
    });

    // 公司删除组
    $("button.del_group_confirm").click(function(){
        var group_name = $("span.del_group_name").text();
        var group_id = $("span.del_group_id").text();
        if(group_id){
            del_company_group(group_id);
            $("button.del_group_confirm").attr("disabled", true);
        }
    });

    // 公司添加新用户
    $("button.add_member_confirm").click(function(){
        var usrid = $("#userid").val();
        var first_name = $("#first_name").val();
        var last_name = $("#last_name").val();
        var mobile = $("#mobile").val();
        var phone = $("#phone").val();
        var pwd = $("#new-pwd").val();
        var repeat_pwd = $("#repeat-pwd").val();

        if(checkUsername(first_name)){
            var email = $(".register:input[name='email']").val();
            if(email==''){
                $(".register:input[name='email']").data("content", "邮箱不能为空");
                $('.popover-email').popover('show');
                setTimeout(function () {
                    $('.popover-email').popover('destroy');
                },2000);
                return false;
            }else{

                var mailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
                if(mailReg.test(email)){
                    console.log("33")
                    $(".register:button[name='submit']").attr("disabled", true);
                    user_exists(email);
                    register(full_name, email);
                    return true;
                }else{

                    $(".register:input[name='email']").data("content", "邮箱格式不合法");
                    $('.popover-email').popover('show');
                    setTimeout(function () {
                        $('.popover-email').popover('destroy');
                    },2000);
                    return false;
                }
            }

        }


        var userinfo = {
                "email":usrid,
                "first_name":first_name,
                "last_name":last_name,
                "phone":phone,
                "mobile_no":mobile,
                "new_password":repeat_pwd
        };
        console.log(userinfo);
        return false;
        add_newuser2company(userinfo);

    });


});