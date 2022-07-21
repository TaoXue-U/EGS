EGS.Base = EGS.Class(
{
	_webglContext : null,
	_program : null,
	_vertexBuffer : null,
	_v3PositionIndex : 0,
	_vsCode : "attribute vec3 v3Position;void main(void){gl_Position = vec4(v3Position, 1.0);}",
	_fsCode : "void main(void){gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);}",
	_posNameString : "v3Position",
	_vertexData : null,
	_canvas : null,


	
	initialize : function(context, canvas)
	{
		this._webglContext = context;
		this._canvas = canvas;
		this.initProgram();
		//this.render();
	},

	render : function()
	{

		var webgl = this._webglContext;
		webgl.clearColor(0.0, 0.0, 0.0, 1.0);
	    webgl.clear(webgl.COLOR_BUFFER_BIT);
	    webgl.bindBuffer(webgl.ARRAY_BUFFER, this._vertexBuffer);
	    webgl.enableVertexAttribArray(this._v3PositionIndex);
	    webgl.vertexAttribPointer(this._v3PositionIndex, 3, webgl.FLOAT, false, 0, 0);
	    webgl.drawArrays(webgl.TRIANGLES, 0, 3);

	},

	initProgram : function()
	{
		var webglContext = this._webglContext;
		var program = new EGS.ShaderProgramOperator(webgl);
		this._program = program;


		program.initWithShaderCode(this._vsCode, this._fsCode);
		program.bindAttributeLocation(this._posNameString, this._v3PositionIndex);
		if(!program.linkShader())
		{
			console.error("Program link Failed!");
			return false;
		}

		program.useProgram();

		this.initPostionData();

		var buffer = webglContext.createBuffer();
		this._vertexBuffer = buffer;
		webglContext.bindBuffer(webglContext.ARRAY_BUFFER, buffer);
		webglContext.bufferData(webglContext.ARRAY_BUFFER, new Float32Array(this._vertexData), webglContext.STATIC_DRAW);

		this.initData();

		return true;
	},

	initPostionData : function()
	{
         this._vertexData = [
              0.0, 1.0, 0.0,
             -1.0, 0.0, 0.0,
              1.0, 0.0, 0.0
         ];
	},


	initData : function()
	{

	},

	release : function()
	{
		this._program.release();
	},

	getProgram : function()
	{
		return this._program;
	},


});