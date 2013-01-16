// Copyright (c) 2012 zhymax. All rights reserved.


var divMenuId = "cs_search_menu_id";	// 主菜单id
var divCatDefId = "cs_cat_default_id";	// 默认菜单分组id
var ctrlKey = false; // 是否按下ctrl键
var menuOffset = 20; // 菜单显示位置偏移量
var aMargin = 5; // 菜单项间隔


// 创建和显示菜单
function createDivMenu(opts, x, y)
{
	console.log("Create div menu.");

	// 解析json格式的配置数据
	var J = opts;
	if (J == null)
	{
		console.log("Failed to create context menu item.");
		return;
	}

	// 使用ctrl键的情况下，检查ctrl是否按下
	if (J.TRIGGERKEY && !ctrlKey)
	{
		return;
	}

	// 获取当前选择的文本，如果没有则不显示菜单
	var text = document.getSelection().toString();
	if (text == "")
	{
		return;
	}

	chrome.extension.sendRequest({cmd: 'encode_text', text: text}, function(encText) {
		//console.log(encText);

		// 创建菜单div
		divMenu = document.createElement("div");
		divMenu.id = divMenuId;
		divMenu.align = "left";
		//divMenu.innerHTML = "默认: ";
		with (divMenu.style)
		{
			disabled = false;
			position = "absolute";
			left = x + "px";
			top = (y + menuOffset) + "px";
			zIndex = 0xffffffff;
			backgroundColor = "#f9f9bb";
			borderStyle = "solid";
			borderWidth = "1px";
			borderColor = "#d5bc6e";
			padding = "4px";
		}
		document.body.appendChild(divMenu);

		// 创建默认分组
		var divCatDef = document.createElement("div");
		divCatDef.id = divCatDefId;
		divMenu.appendChild(divCatDef);

		// 根据配置新建子菜单项
		for (var i = 0; i < J.SEARCHENGINES.length; i++)
		{
			var catalog = J.SEARCHENGINES[i].CATALOG;
			var divCat = null;

			// 菜单是否启用
			if (!J.SEARCHENGINES[i].ENABLE)
			{
				continue;
			}

			// 选择分组菜单
			if (catalog != "")
			{
				if (catalog == "-")
				{
					// 分隔符不添加
					continue;
				}

				divCat =  document.getElementById(catalog);
				if (divCat == null)
				{
					// 新建一个分组菜单项
					divCat = document.createElement("div");
					divCat.id = catalog;
					//divCat.align = "left";
					divCat.innerHTML = "[" + catalog + "] ";
					divMenu.appendChild(divCat);
				}
			}
			else
			{
				divCat = divCatDef;  // 如果没有分组，使用默认分组
			}

			// 新建实际操作菜单项
			var a  = document.createElement("a");
			a.href = J.SEARCHENGINES[i].ENCODE ?
				J.SEARCHENGINES[i].URL.replace("%s", encText) :
				J.SEARCHENGINES[i].URL.replace("%s", encodeURIComponent(text));
			a.innerHTML = J.SEARCHENGINES[i].ID;
			a.target = "_blank";
			with(a.style)
			{
				margin = aMargin + "px";
				textDecoration = "none";
			}

			// 点击菜单项后关闭菜单
			a.addEventListener("click", function(){
				//document.body.removeChild(div);
			}, true);

			divCat.appendChild(a);
		}
	});
}

// 检查ctrl是否按下
document.addEventListener("keydown", function() {
	ctrlKey = event.ctrlKey;

	// 有键盘任意键按下时关闭菜单
	//var divMenu = document.getElementById(divMenuId);
	//if (divMenu)
	//{
	//	document.body.removeChild(divMenu);
	//}
}, true);

document.addEventListener("keyup", function() {
	ctrlKey = event.ctrlKey;
}, true);

document.addEventListener("mouseup", function() {
	// 只处理鼠标左键
	if (event.button != 0)
	{
		return;
	}

    // 鼠标点击坐标位置
	var x = event.pageX;
	var y = event.pageY;

	// 在菜单已经显示的情况下，如果鼠标点击了菜单之外位置，则删除菜单，
	// 否则不做处理，继续等待超链接的点击事件。
	var divMenu = document.getElementById(divMenuId);
	if (divMenu)
	{
		//console.log("x:" + x + " y:" + y +
		//	" offsetLeft:" + divMenu.offsetLeft + " offsetWidth:" + divMenu.offsetWidth +
		//	" offsetTop:" + divMenu.offsetTop + " offsetHeight" + divMenu.offsetHeight);

		if (x >= divMenu.offsetLeft && x <= (divMenu.offsetLeft + divMenu.offsetWidth)
			&& y >= divMenu.offsetTop && y <= (divMenu.offsetTop + divMenu.offsetHeight))
		{
			// 如果鼠标在菜单中点击，则等待click事件处理
			return;
		}
		else
		{
			// 删除当前菜单
			document.body.removeChild(divMenu);
		}
	}

	// 读取配置，创建菜单
	chrome.extension.sendRequest({cmd: 'get_options'}, function(opts) {
		createDivMenu(opts, x, y);
	});

}, false);