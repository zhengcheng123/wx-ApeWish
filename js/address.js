// 获取账户的地址
function getAddress() {
	$('header i').on('click', function() {
		window.location.href = 'account.html'
	})
	$('section ul').empty()
	$.ajax({
		type: "get",
		url: "https://www.xingyuanji.com/wxp/address/getAddress",
		xhrFields: {
			withCredentials: true
		}
	}).done(function(res) {
		if(res.result === 0) {
			if(!res.list.length) {
				$('section').addClass('no-address')
			} else {
				$('section').removeClass('no-address')
			}
			
			var addressLi = ''
			res.list.forEach(function(ele, index) {
				ele.city = ele.city ? ele.city.split(' > ').join('') : ''
				addressLi += '<li>' +
					'<p class="username">' +
					'<span>收货人：</span>' +
					'<span>' + ele.name + '</span>' +
					'</p>' +
					'<p class="address-detail">' +
					'<span>收货地址：</span>' +
					'<span>' + ele.city + ele.address + '</span>' +
					'</p>' +
					'<div class="operate-box">' +
					'<div>' +
					'<i class="set-default' + (ele.def ? ' active' : '') + '" address-id="' + ele.id + '"></i>' +
					'<span>设为默认地址</span>' +
					'</div>' +
					'<div class="operate">' +
					'<span class="edit-address" address-id="' + ele.id + '">' +
					'<i></i>' +
					'编辑' +
					'</span>' +
					'<span class="delete-address" address-id="' + ele.id + '">' +
					'<i></i>' +
					'删除' +
					'</span>' +
					'</div>' +
					'</div>' +
					'</li>'
			})
			$('section ul').append(addressLi)
		} else {
			pointOut('获取收货地址失败')
		}
	}).fail(function(err) {
		pointOut('服务器异常')
	})
}

// 设置默认地址
function setDefault(id) {
	$('header i').on('click', function() {
		window.location.href = 'account.html'
	})

	$.ajax({
		type: "post",
		url: "https://www.xingyuanji.com/wxp/address/setDefAddress",
		xhrFields: {
			withCredentials: true
		},
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({
			addressId: id
		}),
		dataType: "json"
	}).done(function(res) {
		if(res.result === 0) {
			getAddress()
			pointOut('操作成功')
		} else {
			pointOut('操作失败')
		}
	}).fail(function(err) {
		pointOut('服务器异常')
	})
}

// 删除地址
function deleteAddress(id) {
	$.ajax({
		type: "post",
		url: "https://www.xingyuanji.com/wxp/address/deletesAddressById",
		xhrFields: {
			withCredentials: true
		},
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({
			addressId: id
		}),
		dataType: "json"
	}).done(function(res) {
		if(res.result === 0) {
			getAddress()
			pointOut('操作成功')
		} else {
			pointOut('操作失败')
		}
	}).fail(function(err) {
		pointOut('服务器异常')
	})
}

$(function() {
	getAddress()
	var timer = null
	$(document).on('click', '.set-default', function() {
		if(timer) {
			clearTimeout(timer)
		}
		if($(this).hasClass('active')) {
			console.log('这是一个已被默认的地址')
		} else {
			var that = this
			timer = setTimeout(function() {
				var id = parseInt($(that).attr('address-id'))
				setDefault(id)
			}, 300)
		}
	})

	$(document).on('click', '.edit-address', function() {
		var id = parseInt($(this).attr('address-id'))
		window.location.href = 'add_address.html?addressId=' + id
	})

	$(document).on('click', '.delete-address', function() {
		var id = parseInt($(this).attr('address-id'))
		confirmOut('确定删除该地址吗？', function() {
			deleteAddress(id)
		})
	})

	$('footer button').on('click', function() {
		console.log($('section ul').children())
		if($('section ul').children().length > 5) {
			pointOut('最多添加五个地址')
		} else {
			window.location.href = 'add_address.html'
		}
	})
})