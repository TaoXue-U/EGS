String.prototype.Insert=function(index,str){
	return this.substring(0,index)+str+this.substr(index);
}

var textureCache = new Array();
EGS.SourceParser = EGS.Class({
	_webglCanvas : null,
	_webglContext : null,
	_srcImg : null,
	_id : null,
	isHadeDataHead : false,
	headDataString : "",
	_texNameArray : null,
	_idArray : null,
	_index : 0,
	_base64Data : null,
	_idData : null,
	_imgData : null,
	_algorithmDataArray : null,
	_smallSize : 150,

	initialize : function()
	{
		this._base64Data = new Array();
		this._imgData = new Array();
		this._idData = new Array();
		this._algorithmDataArray = new Array();
	},

	initCanvas : function()
	{
		var img = this._srcImg;
		if(this._webglCanvas==null)
			this._webglCanvas = document.createElement("canvas");
		 this._webglCanvas.width = img.width;
   		 this._webglCanvas.height = img.height;

		this._webglContext = this._webglCanvas.getContext("experimental-webgl");		

		if(!this._webglContext)			
		{
			console.log("not support webgl");
		}

		this._webglContext.viewport(0, 0,  this._webglCanvas.width,  this._webglCanvas.height);	
	},

	startSourceParser : function(picBase, idArray, id)
	{
		this._id = id;
		
		var self = this;
		this._idArray = idArray;

		var dataHead = picBase.slice(0, 50);
		var showpic = "";
		var startIndex = dataHead.indexOf("data:image/")
		if(startIndex >= 0)
		{
			showpic = picBase;
			this.isHadeDataHead = true;
			var lastIndex = dataHead.indexOf(";");
			this.headDataString = dataHead.slice(startIndex + 11, lastIndex);
		}
		else
		{
			showpic = "data:image/jpeg;base64,"+ picBase;
			this.isHadeDataHead= false;
		}
   
	   if(this._srcImg == null)
	        this._srcImg = document.createElement("img");

   		var imgLoad = function (url) {
	        self._srcImg.src = url;
	        if (self._srcImg.complete)
	        {
	           self.texParser(idArray);
	        } 
	        else 
	        {
	             self._srcImg.onload = function ()
	             {
	                self.texParser(idArray);
	        	 };
	    	};
	    };

	    imgLoad(showpic);
	},


	texParser : function(idArray)
	{
		//init canvas first 
		this.initCanvas();

		var texArr = new Array();
		for (var i = 0; i < idArray.length; i++) {
			var algorithmString = AlgorithmConfigData[idArray[i]];
			var tmpAlgorithmString = algorithmString.substr(0);

			var data = tmpAlgorithmString.match(/\S+/g);
			for (var j = 0; j < data.length; j++) {
				if(data[j].indexOf(".jpg") >= 0 || data[j].indexOf(".jpeg") >= 0|| data[j].indexOf(".png") >= 0)	
				{
					if(this._srcImg.width < this._smallSize)
					{
						var tempString ="s_" + data[j];
						var index = tmpAlgorithmString.indexOf(data[j]);
						tmpAlgorithmString =  tmpAlgorithmString.Insert(index, "s_");
						texArr.push(tempString);
						continue;
					}
					texArr.push(data[j]);
				}		
			}

			this._algorithmDataArray.push(tmpAlgorithmString);
		}

		texArr = this.unique(texArr);

		if(!texArr.length)
		{
			this.allResourceLoaded();
			return;
		}

		this.loadTextures(texArr);
	},


	allResourceLoaded : function()
	{
		for (var i = 0; i < this._idArray.length; i++) {
			  var algorithmData = this._algorithmDataArray[i];
			  this.processOne(algorithmData);
		};
	},

	processOne : function(algorithmData)
	{
		var self = this;
		var webglCanvas = self._webglCanvas;
		var webglContext = self._webglContext;

	    var img = self._srcImg;
		var texture = new EGS.Texture2d(webglContext);
		texture.initByImage(img);

		var dstTexture = new EGS.Texture2d(webglContext);
		dstTexture.initByImage(img);
		var manager = new EGS.EffectManager(webglCanvas, webglContext);
		manager.initTexture(texture, dstTexture);

		var parserEngine = new EGS.ParserEngine(algorithmData, manager, webglCanvas, webglContext, textureCache);

		var drawResultFilter = new EGS.DrawResultFilter(webglCanvas, webglContext);
 		manager.addFilter(drawResultFilter);

 		var head = this.isHadeDataHead ? "image/" + self.headDataString : "image/jpeg";
 		var s = webglCanvas.toDataURL(head, 1);
 		

 		//this._base64Data[this._idArray[this._index]] = s;
 		this._imgData.push(s);
 		this._idData.push(this._idArray[this._index]);

 		manager.releaseAll();

 		this._index++;
 		if(this._index >= this._idArray.length){
 			self.allDone();
 		}

	},

	allDone : function()
	{
		this._webglCanvas.width = 0;
		this._webglCanvas.height = 0;

		this._base64Data.push(this._idData);
		this._base64Data.push(this._imgData);

		webGLEffect(this._base64Data, null, this._id);
	},

	loadTextures : function(arr)
	{
		var n = 0;
		var self = this;

		if(arr == null || arr.length == 0)
		{
			console.error("texture array error");
			return;
		}

	    var imgLoad = function (filename) {
	    	
	    	var url = null;
	    	if(self._srcImg.width >= self._smallSize)
		    	url = "/images2/lib/img/" + filename;
		    else 
		    	url = ResourceData[filename];


	    	var img = document.createElement("img");
	        img.src = url;

	        if (img.complete)
	        {
	           	n++;
	           	textureCache[filename] = img;
	           	if(n == arr.length)
	           		self.allResourceLoaded();
	        } 
	        else 
	        {
	             img.onload = function ()
	             {
	             	n++;
	               	 textureCache[filename] = img;
	               	 if(n == arr.length)
	               	 	self.allResourceLoaded();
	        	 };

	        	 img.onerror = function(){
	        	  	console.error("load texture" + n + "failed");
	        	 }
        	};
	    };

	    for (var i = 0; i < arr.length; i++) {
	    	if(textureCache[arr[i]])
	    	{
	    		n++;
	    		
	    		if(n == arr.length)
	    		{
	    			this.allResourceLoaded();
	    			return;
	    		}
	    		continue;
	    	}
	    	imgLoad(arr[i]);
	    };

	},



	 unique : function(arr)
	 {
	    var result = [], hash = {};
	    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
	        if (!hash[elem]) {
	            result.push(elem);
	            hash[elem] = true;
	        }
	    }
	    return result;
	 },
});



