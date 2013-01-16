// Copyright (c) 2012 zhymax. All rights reserved.



// 使用浏览器间同步的方式保存配置
var Storage = chrome.storage.sync;

// 默认配置数据
var defOpts = {"VER":"1","NAME":"用其他引擎搜索 \"%s\"","TRIGGERKEY":true,"SEARCHENGINES":[
	{"CATALOG":"","ID":"Google","URL":"http://www.google.com.hk/search?q=%s","ENCODE":false,"ENABLE":true},
	{"CATALOG":"网页","ID":"必应","URL":"http://www.bing.com/search?q=%s","ENCODE":false,"ENABLE":true},
	{"CATALOG":"网页","ID":"雅虎","URL":"http://one.cn.yahoo.com/s?p=%s","ENCODE":false,"ENABLE":false},
	{"CATALOG":"网页","ID":"百度","URL":"http://www.baidu.com/s?wd=%s","ENCODE":false,"ENABLE":true},
	{"CATALOG":"网页","ID":"搜搜","URL":"http://www.soso.com/q?sc=web&ch=w.ptl&w=%s","ENCODE":false,"ENABLE":false},
	{"CATALOG":"网页","ID":"有道","URL":"http://www.youdao.com/search?q=%s","ENCODE":false,"ENABLE":false},
	{"CATALOG":"网页","ID":"搜狗","URL":"http://www.sogou.com/web?query=%s","ENCODE":false,"ENABLE":false},
	{"CATALOG":"网页","ID":"豆瓣","URL":"http://www.douban.com/search?q=%s","ENCODE":false,"ENABLE":true},
	{"CATALOG":"-","ID":"","URL":"","ENCODE":false,"ENABLE":true},
	{"CATALOG":"","ID":"淘宝网","URL":"http://s.taobao.com/search?q=%s","ENCODE":false,"ENABLE":true},
	{"CATALOG":"","ID":"一淘","URL":"http://s.etao.com/search?ie=utf-8&style=grid&q=%s","ENCODE":false,"ENABLE":true},
	{"CATALOG":"购物","ID":"京东商城","URL":"http://search.360buy.com/Search?enc=utf-8&keyword=%s","ENCODE":false,"ENABLE":true},
	{"CATALOG":"购物","ID":"天猫","URL":"http://list.tmall.com/search_product.htm?q=%s","ENCODE":true,"ENABLE":true},
	{"CATALOG":"购物","ID":"一号店","URL":"http://www.yihaodian.com/ctg/s2/c0-0/k%s","ENCODE":false,"ENABLE":true},
	{"CATALOG":"购物","ID":"当当网","URL":"http://searchb.dangdang.com/?key=%s","ENCODE":false,"ENABLE":true},
	{"CATALOG":"购物","ID":"易迅","URL":"http://s.51buy.com/--------.html?YTAG=1.100002000&q=%s","ENCODE":true,"ENABLE":false},
	{"CATALOG":"购物","ID":"我买网","URL":"http://sh.womai.com/ProductList.htm?Keywords=%s","ENCODE":false,"ENABLE":false},
	{"CATALOG":"购物","ID":"红孩子","URL":"http://www.redbaby.com.cn/search?keyword=%s","ENCODE":false,"ENABLE":true},
	{"CATALOG":"购物","ID":"苏宁","URL":"http://search.suning.com/emall/search.do?keyword=%s","ENCODE":false,"ENABLE":false},
	{"CATALOG":"购物","ID":"国美","URL":"http://www.gome.com.cn/ec/homeus/atgsearch/gomeSearchResults.jsp?question=%s","ENCODE":false,"ENABLE":false},
	{"CATALOG":"购物","ID":"亚马逊中国","URL":"http://www.amazon.cn/s?ie=UTF8&index=blended&keywords=%s","ENCODE":false,"ENABLE":false},
	{"CATALOG":"购物","ID":"凡客诚品","URL":"http://s.vancl.com/search.aspx?source=sofeng&k=%s","ENCODE":false,"ENABLE":false},
	{"CATALOG":"购物","ID":"新蛋","URL":"http://www.newegg.com.cn/Search.aspx?keyword=%s","ENCODE":true,"ENABLE":false},
	{"CATALOG":"购物","ID":"拍拍","URL":"http://search1.paipai.com/cgi-bin/comm_search1?KeyWord=%s","ENCODE":true,"ENABLE":false},
	{"CATALOG":"-","ID":"","URL":"","ENCODE":false,"ENABLE":true},
	{"CATALOG":"","ID":"优酷","URL":"http://so.youku.com/search_video/q_%s","ENCODE":false,"ENABLE":true},
	{"CATALOG":"影音","ID":"土豆网","URL":"http://so.tudou.com/isearch/%s","ENCODE":false,"ENABLE":true},
	{"CATALOG":"影音","ID":"迅雷看看","URL":"http://search.kankan.com/search.php?keyword=%s","ENCODE":false,"ENABLE":true},
	{"CATALOG":"影音","ID":"奇艺","URL":"http://www.qiyi.com/common/searchresult.html?key=%s","ENCODE":false,"ENABLE":false},
	{"CATALOG":"影音","ID":"酷6","URL":"http://so.ku6.com/v/q%s","ENCODE":false,"ENABLE":false},
	{"CATALOG":"影音","ID":"人人影视","URL":"http://www.yyets.com/php/search/index?keyword=%s","ENCODE":false,"ENABLE":true},
	{"CATALOG":"影音","ID":"VeryCD","URL":"http://www.verycd.com/search/folders/%s","ENCODE":false,"ENABLE":false},
	{"CATALOG":"影音","ID":"时光网","URL":"http://search.mtime.com/search/?%s","ENCODE":false,"ENABLE":false},
	{"CATALOG":"影音","ID":"射手字幕","URL":"http://www.shooter.cn/search/%s","ENCODE":false,"ENABLE":false},
	{"CATALOG":"影音","ID":"搜狗音乐","URL":"http://mp3.sogou.com/music.so?ie=UTF-8&query=%s","ENCODE":false,"ENABLE":true},
	{"CATALOG":"影音","ID":"谷歌音乐","URL":"http://www.google.cn/music/search?q=%s","ENCODE":false,"ENABLE":false},
	{"CATALOG":"影音","ID":"百度MP3","URL":"http://mp3.baidu.com/m?f=baidump3&word=%s","ENCODE":true,"ENABLE":false},
	{"CATALOG":"影音","ID":"百度图片","URL":"http://image.baidu.com/i?tn=baiduimage&ct=201326592&word=%s","ENCODE":true,"ENABLE":false},
    {"CATALOG":"-","ID":"","URL":"","ENCODE":false,"ENABLE":true},
	{"CATALOG":"","ID":"百度知道","URL":"http://zhidao.baidu.com/q?ct=17&tn=ikaslist&word=%s","ENCODE":false,"ENABLE":true},
	{"CATALOG":"其他","ID":"百度贴吧","URL":"http://tieba.baidu.com/f?kw=%s","ENCODE":false,"ENABLE":true},
    {"CATALOG":"其他","ID":"维基百科","URL":"http://zh.wikipedia.org/zh-cn/%s","ENCODE":false,"ENABLE":false},
	{"CATALOG":"其他","ID":"有道翻译","URL":"http://dict.youdao.com/search?q=%s","ENCODE":false,"ENABLE":true},
	{"CATALOG":"其他","ID":"谷歌翻译","URL":"http://translate.google.cn/?hl=zh-CN&eotf=1&layout=2&sl=en&tl=zh-CN&q=good#auto|zh-CN|%s","ENCODE":false,"ENABLE":false},
	{"CATALOG":"其他","ID":"金山爱词霸","URL":"http://www.iciba.com/%s","ENCODE":false,"ENABLE":false},
	{"CATALOG":"其他","ID":"海词 Dict.cn","URL":"http://www.dict.cn/%s","ENCODE":false,"ENABLE":false}
]};


// JSON格式配置数据
var J = null;



// 保存配置到Storage，超过QUOTA_BYTES_PER_ITEM需要进行分片保存。
function setOptions(opts, cb)
{
	var optionStr = JSON.stringify(opts);
	var length = optionStr.length;
	var sliceLength = Storage.QUOTA_BYTES_PER_ITEM / 2; // 简单设置每个分片最大长度，保证能存储到
	var optionSlices = {}; // 保存分片数据
	var i = 0; // 分片序号

	// 分片保存数据
	while (length > 0)
	{
		optionSlices["cs_options_" + i] = optionStr.substr(i * sliceLength, sliceLength);
		length -= sliceLength;
		i++;
	}

	// 保存分片数量
	optionSlices["cs_options_num"] = i;

	// 写入Storage
	Storage.set(optionSlices, cb);

	//console.log(optionSlices);
}

// 从Storage读取配置
function getOptions(cb)
{
	Storage.get(null, function(items) {
		// 新建菜单
		if (!items.cs_options_num || items.cs_options_num == 0)
		{
			// 保存默认配置
			setOptions(defOpts);

			cb(defOpts);
		}
		else
		{
			var opts = "";
			// 把分片数据组成字符串
			for(var i = 0; i < items.cs_options_num; i++)
			{
				opts += items["cs_options_"+i];
			}

			cb(JSON.parse(opts));

			//console.log(opts);
		}
	});
}


// 创建上下文菜单项和子菜单
function createContextMenu(opts)
{
	console.log("Create context menu");

	J = opts;

    // 新建选择页面内容后显示的菜单项
    var context = "selection";
    var id = chrome.contextMenus.create({
			"title" : J.NAME,
			"id" : "c" + context,
			"contexts" :[context]
		});

    // 根据配置数据新建子菜单项
	for (var i = 0; i < J.SEARCHENGINES.length; i++)
	{
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
		if (catalog != "")
		{
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
function deleteContextMenu()
{
	chrome.contextMenus.removeAll();
};

// 菜单项点击后调用相应的搜索引擎
function onClickMenu(info, tab)
{
	var url = "";
	var search = J.SEARCHENGINES[info.menuItemId];

	if (search.ENCODE)
	{
		url = search.URL.replace("%s", urlEncode(info.selectionText));
	}
	else
	{
		url = search.URL.replace("%s", encodeURIComponent(info.selectionText));
	}

	chrome.tabs.create({"url": url, "index": tab.index+1});
};

// 初始化入口
function init()
{
	// 首先清空原有菜单
	deleteContextMenu();

	// 读取选项配置，加载菜单
	// 完成后设置事件监听函数
	getOptions(createContextMenu, function(){
		 // Storage有改动时，调用此函数重新生成菜单
		chrome.storage.onChanged.addListener(function(changes, namespace) {
			deleteContextMenu();
			getOptions(createContextMenu);
		});
	});

	// 其他页面请求事件处理
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		//console.log("Recieve request: " + request);

		if (request.cmd == 'encode_text')
		{
			sendResponse(urlEncode(request.text));
		}
		else if (request.cmd == 'get_options')
		{
			getOptions(function(opts){
				sendResponse(opts);
			});
		}
		else if (request.cmd == 'set_options')
		{
			setOptions(request.opts, function(){
				sendResponse();
			});
		}
	});
};



// 初始化
init();