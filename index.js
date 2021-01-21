var f = require("fs");

var input_file = f.readFileSync("E.txt", "utf-8").trim().split("\n");

var params = input_file[0].split(" ");

var videos = parseInt(params[0]);
var endpoints = parseInt(params[1]);
var request_desc = parseInt(params[2]);
var cache = parseInt(params[3]);
var sizes = parseInt(params[4]);

var cache_servers = {...Array.from({length:cache}, ()=>[[], parseInt(sizes)])};

var _video_data = input_file[1].split(" ");

var _request_data = [];

var _endpoints_data = [];

function getvideosize(x) {
	return parseInt(_video_data[parseInt(x)]);
}

function pickendpoint(x) {
	if (x <= input_file.length - request_desc) {
		let _line = input_file[x].split(" ");
		let _latency = parseInt(_line[0]);
		let _c = parseInt(_line[1]);
		let _caches = [...input_file.slice(x + 1, x + _c + 1)].map(x=>x.split(" ")).sort((a,b)=>parseInt(b[1])-parseInt(a[1]));
		if (_caches.length == 0) {
			_caches = Array.from({length:cache}, ()=>_latency).map((a,b)=>[b.toString(), a.toString()]);
		}
		let _data = [
			_caches.length,//cache_servers_count
			_caches//cache_servers
		];
		_endpoints_data.push(_data);
		pickendpoint(x + _caches.length + 1);
	}
}
function getcachesize(x) {
	return parseInt(cache_servers[x.toString()][1]);
}
function addtocache(x, y, z) {
	cache_servers[x.toString()][1] = parseInt(cache_servers[x.toString()][1]) - parseInt(y);
	cache_servers[x.toString()][0].push(z);
}
pickendpoint(2);

for (let i of input_file.slice(request_desc * -1)) {
	let _line = i.split(" ");
	let _data = [
		parseInt(_line[0]),//video id
		parseInt(_line[1]),//endpoint
		parseInt(_line[2])//requests
	];
	_request_data.push(_data);
}

for (let i = 0; i < _request_data.length; i++) {
	try {
		let videoid_ = _request_data[i][0];
		let endpoint_ = _request_data[i][1];
		let requests_ = _request_data[i][2];
		let end_array = _endpoints_data[endpoint_][1];
		for (let j of end_array) {
			let cache_list = j[0];
			let id_ = parseInt(cache_list[0]);
			let lat_ = parseInt(cache_list[1]);
			let vid_size = getvideosize(videoid_);
			let c_size = getcachesize(id_);
			if (c_size - vid_size >= 0) {
				addtocache(id_, vid_size, videoid_);
				break;
			}
		}	
	}
	catch (error) {}
}
let output = [];
for (let i in cache_servers) {
	if (cache_servers[i][0].length >= 1) {
		output.push(i + " " + cache_servers[i][0].join(" "));
	}
}
f.writeFileSync("E_0.txt", [output.length].concat(output).join("\n"));