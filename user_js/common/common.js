
$.notifyDefaults({
    element: 'body',
    position: null,
    type: "info",
    allow_dismiss: true,
    newest_on_top: true,
    placement: {
        from: "bottom",
        align: "right"
    },
    offset: 20,
    spacing: 10,
    z_index: 1031,
    delay: 5000,
    timer: 1000,
    url_target: '_blank',
    mouse_over: null,
    animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
    },
    onShow: null,
    onShown: null,
    onClose: null,
    onClosed: null,
    icon_type: 'class',
    template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss">&times;</button><span data-notify="icon"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
});

/**
 * @file            common.js
 * @description     公共函数。
 * @author          dongsun Team ( http://www.dongsun.com/ )
 * @date            2018-03-08 dongsun
**/

/* 排除 transport.js和jquery的冲突 */
$(function() {
	window.__Object_toJSONString = Object.prototype.toJSONString;
	delete Object.prototype.toJSONString;
});

/**
 *	检测IP地址是否合法
 **/

function checkIP(value){
    str = value.match(/(\d+)\.(\d+)\.(\d+)\.(\d+)/g);
    if (str == null){
        // alert("你输入的IP地址格式不正确");
        return false;
    }else if (RegExp.$1>224 || RegExp.$2>255 || RegExp.$3>255 || RegExp.$4>255){
        // alert("你输入的IP地址无效");
        return false;
    }else{
        // alert("你输入的IP地址有效");
        return true;
    }
}

/**
 *	UTF8编码
 **/
function encodeUTF8(str){
    var temp = "",rs = "";
    for( var i=0 , len = str.length; i < len; i++ ){
        temp = str.charCodeAt(i).toString(16);
        rs  += "\\u"+ new Array(5-temp.length).join("0") + temp;
    }
    return rs;
}
/**
 *	UTF8解码
 **/
function decodeUTF8(str){
    return str.replace(/(\\u)(\w{4}|\w{2})/gi, function($0,$1,$2){
        return String.fromCharCode(parseInt($2,16));
    });
}





/**
 *	获取url里的文件名
**/
function getHtmlDocName() {
    var str = window.location.href;
    str = str.substring(str.lastIndexOf("/") + 1);
    str = str.substring(0, str.lastIndexOf("."));
    return str;
}
/**
 *	获取url里的某个参数值
**/
function getParam(name) {
    //构造一个含有目标参数的正则表达式对象
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
    //匹配目标参数
    var r = window.location.search.substr(1).match(reg);
    //返回参数值
    if (r != null) return unescape(r[2]);
    //不存在时返回null
    return null; 
}
function getUrlParam(param){
    //获取当前URL
    var local_url = document.location.href; 
    //获取要取得的get参数位置
    var get = local_url.indexOf(param +"=");
    if(get == -1){
        return false;   
    }
    //截取字符串
    var get_par = local_url.slice(param.length + get + 1);    
    //判断截取后的字符串是否还有其他get参数
    var nextPar = get_par.indexOf("&");
    if(nextPar != -1){
        get_par = get_par.slice(0, nextPar);
    }
    return get_par;
}



/* *
* 对返回的HTTP响应结果进行过滤。
*
* @public
* @params   {mix}   result   xhr.responseText
* @return  返回过滤后的结果
* @type string
*/
function errorMsg(result,err_message){
	var result = JSON.parse(result);
	err_message = (err_message)?err_message:"error";
	if(result && typeof result.message !== 'undefined') {
		return result.message;
	}else if (result._server_messages) {
		var msg = ($.map(JSON.parse(result._server_messages || '[]'), function(v) {						
			try {
				return JSON.parse(v).message;
			} catch (e) {
				return v;
			}
		}) || []).join(',') || err_message;

		// console.log('msg',msg);
		return msg;
	}else{
		return err_message;
	}
}

//alt(21,1);
/**
 *	获取cookie
**/
function getCookie(name){
	var value = $.cookie('T&R_'+name);
	if(value!=null) {
		value = decodeURI(value, "utf-8");
	}
	return value;
}
/**
 *	设置或删除cookie ， value==null时删除
**/
function setCookie(name,value){
	if(value==null){
		$.cookie('T&R_'+name, '', { expires: -1, path: "/"}); // 删除
		return;
	}
	value = encodeURI(value, "utf-8");
	return $.cookie('T&R_'+name,value, { expires: 7, path: "/"});
}

/**
 *	删除cookie
**/
function delCookie(name,value){
	return $.cookie('T&R_'+name, '', { expires: -1, path: "/"}); // 删除
}

/**
 *	删除cookie
 **/
function ttips(name ,value){
    name.poshytip({
        className: 'tip-darkgray',
        content: value,
        showOn: 'none',
        alignTo: 'target',
        alignX: 'inner-left',
        offsetX: 0,
        offsetY: 5
    });
    name.poshytip('show');
    name.poshytip('hideDelayed', 2000);
}

// 跳转
function redirect(url){
	window.location.href=url;
}

// 判断键值是否在数组中
function in_array(stringToSearch, arrayToSearch) {
     for (s = 0; s < arrayToSearch.length; s++) {
      thisEntry = arrayToSearch[s].toString();
      if (thisEntry == stringToSearch) {
       return true;
      }
     }
     return false;
}

// 函数将查询字符串解析到变量中 	parse_str 反向函数
// function parse_url(){
// 	url = location.search.substr(1);
// 	var querys = url
//     .substring(url.indexOf('?') + 1)
//     .split('&')
//     .map((query) => query.split('='))
//     .reduce((params, pairs) => (params[pairs[0]] = pairs[1] || '', params), {});new `   `
// 	return querys;
// }


// 函数将查询字符串解析到变量中 	parse_url 反向函数
function parse_str(obj) { 
	var ret = []; 
	for(var key in obj){ 
		key = encodeURIComponent(key); 
		var values = obj[key]; 
		if(values && values.constructor == Array){//数组 
			var queryValues = []; 
			for (var i = 0, len = values.length, value; i < len; i++) { 
				value = values[i]; 
				queryValues.push(toQueryPair(key, value)); 
			} 
			ret = ret.concat(queryValues); 
		}else{ //字符串 
			ret.push(toQueryPair(key, values)); 
		} 
	} 
	return ret.join('&'); 
} 
function toQueryPair(key, value) { 
	if (typeof value == 'undefined'){ 
		return key; 
	} 
	return key + '=' + encodeURIComponent(value === null ? '' : String(value)); 
}

Date.prototype.format = function(fmt) { 
     var o = { 
        "M+" : this.getMonth()+1,                 //月份 
        "d+" : this.getDate(),                    //日 
        "h+" : this.getHours(),                   //小时 
        "m+" : this.getMinutes(),                 //分 
        "s+" : this.getSeconds(),                 //秒 
        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
        "S"  : this.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
     for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
     }
    return fmt; 
}

Array.prototype.remove=function(dx)
{
	if(isNaN(dx)||dx>this.length){return false;}
	for(var i=0,n=0;i<this.length;i++)
	{
		if(this[i]!=this[dx])
		{
			this[n++]=this[i]
		}
	}
	this.length-=1
}


function left(len,content) {
    if (!content) return false;
    if (content.length > len) {
        content = content.substring(0, len) + '...';
    }
    return content;
}


/**
 *	网关执行动作
 */
function gate_exec_action(action, act_post, task_desc, inst, action_str ,val){
    var actstr={
        "app_start": "app_start",
        "app_stop": "app_stop",
        "app_option": "app_option",
        "sys_upgrade": "sys_upgrade",
        "upload_appslist": "app_list",
        "app_install": "app_install",
        "app_uninstall": "app_uninstall",
        "app_upgrade": "app_upgrade",
        "sys_enable_comm": "sys_enable_comm",
        "sys_enable_log": "sys_enable_log",
        "sys_enable_data": "sys_enable_data",
        "sys_enable_stat": "sys_enable_stat",
        "send_command": "send_command",
        "send_output": "send_output"
    };
    // console.log(action, act_post);
    $.ajax({
        url: '/apis/api/method/iot.device_api.' + action,
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'post',
        async: false,
        data: JSON.stringify(act_post),
        contentType: "application/json; charset=utf-8",
        dataType:'json',
        success:function(req){
            // console.log("1", req);
            // console.log("2", act_post.id);
            var times = 20;
            if(action=="sys_upgrade"){
                times = 40;
            }
            if(req.message){
                console.log("success", req);
                var idarr = {'id':req.message, 'times':times, 'title':task_desc, 'inst':inst, "action":action_str, "value":val};
                addCrontab(idarr);
                $.notify({
                    title: "<strong>提交任务成功:</strong><br><br> ",
                    message: task_desc
                },{
                    type: 'success'
                });
            }else{
                console.log("fail", req);
                $.notify({
                    title: "<strong>提交任务失败:</strong><br><br> ",
                    message: task_desc
                },{
                    type: 'warning'
                });
            }
            // setTimeout(function(){get_action_result(act_post.id);},3000);
            // var retid = setInterval(function(){get_action_result(act_post.id);},3000);
        },
        error:function(req){
            console.log(req);
            // console.log(JSON.parse(JSON.parse(req.responseJSON._server_messages)[0]).message);
            // $.notify({
            //     title: "<strong>服务器错误提示:</strong><br><br> ",
            //     message: decodeUTF8(JSON.parse(JSON.parse(req.responseJSON._server_messages)[0]).message)
            // },{
            //     type: 'warning'
            // });
        }
    });

}

/**
 *	网关上传日志或报文
 */
function gate_upload_mes(action, act_post){
    var actstr={
        "sys_enable_comm": "sys_enable_comm",
        "sys_enable_log": "sys_enable_log"
    };
    // console.log(action, act_post);
    $.ajax({
        url: '/apis/api/method/iot.device_api.' + action,
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'post',
        async: false,
        data: JSON.stringify(act_post),
        contentType: "application/json; charset=utf-8",
        dataType:'json',
        success:function(req){
            // console.log("1", req);
        },
        error:function(req){
            // console.log(req);
        }
    });
}


/**
 *	网关上传应用列表
 */
function gate_upload_applist(sn){
    $.ajax({
        url: '/apis/api/method/iot.device_api.app_list',
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'post',
        data: JSON.stringify({"device":sn}),
        contentType: "application/json; charset=utf-8",
        dataType:'json',
        error:function(req){
            console.log(req);
        }
    });
}

/**
 *	获取或申请当前用户AccessKey
 */
function apply_AccessKey(){
    $.ajax({
        url: '/apis/api/method/iot_ui.iot_api.apply_AccessKey',
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'get',
        contentType: "application/json; charset=utf-8",
        dataType:'json',
        success:function(req){
            if(req.message){
                $("span.user-name").data("accesskey",req.message);
                $("span.user_AccessKey").text(req.message);
            }
            // console.log(req);
        },
        error:function(req){
            console.log(req);
        }
    });
}

/**
 *	更新当前用户AccessKey
 */
function renew_AccessKey(){
    $.ajax({
        url: '/apis/api/method/iot_ui.iot_api.renew_AccessKey',
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'get',
        contentType: "application/json; charset=utf-8",
        dataType:'json',
        success:function(req){
            if(req.message){
                $("span.user-name").data("accesskey",req.message);
                $("span.user_AccessKey").text(req.message);
            }
            // console.log(req);
        },
        error:function(req){
            console.log(req);
        }
    });
}

/**
 *	删除当前用户AccessKey
 */
function delete_AccessKey(){
    $.ajax({
        url: '/apis/api/method/iot_ui.iot_api.delete_AccessKey',
        headers: {
            Accept: "application/json; charset=utf-8",
            "X-Frappe-CSRF-Token": auth_token
        },
        type: 'get',
        contentType: "application/json; charset=utf-8",
        dataType:'json',
        success:function(req){
            if(req.message){
                $("span.user-name").data("accesskey","");
                // $("span.user_AccessKey").text("");
            }
            // console.log(req);
        },
        error:function(req){
            console.log(req);
        }
    });
}



/**
 *	删除当前用户AccessKey
 */
function record_gate_op(sn){
    var op_list = new Array();
    var user = getCookie('usr');

    var tmpstr = localStorage.getItem("gate_op/"+ user);
    if(tmpstr!==null){
        var arr = JSON.parse(tmpstr);
        if(arr.length>0){
            op_list = arr
        }
    }
    var sn_index = $.inArray(sn, op_list);
    console.log(sn_index);
    if(sn_index!=-1){
        console.log("delete self");
        op_list.splice(sn_index,1)
    }
    op_list.unshift(sn);
    if(op_list.length>10){
        console.log("delete last");
        op_list.pop();
    }
    localStorage.setItem("gate_op/"+ user, JSON.stringify(op_list));

}

/**
 *	提示对话框
 */

function errorAlert(text){
    $('.danger').show();

    $('.danger>a').text(text);
    setTimeout(function () {
        $('.danger').hide();
    },4000)
}