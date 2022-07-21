EGS.SceneDemo = EGS.Class(EGS.Base,
{
	_colorBuffer : null,
	_v3ColorIndex : 1,
	_loopFunc : null,
	_animationRequest : null,
	_color : null,
	_isDesc : false,
	_projectionMatrix : null,
	spriteModelMatrix : null,
	lastMouseX : 0,
	lastMouseY : 0,
	_loopFunc : null,
	_meshIndexVBO : null,
	_meshIndexSize : 0,
	_lookmaxtrix : null,
	_distance : 1.5, 
	_sampleTexIndex : 3,
	_texture : null,

	_vsCode : "uniform mat4 modelMatrix;uniform mat4 lookMatrix;uniform mat4 proMaxtix;attribute vec3 v3Position;uniform vec2 spriteflip;varying vec2 vTextureCoord;void main(void){		vTextureCoord = (v3Position.xy *spriteflip  + 1.0) / 2.0; 	gl_Position =  proMaxtix *(lookMatrix*modelMatrix)* vec4(v3Position, 1.0);}",
	_fsCode : "precision mediump float;uniform sampler2D sTexture;varying vec2 vTextureCoord;void main(void){	vec4 color = texture2D(sTexture, vTextureCoord); gl_FragColor = color;}",


	initialize : function(context, canvas)
	{
		this._loopFunc = this.mainLoop.bind(this);
		context.enable(context.DEPTH_TEST);
		this._color = new EGS.Vec3(1, 1, 1);
		EGS.Base.initialize.apply(this, arguments);
		this.initMatrix();
		this.onCanvasResize();
		this.handlePos(0, 0);
		this.mainLoop();
	},

	initPostionData : function()
	{
        // this.initBuffers(0, 5);
        this._vertexData =	[-1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0];
	},

	setCameraDistance : function(v)
	{
		this._distance = v;
		this.setLook();
	},

	getCameraDistance : function()
	{
		return this._distance;
	},

	setLook : function()
	{
		this._lookmaxtrix = EGS.makeLookAt(0, 0, this._distance, 0, 0, 0, 0, 1, 0);
	},


	initData : function()
	{

		  var backtex = document.getElementById("back");
  	      this._backTexture = new EGS.Texture2d(this._webglContext);
		  this._backTexture.initByImage(backtex);	

		  var downtex = document.getElementById("down");
  	      this._downTexture = new EGS.Texture2d(this._webglContext);
		  this._downTexture.initByImage(downtex);	

		  var frontTex = document.getElementById("front");
  	      this._frontTexture = new EGS.Texture2d(this._webglContext);
		  this._frontTexture.initByImage(frontTex);

  		  var lefttex = document.getElementById("left");
  	      this._leftTexture = new EGS.Texture2d(this._webglContext);
		  this._leftTexture.initByImage(lefttex);	

  		  var righttex = document.getElementById("right");
  	      this._rightTexture = new EGS.Texture2d(this._webglContext);
		  this._rightTexture.initByImage(righttex);

  		  var uptex = document.getElementById("up");
  	      this._upTexture = new EGS.Texture2d(this._webglContext);
		  this._upTexture.initByImage(uptex);			

		  this._sampleTexIndex = this._program.uniformLocation("sTexture");
	},

	onCanvasResize : function()
	{
		var w = 4, h = 4;
		var z =  2.0;
		this._projectionMatrix = EGS.makePerspective(Math.PI/4, w/h, 1, 100);
		this._lookmaxtrix = EGS.makeLookAt(0, 0, 1.5, 0, 0, 0, 0, 1, 0);
		this._program.useProgram();
		this._program.setUniformMat4("proMaxtix", false, this._projectionMatrix.data);
		this._program.setUniformMat4("lookMatrix", false, this._lookmaxtrix.data);
	},

	render : function()
	{
		this._program.useProgram();
		this._program.setUniformMat4("lookMatrix", false, this._lookmaxtrix.data);

		var webgl = this._webglContext;

		webgl.clearColor(0.0, 0.0, 0.0, 1.0);
	    webgl.clear(webgl.COLOR_BUFFER_BIT);
	    webgl.bindBuffer(webgl.ARRAY_BUFFER, this._vertexBuffer);
	    webgl.enableVertexAttribArray(this._v3PositionIndex);
	    webgl.vertexAttribPointer(this._v3PositionIndex, 3, webgl.FLOAT, false, 0, 0);

		this.setCanvasflip(false, true);
	    this._rightTexture.bindToIndex(0);
	    this._webglContext.uniform1i(this._sampleTexIndex, 0);

		var newMat1 = mat4.create();
		mat4.identity(newMat1);
		mat4.rotate(this.spriteModelMatrix, this.degToRad(90), [0, 1, 0], newMat1);
		mat4.translate(newMat1, [0.0, 0.0, 1.0], newMat1);
		this._program.setUniformMat4("modelMatrix", false, newMat1);
		webgl.drawArrays(this._webglContext.TRIANGLE_STRIP, 0, 4);	

		this.setCanvasflip(true, true);
		this._leftTexture.bindToIndex(0);
	    this._webglContext.uniform1i(this._sampleTexIndex, 0);

		var newMat2 = mat4.create();
		mat4.identity(newMat2);
		mat4.rotate(this.spriteModelMatrix, this.degToRad(90), [0, 1, 0], newMat2);
		mat4.translate(newMat2, [0.0, 0.0, -1.0], newMat2);
		this._program.setUniformMat4("modelMatrix", false, newMat2);
		webgl.drawArrays(this._webglContext.TRIANGLE_STRIP, 0, 4);	

		this.setCanvasflip(true, false);
		this._downTexture.bindToIndex(0);
	    this._webglContext.uniform1i(this._sampleTexIndex, 0);
		var newMat3 = mat4.create();
		mat4.identity(newMat3);
		mat4.rotate(this.spriteModelMatrix, this.degToRad(90), [1, 0, 0], newMat3);
		mat4.translate(newMat3, [0.0, 0.0, 1.0], newMat3);
		this._program.setUniformMat4("modelMatrix", false, newMat3);
		webgl.drawArrays(this._webglContext.TRIANGLE_STRIP, 0, 4);	

		this.setCanvasflip(true, true);
		this._upTexture.bindToIndex(0);
	    this._webglContext.uniform1i(this._sampleTexIndex, 0);
		var newMat4 = mat4.create();
		mat4.identity(newMat4);
		mat4.rotate(this.spriteModelMatrix, this.degToRad(90), [1, 0, 0], newMat4);
		mat4.translate(newMat4, [0.0, 0.0, -1.0], newMat4);
		this._program.setUniformMat4("modelMatrix", false, newMat4);
		webgl.drawArrays(this._webglContext.TRIANGLE_STRIP, 0, 4);

		this.setCanvasflip(true, true);
		this._backTexture.bindToIndex(0);
	    this._webglContext.uniform1i(this._sampleTexIndex, 0);
		var newMat5 = mat4.create();
		mat4.identity(newMat5);
		mat4.translate(this.spriteModelMatrix, [0.0, 0.0, -1.0], newMat5);
		this._program.setUniformMat4("modelMatrix", false, newMat5);
	    webgl.drawArrays(this._webglContext.TRIANGLE_STRIP, 0, 4);	

	    this.setCanvasflip(false, true);
	    this._frontTexture.bindToIndex(0);
	    this._webglContext.uniform1i(this._sampleTexIndex, 0);
		var newMat6 = mat4.create();
		mat4.identity(newMat6);
		mat4.translate(this.spriteModelMatrix, [0.0, 0.0, 1.0], newMat6);
		this._program.setUniformMat4("modelMatrix", false, newMat6);
	    webgl.drawArrays(this._webglContext.TRIANGLE_STRIP, 0, 4);	
	},

	initMatrix : function()
	{
       	this.spriteModelMatrix = mat4.create();
        mat4.identity(this.spriteModelMatrix);
        this._program.useProgram();
		this._program.setUniformMat4("modelMatrix", false, this.spriteModelMatrix);
	},

	degToRad : function(degrees) {
    	return degrees * Math.PI / 180;
	},

	handlePos : function(newX, newY) 
     {
        var dx = newX - this.lastMouseX;
        var newRotateMatrix = mat4.create();
        mat4.identity(newRotateMatrix);
        mat4.rotate(newRotateMatrix, this.degToRad(dx / 10.0), [0, 1, 0]);
        var dy = newY - this.lastMouseY;
        mat4.rotate(newRotateMatrix, this.degToRad(dy / 10.0), [1, 0, 0]);
        mat4.multiply(newRotateMatrix, this.spriteModelMatrix, this.spriteModelMatrix);

        this.lastMouseX = newX;
        this.lastMouseY = newY;
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

	setCanvasflip : function(v1, v2)
	{
		var f1 = v1 ? -1.0 : 1.0;
		var f2 = v2 ? -1.0 : 1.0;

		this._program.useProgram();
		this._program.setUniform2f("spriteflip", f1, f2);
	},

	
});