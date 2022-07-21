EGS.NormalMap = EGS.Class(EGS.Base,
{
	_vertexBuffer : null,		//顶点buffer
	_vertexLocation : 0, 		//顶点管道
	_vertextLocationString : "aPosition",//顶点shader变量

	_texCoodBuffer : null,		//
	_texCoodLocation : 1,
	_texCoodLocationString : "aTexCoor",

	_aNormalBuffer : null,
	_aNormalLocation : 2,
	_aNormalLocationString : "aNormal",

	_tNormalBuffer : null,
	_tNormalLocation : 3,
	_tNormalLocationString : "tNornal",

	_vertexIndexBuffer : null,
	_indexLength : 0,

	_uMVPMatrixLocation : 5,
	_uMVPMatrixLocationString : "uMVPMatrix",
	_uMVPMatrixValue : null,


	_sTexturewgLocation : 6,
	_sTexturewgLocationString : "sTextureWg",
	_sTexturewgTex : null,

	_sTextureNormalLocation : 10,
	_sTextureNormalLocationString : "sTextureNormal",
	_sTextureNormalTex : null,
	

	_uMMatrixLocation : 7,
	_uMMatrixLocationString : "uMMatrix",
	_uMMatrixValue : null,

	_uCameraLocation : 8,
	_uCameraLocationString : "uCamera",
	_uCameraValue : null,

	_uLightLocationSunLocation : 9,
	_uLightLocationSunString : "uLightLocationSun",
	_uLightLocationSunValue : null,

	startIndex : 0,
	_projectionMatrix : null,
	_lookmaxtrix : null,
	_modalMatrix : null,

	_distance : 8, 

	_loopFunc : null,

	_isOpenBlend : false,

	initialize : function(context, canvas)
	{
		context.enable(context.DEPTH_TEST);
		this.init();
		this.initCode();
		EGS.Base.initialize.apply(this, arguments);

		this.mainLoop();
	},

	initCode : function()
	{
		this._vsCode = EGS.requestTextByURL("../Shaders/NormalMap/NormalMapVsShader.txt");
		this._fsCode = EGS.requestTextByURL("../Shaders/NormalMap/NormalMapFsShader.txt");
	},

	init : function()
	{
		this._loopFunc = this.mainLoop.bind(this);
		this._uCameraValue = new EGS.Vec3(0, 0, 0);
		this._uLightLocationSunValue = new EGS.Vec3(0,0,0 );
		this.initParams();
	},


	initParams : function()
	{
		this.setMVPMatrix();
		this.setMMatrix();
		this.setCamera(0, 0, this._distance);
		this.setLight(100, 0, 100);
	},

	render : function()
	{
		this._program.useProgram();
		this.updateParamLocation();

		var webgl = this._webglContext;
		webgl.clearColor(0.0, 0.0, 0.0, 1.0);
	    webgl.clear(webgl.COLOR_BUFFER_BIT);
	    webgl.bindBuffer(webgl.ARRAY_BUFFER, this._vertexBuffer);
	    webgl.enableVertexAttribArray(this._vertexLocation);
	    webgl.vertexAttribPointer(this._vertexLocation, 3, webgl.FLOAT, false, 0, 0);

	    webgl.bindBuffer(webgl.ARRAY_BUFFER, this._texCoodBuffer);
	    webgl.enableVertexAttribArray(this._texCoodLocation);
	    webgl.vertexAttribPointer(this._texCoodLocation, 3, webgl.FLOAT, false, 0, 0);

	    webgl.bindBuffer(webgl.ARRAY_BUFFER, this._aNormalBuffer);
	    webgl.enableVertexAttribArray(this._aNormalLocation);
	    webgl.vertexAttribPointer(this._aNormalLocation, 3, webgl.FLOAT, false, 0, 0);

	     webgl.bindBuffer(webgl.ARRAY_BUFFER, this._tNormalBuffer);
	    webgl.enableVertexAttribArray(this._tNormalLocation);
	    webgl.vertexAttribPointer(this._tNormalLocation, 3, webgl.FLOAT, false, 0, 0);

	    webgl.activeTexture(webgl.TEXTURE0);
	    webgl.bindTexture(webgl.TEXTURE_2D, this._sTexturewgTex.texture);
        webgl.uniform1i(this._sTexturewgLocation, 0);

	    webgl.activeTexture(webgl.TEXTURE1);
	    webgl.bindTexture(webgl.TEXTURE_2D, this._sTextureNormalTex.texture);
        webgl.uniform1i(this._sTextureNormalLocation, 1);
	    
        webgl.enable(webgl.BLEND);//首先要启用混合
	    webgl.blendEquation(webgl.FUNC_ADD);//叠加方式
	    webgl.blendFunc(webgl.SRC_ALPHA, webgl.DST_COLOR);

	    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, this._vertexIndexBuffer);
	    webgl.drawElements(webgl.TRIANGLES, this._indexLength, webgl.UNSIGNED_SHORT, 0);
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

		var vertexData = EGS.TeapotModel.positions;
	  	for (var i = 0; i < vertexData.length; i++) {
             vertexData[i] /= 20.0;
         };
		this._vertexBuffer = this.bindAttribute(this._vertextLocationString, this._vertexLocation, vertexData);

		var texCoodData = EGS.TeapotModel.texCoords;
		this._texCoodBuffer =  this.bindAttribute(this._texCoodLocationString,  this._texCoodLocation, texCoodData);

		var aNormalData = EGS.TeapotModel.normals;
		this._aNormalBuffer = this.bindAttribute(this._aNormalLocationString,  this._aNormalLocation, aNormalData);

		var tNormalData = EGS.TeapotModel.tangents;
		this._tNormalBuffer =  this.bindAttribute(this._tNormalLocationString,  this._tNormalLocation, tNormalData);

		var indexData = EGS.TeapotModel.indices;
	    this._vertexIndexBuffer = webgl.createBuffer();
	    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, this._vertexIndexBuffer);
	    webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), webgl.STATIC_DRAW);
	    this._indexLength = indexData.length;

	    this.setParamsLocation();
	    
	    var tex1 = document.getElementById("tex1");
	    this.setTextureNormal(tex1);

	    var tex2 = document.getElementById("tex2");
	    this.setTextureWg(tex2);
	      
	},

	setParamsLocation : function()
	{
		var webgl = this._webglContext;
		var program = this._program;
		this._uMVPMatrixLocation = program.uniformLocation(this._uMVPMatrixLocationString);
		this._uMMatrixLocation = program.uniformLocation(this._uMMatrixLocationString);
		this._uCameraLocation = program.uniformLocation(this._uCameraLocationString);
		this._uLightLocationSunLocation = program.uniformLocation(this._uLightLocationSunString);

	},

	updateParamLocation : function()
	{
		var webgl = this._webglContext;
		webgl.uniformMatrix4fv(this._uMVPMatrixLocation, false, this._uMVPMatrixValue.data);
		webgl.uniformMatrix4fv(this._uMMatrixLocation, false, this._uMMatrixValue.data);
		webgl.uniform3f(this._uCameraLocation, this._uCameraValue.data[0], this._uCameraValue.data[1], this._uCameraValue.data[2]);
		webgl.uniform3f(this._uLightLocationSunLocation, this._uLightLocationSunValue.data[0], this._uLightLocationSunValue.data[1], this._uLightLocationSunValue.data[2]);
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

	setMMatrix : function()
	{
		this._uMMatrixValue = EGS.mat4Identity();
		//this._uMMatrixValue.rotate(180/180*Math.PI, 0, 1, 0);
	},

	setCamera : function(v1, v2, v3)
	{
		this._uCameraValue.data[0] = v1;
		this._uCameraValue.data[1] = v2;
		this._uCameraValue.data[2] = v3;
	},

	setLight : function(v1, v2, v3)
	{
		this._uLightLocationSunValue.data[0] = v1;
		this._uLightLocationSunValue.data[1] = v2;
		this._uLightLocationSunValue.data[2] = v3;
	},

	setTextureWg : function(tex)
	{
		var webgl = this._webglContext;
  		var texture = new EGS.Texture2d(this._webglContext);
		texture.initByImage(tex);

		this._sTexturewgTex = texture;
		var uniform = this._program.uniformLocation(this._sTexturewgLocationString);
		this._sTexturewgLocation = uniform;

	},

	setTextureNormal : function(tex)
	{
		var webgl = this._webglContext;
  		var texture1 = new EGS.Texture2d(this._webglContext);
		texture1.initByImage(tex);

		this._sTextureNormalTex = texture1;
		var uniform = this._program.uniformLocation(this._sTextureNormalLocationString);
		this._sTextureNormalLocation = uniform;
	},

	degToRad : function(degrees) {
    	return degrees * Math.PI / 180;
	},

	handlePos : function(newX, newY) 
     {
        var dx = newX - this.lastMouseX;
        var newRotateMatrix = EGS.mat4Identity();
        newRotateMatrix.rotate(this.degToRad(dx / 5.0), 0, 1, 0);
        var dy = newY - this.lastMouseY;
        newRotateMatrix.rotate(this.degToRad(dy / 5.0), 1, 0, 0);
        this._modalMatrix =  EGS.mat4Mul(newRotateMatrix, this._modalMatrix);
       // this._uMMatrixValue = this._modalMatrix;

        this._uMMatrixValue =  EGS.mat4Mul(newRotateMatrix, this._uMMatrixValue);

        this.lastMouseX = newX;
        this.lastMouseY = newY;

		this.updateMVPMatrix();
    },

    setLastPos : function(lastX, lastY)
    {
    	this.lastMouseX = lastX;
    	this.lastMouseY = lastY;
    },

    mainLoop : function() {
       this.render();
	   this._animationRequest = requestAnimationFrame(this._loopFunc);
	},

	updateMVPMatrix : function()
	{
		var matrix = EGS.mat4Mul(this._lookmaxtrix, this._modalMatrix);
		this._uMVPMatrixValue = EGS.mat4Mul(this._projectionMatrix, matrix);
	},

	getCameraDistance : function()
	{
		return this._distance;
	},

	setBlendOpen : function(isBlendOpen)
	{
		this._isOpenBlend = isBlendOpen;
	},

	getBlendOpended : function()
	{
		return this._isOpenBlend;
	},



});