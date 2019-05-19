var scriptToAppend = [
    "js/events.js",
    "js/friends.js",
    "js/map.js"
];


function appendScript(jsFilePath){
	var js = document.createElement("script");
	js.type = "text/javascript";
	js.src = jsFilePath;
	document.head.appendChild(js);
}
scriptToAppend.forEach(x => appendScript(x));
