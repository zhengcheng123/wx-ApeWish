(function(doc, win) {
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function() {
			var clientWidth = docEl.clientWidth;
			if(!clientWidth) return;
			docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
		};
	if(!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

//手机号验证规则
var phoneRule = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
//密码验证正则
var passwordRule = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
//正整数判断正则
var intRule = /^\+?[1-9][0-9]*$/

// 获取url参数
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); // 匹配目标参数
	if(r != null) return unescape(r[2]);
	return null; // 返回参数值
}

//文字提示
function pointOut(message) {
	if($('span.pointOut').length) {
		return null
	} else {
		$('body').append('<span class="pointOut">ERROR!</span>')
	}

	$('span.pointOut').html(message);

	$('span.pointOut').stop().animate({
		opacity: 1
	}, 500, function() {
		setTimeout(function() {
			$('span.pointOut').stop().animate({
				opacity: 0
			}, 100)
			$('body span.pointOut').remove()
		}, 2000)
	})
}

//confirm提示
function confirmOut(message, callback) {
	if($('div.confirmOut').length) {
		return null
	} else {
		var html = '<div class="confirmOut">' +
			'<div class="content">' +
			'<h3>' + message + '</h3>' +
			'<ul>' +
			'<li id="confirm_cancel">取消</li>' +
			'<li id="confirm_sure">确定</li>' +
			'</ul>' +
			'</div>' +
			'</div>'
		$('body').append(html)
	}

	$('div.confirmOut').fadeIn()

	$('#confirm_cancel').on('click', function() {
		$('div.confirmOut').fadeOut()
		$('body div.confirmOut').remove()
	})

	$('#confirm_sure').on('click', function() {
		$('div.confirmOut').fadeOut()
		$('body div.confirmOut').remove()
		callback()
	})
}

setTimeout(function() {
	$('body').css('visibility', 'inherit')
}, 1)

//$('header i').on('click', function() {
//	history.go(-1)
//})