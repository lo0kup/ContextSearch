///////////////////////////////////////////////////////////////////////////
//                                                                       //
//   Context Search                                                      //
//   Copyright (c) 2013 zhymax (zhymax at gmail d0t com)                 //
//   Licensed under the GPL licenses.                                    //
//                                                                       //
///////////////////////////////////////////////////////////////////////////


var itemIndex = 0; // 菜单项序号
var checkedColor = "#c9dcec";


// 在表格中中添加一行菜单项数据
// 并处理上移、下移和删除按钮的事件
function addItem(table, item)
{
	var catalog = item.CATALOG ? item.CATALOG : "";
	var name = item.ID ? item.ID : "";
	var url = item.URL ? item.URL : "";
	var checked = item.ENABLE ? " checked " : "";
	var urlEncode = item.ENCODE ? " checked " : "";
	var id = itemIndex++;  // 获取内部item序号，从0开始递增

	// 表格中添加一行
	// 尽量不要改变此处顺序，如有必要请同时修改saveWindowData中的顺序
	var tr = document.createElement("tr");
	var td = document.createElement("td");
	td.innerHTML =
		"<input id='cs_item_enable_"+id+"' type='checkbox'"+checked+"></input>" +
		"<input id='cs_item_catalog_"+id+"' type='text' placeholder='菜单分组名称' value='"+catalog+"' style='width:90px'>" +
		"<input id='cs_item_id_"+id+"' type='text' placeholder='菜单名称' value='"+name+"' >" +
		"<input id='cs_item_url_"+id+"' type='text' placeholder='搜索地址' value='"+url+"' style='width:400px'>" +
		"<input id='cs_item_encode_"+id+"' type='checkbox'"+urlEncode+">编码 </input>" +
		"<button id='cs_item_up"+id+"' type='button' title='上移'>上移</button>" +
		"<button id='cs_item_down"+id+"' type='button' title='下移'>下移</button>" +
		"<button id='cs_item_delete"+id+"' type='button' title='删除'>删除</button>";
	td.style.backgroundColor = item.ENABLE ? checkedColor : "#ffffff";
	tr.appendChild(td);
	table.appendChild(tr);

	// 按钮事件处理

	var btnEnable = document.getElementById("cs_item_enable_"+id);
	btnEnable.addEventListener("click", function(){
		td.style.backgroundColor = btnEnable.checked ? checkedColor : "#ffffff";
	}, true);

	// 上移
	var btnUp = document.getElementById("cs_item_up"+id);
	btnUp.addEventListener("click", function(){
		var prev = tr.previousSibling;
		if (prev != null)
		{
			table.removeChild(tr);
			table.insertBefore(tr, prev);
		}
	}, true);

	// 下移
	var btnDown = document.getElementById("cs_item_down"+id);
	btnDown.addEventListener("click", function(){
		var next = tr.nextSibling;
		if (next != null && next.nextSibling != null)
		{
			table.removeChild(tr);
			table.insertBefore(tr, next.nextSibling);
		}
	}, true);

	// 删除
	var btnDelete = document.getElementById("cs_item_delete"+id);
	btnDelete.addEventListener("click", function(){
		table.removeChild(tr);
	}, true);
}

// 读取配置，更新界面 option.html
function updateWindowData()
{
	var table = document.getElementById("cs_tb_data");

	chrome.extension.sendRequest({cmd: 'get_options'}, function(opts) {
		var J =  opts;

		// 搜索引擎菜单项添加到界面表格中
		for (var i = 0; i < J.SEARCHENGINES.length; i++)
		{
			addItem(table, J.SEARCHENGINES[i]);
		}

		// 把配置数据添加到快速导入文本框中
		document.getElementById("cs_options").value = JSON.stringify(J);

		// 菜单名称，显示在右键菜单中
		document.getElementById("cs_name").value = J.NAME;

		// 是否使用ctrl键
		document.getElementById("cs_ctrl").checked = J.TRIGGERKEY;
	});


	// 设置按钮click事件处理函数

	// 添加，在界面表格中添加一个空行
	document.getElementById("cs_item_new").addEventListener("click", function() {
		addItem(table, { "CATALOG":"", "ID":"", "URL":"", "ENCODE":false, "ENABLE":true});
	}, true);

	// 选择配置导入方式
	document.querySelector('#cs_import').addEventListener('click', function(){
		if (document.getElementById("cs_import").checked)
		{
			document.getElementById("cs_options").style.display="block";
		}
		else
		{
			document.getElementById("cs_options").style.display="none";
		}
	});

	// 保存
	document.querySelector('#save').addEventListener('click', saveWindowData);
}

// 读取界面数据，保存到Storage
function saveWindowData()
{
	var opts = null;

	var name = document.getElementById("cs_name").value;
	var ctrl = document.getElementById("cs_ctrl").checked;

	// 选择配置数据来源
	if (document.getElementById("cs_import").checked)
	{
		// 文本数据，JSON格式
		var textarea = document.getElementById("cs_options");
		opts = {"VER":"1", "NAME":name, "TRIGGERKEY": ctrl, "SEARCHENGINES": textarea.value};
	}
	else
	{
		// 表格中的数据，组装为JSON格式保存
		var items = new Array();

		var table = document.getElementById("cs_tb_data");
		for(var i = 0; i < table.childNodes.length; i++)
		{
			var td = table.childNodes[i].childNodes[0];
			if (td)
			{
				var enable = td.childNodes[0].checked;
				var catalog = td.childNodes[1].value;
				var id = td.childNodes[2].value;
				var url = td.childNodes[3].value;
				var encode = td.childNodes[4].checked;


				if (catalog != "-" && (id == "" || url == ""))
				{
					// 不是分隔符，不允许id或者url为空
					// todo：界面添加提示
					continue;
				}

				items[i] = {CATALOG: catalog, ID: id, URL: url, ENCODE: encode, ENABLE: enable};
			}
		}

		opts = {"VER":"1", "NAME":name, "TRIGGERKEY": ctrl, "SEARCHENGINES": items};
	}

	chrome.extension.sendRequest({cmd: 'set_options', opts: opts}, function() {
		// 如果成功在界面显示提示
		var status = document.getElementById("cs_status");
		status.innerHTML = "配置已经保存。";
		setTimeout(function() {
			status.innerHTML = "";
		}, 800);
	});
}


// 配置界面入口
updateWindowData();