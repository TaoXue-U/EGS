EGS.Redflag = EGS.Class(EGS.Base,
{
	_webglContext : null,
	_webglCanvas : null,
	_vCount : 0,

	_vertexData : null,
	_texCoodData : null,

	_vertexBuffer : null,
	_vertextLocationString : "aPosition",
	_vertexLocation : 0,

	_texCoodBuffer : null,
	_texCoodLocationString : "texCood",
	_texCoodLocation : 1,

	_sTextureLocation : 10,
	_sTextureLocationString : "sTexture",
	_sTextureTex : null,

	_uMVPMatrixLocation : 2,
	_uMVPMatrixLocationString : "uMVPMatrix",
	_uMVPMatrixValue : null,

	_maxLengthLocation : 3,
	_maxLengthLocationString : "maxLength",
	_maxLengthValue : 3.3,

	_startAngleLocation : 4,
	_startAngleLocationString : "startAngle",
	_startAngleValue : 0, 

	_projectionMatrix : null,
	_lookmaxtrix : null,
	_modalMatrix : null,

	_distance : 8,

	_loopFunc : null,
	


	initialize : function(context, canvas)
	{
		this._webglContext = context;
		this._webglCanvas = canvas;

		this.initCode();

		this.setMVPMatrix();

		EGS.Base.initialize.apply(this, arguments);

		// this.render();
		this._loopFunc = this.mainLoop.bind(this);
		this.mainLoop();
	},

	mainLoop : function()
	{
	   this._startAngleValue += 0.2;
	   this.render();
	   this._animationRequest = requestAnimationFrame(this._loopFunc);
	},

	setStartAngleValue : function(v)
	{
		this._startAngleValue = v;
	},

	initCode : function()
	{
		this._vsCode = EGS.requestTextByURL("../Shaders/Redflag/RedFlagVsCode.cpp");
		this._fsCode = EGS.requestTextByURL("../Shaders/Redflag/RedFlagFsCode.cpp");
	},

	setMVPMatrix : function()
	{
		var w = 4, h = 4;
		var z =  2.0;
		this._modalMatrix = EGS.mat4Identity();
		//this._modalMatrix.rotate(Math.PI*0.5, 0, 1, 0);
		this._projectionMatrix = EGS.makePerspective(Math.PI/4, w/h, 1, 10000);
		this._lookmaxtrix = EGS.makeLookAt(0, 0, this._distance, 0, 0, 0, 0, 1, 0);

		var matrix = EGS.mat4Mul(this._lookmaxtrix, this._modalMatrix);
		this._uMVPMatrixValue = EGS.mat4Mul(this._projectionMatrix, matrix);
	},

	render : function()
	{
		var webgl = this._webglContext;
		this._program.useProgram();
		this.updateParamLocation();
		
		webgl.clearColor(0.0, 0.0, 0.0, 1.0);
	    webgl.clear(webgl.COLOR_BUFFER_BIT);
	    webgl.bindBuffer(webgl.ARRAY_BUFFER, this._vertexBuffer);
	    webgl.enableVertexAttribArray(this._vertexLocation);
	    webgl.vertexAttribPointer(this._vertexLocation, 3, webgl.FLOAT, false, 0, 0);

	    webgl.bindBuffer(webgl.ARRAY_BUFFER, this._texCoodBuffer);
	    webgl.enableVertexAttribArray(this._texCoodLocation);
	    webgl.vertexAttribPointer(this._texCoodLocation, 2, webgl.FLOAT, false, 0, 0);

	    webgl.activeTexture(webgl.TEXTURE0);
	    webgl.bindTexture(webgl.TEXTURE_2D, this._sTextureTex.texture);
        webgl.uniform1i(this._sTextureLocation, 0);

	    webgl.drawArrays(webgl.TRIANGLES, 0, this._vCount);
	},
	
	initProgram : function()
	{
		var webgl = this._webglContext;
		var program = new EGS.ShaderProgramOperator(webgl);
		this._program = program;

		program.initWithShaderCode(this._vsCode, this._fsCode);
		
		if(!program.linkShader())
		{
			console.error("Program link Failed!");
			return false;
		}

		this.initData();

		return true;
	},

	bindAttribute : function(locationString, location, data)
	{
		var webgl = this._webglContext;
		var program = this._program;

		program.bindAttributeLocation(locationString, location);
		var buffer = webgl.createBuffer();
		webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
		webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(data), webgl.STATIC_DRAW);

		return buffer;
	},


	initData : function()
	{
		var webgl = this._webglContext;
		var program = this._program;
		this.vertexData();

		var vertexData = this._vertexData;
		this._vertexBuffer = this.bindAttribute(this._vertextLocationString, this._vertexLocation, vertexData);

		var texCoodData = this._texCoodData;
		this._texCoodBuffer =  this.bindAttribute(this._texCoodLocationString,  this._texCoodLocation, texCoodData);

	    var tex1 = document.getElementById("tex1");
	    this.setTexture(tex1);

	    this.setParamsLocation();
	},

	setParamsLocation : function()
	{
		var webgl = this._webglContext;
		var program = this._program;
		this._uMVPMatrixLocation = program.uniformLocation(this._uMVPMatrixLocationString);
		this._maxLengthLocation = program.uniformLocation(this._maxLengthLocationString);
		this._startAngleLocation = program.uniformLocation(this._startAngleLocationString);
	},

	updateParamLocation : function()
	{
		var webgl = this._webglContext;
		webgl.uniformMatrix4fv(this._uMVPMatrixLocation, false, this._uMVPMatrixValue.data);
		webgl.uniform1f(this._maxLengthLocation, this._maxLengthValue);
		webgl.uniform1f(this._startAngleLocation, this._startAngleValue);
	},


	setTexture : function(tex)
	{
		var webgl = this._webglContext;
  		var texture1 = new EGS.Texture2d(this._webglContext);
		texture1.initByImage(tex);

		this._sTextureTex = texture1;
		var uniform = this._program.uniformLocation(this._sTextureLocationString);
		this._sTextureLocation = uniform;
	},

	vertexData : function()
	{
		var WIDTH_SPAN=3.3;
		var cols=12;//列数
    	var rows=cols*3/4;//行数
    	var UNIT_SIZE=WIDTH_SPAN/cols;//每格的单位长度
    	//顶点坐标数据的初始化================begin============================
    	this._vCount=cols*rows*6;//每个格子两个三角形，每个三角形3个顶点    
        var vertices=new Array(this._vCount*3);//每个顶点xyz三个坐标
        var count=0;//顶点计数器
        for(var j=0;j<rows;j++)
        {
        	for(var i=0;i<cols;i++)
        	{        		
        		//计算当前格子左上侧点坐标 
        		var zsx=-UNIT_SIZE*cols/2+i*UNIT_SIZE;
        		var zsy=UNIT_SIZE*rows/2-j*UNIT_SIZE;
        		var zsz=0;
       
        		vertices[count++]=zsx;
        		vertices[count++]=zsy;
        		vertices[count++]=zsz;
        		
        		vertices[count++]=zsx;
        		vertices[count++]=zsy-UNIT_SIZE;
        		vertices[count++]=zsz;
        		
        		vertices[count++]=zsx+UNIT_SIZE;
        		vertices[count++]=zsy;
        		vertices[count++]=zsz;
        		
        		vertices[count++]=zsx+UNIT_SIZE;
        		vertices[count++]=zsy;
        		vertices[count++]=zsz;
        		
        		vertices[count++]=zsx;
        		vertices[count++]=zsy-UNIT_SIZE;
        		vertices[count++]=zsz;
        		        		
        		vertices[count++]=zsx+UNIT_SIZE;
        		vertices[count++]=zsy-UNIT_SIZE;
        		vertices[count++]=zsz; 
        	}
        }

        this._vertexData = vertices;
        this._texCoodData = this.generateTexCoor(cols, rows);
	},

	generateTexCoor : function(bw,bh)
    {
    	var result=new Array(bw*bh*6*2); 
    	var sizew=1.0/bw;//列数
    	var sizeh=0.75/bh;//行数
    	var c=0;
    	for(var i=0;i<bh;i++)
    	{
    		for(var j=0;j<bw;j++)
    		{
    			//每行列一个矩形，由两个三角形构成，共六个点，12个纹理坐标
    			var s=j*sizew;
    			var t=i*sizeh;
    			
    			result[c++]=s;
    			result[c++]=t;
    			
    			result[c++]=s;
    			result[c++]=t+sizeh;
    			
    			result[c++]=s+sizew;
    			result[c++]=t;
    			
    			
    			result[c++]=s+sizew;
    			result[c++]=t;
    			
    			result[c++]=s;
    			result[c++]=t+sizeh;
    			
    			result[c++]=s+sizew;
    			result[c++]=t+sizeh;    			
    		}
    	}
    	return result;
    },







});