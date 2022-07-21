EGS.ZipHandle = EGS.Class({
	_webglCanvas : null,
	_webglContext : null,
	_srcImg : null,
	_id : null,
	isHadeDataHead : false,
	headDataString : "",

	initialize : function()
	{
	},

	getEntries : function(file, onend) 
	{
		zip.createReader(new zip.BlobReader(file), function(zipReader) {
			zipReader.getEntries(onend);
		}, onerror);
	},


	b64toBlob : function(b64Data, contentType, sliceSize)
	{
		contentType = contentType || '';
	    sliceSize = sliceSize || 512;

	    var byteCharacters = atob(b64Data);
	    var byteArrays = [];

	    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
	        var slice = byteCharacters.slice(offset, offset + sliceSize);

	        var byteNumbers = new Array(slice.length);	
	        for (var i = 0; i < slice.length; i++) {
	            byteNumbers[i] = slice.charCodeAt(i);
	        }

	        var byteArray = new Uint8Array(byteNumbers);

	        byteArrays.push(byteArray);
	    }

	    var blob = new Blob(byteArrays, {type: contentType});
	    return blob;
	},

	parser : function(zipData)
	{
		var self = this;
		this.fileData = new Array();
		var fileText = "";
		var len = 0;
		var totalCount=0;


		function handleImageLoaded(filename,self)
		{
			return function(data) {

			         var reader = new window.FileReader();
					 reader.readAsDataURL(data); 
					 reader.onloadend = function() {
				         var base64data = reader.result;                
				         var img = document.createElement("img");
				         var imgLoad = function (url) {
				         	
					        img.src = url;
					        if (img.complete)
					        {
					         	self.fileData[filename] = img;   
					         	len++;
							 	if(len>=totalCount)
							 			self.allDone();
     				    		
					        } else {
					             // img.onload = handleImgLoaded(filename,self,img);
					               img.onload = function () {
						         	self.fileData[filename] = img;   
						         	len++;
								 	if(len>=totalCount)
								 		self.allDone();
					            };
					        };
					    };
					    imgLoad(base64data);
					  };

			      }
		}

		function handleImgLoaded(filename,self,img)
		{

			return function() {
					self.fileData[filename] = img;   			    	
					len++;
					if(len>=totalCount)
						self.allDone();
			      }
		}

		function handleTextLoaded(filename,self)
		{
			return function(text) {
						self.fileText = text;
						self.fileData[filename]=text;			    	

					len++;
					if(len>=totalCount)
						self.allDone();
			      }
		}


		this.getEntries(zipData, function(entries) {

			entries.forEach(function(entry) {
				var filename = entry.filename;
				var f = filename.split(".");
				
				if(f[f.length  - 1] == "jpg" || f[f.length  - 1] == "png" || f[f.length  - 1] == "jpeg" ){
					totalCount++;
			         entry.getData(new zip.BlobWriter("image/" + f[f.length  - 1]), handleImageLoaded(filename,self), function(current, total) {
			      });
			    }
			    else if(f[f.length - 1] == "algorithm")
			    {
			    	totalCount++;
			    	entry.getData(new zip.TextWriter(),handleTextLoaded(filename,self), function(current, total) {
			      });
			    }

			}, function(){console.log("error")});
		});						
	},
	
	allDone : function()
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

		var parserEngine = new EGS.ParserEngine(self.fileText, manager, webglCanvas, webglContext, self.fileData);

		var drawResultFilter = new EGS.DrawResultFilter(webglCanvas, webglContext);
 		manager.addFilter(drawResultFilter);

 		var head = this.isHadeDataHead ? "image/" + self.headDataString : "image/jpeg";
 		var s = webglCanvas.toDataURL(head, 1);
 		webGLEffect(s, null, this._id);
 		
 		manager.releaseAll();

 		self._webglCanvas.width = 0;
 		self._webglCanvas.height = 0;

	},

	imgDataParser : function(picBase, zipData, id)
	{
		this._id = id;
		var self = this;

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
		            self.zipParser(zipData, self._srcImg);
		        } 
		        else 
		        {
		             self._srcImg.onload = function ()
		             {
		                self.zipParser(zipData, self._srcImg);
		        	 };
	        	};
	    };

	    imgLoad(showpic);
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

	zipParser : function(zip)
	{
		var blob = this.b64toBlob(zip);
		this.initCanvas();
   		this.parser(blob);
	}


});