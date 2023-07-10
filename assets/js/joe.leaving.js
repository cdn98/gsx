document.addEventListener('DOMContentLoaded', () => {
	const encryption = str => window.btoa(unescape(encodeURIComponent(str)));
	const decrypt = str => decodeURIComponent(escape(window.atob(str)));

	/* 當前頁的CID */
	const cid = $('.joe_detail').attr('data-cid');

	/* 獲取本篇文章百度收錄情況 */
	{
		$.ajax({
			url: Joe.BASE_API,
			type: 'POST',
			dataType: 'json',
			data: { routeType: 'baidu_record', site: window.location.href },
			success(res) {
				if (res.data && res.data === '已收錄') {
					$('#Joe_Baidu_Record').css('color', '#67C23A');
					$('#Joe_Baidu_Record').html('已收錄');
				} else {
					/* 如果填寫了Token，則自動推送給百度 */
					if (Joe.BAIDU_PUSH) {
						$('#Joe_Baidu_Record').html('<span style="color: #E6A23C">未收錄，推送中...</span>');
						const _timer = setTimeout(function () {
							$.ajax({
								url: Joe.BASE_API,
								type: 'POST',
								dataType: 'json',
								data: {
									routeType: 'baidu_push',
									domain: window.location.protocol + '//' + window.location.hostname,
									url: encodeURI(window.location.href)
								},
								success(res) {
									if (res.data.error) {
										$('#Joe_Baidu_Record').html('<span style="color: #F56C6C">推送失敗，請檢查！</span>');
									} else {
										$('#Joe_Baidu_Record').html('<span style="color: #67C23A">推送成功！</span>');
									}
								}
							});
							clearTimeout(_timer);
						}, 1000);
					} else {
						const url = `https://ziyuan.baidu.com/linksubmit/url?sitename=${encodeURI(window.location.href)}`;
						$('#Joe_Baidu_Record').html(`<a target="_blank" href="${url}" rel="noopener noreferrer nofollow" style="color: #F56C6C">未收錄，提交收錄</a>`);
					}
				}
			}
		});
	}

	/* 激活瀏覽功能 */
	{
		let viewsArr = localStorage.getItem(encryption('views')) ? JSON.parse(decrypt(localStorage.getItem(encryption('views')))) : [];
		const flag = viewsArr.includes(cid);
		if (!flag) {
			$.ajax({
				url: Joe.BASE_API,
				type: 'POST',
				dataType: 'json',
				data: { routeType: 'handle_views', cid },
				success(res) {
					if (res.code !== 1) return;
					$('#Joe_Article_Views').html(`${res.data.views} 閱讀`);
					viewsArr.push(cid);
					const name = encryption('views');
					const val = encryption(JSON.stringify(viewsArr));
					localStorage.setItem(name, val);
				}
			});
		}
	}

	/* 激活隨機樣式 */
	{
		let _index = 100;
		const colors = ['#F8D800', '#0396FF', '#EA5455', '#7367F0', '#32CCBC', '#F6416C', '#28C76F', '#9F44D3', '#F55555', '#736EFE', '#E96D71', '#DE4313', '#D939CD', '#4C83FF', '#F072B6', '#C346C2', '#5961F9', '#FD6585', '#465EFB', '#FFC600', '#FA742B', '#5151E5', '#BB4E75', '#FF52E5', '#49C628', '#00EAFF', '#F067B4', '#F067B4', '#ff9a9e', '#00f2fe', '#4facfe', '#f093fb', '#6fa3ef', '#bc99c4', '#46c47c', '#f9bb3c', '#e8583d', '#f68e5f'];
		const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
		const maxWidth = $('.joe_detail__leaving-list').width();
		const maxHeight = $('.joe_detail__leaving-list').height();
		const radius1 = ['20px 300px', '20px 400px', '20px 500px', '30px 300px', '30px 400px', '30px 500px', '40px 300px', '40px 400px', '40px 500px'];
		const radius2 = ['300px 20px', '400px 20px', '500px 20px', '300px 30px', '400px 30px', '500px 30px', '300px 40px', '400px 40px', '500px 40px'];
		$('.joe_detail__leaving-list .item').each((index, item) => {
			const zIndex = random(1, 99);
			const background = colors[random(0, colors.length - 1)];
			const width = Math.ceil($(item).width());
			const height = Math.ceil($(item).height());
			const top = random(0, maxHeight - height);
			const left = random(0, maxWidth - width);
			$(item).css({
				display: 'block',
				zIndex,
				background,
				top,
				left,
				borderTopLeftRadius: radius2[random(0, radius2.length - 1)],
				borderTopRightRadius: radius1[random(0, radius1.length - 1)],
				borderBottomLeftRadius: radius1[random(0, radius1.length - 1)],
				borderBottomRightRadius: radius1[random(0, radius1.length - 1)]
			});
			$(item).draggabilly({ containment: true });
			$(item).on('dragStart', e => {
				_index++;
				$(item).css({ zIndex: _index });
			});
		});
	}
});

/* 寫在load事件裏，為了解決圖片未加載完成，滾動距離獲取會不準確的問題 */
window.addEventListener('load', function () {
	/* 判斷地址欄是否有錨點鏈接，有則跳轉到對應位置 */
	{
		const scroll = new URLSearchParams(location.search).get('scroll');
		if (scroll) {
			const height = $('.joe_header').height();
			let elementEL = null;
			if ($('#' + scroll).length > 0) {
				elementEL = $('#' + scroll);
			} else {
				elementEL = $('.' + scroll);
			}
			if (elementEL && elementEL.length > 0) {
				const top = elementEL.offset().top - height - 15;
				window.scrollTo({ top, behavior: 'smooth' });
			}
		}
	}
});
