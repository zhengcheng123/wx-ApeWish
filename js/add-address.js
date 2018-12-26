$(function() {
	$('header i').on('click', function() {
		window.location.href = 'address.html'
	})
	var form = {
		city: '',
		address: '',
		postCode: '',
		name: '',
		phone: ''
	}

	var addressId = parseInt(getUrlParam('addressId'))
	var isEdit = addressId ? true : false
	if(isEdit) {
		$('header span').html('编辑收货地址')
		$.ajax({
			type: "get",
			url: "https://www.xingyuanji.com/wxp/address/getAddress",
			xhrFields: {
				withCredentials: true
			}
		}).done(function(res) {
			if(res.result === 0) {
				let editForm = res.list.filter(function(obj) {
					return obj.id === addressId
				})
				editForm = editForm.length ? editForm[0] : {
					city: '',
					address: '',
					postCode: '',
					name: '',
					phone: ''
				}

				form.id = addressId
				for(let i in form) {
					form[i] = editForm[i]
				}

				$('#name').val(form.name)
				$('#phoneNum').val(form.phone)
				$('#expressArea').val(form.city)
				$('#detail-address').val(form.address)
				$('#mailNum').val(form.postCode)
			} else {
				pointOut('获取编辑地址失败')
			}
		}).fail(function(err) {
			pointOut('服务器异常')
		})
	}

	var isClick = true
	$('.save').on('click', function() {
		form.city = $('#expressArea').val()
		form.address = $('#detail-address').val()
		form.postCode = $('#mailNum').val()
		form.name = $('#name').val()
		form.phone = $('#phoneNum').val()
		if(!form.address || !form.postCode || !form.name || !form.phone || !$('#detail-address').val()) {
			pointOut('请填写完整信息')
		} else {
			if(!phoneRule.test(form.phone)) {
				pointOut('请填写正确的手机格式')
			} else {
				if(isClick) {
					isClick = false
					if(!isEdit)
						$.ajax({
							type: "post",
							url: "https://www.xingyuanji.com/wxp/address/save",
							xhrFields: {
								withCredentials: true
							},
							contentType: "application/json; charset=utf-8",
							data: JSON.stringify(form),
							dataType: "json"
						}).done(function(res) {
							isClick = true
							if(res.result === 0) {
								window.location.href = 'address.html'
							} else {
								pointOut('保存失败')
							}
						}).fail(function(err) {
							pointOut('服务器异常')
						})
					else
						$.ajax({
							type: "post",
							url: "https://www.xingyuanji.com/wxp/address/updateAddress",
							xhrFields: {
								withCredentials: true
							},
							contentType: "application/json; charset=utf-8",
							data: JSON.stringify(form),
							dataType: "json"
						}).done(function(res) {
							isClick = true
							if(res.result === 0) {
								window.location.href = 'address.html'
							} else {
								pointOut('编辑失败')
							}
						}).fail(function(err) {
							pointOut('服务器异常')
						})
				}
			}
		}
	})

	$('.cancel').on('click', function() {
		window.location.href = 'address.html'
	})
})