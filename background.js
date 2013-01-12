// Copyright (c) 2012 zhymax. All rights reserved.

var J = null; 

// 创建上下文菜单项和子菜单
function createContextMenu(title, data) {
	// 解析json格式的配置数据
	J = JSON.parse(data);
	if (J == null)
	{
		console.log("Failed to create context menu item.");
		return;
	}

    // 新建选择页面内容后显示的菜单项
    var context = "selection";
    var id = chrome.contextMenus.create({
			"title" : title,
			"id" : "c" + context,
			"contexts" :[context]
		});

    // 根据配置数据新建子菜单项
	for (var i = 0; i < J.SEARCHENGINES.length; i++) {
		var catalog = J.SEARCHENGINES[i].CATALOG;
		var catalogId = id;

		// 新建菜单分隔线
		if (catalog == "-")
		{
			chrome.contextMenus.create({
				"id" : "c" + i.toString(),
				"type" : "separator",
				"contexts" : [context],
				"parentId" : id
			});
			continue;
		}
		
		// 判断菜单是否启用
		if (!J.SEARCHENGINES[i].ENABLE)
		{
			continue;
		}

		// 新建一个分类菜单项，不响应click操作
		if (catalog != "") {
			catalogId = chrome.contextMenus.create({
					"title" : catalog,
					"id" : "c" + catalog,
					"contexts" : [context],
					"parentId" : id
				});
		}	
		
		// 新建实际操作菜单项
		chrome.contextMenus.create({
			"title" : J.SEARCHENGINES[i].ID,
			"id" : i.toString(),
			"contexts" :[context],
			"parentId" : catalogId,
			"enabled" : J.SEARCHENGINES[i].ENABLE,
			"onclick" : onClickMenu
		});
	}
};

// 删除本扩展创建的上下文菜单
function deleteContextMenu() {
	chrome.contextMenus.removeAll();
};

// 从选项配置中加载菜单
function updateMenu() {
	var Storage = chrome.storage.sync;
	Storage.get({"cs_name": "用其他引擎搜索 \"%s\"", "cs_options": ""}, function(items) {
		if (items.cs_options) {
			console.log(items.cs_options);
			deleteContextMenu();
			createContextMenu(items.cs_name, items.cs_options);
		}
		else
		{
			console.log("Options is empty.");
		}
	});	
};

function onClickMenu(info, tab) {
	var i = new Number(info.menuItemId);
	chrome.tabs.create({"url": J.SEARCHENGINES[i].URL.replace("%s", info.selectionText), "index": tab.index});
};

// 监听配置更改事件
chrome.storage.onChanged.addListener(function(changes, namespace) {
	updateMenu();
});

// 加载菜单
updateMenu();