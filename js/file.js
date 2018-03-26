var		LOGIN			=		0;
var 	DCU				=		1;
var 	METER			=		2;
var		VPN				=		3;
var 	NTP				=		4;
var		SNMP			=		5;
var		DHCP			=		6;
var		COMM			=		7;
var		ADVANCE			=		8;
var		HARDWARE		=		9;

var 	FACTORY_INFO	= 		16;

var 	TASK_STATE	=	1;
var 	TASK_SCHED	=	2;

/**
 *  valueList contains values of current page.
 *	if value has changed.then post it.
 */
var 	keyList = new Array();
var 	valList = new Array();

/**
 *	get index of select item
 *	
 */
function getCtrlParam(id)
{
	var x=document.getElementById(id).selectedIndex;
	var y=document.getElementById(id).options;
	var ctrl = y[x].index;
	var tmp = "";
	if(ctrl === 0)
		tmp = id+"=1&";
	else if(ctrl === 1)
		tmp = id+"=0&";
	
	return tmp;
}
/**
 * send get request to cgi 
 * index : the page number of html
 * callback: callback when data is ready form cgi.
 */
function httpGet(index, callback)
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", "./cgi-bin/config.cgi?"+index, true ); // false for synchronous request
	xmlHttp.setRequestHeader("If-Modified-Since","0"); 
	xmlHttp.send();
	xmlHttp.onreadystatechange=function()
	{
		//get request ready
		if (xmlHttp.readyState==4 && xmlHttp.status==200)
		{
			keyList.length = 0;
			valList.length = 0;
			callback(xmlHttp.responseText);
		}
	}
}

/**
 * get value from string  
 * value: return by cgi program.
 * name: name of query value.
 */
function getQueryStringByName(value,name)
{
	var index = value.indexOf(name);
	if(index < 0)
		return "";
	var end = value.indexOf("\n", index); 
	var val = value.substring(index+name.length+1,end);
	
	keyList.push(name);
	valList.push(val);
	return val;
}

function getQueryString(string)
{
	var index = string.indexOf("=");
	var end = string.indexOf("&", index); 
	
	var key = string.substring(0, index);
	var val = string.substring(index+1,end);
	
	return [key, val];
}

/**
 *	check for Modification
 */
function checkForModification(key, value)
{
	var add = 1;
	for(var i=0;i<keyList.length;i++)
	{
		if(keyList[i] == key && valList[i] == value)
		{
			add = 0;
			break;
		}
	}
	return add;
}
/**
 *	post data to server
 *	use ajax send request
 */
function onPostHide(idName, index, ctrl)
{
	var str = "";

	var arr = new Array();
	/* get number of input */
	arr[0] = "type";
	arr[1] = index;
	var row = document.getElementById(idName).getElementsByTagName("input");
	var subm = arr[0]+"="+arr[1]+"&";
	if(ctrl !== "")
	{
		var tmp = getQueryString(ctrl);
		if(checkForModification(tmp[0],tmp[1]))
			subm += ctrl;
	}
	for(var i=0; i<row.length; i++)
	{
		var key = row[i].id;
		var value = row[i].value;
		
		if(checkForModification(key, value))
			subm += (key+"="+value+"&");
	}
	xmlHttpPost(subm);
	
	return false;
}

function xmlHttpPost(str, callback)
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "POST", "./cgi-bin/config.cgi", true ); // false for synchronous request
//	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlHttp.setRequestHeader("If-Modified-Since","0"); 
	xmlHttp.send(str);
	xmlHttp.onreadystatechange=function()
	{
		//get request ready
		if (xmlHttp.readyState==4 && xmlHttp.status==200)
		{
			//alert(xmlHttp.responseText);
            if(callback != null)
                callback();
		}
	}
}

/**
 *	post data to server
 *
 */
function onPost(idName, index)
{
	var str = "";
//	var tab = document.getElementById("table");
//	var row = tab.rows.length;

	var arr = new Array();
	/* get number of input */
	arr[0] = "type";
	arr[1] = index;
	var row = document.getElementById(idName).getElementsByTagName("input");
	for(var i=0; i<row.length; i++)
	{
		var key = row[i].id;
		var value = row[i].value;
		
		arr.push(key);
		arr.push(value);
	}
	
	post(arr);
}

/** 
 *	post action
 *
 */
function post(PARAMS) {        
    var iframe = document.createElement("iframe");        
    iframe.style.display = "none";
    var form = document.createElement("form");        
    form.action = "./config.cgi";        
    form.method = "post";        
    form.style.display = "none";
	form.target = "iframe";

	for(var i=0; i<PARAMS.length; i+=2)
	{
		var opt = document.createElement("input");
		opt.name = PARAMS[i];
		opt.value = PARAMS[i+1];

		form.appendChild(opt);
	}
    document.body.appendChild(form);        
    form.submit();
	document.body.removeChild(form);
}   

/**
 *	check ip is legal
 *
 *
 */
function checkIP(id, br)  
{  
	var obj = document.getElementById(id).value;  
		
	var exp=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;  
	var reg = obj.match(exp);
	if (reg == null)
	{
		setHtmlText(br,"invalid ip address");
		return 0;
	}
	else
	{
		setHtmlText(br,"");
		return 1;
	}
}

function setHtmlText(id, str)
{
	document.getElementById(id).innerHTML = str;
}

/**
 *	get table info
 */
function getTableRows(id)
{
	var table =document.getElementById(id);
	var rows = table.rows.length;
	return rows;
}

function getTableColums(id)
{
	var table =document.getElementById(id);
	var colums = table.rows[0].cells.length;
	return colums;
}

/**
 *	table btn function
 *
 */
function getTaskName(obj)
{
	//td -> tr -> table
	var tr=obj.parentNode.parentNode;
	//get task name
	var name = tr.cells[1].innerHTML;
	
	return name;
}
 
function onTableUpload(obj)
{
	var task_name = getTaskName(obj);
	xmlHttpPost("taskresult="+task_name);
}

/**
 *	task return by cgi.
 *
 */
function onTaskView(str)
{
	//alert(str);
	window.document.getElementById('view_text').value = str;
	window.document.getElementById('light').style.display='block';
}

function onTableView(obj)
{
	var task_name = getTaskName(obj);
	
	//send request to cgi
	httpGet("taskview="+task_name, onTaskView);
}

function insertRow(id, rows, val, type)
{
	var x=document.getElementById(id).insertRow(rows);
	var count = getTableColums(id);
	var index=x.insertCell(0);
	index.innerHTML = rows;
	index.className="table_td";
	for(var i=0; i<val.length;i++)
	{
		var y=x.insertCell(i+1);
		y.className="table_td";
		y.innerHTML=val[i];
	}
	
	if(type == TASK_STATE)
	{
		var y=x.insertCell(i+1);
		y.className="table_td";
		y.innerHTML='<input class="button button1" type="button" value="Upload" onClick="onTableUpload(this)"/>';
		y=x.insertCell(i+2);
		y.className="table_td";
		y.innerHTML='<input class="button button1" type="button" value="Task view" onClick="onTableView(this)"/>';
	}
}

function deleteRows(id)
{
	var rows = getTableRows(id);
	var table =document.getElementById(id);
	for(var i=1;i<rows;i++)
	{
		table.deleteRow(1);
	}
}

/**
 *	split str with "\n"	
 *	this function is used for meter list
 *
 */
function insertTableInfo(str, id, type)
{
	var rowNumber = 1;
	var temp = str.split("\r\n");
	for(var i =0;i<temp.length;i++){
		if(temp[i] == ""){
			continue;
		}
		var val = temp[i].split("\n");
		var list = new Array();
		for(var j=0;j<val.length;j++)
		{
			list.push(val[j]);
		}
		insertRow(id, rowNumber, list, type);
		rowNumber++;
	}
}

function setActive(index)
{
	var a=window.parent.document.getElementById("menu_form");
	var li = a.getElementsByTagName("li");
	for(var i=0;i<li.length;i++)
	{
		if(i == index)
			li[i].className="current";
		else
			li[i].className="";
	}	
}