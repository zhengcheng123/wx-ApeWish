$(function() {
	var u = 1.48; //盒子加分隔栏的高度
	var prizeNum = 21 //奖品数量
	var index = sessionStorage.getItem('lotteryDrawIndex') ? parseInt(sessionStorage.getItem('lotteryDrawIndex')) : 0
	var failRandomNum = new Array()

	// 扫码登录
	$.ajax({
		type: "get",
		url: "https://www.xingyuanji.com/wxp/tlogin",
		xhrFields: {
			withCredentials: true
		}
	}).done(function(res) {
		if(res.result === 0) {

		}
	}).fail(function(err) {
		pointOut('服务器异常')
		throw Error(err)
	})

	// 引入规则内容
	$(".activity-rules").load("rule.html")

	// 阅读完规则进入游戏
	$('.entry').on('click', function() {
		if($('.btn input[type=checkbox]').is(':checked')) {
			$('.read').hide()
			$('.com-main').show()
		} else {
			pointOut('请认真阅读条例')
		}
	})

	function getFailNum() {
		var random1 = parseInt(Math.random() * prizeNum)
		var random2 = parseInt(Math.random() * prizeNum)
		var random3 = parseInt(Math.random() * prizeNum)
		if(random1 === random2 && random2 === random3) {
			getFailNum()
		} else {
			failRandomNum = [random1, random2, random3]
		}
	}
	getFailNum()
	setTimeout(function() {
		console.log(failRandomNum)
	}, 2000)

	var isClick = true
	$('.com-main .play-btn').click(function() {
		var randomResult = new Array() //最终展示的结果
		var shwoResult = 0 // 0 再来一次， -1没有了, 1中了
		if(index === 0) {
			shwoResult = 0
			randomResult = failRandomNum
			var _this = $(this)
			if(!_this.hasClass('active')) {
				_this.addClass('active')
				setTimeout(function() {
					_this.removeClass('active')
				}, 200)
				$(".com-main dl dd").slots(u, randomResult, function() {
					if(shwoResult === 0) {
						$('.try-again').css('visibility', 'inherit')
					} else if(shwoResult === -1) {
						$('.fail').css('visibility', 'inherit')
					} else {
						$('.success').css('visibility', 'inherit')
					}
					index++
					sessionStorage.setItem('lotteryDrawIndex', index)
				})
			}
		} else if(index === 1) {
			if(isClick) {
				isClick = false
				$.ajax({
					type: "get",
					url: "https://www.xingyuanji.com/wxp/prize/get",
					xhrFields: {
						withCredentials: true
					}
				}).done(function(res) {
					if(res.result === 0) {
						if(res.data) {
							shwoResult = 1
							randomResult = [parseInt(res.data), parseInt(res.data), parseInt(res.data)]
						} else {
							shwoResult = -1
							getFailNum()
							randomResult = failRandomNum
						}
						var _this = $(this)
						if(!_this.hasClass('active')) {
							_this.addClass('active')
							setTimeout(function() {
								_this.removeClass('active')
							}, 200)
							$(".com-main dl dd").slots(u, randomResult, function() {
								if(shwoResult === 0) {
									$('.try-again').css('visibility', 'inherit')
								} else if(shwoResult === -1) {
									$('.fail').css('visibility', 'inherit')
								} else {
									$('.success').css('visibility', 'inherit')
								}
								index++
								sessionStorage.setItem('lotteryDrawIndex', index)
								isClick = true
							})
						}
					} else {
						pointOut(res.msg)
					}
				}).fail(function(err) {
					pointOut('服务器异常')
					throw Error(err)
				})
			}
		} else {
			shwoResult = -1
			$('.fail').css('visibility', 'inherit')
			pointOut('您的抽奖机会用完了哦！')
		}
	})

	$('.try-again button').on('click', function() {
		$('.try-again').css('visibility', 'hidden')
	})
});