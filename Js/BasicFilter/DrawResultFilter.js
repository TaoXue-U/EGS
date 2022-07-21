
EGS.DrawResultFilter = EGS.Class(EGS.ImageBaseFilter,
{
	intensityString : "intensity",


	initShaderFromString : function()
	{
		var vsShaderCode = EGS.VsShader2;
		var FsShaderCode = EGS.FsShaderTitle +"varying vec2 vTexCood;uniform sampler2D inputImageTexture;void main(){vec4 src = texture2D(inputImageTexture, vTexCood);gl_FragColor = src;}";
		this.initProgram(vsShaderCode, FsShaderCode);
	},

	setParams : function()
	{
	},

	initProgram : function(vsh, fsh)
	{
		var webglContext = this._webglContext;
		var program = new EGS.ShaderProgramOperator(webglContext); 
		this._program = program;

		program.initWithShaderCode(vsh, fsh);
		program.bindAttributeLocation("v3Position", this.v3PositionIndex);
		if(!program.linkShader())
		{
			console.error("Program link Failed!");
			return false;
		}

		program.useProgram();
		
	    var verticesData = [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0];
		var buffer = webglContext.createBuffer();
		this._vertexBuffer = buffer;
		webglContext.bindBuffer(webglContext.ARRAY_BUFFER, buffer);
		webglContext.bufferData(webglContext.ARRAY_BUFFER, new Float32Array(verticesData), webglContext.STATIC_DRAW);

		this.setParams();
		return true;
	},

	renderImage : function()
	{
		var webglContext = this._webglContext;
		this._program.useProgram();
		this._webglContext.clearColor(0.0, 0.0, 0.0, 0.0);
	    this._webglContext.clear(webglContext.COLOR_BUFFER_BIT);
	    this._texture.bindToIndex(this.startIndex);
	    this._webglContext.uniform1i(this._sampleTexIndex, this.startIndex);
	    

	    this._webglContext.bindBuffer(webglContext.ARRAY_BUFFER, this._vertexBuffer);
	    this._webglContext.enableVertexAttribArray(this.v3PositionIndex);
	    this._webglContext.vertexAttribPointer(this.v3PositionIndex, 2, webglContext.FLOAT, false, 0, 0);

	    this.startIndex++;
	    this._webglContext.drawArrays(this._webglContext.TRIANGLE_STRIP, 0, 4);	
	},

});