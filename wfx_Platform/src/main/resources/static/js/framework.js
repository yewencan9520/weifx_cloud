
/*******************************************************************************************************************
 * 判断浏览器版本
 * @param {Object} name
 * @return {TypeName} 
 *******************************************************************************************************************/
var isIE = navigator.userAgent.toLowerCase().indexOf("msie") != -1;
var isIE8 = !!window.XDomainRequest&&!!document.documentMode;
var isIE7 = navigator.userAgent.toLowerCase().indexOf("msie 7.0") != -1 && !isIE8;
var isIE6 = navigator.userAgent.toLowerCase().indexOf("msie 6.0") != -1;
var isGecko = navigator.userAgent.toLowerCase().indexOf("gecko") != -1;
var isOpera = navigator.userAgent.toLowerCase().indexOf("opera") != -1;
var isQuirks = document.compatMode == "BackCompat";
var isStrict = document.compatMode == "CSS1Compat";
var isBorderBox = isIE && isQuirks;



/******************************************************************************************************************
 * Cookie操作类，支持大于4K的Cookie
 ******************************************************************************************************************/
var Cookie = {};
Cookie.Spliter = "_JACK_SPLITER_";
/******************************************************************************************************************
 * 获取指定cookie对象
 * @param {Object} name
 * @return {TypeName} 
 *****************************************************************************************************************/
Cookie.get = function(name) {
	var cs = document.cookie.split("; ");
	for (i = 0; i < cs.length; i++) {
		var arr = cs[i].split("=");
		var n = arr[0].trim();
		var v = arr[1] ? arr[1].trim() : "";
		if (n == name) {
			return decodeURI(v);
		}
	}
	return null;
}

/******************************************************************************************************************
 * 获取所有cookie对象
 * @return {TypeName} 
 *****************************************************************************************************************/
Cookie.getAll = function(){
  var cs = document.cookie.split("; ");
  var r = [];
  for(i=0; i<cs.length; i++){
	  var arr = cs[i].split("=");
	  var n = arr[0].trim();
	  var v = arr[1]?arr[1].trim():"";
	  if(n.indexOf(Cookie.Spliter)>=0){
	  	continue;
	  }
	  if(v.indexOf("^"+Cookie.Spliter)==0){
	      var max = v.substring(Cookie.Spliter.length+1,v.indexOf("$"));
	      var vs = [v];
	      for(var j=1;j<max;j++){
	      	vs.push(Cookie.get(n+Cookie.Spliter+j));
	      }
	      v = vs.join('');
	      v = v.substring(v.indexOf("$")+1);
	   }
	   r.push([n,decodeURI(v)]);
	}
	return r;
}



/******************************************************************************************************************
 * 增加cookie操作
 * @param {Object} name
 * @param {Object} value
 * @param {Object} expires
 * @param {Object} path
 * @param {Object} domain
 * @param {Object} secure
 * @param {Object} isPart
 * @return {TypeName} 
 *****************************************************************************************************************/
Cookie.set = function(name, value, expires, path, domain, secure, isPart){
	if(!isPart){
		var value = encodeURI(value);
	}
	if(!name || !value){
		return false;
	}
	if(!path){
		path = Server.ContextPath;//特别注意，此处是为了实现不管当前页面在哪个路径下，Cookie中同名名值对只有一份
	}
	path = path.replace(/^\w+:\/\/[.\w]+:?\d*/g, '');//特别注意，此处是为了实现不管当前页面在哪个路径下，Cookie中同名名值对只有一份
	if(expires!=null){
	  if(/^[0-9]+$/.test(expires)){
	    expires = new Date(new Date().getTime()+expires*1000).toGMTString();
		}else{
			var date = DateTime.parseDate(expires);
			if(date){
				expires = date.toGMTString();
			}else{
		  	expires = undefined;
		  }
		}
	}
	if(!isPart){
	  Cookie.remove(name, path, domain);
	}
	var cv = name+"="+value+";"
		+ ((expires) ? " expires="+expires+";" : "")
		+ ((path) ? "path="+path+";" : "")
		+ ((domain) ? "domain="+domain+";" : "")
		+ ((secure && secure != 0) ? "secure" : "");
  if(cv.length < 4096){
		document.cookie = cv;
	}else{
		var max = Math.ceil(value.length*1.0/3800);
		for(var i=0; i<max; i++){
			if(i==0){
				Cookie.set(name, '^'+Cookie.Spliter+'|'+max+'$'+value.substr(0,3800), expires, path, domain, secure, true);
			}else{
				Cookie.set(name+Cookie.Spliter+i, value.substr(i*3800,3800), expires, path, domain, secure, true);
			}
		}
	}
  return true;
}


/******************************************************************************************************************
 * 删除cookie操作
 * @param {Object} name
 * @param {Object} path
 * @param {Object} domain
 * @return {TypeName} 
 *****************************************************************************************************************/
Cookie.remove = function(name, path, domain){
	var v = Cookie.get(name);
  if(!name||v==null){
  	return false;
  }
  if(encodeURI(v).length > 3800){
		var max = Math.ceil(encodeURI(v).length*1.0/3800);
		for(i=1; i<max; i++){
			document.cookie = name+Cookie.Spliter+i+"=;"
				+ ((path)?"path="+path+";":"")
				+ ((domain)?"domain="+domain+";":"")
				+ "expires=Thu, 01-Jan-1970 00:00:01 GMT;";
		}
	}
	document.cookie = name+"=;"
		+ ((path)?"path="+path+";":"")
		+ ((domain)?"domain="+domain+";":"")
		+ "expires=Thu, 01-Jan-1970 00:00:01 GMT;";
	return true;
}



/******************************************************************************************************************
 * 数据集合操作（参数转换）
 * @memberOf {TypeName} 
 * @return {TypeName} 
 *****************************************************************************************************************/
function DataCollection(){
	this.map = {};
	this.valuetype = {};
	this.keys = [];

	DataCollection.prototype.get = function(ID){
		if(typeof(ID)=="number"){
			return this.map[this.keys[ID]];
		}
		return this.map[ID];
	}

	DataCollection.prototype.getKey = function(index){
		return this.keys[index];
	}

	DataCollection.prototype.size = function(){
		return this.keys.length;
	}

	DataCollection.prototype.remove = function(ID){
		if(typeof(ID)=="number"){
			if(ID<this.keys.length){
				var obj = this.map[this.keys[ID]];
				this.map[this.keys[ID]] = null;
				this.keys.splice(ID);
				return obj;
			}
		}else{
			for(var i=0;i<this.keys.length;i++){
				if(this.keys[i]==ID){
					var obj = this.map[ID];
					this.map[ID] = null;
					this.keys.splice(i);
					return obj;
					break;
				}
			}
		}
		return null;
	}

	DataCollection.prototype.toQueryString = function(){
		var arr = [];
		for(var i=0;i<this.keys.length;i++){
			if(this.map[this.keys[i]]==null||this.map[this.keys[i]]==""){continue;}
			if(i!=0){
				arr.push("&");
			}
			arr.push(this.keys[i]+"="+this.map[this.keys[i]]);
		}
		return arr.join('');
	}

	DataCollection.prototype.parseXML = function(xmlDoc){
		var coll = xmlDoc.documentElement;
		if(!coll){
			return false;
		}
		var nodes = coll.childNodes;
		var len = nodes.length;
		for(var i=0;i<len;i++){
			var node = nodes[i];
			var Type = node.getAttribute("Type");
			var ID = node.getAttribute("ID");
			this.valuetype[ID] = Type;
			if(Type=="String"){
				var v = node.firstChild.nodeValue;
				if(v==Constant.Null){
					v = null;
				}
				this.map[ID] = v;
			}else if(Type=="StringArray"){
				this.map[ID] = eval("["+node.firstChild.nodeValue+"]");
			}else if(Type=="Map"){
				this.map[ID] = eval("("+node.firstChild.nodeValue+")");
			}else if(Type=="DataTable"||Type=="Schema"||Type=="SchemaSet"){
				this.parseDataTable(node,"DataTable");
			}else{
				this.map[ID] = node.getAttribute("Value");
			}
			this.keys.push(ID);
		}
		return true;
	}

	DataCollection.prototype.parseDataTable = function(node,strType){
		var cols = node.childNodes[0].childNodes[0].nodeValue;
		cols = "var _TMP1 = "+cols+"";
		eval(cols);
		cols = _TMP1;
		var values = node.childNodes[1].childNodes[0].nodeValue;
		values = "var _TMP2 = "+values+"";
		eval(values);
		values = _TMP2;
		var obj;
		obj = new DataTable();
		obj.init(cols,values);
		this.add(node.getAttribute("ID"),obj);
	}

	DataCollection.prototype.toXML = function(){
		var arr = [];
		arr.push("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
		arr.push("<collection>");
		for(var i=0;i<this.keys.length;i++){
			var ID = this.keys[i];
			try{
				var v = this.map[ID];
				arr.push("<element ID=\""+ID+"\" Type=\""+this.valuetype[ID]+"\">");
				if(this.valuetype[ID]=="DataTable"){
					arr.push(v.toString());
				}else if(this.valuetype[ID]=="String"){
					if(v==null||typeof(v)=="undefined"){
						arr.push("<![CDATA["+Constant.Null+"]]>");
					}else{
						arr.push("<![CDATA["+v+"]]>");
					}
				}else if(this.valuetype[ID]=="Map"){
					if(v==null||typeof(v)=="undefined"){
						arr.push("<![CDATA["+Constant.Null+"]]>");
					}else{
						arr.push("<![CDATA["+JSON.toString(v)+"]]>");
					}
				}else{
					arr.push(v);
				}
				arr.push("</element>");
			}catch(ex){alert("DataCollection.toXML():"+ID+","+ex.message);}
		}
		arr.push("</collection>");
		return arr.join('');
	}

	DataCollection.prototype.add = function(ID,Value,Type){
		this.map[ID] = Value;
		this.keys.push(ID);
		if(Type){
			this.valuetype[ID] = Type;
		}else	if( Value && Value.getDataRow){//DataTable可能不是本页面中的
			this.valuetype[ID] = "DataTable";
		}else{
			this.valuetype[ID] = "String";
		}
	}

	DataCollection.prototype.addAll = function(dc){
		if(!dc){
			return;
		}
		if(!dc.valuetype){
			alert("DataCollection.addAll()要求参数必须是一个DataCollection!");
		}
		var size = dc.size();
		for(var i=0;i<size;i++){
			var k = dc.keys[i];
			var v = dc.map[k];
			var t = dc.valuetype[k];
			this.add(k,v,t);
		}
	}
}


/******************************************************************************************************************
 * 数据表格操作
 * @memberOf {TypeName} 
 * @return {TypeName} 
 *****************************************************************************************************************/
function DataTable(){
	this.Columns = null;
	this.Values = null;
	this.Rows = null;
	this.ColMap = {};

	DataTable.prototype.getRowCount = function(){
		return this.Rows.length;
	}

	DataTable.prototype.getColCount = function(){
		return this.Columns.length;
	}

	DataTable.prototype.getColName = function(i){
		return this.Columns[i];
	}

	DataTable.prototype.get2 = function(i,j){
		return this.Rows[i].get2(j);
	}

	DataTable.prototype.get = function(i,str){
		return this.Rows[i].get(str);
	}

	DataTable.prototype.getDataRow = function(i){
		return this.Rows[i];
	}

	DataTable.prototype.deleteRow = function(i){
		this.Values.splice(i,1);
		this.Rows.splice(i,1);
		for(var k=i;k<this.Rows.length;k++){
			this.Rows[k].Index = k;
		}
	}

	DataTable.prototype.insertRow = function(i,values){
		this.Values.splice(i,0,values);
		this.Rows.splice(i,0,new DataRow(this,i));
		for(var k=i;k<this.Rows.length;k++){
			this.Rows[k].Index = k;
		}
	}
	
	DataTable.prototype.insertColumn = function(name){
		if(this.hasColumn(name)){
			return;
		}
		var col = {};
		col.Name = name.toLowerCase();
		col.Type = 1;//string
		this.Columns.push(col);
		this.ColMap[col.Name] = this.Columns.length-1;
		for(var i=0;i<this.Values.length;i++){
			this.Values[i].push(null);//置空值
		}
	}	
	
	DataTable.prototype.hasColumn = function(name){
		name = name.toLowerCase();
		for(var j=0;j<this.Columns.length;j++){
			if(this.Columns[j].Name==name){
				return true;
			}
		}
		return false;
	}

	DataTable.prototype.init = function(cols,values){
		this.Values = values;
		this.Columns = [];
		this.Rows = [];
		for(var i=0;i<cols.length;i++){
			var col = {};
			col.Name = cols[i][0].toLowerCase();
			col.Type = cols[i][1];
			this.Columns[i] = col;
			this.ColMap[col.Name] = i;
		}
		for(var i=0;i<values.length;i++){
			var row = new DataRow(this,i);
			this.Rows[i] = row;
		}
	}

	DataTable.prototype.toString = function(){
		var arr = [];
		arr.push("<columns><![CDATA[[");
		for(var i=0;i<this.Columns.length;i++){
			if(i!=0){
				arr.push(",");
			}
			arr.push("[");
			arr.push("\""+this.Columns[i].Name+"\",")
			arr.push(this.Columns[i].Type)
			arr.push("]");
		}
		arr.push("]]]></columns>");
		arr.push("<values><![CDATA[[");
		for(var i=0;i<this.Values.length;i++){
			if(i!=0){
				arr.push(",");
			}
			arr.push("[");
			for(var j=0;j<this.Columns.length;j++){
				if(j!=0){
					arr.push(",");
				}
				if(this.Values[i][j]==null||typeof(this.Values[i][j])=="undefined"){
					arr.push("\"_JACK_NULL\"");
				}else{
					var v = this.Values[i][j];
					if(typeof(v)=="string"){
						v = javaEncode(v);
					}
					arr.push("\""+v+"\"");
				}
			}
			arr.push("]");
		}
		arr.push("]]]></values>");
		return arr.join('');
	}
}


/******************************************************************************************************************
 * 表格数据行操作
 * @param {Object} dt
 * @param {Object} index
 * @memberOf {TypeName} 
 * @return {TypeName} 
 *****************************************************************************************************************/
function DataRow(dt,index){
	this.DT = dt;
	this.Index = index;

	DataRow.prototype.get2 = function(i){
		return this.DT.Values[this.Index][i];
	}

	DataRow.prototype.getColCount = function(){
		return this.DT.Columns.length;
	}

	DataTable.prototype.getColName = function(i){
		return this.DT.Columns[i];
	}

	DataRow.prototype.get = function(str){
		str = str.toLowerCase();
		var c = this.DT.ColMap[str];
		if(typeof(c)=="undefined"){
			return null;
		}
		return this.DT.Values[this.Index][c];
	}

	DataRow.prototype.set = function(str,value){
		str = str.toLowerCase();
		var c = this.DT.ColMap[str];
		if(typeof(c)=="undefined"){
			return;
		}
		this.DT.Values[this.Index][c] = value;
	}

	DataRow.prototype.set2 = function(i,value){
		this.DT.Values[this.Index][i] = value;
	}
}



/******************************************************************************************************************
 * 主要负责服务器请求处理
 * @return {TypeName} 
 ******************************************************************************************************************/
var Server = {};
Server.RequestMap = {};
Server.MainServletURL = "MainServlet.jsp";
Server.ContextPath = CONTEXTPATH;
Server.Pool = [];

Server.getXMLHttpRequest = function(){
	for(var i=0;i<Server.Pool.length;i++){
		if(Server.Pool[i][1]=="0"){
			Server.Pool[i][1] = "1";
			return Server.Pool[i][0];
		}
	}
	var request;
	if (window.XMLHttpRequest){
		request = new XMLHttpRequest();
	}else if(window.ActiveXObject){
		for(var i =5;i>1;i--){
      try{
        if(i==2){
					request = new ActiveXObject( "Microsoft.XMLHTTP" );
        }else{
					request = new ActiveXObject( "Msxml2.XMLHTTP." + i + ".0" );
        }
      }catch(ex){}
    }
	}
	Server.Pool.push([request,"1"]);
	return request;
}

Server.loadURL = function(url,func){
	var Request = Server.getXMLHttpRequest();
	Request.open("GET", Server.ContextPath+url, true);
	Request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	Request.onreadystatechange = function(){
		if (Request.readyState==4&&Request.status==200) {
			try{
				if(func){
					func(Request.responseText);
				};
			}finally{
				for(var i=0;i<Server.Pool.length;i++){
					if(Server.Pool[i][0]==Request){
						Server.Pool[i][1] = "0";
						break;
					}
				}
				Request = null;
				func = null;
			}
		}
	}
	Request.send(null);
}
//加载js文件
Server.loadScript = function(url){
	document.write('<script type="text/javascript" src="' + Server.ContextPath+url + '"><\/script>') ;
}
//加载css文件
Server.loadCSS = function(url){
	if(isGecko){
		var e = document.createElement('LINK') ;
		e.rel	= 'stylesheet' ;
		e.type	= 'text/css' ;
		e.href	= url ;
		document.getElementsByTagName("HEAD")[0].appendChild(e) ;
	}else{
		document.createStyleSheet(url);
	}
}

Server.getOneValue = function(methodName,dc,func){//dc既可是一个DataCollection，也可以是一个单值
	if(dc&&dc.prototype==DataCollection.prototype){
		Server.sendRequest(methodName,dc,func);
	}else{
		var dc1 = new DataCollection();
		dc1.add("_Param0",dc);
		Server.sendRequest(methodName,dc1,func);
	}
}
//发送请求
Server.sendRequest = function(methodName,dataCollection,func,id,waitMsg){//参数id用来限定id相同的请求同一时间只能有一个
	if(!Server.executeRegisteredEvent(methodName,dataCollection)){
		Console.log(methodName+"的调用被注册事件阻止!");
		return;
	}
	var Request;
	if(id!=null && Server.RequestMap[id]){
		Request = Server.RequestMap[id];
		Request.abort();
	}else{
		Request = Server.getXMLHttpRequest();
	}
	Request.open("POST", Server.ContextPath+Server.MainServletURL, true);
	Request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	var url = "_JACK_METHOD="+methodName+"&_JACK_DATA=";
	if(dataCollection){
		url += encodeURL(htmlEncode(dataCollection.toXML()));
	}
	url += "&_JACK_URL="+encodeURL(window.location.pathname);
	Server._ResponseDC = null;
	Request.onreadystatechange = function(){Server.onRequestComplete(Request,func);};
	Request.send(url);
}

//请求处理完成后操作
Server.onRequestComplete = function(Request,func){
	if (Request.readyState==4&&Request.status==200) {
		try{
			var xmlDoc = Request.responseXML;
			var dc = new DataCollection();
			if(xmlDoc){
				if(dc.parseXML(xmlDoc)){
					dc["Status"] = dc.get("_JACK_STATUS");
					dc["Message"] = dc.get("_JACK_MESSAGE");
					if(dc.get("_JACK_SCRIPT")){
						eval(dc.get("_JACK_SCRIPT"));
					}
				}
				Server._ResponseDC = dc;
				xmlDoc = null;
			}else{
					dc["Status"] = 0;
					dc["Message"] = "服务器发生异常,未获取到数据!";
			}
			if(func){
				try{
					func(dc);
				}catch(ex){
					alert("Server.onRequestComplete:"+ex.message+"\t"+ex.lineNumber);
				}
			}
		}finally{
			for(var i=0;i<Server.Pool.length;i++){
				if(Server.Pool[i][0]==Request){
					Server.Pool[i][1] = "0";
					break;
				}
			}
			Request = null;
			func = null;
		}
	}
}

//获取响应信息
Server.getResponse = function(){
	return Server._ResponseDC;
}

Server.Events = {};
//当调用method时执行相应的函数，当该函数值为false退出调用，不向后台发送指令
Server.registerEvent = function(methodName,func){
	var arr = Server.Events[methodName];
	if(!arr){
		arr = [];
	}
	arr.push(func);
}

Server.executeRegisteredEvent = function(methodName,dc){
	var arr = Server.Events[methodName];
	if(!arr){
		return true;
	}
	for(var i=0;i<arr.length;i++){
		if(!arr[i].apply(null,[dc,methodName])){
			return false;
		}
	}
	return true;
}


/**
 * JSON转换为String串
 * @param {Object} O
 * @return {TypeName} 
 */
var JSON = {};
JSON.toString=function(O) {
	var string = [];
	var isArray = function(a) {
		var string = [];
		for(var i=0; i< a.length; i++) string.push(JSON.toString(a[i]));
		return string.join(',');
	};
	var isObject = function(obj) {
		var string = [];
		for (var p in obj){
			if(obj.hasOwnProperty(p) && p!='prototype'){
				string.push('"'+p+'":'+JSON.toString(obj[p]));
			}
		};
		return string.join(',');
	};
	if (!O) return false;
	if (O instanceof Function) string.push(O);
	else if (O instanceof Array) string.push('['+isArray(O)+']');
	else if (typeof O == 'object') string.push('{'+isObject(O)+'}');
	else if (typeof O == 'string') string.push('"'+O+'"');
	else if (typeof O == 'number' && isFinite(O)) string.push(O);
	return string.join(',');
}
//json格式化
JSON.evaluate=function(str) {
	return (typeof str=="string")?eval('(' + str + ')'):str;
}


/**
 * 字符串常用操作
 * @param {Object} str
 * @memberOf {TypeName} 
 * @return {TypeName} 
 */
String.prototype.startsWith = String.prototype.startWith = function(str) {
  return this.indexOf(str) == 0;
}

String.prototype.endsWith = String.prototype.endWith = function(str) {
	var i = this.lastIndexOf(str);
  return i>=0 && this.lastIndexOf(str) == this.length-str.length;
}

String.prototype.trim = function(){
	return this.replace(/(^\s*)|(\s*$)/g,"");
}

String.prototype.leftPad = function(c,count){
	if(!isNaN(count)){
		var a = "";
		for(var i=this.length;i<count;i++){
			a = a.concat(c);
		}
		a = a.concat(this);
		return a;
	}
	return null;
}

String.prototype.rightPad = function(c,count){
	if(!isNaN(count)){
		var a = this;
		for(var i=this.length;i<count;i++){
			a = a.concat(c);
		}
		return a;
	}
	return null;
}



/**
 * 数组常用操作
 * @memberOf {TypeName} 
 * @return {TypeName} 
 */
Array.prototype.clone = function(){
	var len = this.length;
	var r = [];
	for(var i=0;i<len;i++){
		if(typeof(this[i])=="undefined"||this[i]==null){
			r[i] = this[i];
			continue;
		}
		if(this[i].constructor==Array){
			r[i] = this[i].clone();
		}else{
			r[i] = this[i];
		}
	}
	return r;
}

Array.prototype.insert = function(index,data){
	if(isNaN(index) || index<0 || index>this.length) {
		this.push(data);
	}else{
		var temp = this.slice(index);
		this[index]=data;
		for (var i=0; i<temp.length; i++){
			this[index+1+i]=temp[i];
		}
	}
	return this;
}

Array.prototype.remove = function(s,dust){//如果dust为ture，则返回被删除的元素
	if(dust){
	var dustArr=[];
	  for(var i=0;i<this.length;i++){
		if(s == this[i]){
			dustArr.push(this.splice(i, 1)[0]);
		}
	  }
	  return dustArr;
	}

  for(var i=0;i<this.length;i++){
    if(s == this[i]){
		this.splice(i, 1);
    }
  }
  return this;
}

Array.prototype.indexOf = function(func){
	var len = this.length;
	for(var i=0;i<len;i++){
		if (this[i]==arguments[0])
			return i;
	}
	return -1;
}

Array.prototype.each = function(func){
	var len = this.length;
	for(var i=0;i<len;i++){
		try{
			func(this[i],i);
		}catch(ex){
			//alert("Array.prototype.each:"+ex.message);
		}
	}
}

/**
 * 判断对象是否为空
 * @param {Object} v
 * @return {TypeName} 
 */
function isNull(v){
	return v===null||typeof(v)=="undefined";
}

/**
 * 判断对象是否不为空
 * @param {Object} v
 * @return {TypeName} 
 */
function isNotNull(v){
	return !isNull(v);
}


function getEvent(evt){
	if(document.all) return window.event;
	if (evt) {
		if((evt.constructor  == Event || evt.constructor == MouseEvent) || (typeof(evt) == "object" && evt.preventDefault && evt.stopPropagation)) {
			return evt;
		}
	}
	func = getEvent.caller;
	while(func != null) {
		var arg0 = func.arguments[0];
		if (arg0) {
			if((arg0.constructor  == Event || arg0.constructor == MouseEvent) || (typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
				return arg0;
			}
		}
		func=func.caller;
	}
	return null;
}

function stopEvent(evt){//阻止一切事件执行,包括浏览器默认的事件
	evt = getEvent(evt);
	if(!evt){
		return;
	}
	if(isGecko){
		evt.preventDefault();
		evt.stopPropagation();
	}
	evt.cancelBubble = true
	evt.returnValue = false;
}

function cancelEvent(evt){//仅阻止用户定义的事件
	evt = getEvent(evt);
	evt.cancelBubble = true;
}

function getEventPosition(evt){//返回相对于最上级窗口的左上角原点的坐标
	evt = getEvent(evt);
	var pos = {x:evt.clientX, y:evt.clientY};
	var win;
	if(isGecko){
		win = evt.srcElement.ownerDocument.defaultView;
	}else{
		win = evt.srcElement.ownerDocument.parentWindow;
	}
	var sw,sh;
	while(win!=win.parent){
		if(win.frameElement&&win.parent.DataCollection){
			pos2 = $E.getPosition(win.frameElement);
			pos.x += pos2.x;
			pos.y += pos2.y;
		}
		sw = Math.max(win.document.body.scrollLeft, win.document.documentElement.scrollLeft);
		sh = Math.max(win.document.body.scrollTop, win.document.documentElement.scrollTop);
		pos.x -= sw;
		pos.y -= sh;
		if(!win.parent.DataCollection){
			break;
		}
		win = win.parent;
	}

	return pos;
}

function getEventPositionLocal(evt){//返回事件在当前页面上的坐标
	evt = getEvent(evt);
	var pos = {x:evt.clientX, y:evt.clientY};
	var win;
	if(isGecko){
		win = evt.srcElement.ownerDocument.defaultView;
	}else{
		win = evt.srcElement.ownerDocument.parentWindow;
	}
	pos.x += Math.max(win.document.body.scrollLeft, win.document.documentElement.scrollLeft);
	pos.y += Math.max(win.document.body.scrollTop, win.document.documentElement.scrollTop);
	return pos;
}


/**
 * 是否为整数
 * @param {Object} str
 * @return {TypeName} 
 */
function isInt(str){
	return /^\-?\d+$/.test(""+str);
}

/**
 * 是否为数字
 * @param {Object} str
 * @return {TypeName} 
 */
function isNumber(str){
	var t = ""+str;
	var dotCount = 0;
	for(var i=0;i<str.length;i++){
		var c = str.charAt(i);
		if(c=="."){
			if(i==0||i==str.length-1||dotCount>0){
				return false;
			}else{
				dotCount++;
			}
		}else if(c=='-'){
			if(i!=0){
				return false;
			}
		}else	if(isNaN(parseInt(c))){
			return false;
		}
	}
	return true;
}


/**
 * 是否为纯时间格式 HH:MM:SS
 * @param {Object} str
 * @return {TypeName} 
 */
function isTime(str){
	if(!str){
		return false;
	}
	var arr = str.split(":");
	if(arr.length!=3){
		return false;
	}
	if(!isNumber(arr[0])||!isNumber(arr[1])||!isNumber(arr[2])){
		return false;
	}
	var date = new Date();
	date.setHours(arr[0]);
	date.setMinutes(arr[1]);
	date.setSeconds(arr[2]);
	return date.toString().indexOf("Invalid")<0;
}


/**
 * 是否为日期
 * @param {Object} str
 * @return {TypeName} 
 */
function isDate(str){
	if(!str){
		return false;
	}
	var arr = str.split("-");
	if(arr.length!=3){
		return false;
	}
	if(!isNumber(arr[0])||!isNumber(arr[1])||!isNumber(arr[2])){
		return false;
	}
	var date = new Date();
	date.setFullYear(arr[0]);
	date.setMonth(arr[1]);
	date.setDate(arr[2]);
	return date.toString().indexOf("Invalid")<0;
}


/**
 * 是否为全时间 YYYY:MM:DD HH:MM:SS
 * @param {Object} str
 * @return {TypeName} 
 */
function isDateTime(str){
	if(!str){
		return false;
	}
	if(str.indexOf(" ")<0){
		return isDate(str);
	}
	var arr = str.split(" ");
	if(arr.length<2){
		return false;
	}
	return isDate(arr[0])&&isTime(arr[1]);
}


/**
 * 是否为数组
 * @param {Object} obj
 * @return {TypeName} 
 */
function isArray(obj) {
	 if(!obj){
	 	 return false;
	 }
   if (obj.constructor.toString().indexOf("Array") == -1){
      return false;
   } else{
      return true;
   }
}


/**
 * URL转码
 * @param {Object} str
 * @return {TypeName} 
 */
function encodeURL(str){
	return encodeURI(str).replace(/=/g,"%3D").replace(/\+/g,"%2B").replace(/\?/g,"%3F").replace(/\&/g,"%26");
}


/**
 * html转码
 * @param {Object} str
 * @return {TypeName} 
 */
function htmlEncode(str) {
	return str.replace(/&/g,"&amp;").replace(/\"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/ /g,"&nbsp;");
}


/**
 * html解码
 * @param {Object} str
 * @return {TypeName} 
 */
function htmlDecode(str) {
	return str.replace(/\&quot;/g,"\"").replace(/\&lt;/g,"<").replace(/\&gt;/g,">").replace(/\&nbsp;/g," ").replace(/\&amp;/g,"&");
}


/**
 * java转码
 * @param {Object} txt
 * @return {TypeName} 
 */
function javaEncode(txt) {
	if (!txt) {
		return txt;
	}
	return txt.replace("\\", "\\\\").replace("\r\n", "\n").replace("\n", "\\n").replace("\"", "\\\"").replace("\'", "\\\'");
}


/**
 * java解码
 * @param {Object} txt
 * @return {TypeName} 
 */
function javaDecode(txt) {
	if (!txt) {
		return txt;
	}
	return txt.replace("\\\\", "\\").replace( "\\n", "\n").replace("\\r", "\r").replace("\\\"", "\"").replace("\\\'", "\'");
}


/**
 * 给dom元素添加属性
 * @param {Object} ele
 * @return {TypeName} 
 */
var Core = {};
Core.attachMethod = function(ele){
	if(!ele||ele["$A"]){
		return;
	}
	if(ele.nodeType==9){
		return;
	}
	var win;
	try{
		if(isGecko){
			win = ele.ownerDocument.defaultView;
		}else{
			win = ele.ownerDocument.parentWindow;
		}
		for(var prop in win.$E){
			ele[prop] = win.$E[prop];
		}
	}catch(ex){
		alert("Core.attachMethod:"+ele)//有些对象不能附加属性，如flash
	}
}

/**
 * 全局公用函数
 * @param {Object} ele
 * @return {TypeName} 
 */
var Constant = {};
    Constant.Null = "_JACK_NULL";
/**
 * 获取DOM元素
 * @param {Object} ele 元素ID
 * @return {TypeName} 
 */
function $(ele) {
  if (typeof(ele) == 'string'){
    ele = document.getElementById(ele)
    if(!ele){
  		return null;
    }
  }
  if(ele){
  	Core.attachMethod(ele);
	}
  return ele;
}

/**
 * 获取表单元素值
 * @param {Object} ele 元素ID
 * @return {TypeName} 
 */
function $V(ele){
	var eleId = ele;
	ele = $(ele);
	if(!ele){
		alert("表单元素不存在:"+eleId);
		return null;
	}
  switch (ele.type.toLowerCase()) {
    case 'submit':
    case 'hidden':
    case 'password':
    case 'textarea':
    case 'file':
    case 'image':
    case 'select-one':
    case 'text':
      return ele.value;
    case 'checkbox':
    case 'radio':
      if (ele.checked){
    		return ele.value;
    	}else{
    		return null;
    	}
    default:
    		return "";
  }
}

/**
 * 通过ID和值进行表单元素回填
 * @param {Object} ele
 * @param {Object} v
 * @return {TypeName} 
 */
function $S(ele,v){
	var eleId = ele;
	ele = $(ele);
	if(!v&&v!=0){
		v = "";
	}
	if(!ele){
		alert("表单元素不存在:"+eleId);
		return;
	}
  switch (ele.type.toLowerCase()) {
    case 'submit':
    case 'hidden':
    case 'password':
    case 'textarea':
    case 'button':
    case 'file':
    case 'image':
    case 'select-one':
    case 'text':
      ele.value = v;
      break;
    case 'checkbox':
    case 'radio':
      if(ele.value==""+v){
      	ele.checked = true;
      }else{
      	ele.checked=false;
      }
      break;
   }
}

/**
 * 通过页面标签获取dom元素 ru 获取input元素
 * @param {Object} tagName
 * @param {Object} ele
 * @return {TypeName} 
 */
function $T(tagName,ele){
	ele = $(ele);
	ele = ele || document;
	var ts = ele.getElementsByTagName(tagName);//此处返回的不是数组
	var arr = [];
	var len = ts.length;
	for(var i=0;i<len;i++){
		arr.push($(ts[i]));
	}
	return arr;
}

/**
 * 通过页面标签
 * @param {Object} ele
 * @return {TypeName} 
 */
function $N(ele){
    if (typeof(ele) == 'string'){
      ele = document.getElementsByName(ele)
      if(!ele||ele.length==0){
    		return null;
      }
      var arr = [];
      for(var i=0;i<ele.length;i++){
      	var e = ele[i];
      	if(e.getAttribute("ztype")=="select"){
      	e = e.parentNode;
      	}
      	Core.attachMethod(e);
      	arr.push(e);
      }
      ele = arr;
    }
    return ele;
}

/**
 * 通过标签name批量获取值
 * @param {Object} ele
 * @return {TypeName} 
 */
function $NV(ele){
	ele = $N(ele);
	if(!ele){
		return null;
	}
	var arr = [];
	for(var i=0;i<ele.length;i++){
		var v = $V(ele[i]);
		if(v!=null){
			arr.push(v);
		}
	}
	return arr.length==0? null:arr;
}


/**
 * 转换Array到String
 * @param {Object} arry
 * @return {TypeName} 
 */
function Arr2String(arry){
  if(arry=='undefined'||arry==null){
     return "";
  }else{
    return arry.join(",");//转换为字符串
  }
}


/**
 * 通过标签name批量回填值
 * @param {Object} ele
 * @param {Object} value
 * @return {TypeName} 
 */
function $NS(ele,value){
	ele = $N(ele);
	if(!ele){
		return;
	}
	if(!ele[0]){
		return $S(ele,value);
	}
	if(ele[0].type=="checkbox"){
		if(value==null){
			value = new Array(4);
		}
		var arr = value;
		if(!isArray(value)){
			arr = value.split(",");
		}
		for(var i=0;i<ele.length;i++){
			for(var j=0;j<arr.length;j++){
				if(ele[i].value==arr[j]){
					$S(ele[i],arr[j]);
					break;
				}
				$S(ele[i],arr[j]);
			}
		}
		return;
	}
	for(var i=0;i<ele.length;i++){
		$S(ele[i],value);
	}
}

/**
 * 获取表单元素
 * @param {Object} ele
 * @return {TypeName} 
 */
function $F(ele){
	if(!ele)
		return document.forms[0];
	else{
		ele = $(ele);
		if(ele&&ele.tagName.toLowerCase()!="form")
			return null;
		return ele;
	}
}



/**
 * 多选框全选
 * @param {Object} ele
 * @param {Object} eles
 */
function selectAll(ele,eles){
	var flag = $V(ele);
	var arr = $N(eles);
	if(arr){
		for(var i=0;i< arr.length;i++){
			arr[i].checked = flag;
	  }
	}
}


var $E = {};

$E.$A = function(attr,ele) {
	ele = ele || this;
	ele = $(ele);
	return ele.getAttribute?ele.getAttribute(attr):null;
}

$E.$T = function(tagName,ele){
	ele = ele || this;
	ele = window.$(ele);
	return window.$T(tagName,ele);
}

$E.visible = function(ele) {
	ele = ele || this;
	ele = $(ele);
	if(ele.style.display=="none"){
		return false;
	}
  return true;
}

$E.toggle = function(ele) {
	ele = ele || this;
	ele = $(ele);
  $E[$E.visible(ele) ? 'hide' : 'show'](ele);
}

$E.toString = function(flag,index,ele) {//flag表示是否显示函数内容
	ele = ele || this;
	var arr = [];
	var i = 0;
	for(var prop in ele){
		if(!index||i>=index){
			var v = null;
			try{v = ele[prop];}catch(ex){}//gecko下可能会报错
			if(!flag){
				if(typeof(v)=="function"){
					v = "function()";
				}else if((""+v).length>100){
					v = (""+v).substring(0,100)+"...";
				}
			}
			arr.push(prop+":"+v);
		}
		i++;
	}
  return arr.join("\n");
}

$E.focusEx = function(ele) {
	ele = ele || this;
	ele = $(ele);
	try{
  	ele.focus();
	}catch(ex){}
}

$E.getForm = function(ele) {
	ele = ele || this;
	ele = $(ele);
	if(isIE){
		ele = ele.parentElement;
	}else if(isGecko){
		ele = ele.parentNode;
	}
	if(!ele){
		return null;
	}
	if(ele.tagName.toLowerCase()=="form"){
		return ele
	}else{
		return $E.GetForm(ele);
	}
}

$E.hide = function(ele) {
	if(!ele){
		ele = this;
	}
	ele = $(ele);
	if(ele.tagName.toLowerCase()=="input"&&ele.type=="button"){
		if(ele.parentElement&&ele.parentElement.getAttribute("ztype")=="zInputBtnWrapper"){
			ele.parentElement.style.display = 'none';
		}
	}
  ele.style.display = 'none';
}

$E.show = function(ele) {
	if(!ele){
		ele = this;
	}
	ele = $(ele);
	if(ele.tagName.toLowerCase()=="input"&&ele.type=="button"){
		if(ele.parentElement&&ele.parentElement.getAttribute("ztype")=="zInputBtnWrapper"){
			ele.parentElement.style.display = '';
		}
	}
  ele.style.display = '';
}

$E.disable = function(ele) {
	ele = ele || this;
	ele = $(ele);
	if(ele.tagName.toLowerCase()=="form"){
		var elements = ele.elements;
		for (var i = 0; i < elements.length; i++) {
		  var element = elements[i];
		  ele.blur();
		  if(ele.hasClassName("zPushBtn")){
			  ele.addClassName("zPushBtnDisabled");
			  if(ele.onclick){
				 ele.onclickbak = ele.onclick;
			  }
			  ele.onclick=null;
		  }else{
			  ele.disabled = 'true';
		  }
		}
	}else{
		if(ele.$A("ztype")&&ele.$A("ztype").toLowerCase()=="select"){
			Selector.setDisabled(ele,true);
		}else if(ele.hasClassName("zPushBtn")){
			ele.addClassName("zPushBtnDisabled");
			if(ele.onclick){
				ele.onclickbak = ele.onclick;
			}
			ele.onclick=null;
		}else{
				ele.addClassName("disabled");
	    	ele.disabled = 'true';
		}
	}
}

$E.enable = function(ele) {
	ele = ele || this;
	ele = $(ele);
	if(ele.tagName.toLowerCase()=="form"){
		var elements = ele.elements;
	    for (var i = 0; i < elements.length; i++) {
	      var element = elements[i];
			if(ele.hasClassName("zPushBtnDisabled")){
				ele.className="zPushBtn";
				if(ele.onclickbak){
					ele.onclick = ele.onclickbak;
				}
			}else{
		    	ele.disabled = '';
			}
	    }
	}else{
		if(ele.$A("ztype")&&ele.$A("ztype").toLowerCase()=="select"){
			Selector.setDisabled(ele,false);
		}else if(ele.hasClassName("zPushBtnDisabled")){
			ele.className="zPushBtn";
			if(ele.onclickbak){
				ele.onclick = ele.onclickbak;
			}
		}else{
			if(ele.hasClassName("disabled")){
				ele.removeClassName("disabled");
			}
	    ele.disabled = '';
		}
	}
}

$E.scrollTo = function(ele) {
	ele = ele || this;
	ele = $(ele);
  var x = ele.x ? ele.x : ele.offsetLeft,
      y = ele.y ? ele.y : ele.offsetTop;
  window.scrollTo(x, y);
}

$E.getDimensions = function(ele){
  ele = ele || this;
  ele = $(ele);
  var dim;
  if(ele.tagName.toLowerCase()=="script"){
  	dim = {width:0,height:0};
  }else if ($E.visible(ele)){
		if(isIE && ele.offsetWidth ==0 && ele.offsetHeight ==0){
			var curStyle=ele.currentStyle;
			if(isBorderBox){
				dim = {width: curStyle.pixelWidth, height: curStyle.pixelHeight};
			}else{
				dim = {width: +curStyle.pixelWidth+parseInt(curStyle.borderLeftWidth)+parseInt(curStyle.borderRightWidth)+parseInt(curStyle.paddingLeft)+parseInt(curStyle.paddingRight),
						height: +curStyle.pixelHeight+parseInt(curStyle.borderTopWidth)+parseInt(curStyle.borderBottomWidth)+parseInt(curStyle.paddingTop)+parseInt(curStyle.paddingBottom)
				};
			}
		}else{
			dim = {width: ele.offsetWidth, height: ele.offsetHeight};
		}
  }else{
	  var style = ele.style;
	  var vis = style.visibility;
	  var pos = style.position;
	  var dis = style.display;
	  style.visibility = 'hidden';
	  style.position = 'absolute';
	  style.display = 'block';
	  var w = ele.offsetWidth;
	  var h = ele.offsetHeight;
	  style.display = dis;
	  style.position = pos;
	  style.visibility = vis;
	  dim = {width: w, height: h};
	}
	return dim;
}
$E.getViewportDimensions = function (win) {
	var win = win || window,
		doc = win.document,
		viewportWidth,
		viewportHeight;
	if(isIE){
		viewportWidth=isQuirks?doc.body.clientWidth :doc.documentElement.clientWidth ;
		viewportHeight=isQuirks?doc.body.clientHeight :doc.documentElement.clientHeight;
	}else{
		viewportWidth=win.innerWidth;
		viewportHeight=win.innerHeight;
	}
	return {width:viewportWidth, height:viewportHeight};
}
$E.getPosition = function(ele){
	ele = ele || this;
	ele = $(ele);
	var doc = ele.ownerDocument;
  if(ele.parentNode===null||ele.style.display=='none'){
    return false;
  }
  var parent = null;
  var pos = [];
  var box;
  if(ele.getBoundingClientRect){//IE,FF3
    box = ele.getBoundingClientRect();
    var scrollTop = Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
    var scrollLeft = Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
    var X = box.left + scrollLeft - doc.documentElement.clientLeft-doc.body.clientLeft;
    var Y = box.top + scrollTop - doc.documentElement.clientTop-doc.body.clientTop;
    return {x:X, y:Y};
  }else if(doc.getBoxObjectFor){ // FF2
    box = doc.getBoxObjectFor(ele);
    var borderLeft = (ele.style.borderLeftWidth)?parseInt(ele.style.borderLeftWidth):0;
    var borderTop = (ele.style.borderTopWidth)?parseInt(ele.style.borderTopWidth):0;
    pos = [box.x - borderLeft, box.y - borderTop];
  }
  if (ele.parentNode) {
    parent = ele.parentNode;
  }else {
    parent = null;
  }
  while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML'){
    pos[0] -= parent.scrollLeft;
    pos[1] -= parent.scrollTop;
    if (parent.parentNode){
      parent = parent.parentNode;
    }else{
      parent = null;
    }
  }
  return {x:pos[0],y:pos[1]}
}

$E.getPositionEx = function(ele){
	ele = ele || this;
	ele = $(ele);
	var pos = $E.getPosition(ele);
	var win = window;
	var sw,sh;
	while(win!=win.parent){
		if(win.frameElement&&win.parent.DataCollection){
			pos2 = $E.getPosition(win.frameElement);
			pos.x += pos2.x;
			pos.y += pos2.y;
		}
		sw = Math.max(win.document.body.scrollLeft, win.document.documentElement.scrollLeft);
		sh = Math.max(win.document.body.scrollTop, win.document.documentElement.scrollTop);
		pos.x -= sw;
		pos.y -= sh;
		if(!win.parent.DataCollection){
			break;
		}
		win = win.parent;
	}
	return pos;
}

$E.getParent = function(tagName,ele){
	ele = ele || this;
	ele = $(ele);
	while(ele){
		if(ele.tagName.toLowerCase()==tagName.toLowerCase()){
			return $(ele);
		}
		ele = ele.parentElement;
	}
	return null;
}

$E.getParentByAttr = function(attrName,attrValue,ele){
	ele = ele || this;
	ele = $(ele);
	while(ele){
		if(ele.getAttribute(attrName)==attrValue){
			return $(ele);
		}
		ele = ele.parentElement;
	}
	return null;
}

$E.nextElement = function(ele){
	ele = ele || this;
	ele = $(ele);
	var x = ele.nextSibling;
	while (x&&x.nodeType!=1){
		x = x.nextSibling;
	}
	return $(x);
}

$E.previousElement = function(ele){
	ele = ele || this;
	ele = $(ele);
	var x = ele.previousSibling;
	while (x&&x.nodeType!=1){
		x = x.previousSibling;
	}
	return $(x);
}

$E.getTopLevelWindow = function(){
	var pw = window;
	while(pw!=pw.parent){
		if(!pw.parent.DataCollection){
			return pw;
		}
		pw = pw.parent;
	}
	return pw;
}

$E.hasClassName = function(className,ele){
	ele = ele || this;
	ele = $(ele);
	return (new RegExp(("(^|\\s)" + className + "(\\s|$)"), "i").test(ele.className));
}

$E.addClassName = function(className,ele,before){
	ele = ele || this;
	ele = $(ele);
  var currentClass = ele.className;
  currentClass = currentClass?currentClass:"";
  if(!new RegExp(("(^|\\s)" + className + "(\\s|$)"), "i").test(currentClass)){
		if(before){
			ele.className = className + ((currentClass.length > 0)? " " : "") + currentClass;
		}else{
			ele.className = currentClass + ((currentClass.length > 0)? " " : "") + className;
		}
  }
  return ele.className;
}

$E.removeClassName = function(className,ele){
	ele = ele || this;
	ele = $(ele);
  var classToRemove = new RegExp(("(^|\\s)" + className + "(?=\\s|$)"), "i");
  ele.className = ele.className.replace(classToRemove, "").replace(/^\s+|\s+$/g, "");
  return ele.className;
}




/**
 * 列表数据操作
 * @param {Object} ele
 */
var DataGrid = {};

DataGrid.onAllCheckClick = function(ele){
	ele = $(ele);
	var strID = ele.id;
	if($(strID+"_AllCheck").checked){
		DataGrid.selectAll(ele);
	}else{
		DataGrid.unselectAll(ele);
	}
}

DataGrid.selectAll = function(ele){
	ele = $(ele);
	var strID = ele.id;
	var arr = $N(strID+"_RowCheck");
	for(var i=0;arr&&i<arr.length;i++){
		if(!arr[i].disabled){
			arr[i].checked = true;
			DataGrid.onSelectorClick(arr[i]);
		}
	}
}

DataGrid.unselectAll = function(ele){
	ele = $(ele);
	var strID = ele.id;
	var arr = $N(strID+"_RowCheck");
	for(var i=0;arr&&i<arr.length;i++){
		if(!arr[i].disabled){
			arr[i].checked = false;
			DataGrid.onSelectorClick(arr[i]);
		}
	}
}

DataGrid.getSelectedValue = function(ele){
	ele = $(ele);
	var strID = ele.id;
	return $NV(strID+"_RowCheck");
}

DataGrid.getSelectedTreeValue = function(ele){
	ele = $(ele);
	return $NV(ele.id+"_TreeRowCheck");
}

DataGrid.getSelectedRows = function(ele){
	ele = $(ele);
	var rs = [];
	for(var i=1;i<ele.rows.length;i++){
		if(ele.rows[i].Selected){
			rs.push(ele.rows[i]);
		}
	}
	return rs;
}

DataGrid.getSelectedData = function(ele){
	ele = $(ele);
	var ds = ele.DataSource;
	var values = [];
	for(var i=1;i<ele.rows.length;i++){
		if(ele.rows[i].Selected){
			values.push(ds.Values[i-1]);
		}
	}
	var dt = new DataTable();
	var cols = [];
	for(var i=0;i<ds.Columns.length;i++){
		cols.push([ds.Columns[i].Name,ds.Columns[i].Type]);
	}
	dt.init(cols,values);
	return dt;
}

DataGrid.select = function(ele,v){
	ele = $(ele);
	var arr = $N(ele.id+"_RowCheck");
	if(!arr){
		return;
	}
	for(var i=0;i<arr.length;i++){
		if(arr[i].value==v){
				arr[i].checked = true;
				DataGrid.onSelectorClick(arr[i]);
				break;
		}
	}
}


DataGrid.SelectedBgColor = "#D8F79D";
DataGrid.MouseOverBgColor = "#EDFBD2";

DataGrid.onSelectorClick = function(ele,evt){
	var tr = $(ele).getParent("tr");
	var dg = $(tr.parentNode.parentNode);
	if(ele.tagName.toLowerCase()=="input"){
		tr.Selected = ele.checked;
	}else{
		tr.Selected = !tr.Selected;
		$(dg.id+"_RowCheck"+tr.rowIndex).checked = tr.Selected;
	}
	DataGrid.onRowSelected(tr,evt);
	var multiSelect = dg.$A("multiSelect")!="false";
	if(evt&&multiSelect){//事件调用，evt为空则为其他函数调用
		tr.SelectorFlag = true;
	}
}

DataGrid.onRowSelected = function(tr,evt){
	if(typeof(tr.DefaultBgColor)=="undefined"){
		tr.DefaultBgColor = tr.style.backgroundColor;
	}
	if(tr.Selected){
		tr.style.backgroundColor = DataGrid.SelectedBgColor;
	}else{
		tr.style.backgroundColor = tr.DefaultBgColor;
	}
}

DataGrid.onRowClick = function(ele,evt){
	evt = getEvent(evt);
	var dg = $(ele.parentNode.parentNode);
	var multiSelect = dg.$A("multiSelect")!="false";
	for(var j=1;j<dg.rows.length;j++){
		var row = dg.rows[j];
		if(evt){
			if(!evt.ctrlKey||!multiSelect){
				if(row!=ele&&row.Selected){
					if(ele.SelectorFlag){
						continue;
					}
					row.Selected = false;
					var chkbox = $(dg.id+"_RowCheck"+row.rowIndex);
					if(chkbox){
						chkbox.checked = false;
					}
					DataGrid.onRowSelected(row);
				}
			}
		}
	}
	if(evt&&!ele.SelectorFlag){
		if(evt.ctrlKey){//按Ctrl点击选中行的其他区域
			if(ele.Selected){
				ele.Selected = false;
				var chkbox = $(dg.id+"_RowCheck"+row.rowIndex);
				if(chkbox){
					chkbox.checked = false;
				}
				DataGrid.onRowSelected(ele);
				ele.SelectorFlag = false;
				return;
			}
		}
	}
	var chkbox = $(dg.id+"_RowCheck"+ele.rowIndex);
	if(chkbox){
		if(evt&&!ele.SelectorFlag){
			chkbox.checked = true;
		}
		ele.Selected = chkbox.checked;
	}else{
		ele.Selected = true;	
	}
	DataGrid.onRowSelected(ele,evt);
	ele.SelectorFlag = false;
}

DataGrid._onContextMenu = function(tr,evt){
	if(!tr.Selected){
		DataGrid.onRowClick(tr,evt);
	}
	evt = getEvent(evt);
	var dg = tr.parentNode.parentNode;
	Menu.close();
	if(dg.onContextMenu){
		dg.onContextMenu(tr,evt);
	}else{//默认菜单为复制文本、导出成Excel、导出全部成Excel
		evt = getEvent(evt);
		var id = dg.id;
		var menu = new Menu();
		menu.Width = 150;
		menu.setEvent(evt);
		var text = evt.srcElement.innerText;
		menu.addItem("复制文本",function(){
			Misc.copyToClipboard(text);
		},"Icons/icon003a2.gif");
		menu.addItem("导出选中行成Excel",function(){
			DataGrid.selectedRowToExcel(id);
		},"Icons/icon003a2.gif");
		menu.addItem("导出本页成Excel",function(){
			DataGrid.toExcel(id);
		},"Icons/icon003a4.gif");
		menu.addItem("导出全部成Excel",function(){
			DataGrid.toExcel(id,true);
		},"Icons/icon003a3.gif");
		menu.show();
	}		
	stopEvent(evt);
}
