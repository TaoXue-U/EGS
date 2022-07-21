EGS.Sprite2D = EGS.Class(
{
	_texture : null,
	_rotate : 0,
	_pos : null,
	_scale : null, 
	_z  : 0,
	_hotspot : null,
	_alpha : 1,
	_projectionMaxtrix : null,
	_halfTexSize : null,
	_translation : null,
	_canvasflip : null,
	_spriteflip : null,
	_program : null,
	_webglCanvas : null,
	_webglContext : null,


	_posLocation : null,
	_rotateLocation : null,
	_scaleLocation : null,
	_translationLocation : null,
	_hotspotLocation : null,
	_canvasflipLocation : null,
	_spriteflipLocation : null,
	_alphaLocation : null,
	_zLocation : null,
	_vertexBuffer : null,
	_halfTexLoc : null,
	_projectionLocation : null,

	ProjectionMatrixName : "m4Projection",
	HalfTexSizeName : "v2HalfTexSize",
	RotationName : "rotation",
	ScalingName : "v2Scaling",
	TranslationName : "v2Translation",
	HotspotName : "v2Hotspot",
	AlphaName : "alpha",
	canvasflipName : "canvasflip",
	spriteflipName : "spriteflip",
	zName : "zIndex",

	srcTextureString : "sTexture",
	startIndex : 0,
	v3PositionIndex : null,
	_sampleTexIndex : null,


	initialize : function(canvas, context)
	{
		this.initData();

		this._webglCanvas = canvas;
		if(!this._webglCanvas )
		{
			console.error("Sprite2D canvas params invaliad");
			return;
		}
		this._webglContext = context || this._webglCanvas.getContext("webgl") || this._webglCanvas.getContext("experimental-webgl");


		this.initShaderFromString();

		this.onCanvasResize();

		this.setCanvasflip(false, true);
		this.setSpriteflip(false, false);

	},

	initData : function()
	{
		this._scale = new EGS.Vec2(1, 1);
		this._pos = new EGS.Vec2(0,0);
		this._hotspot = new EGS.Vec2(0,0);

	},
	initShaderFromString : function()
	{
		var vertexCode  = "attribute vec2 aPosition;varying vec2 vTextureCoord;uniform mat4 m4Projection;uniform vec2 v2HalfTexSize;uniform float rotation;uniform vec2 v2Scaling;uniform vec2 v2Translation;uniform vec2 v2Hotspot;uniform vec2 canvasflip;uniform vec2 spriteflip;uniform float zIndex;mat3 mat3ZRotation(float rad){float cosRad = cos(rad);float sinRad = sin(rad);return mat3(cosRad,sinRad,0.0,-sinRad,cosRad,0.0,0.0,0.0,1.0);}void main(){vTextureCoord = (aPosition.xy * spriteflip + 1.0) / 2.0;vec3 pos = mat3ZRotation(rotation) * vec3((aPosition - v2Hotspot) * v2HalfTexSize,zIndex);pos.xy = (pos.xy + v2Hotspot * v2HalfTexSize);pos.xy *= v2Scaling;pos.xy += v2Translation - v2Scaling * v2HalfTexSize * v2Hotspot;gl_Position = m4Projection * vec4(pos,1.0);gl_Position.xy *= canvasflip;}";
		var fragmentCode = "precision mediump float;varying vec2 vTextureCoord;uniform sampler2D sTexture;uniform float alpha;void main(){gl_FragColor = texture2D(sTexture,vTextureCoord);gl_FragColor.a *= alpha;gl_FragColor.rgb *= gl_FragColor.a;}";
		return this.initPorgram(vertexCode, fragmentCode);
	},



	onCanvasResize : function()
	{
		var w = this._webglCanvas.width, h = this._webglCanvas.height;
		var z = Math.max(w, h) * 2.0;
		this._projectionMatrix = EGS.makeOrtho(-w/2, w/2, -h/2, h/2, -z, z);
		this._program.useProgram();
		this._program.setUniformMat4(this.ProjectionMatrixName, false, this._projectionMatrix.data);
	},

	initPorgram : function(vsCode, fsCode)
	{
		var webglContext = this._webglContext;
		var program = new EGS.ShaderProgramOperator(webglContext); 
		this._program = program;

		
		program.initWithShaderCode(vsCode, fsCode);
		program.bindAttributeLocation("v3Position", this.v3PositionIndex);


		if(!program.linkShader())
		{
			console.error("Program link Failed!-");
			return false;
		}
		program.useProgram();

	    var verticesData = [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0];
		var buffer = webglContext.createBuffer();
		this._vertexBuffer = buffer;
		webglContext.bindBuffer(webglContext.ARRAY_BUFFER, buffer);
		webglContext.bufferData(webglContext.ARRAY_BUFFER, new Float32Array(verticesData), webglContext.STATIC_DRAW);
		
		this._rotateLocation = program.uniformLocation(this.RotationName);
		this._scaleLocation = program.uniformLocation(this.ScalingName);
		this._translationLocation = program.uniformLocation(this.TranslationName);
		this._hotspotLocation = program.uniformLocation(this.HotspotName);

		this._zLocation = program.uniformLocation(this.zName);
		this._alphaLocation = program.uniformLocation(this.AlphaName);

		return true;
	},

	updateParams : function()
	{
		this._webglContext.uniform1f(this._rotateLocation, this._rotate);
		this._webglContext.uniform2f(this._scaleLocation, this._scale.data[0], this._scale.data[1]);
		this._webglContext.uniform2f(this._hotspotLocation, this._hotspot.data[0], this._hotspot.data[1]);
		this._webglContext.uniform1f(this._zLocation, this._z);
		this._webglContext.uniform1f(this._alphaLocation, this._alpha);
		this._webglContext.uniform2f(this._translationLocation, this._pos.data[0], this._pos.data[1]);
	},

	initSpriteTexture : function(tex)
	{
		if(!tex)
			return false;

		if(tex instanceof EGS.Texture2d)
		{
			this._texture  = tex;
		}
		else
		{
			this._texture = new EGS.Texture2d(this._webglContext);
			this._texture.initByImage(tex);			
		}
		this._program.useProgram();
		this._sampleTexIndex = this._program.uniformLocation(this.srcTextureString);
		this._program.setUniform2f(this.HalfTexSizeName, this._texture.width/2, this._texture.height/2);

		return true;
	},

	render : function()
	{

		var webglContext = this._webglContext;
		this._program.useProgram();
		 this.updateParams();
		
		this._webglContext.clearColor(1.0, 1.0, 0.0, 1.0);
	    this._webglContext.clear(webglContext.COLOR_BUFFER_BIT);

	    this._texture.bindToIndex(0);
	    this._webglContext.uniform1i(this._sampleTexIndex, 0);

	    this._webglContext.bindBuffer(webglContext.ARRAY_BUFFER, this._vertexBuffer);
	    this._webglContext.enableVertexAttribArray(this.v3PositionIndex);
	    this._webglContext.vertexAttribPointer(this.v3PositionIndex, 2, webglContext.FLOAT, false, 0, 0);

	    this.startIndex++;
	    webglContext.flush();
	    this._webglContext.drawArrays(this._webglContext.TRIANGLE_STRIP, 0, 4);	
	},

	renderTo : function()
	{
	
	},

	release : function()
	{
		if(!this._program)
			this._program.release();
		if(!this._texture)
			this._texture.release();
	},


	move : function(dx, dy)
	{
		this._pos.data[0] += dx;
		this._pos.data[1] += dy;
	},

	moveTo : function(x, y)
	{
		this._pos.data[0] = x;
		this._pos.data[1] = y;
	},


	setAlpha : function(value)
	{
		this._alpha = value;
	},

	setRotation : function(value)
	{
		this._rotate = value;
	},

	setScaling : function(v1, v2)
	{
		this._scale.data[0] = v1;
		this._scale.data[1] = v2;
	},


	setTranslation : function(v1, v2)
	{
		this._program.useProgram();
		this._program.setUniform2f(this.TranslationName, v1, v2);
	},

	setHotspot: function(v1, v2)
	{
		this._hotspot.data[0] = v1;
		this._hotspot.data[1] = v2;
	},

	setCanvasflip : function(v1, v2)
	{
		var f1 = v1 ? -1.0 : 1.0;
		var f2 = v2 ? -1.0 : 1.0;

		this._program.useProgram();
		this._program.setUniform2f(this.canvasflipName, f1, f2);
	},

	setSpriteflip : function(v1, v2)
	{
		var f1 = v1 ? -1.0 : 1.0;
		var f2 = v2 ? -1.0 : 1.0;

		this._program.useProgram();
		this._program.setUniform2f(this.spriteflipName, f1, f2);
	},

	setZ : function(value)
	{
		this._z = value;
	},


});