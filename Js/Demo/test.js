EGS.Earth = EGS.Class(EGS.Base, 
{
	_colorBuffer : null,
	_v3ColorIndex : 1,
	_loopFunc : null,
	_animationRequest : null,
	_color : null,
	_isDesc : false,
	_projectionMatrix : null,
	earthRotationMatrix : null,
	lastMouseX : 0,
	lastMouseY : 0,
	_loopFunc : null,
	_meshIndexVBO : null,
	_meshIndexSize : 0,
	_vertexTextureCoordData : null,
	_vertexTextureCoordDataBuffer : null,
	_vertexTextureCoordDataIndex : 2,
	_sampleTexIndex : 3,
	_texture : null,
	_img : null,

	_vsCode : "uniform mat4 modelMatrix;uniform mat4 lookMatrix;uniform mat4 proMaxtix;attribute vec3 v3Position;attribute vec3 av3Color;varying vec3 vv3Color;attribute vec2 aTextureCoord;varying vec2 vTextureCoord;void main(void){vv3Color = av3Color;vTextureCoord = aTextureCoord;gl_Position =  proMaxtix *(lookMatrix*modelMatrix)* vec4(v3Position, 1.0);}",
	_fsCode : "precision mediump float;varying vec3 vv3Color;uniform sampler2D uSampler;varying vec2 vTextureCoord;void main(void){ vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)); gl_FragColor = vec4(textureColor.rgb, textureColor.a);}",

	initialize : function(context, canvas, img)
	{
		this._img = img ;
		this._loopFunc = this.mainLoop.bind(this);
		context.enable(context.DEPTH_TEST);
		this._color = new EGS.Vec3(1, 1, 1);
		EGS.Base.initialize.apply(this, arguments);
		this.initMatrix();
		this.onCanvasResize();
		this.handlePos(300, 200);
		this.mainLoop();
	},

	initPostionData : function()
	{
         this.initBuffers(0, 5);
	},


	initData : function()
	{
	  this._program.bindAttributeLocation("av3Color", this._v3ColorIndex);
      var jsArrayColor = EGS.clone(this._vertexData);
      // for (var i = jsArrayColor.length - 1; i >= 0; i--) {
      // 	jsArrayColor[i] = Math.abs(jsArrayColor[i]);
      // };

      this._colorBuffer = webgl.createBuffer();
      webgl.bindBuffer(webgl.ARRAY_BUFFER, this._colorBuffer);
      webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(jsArrayColor), webgl.STATIC_DRAW);

      this._program.bindAttributeLocation("aTextureCoord", this._vertexTextureCoordDataIndex);
      this._vertexTextureCoordDataBuffer = webgl.createBuffer();
      webgl.bindBuffer(webgl.ARRAY_BUFFER, this._vertexTextureCoordDataBuffer);
      webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(this._vertexTextureCoordData), webgl.STATIC_DRAW);

      var tex = document.getElementById("samptexImg");
      this._texture = new EGS.Texture2d(this._webglContext);
	  this._texture.initByImage(tex);		
	  this._sampleTexIndex = this._program.uniformLocation("uSampler");
	},

	onCanvasResize : function()
	{
		var w = 4, h = 4;
		var z =  2.0;
		this._projectionMatrix = EGS.makePerspective(Math.PI/4, w/h, 1, 100);
		var lookmaxtrix = EGS.makeLookAt(0, 0, 6, 0, 0, 0, 0, 1, 0);
		this._program.useProgram();
		this._program.setUniformMat4("proMaxtix", false, this._projectionMatrix.data);
		this._program.setUniformMat4("lookMatrix", false, lookmaxtrix.data);
	},

	render : function()
	{
		this._program.useProgram();
		this._program.setUniformMat4("modelMatrix", false, this.earthRotationMatrix);

		var webgl = this._webglContext;
		webgl.clearColor(0.0, 0.0, 0.0, 1.0);
	    webgl.clear(webgl.COLOR_BUFFER_BIT);
	    webgl.bindBuffer(webgl.ARRAY_BUFFER, this._vertexBuffer);
	    webgl.enableVertexAttribArray(this._v3PositionIndex);
	    webgl.vertexAttribPointer(this._v3PositionIndex, 3, webgl.FLOAT, false, 0, 0);
	    
	    webgl.bindBuffer(webgl.ARRAY_BUFFER, this._colorBuffer);
	    webgl.enableVertexAttribArray(this._v3ColorIndex);
	    webgl.vertexAttribPointer(this._v3ColorIndex, 3, webgl.FLOAT, false, 0, 0);

	    webgl.bindBuffer(webgl.ARRAY_BUFFER, this._vertexTextureCoordDataBuffer);
	    webgl.enableVertexAttribArray(this._vertexTextureCoordDataIndex);
	    webgl.vertexAttribPointer(this._vertexTextureCoordDataIndex, 2, webgl.FLOAT, false, 0, 0);

	    this._texture.bindToIndex(0);
	    this._webglContext.uniform1i(this._sampleTexIndex, 0);

	    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, this._meshIndexVBO);
	    webgl.drawElements(webgl.TRIANGLES, this._meshIndexSize, webgl.UNSIGNED_SHORT, 0);
	},

	initMatrix : function()
	{
       	this.earthRotationMatrix = mat4.create();
        mat4.identity(this.earthRotationMatrix);
        this._program.useProgram();
		this._program.setUniformMat4("modelMatrix", false, this.earthRotationMatrix);
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
        mat4.multiply(newRotateMatrix, this.earthRotationMatrix, this.earthRotationMatrix);

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

	initBuffers : function(zoom, blockIndex) 
	{
		this._program.bindAttributeLocation("av3Color", this._v3ColorIndex);
		this._program.bindAttributeLocation("aTextureCoord", this._vertexTextureCoordDataIndex);
	    var latitudeBands = 60;
	    var longitudeBands = 60;
	    var radius = 2;

	    var vertexPositionData = [];
	    var vertexTextureCoordData = [];
	    var normalData = [];

	    var pow = Math.pow(2, zoom);
	    var xIndex = blockIndex % pow;
	    var yIndex = parseInt(blockIndex / pow);

	    var latitudeStart = yIndex * latitudeBands / pow;
	    var latitudeEnd = (yIndex + 1) * latitudeBands / pow;
	    var longitudeStart = xIndex * longitudeBands / pow;
	    var longitudeEnd = (xIndex + 1) * longitudeBands / pow;

	    for (var latN = latitudeStart; latN <= latitudeEnd; latN++) {
	        var theta = latN * Math.PI / latitudeBands;
	        var sinTheta = Math.sin(theta);
	        var cosTheta = Math.cos(theta);
	        for (var lonN = longitudeStart; lonN <= longitudeEnd; lonN++) {
	            var phi = lonN * 2 * Math.PI / longitudeBands;
	            var sinPhi = Math.sin(phi);
	            var cosPhi = Math.cos(phi);

	            var x = cosPhi * sinTheta;
	            var y = cosTheta;
	            var z = sinPhi * sinTheta;
	            var u = 1 - ((latN - latitudeStart) * 1.0 / (longitudeEnd - longitudeStart));
	            var v = 1 - ((lonN - longitudeStart) * 1.0 / (latitudeEnd - latitudeStart));

	            normalData.push(x);
	            normalData.push(y);
	            normalData.push(z);
	            vertexPositionData.push(radius * x);
	            vertexPositionData.push(radius * y);
	            vertexPositionData.push(radius * z);
	            vertexTextureCoordData.push(v);
	            vertexTextureCoordData.push(u);
	        }
	    }

	    var indexData = [];
	    for (var latN = latitudeStart; latN < latitudeEnd; latN++) {
	        for (var lonN = longitudeStart; lonN < longitudeEnd; lonN++) {
	            var first = ((latN - latitudeStart) * (longitudeBands / pow + 1)) + (lonN - longitudeStart);
	            var second = first + longitudeBands / pow + 1;

	            indexData.push(first);
	            indexData.push(second);
	            indexData.push(first + 1);

	            indexData.push(second);
	            indexData.push(second + 1);
	            indexData.push(first + 1);
	        }
	    }

	    this._vertexData = vertexPositionData;
	    var gl = this._webglContext;

	    this._meshIndexVBO = gl.createBuffer();
	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._meshIndexVBO);
	    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
	    this._meshIndexSize = indexData.length;

	    this._vertexTextureCoordData = vertexTextureCoordData;


	},

	
}); 