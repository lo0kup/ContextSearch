///////////////////////////////////////////////////////////////////////////
//                                                                       //
//   Context Search                                                      //
//   Copyright (c) 2013 zhymax (zhymax at gmail d0t com)                 //
//   Licensed under the GPL licenses.                                    //
//                                                                       //
///////////////////////////////////////////////////////////////////////////

//  实现划词搜索功能
//  在打开页面中加载context.js脚本，监听鼠标up事件，显示动态创建的搜索菜单
//

var searchMenuId = "cs_search_menu_id";	// 主菜单id
var defCatMenuId = "cs_def_cat_id";	// 默认菜单分组id
var ctrlKey = false; // 是否按下ctrl键
var menuOffset = 20; // 菜单显示位置偏移量
var aMargin = 5; // 菜单项间隔

// 创建和显示菜单
function createSearchMenu(opts, x, y)
{
	//console.log("Create search menu.");

	// 解析json格式的配置数据
	var J = opts;
	if (J == null)
	{
		console.log("Failed to create context menu item.");
		return;
	}

	// 没有菜单项存在，直接返回
	if (J.SEARCHENGINES.length == 0)
	{
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
		var searchMenu = document.createElement("div");
		searchMenu.id = searchMenuId;
		searchMenu.align = "left";
		with (searchMenu.style)
		{
			position = "absolute";
			left = x + "px";
			top = (y + menuOffset) + "px";
			zIndex = 0xffffffff;
			backgroundColor = "#F6F6F6";
			border = "1px solid #666";
			padding = "4px";
			llineHeight = "normal";
		}
		document.body.appendChild(searchMenu);

		// 创建默认分组
		var defCatMenu = document.createElement("div");
		defCatMenu.id = defCatMenuId;
		searchMenu.align = "left";
		defCatMenu.style.borderBottom="4px solid #F6F6F6";
		searchMenu.appendChild(defCatMenu);

		// 根据配置新建子菜单项
		for (var i = 0; i < J.SEARCHENGINES.length; i++)
		{
			var catalog = J.SEARCHENGINES[i].CATALOG;
			var catMenu = null;

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

				// 如果分组菜单不存在，则新建一个
				catMenu =  document.getElementById(catalog);
				if (catMenu == null)
				{					
					catMenu = document.createElement("div");
					catMenu.id = catalog;
					catMenu.innerHTML = "[<font size='2'>" + catalog + "</font>] ";
					searchMenu.appendChild(catMenu);
				}
			}
			else
			{
				// 如果没有分组，添加到默认分组
				catMenu = defCatMenu; 
			}

			// 新建实际操作菜单项
			var menuItem  = document.createElement("a");
			menuItem.href = J.SEARCHENGINES[i].ENCODE ?
				J.SEARCHENGINES[i].URL.replace("%s", encText) :
				J.SEARCHENGINES[i].URL.replace("%s", encodeURIComponent(text));
			menuItem.innerHTML = J.SEARCHENGINES[i].ID;
			menuItem.target = "_blank";
			with(menuItem.style)
			{
				margin = aMargin + "px";
				textDecoration = "none";
				color = "#005C94";
				fontSize = "10pt";
			}

			// 点击菜单项后关闭菜单
			menuItem.addEventListener("click", function(){
				//document.body.removeChild(div);
			}, true);

			catMenu.appendChild(menuItem);
		}
	});
}

// 检查ctrl是否按下
document.addEventListener("keydown", function() {
	ctrlKey = event.ctrlKey;

	if (!ctrlKey)
	{
		// 有键盘其他键按下时关闭菜单
		var searchMenu = document.getElementById(searchMenuId);
		if (searchMenu)
		{
			document.body.removeChild(searchMenu);
		}
	}
}, true);

document.addEventListener("keyup", function() {
	ctrlKey = event.ctrlKey;
}, true);

document.addEventListener("mouseup", function() {
	var searchMenu = document.getElementById(searchMenuId);

	// 只处理鼠标左键，其他键按下时如果有菜单，则删除菜单
	if (event.button != 0)
	{
		if(searchMenu)
		{
			document.body.removeChild(searchMenu);
		}
		return;
	}

    // 鼠标点击坐标位置
	var x = event.pageX;
	var y = event.pageY;

	// 菜单已经显示，此时如果鼠标点击了菜单之外位置，则删除菜单，
	// 否则不做处理，继续等待超链接的点击事件。	
	if (searchMenu)
	{
		if (x >= searchMenu.offsetLeft && x <= (searchMenu.offsetLeft + searchMenu.offsetWidth)
			&& y >= searchMenu.offsetTop && y <= (searchMenu.offsetTop + searchMenu.offsetHeight))
		{
			// 如果鼠标在菜单中点击，则等待click事件处理
			return;
		}
		else
		{
			document.body.removeChild(searchMenu);
		}
	}

	// 读取配置，创建菜单
	chrome.extension.sendRequest({cmd: 'get_options'}, function(opts) {
		createSearchMenu(opts, x, y);
	});

}, false);
