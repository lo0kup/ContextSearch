
// options.js


//var Storage = chrome.storage.local;
var Storage = chrome.storage.sync; // sync with all browsers

load_options();
document.querySelector('#save').addEventListener('click', save_options);

// Saves options to storage.
function save_options() {
	var input = document.getElementById("cs_name");
	var textarea = document.getElementById("cs_options");	

	Storage.set({"cs_name": input.value, "cs_options": textarea.value}, function() {
		// Notify that we saved.
		// Update status to let user know options were saved.
		var status = document.getElementById("cs_status");
		status.innerHTML = "Options Saved.";
		setTimeout(function() {
			status.innerHTML = "";
		}, 750);
	});  
}

// Restores select box state to saved value from localStorage.
function load_options() {
	Storage.get({"cs_name": "用其他引擎搜索 \"%s\"", "cs_options": ""}, function(items) {
		if (items.cs_options) {
			var textarea = document.getElementById("cs_options");
			textarea.value = items.cs_options;
		}
		if (items.cs_name)
		{
			var input = document.getElementById("cs_name");
			input.value = items.cs_name;
		}
	});	
}
