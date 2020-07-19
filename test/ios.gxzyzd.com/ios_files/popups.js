function PopTxt(obj)
{
	var bg_mask = document.createElement('div');
	var popups = document.createElement('div');
	var popups_txt = document.createElement('div');
	var popups_btn = document.createElement('div');
		bg_mask.className = 'bg_mask';
		bg_mask.id = 'bg_mask';
		popups.className = 'popups';
		popups_txt.className = 'popups_txt';
		popups_btn.className = 'popups_btn';

	if(obj.tit !== undefined && obj.tit !=='')
	{
		var H3 = document.createElement('h3');
			H3.innerHTML = obj.tit;
			popups_txt.appendChild(H3);
	}

	if(obj.content !== undefined && obj.content !=='')
	{
		var P = document.createElement('p');
			P.className = 'popups_txt_left';
			P.innerHTML = obj.content;
			popups_txt.appendChild(P);
	}

	if(obj.btnD !== undefined && obj.btnD !=='')
	{
		var A = document.createElement('a');
			A.className = 'popups_btn_banner popups_btn_disab';
			A.href = obj.btnD['href'];
			A.innerHTML = obj.btnD['txt'];
			popups_btn.appendChild(A);
	}

	if(obj.btnL !== undefined && obj.btnL !=='')
	{
		var A = document.createElement('a');
			A.className = 'popups_btn_left';
			A.innerHTML = obj.btnL;
			A.setAttribute('onclick','close_bg_mask()');
			popups_btn.appendChild(A);
	}

	if(obj.btnR !== undefined && obj.btnR !=='')
	{
		var A = document.createElement('a');
			A.className = 'popups_btn_focus';
			A.innerHTML = obj.btnR['txt'];

			if(obj.btnR['callback'] == undefined || obj.btnR['callback'] == "" ||obj.btnR['callback'] == null)
			{
				console.log("无回调函数");
			}
			else
			{
				A.setAttribute(obj.btnR['event'],obj.btnR['callback']);
			}

			if(obj.btnR['url'] == undefined || obj.btnR['url'] == "" ||obj.btnR['url'] == null)
			{
				console.log("无href");
			}
			else
			{
				A.href = obj.btnR['url'];
			}
			popups_btn.appendChild(A);
	}

	popups.appendChild(popups_txt);
	popups.appendChild(popups_btn);
	bg_mask.appendChild(popups);
	document.body.appendChild(bg_mask);

	/*关闭弹窗*/
    close_bg_mask = function()
    {
		var o = document.getElementById('bg_mask');
			o.remove();
	}

	function jt(event)
	{
		event.preventDefault();
	}
	/*监听弹窗 添加屏幕禁止滑动滑动事件*/
	bg_mask.addEventListener('touchmove',jt);
}



/*使用方法

	new PopTxt({
		tit:'你好吗',
		content:'兑换商品前请绑定手机号，以便我们更好地为你服务。兑换商品前请绑定手机号，以便我们更好地为你服务。',
		btnD:{
			txt:'哈哈',
			href:"https://ios.gxzyzd.com/ios_files/index.html"
		},
		btnL:'取消',
		btnR:{
			event:'onclick',
			txt:"确定",
			callback:'suer()'//回调函数名
		}
	}) 

*/