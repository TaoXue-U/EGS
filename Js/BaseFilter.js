/*
 * BaseFilter.js
 *
 *  Created on: 2015-3-28
 *      Author: ixshells
 *        blog: http://nbcoders.com
 */

 /*
	
 */


EGS.ShaderDir = "../Js/BasicFilter/";

EGS.BaseFilter = EGS.Class(
{
	_context : null,

	initialize : function (context)
	{
		this._context = context;
	},

	renderImage : function()
	{
		
	},
});	


EGS.ImageBaseFilter = EGS.Class(EGS.BaseFilter,
{
	_webglContext : null,
	_program : null,
	_vertexBuffer : null,
	_texture : null,
	_sampleTexIndex : null,
	_frameBuffer : null,
	_renderBuffer : null,
	srcTextureString : "inputImageTexture",
	startIndex : 0,
	v3PositionIndex : null,


	initialize : function(ctx)
	{
		this._webglContext = ctx;

		this.initShaderFromString();
	},


	updateParams : function()
	{

	},

	renderImage : function(dstTexture)
	{
	    var webglContext = this._webglContext;
		this._frameBuffer=this._webglContext.createFramebuffer();
		this._renderBuffer = this._webglContext.createRenderbuffer();

	    this._program.useProgram();
	    this.updateParams();

	    var context = this._webglContext;
	    this._webglContext.clearColor(0.0, 0.0, 0.0, 0.0);
	    this._webglContext.clear(webglContext.COLOR_BUFFER_BIT);

	    this._webglContext.bindBuffer(webglContext.ARRAY_BUFFER, this._vertexBuffer);
	    this._webglContext.enableVertexAttribArray(this.v3PositionIndex);
	    this._webglContext.vertexAttribPointer(this.v3PositionIndex, 2, webglContext.FLOAT, false, 0, 0);

	    context.bindFramebuffer(context.FRAMEBUFFER, this._frameBuffer);
	    context.framebufferTexture2D(context.FRAMEBUFFER, context.COLOR_ATTACHMENT0, context.TEXTURE_2D, dstTexture.texture, 0);

    	dstTexture.bindToIndex(this.startIndex);
	   // this._webglContext.uniform1i(this._sampleTexIndex, this.startIndex);
	    this.startIndex++;
	    if(context.checkFramebufferStatus(context.FRAMEBUFFER) != context.FRAMEBUFFER_COMPLETE)
	    {
	    	context.deleteRenderbuffer(this._renderBuffer);this._renderBuffer = null;
	    	context.deleteFramebuffer(this._frameBuffer);this._frameBuffer = null;
	    	console.error("buffer is not correct!");
	    	return;
	    }

	    this._texture.bindToIndex(this.startIndex);
	    this._webglContext.uniform1i(this._sampleTexIndex, this.startIndex);
	    this.startIndex++;

	    this._webglContext.drawArrays(this._webglContext.TRIANGLE_STRIP, 0, 4);	
	    context.deleteRenderbuffer(this._renderBuffer);this._renderBuffer = null;
	    context.deleteFramebuffer(this._frameBuffer);this._frameBuffer = null;
	    context.deleteBuffer(this._vertexBuffer);this._vertexBuffer = null;
	    this.deleteTex();
	},

	deleteTex : function()
	{
		
	},

	setParams : function()
	{

	},

	initShaderFromString : function()
	{

	},


	initRenderTexture : function(tex)
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
		this._sampleTexIndex = this._program.uniformLocation(this.srcTextureString);

		
	},

	setParamsLocation : function()
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

		this.setParamsLocation();
		this.setParams();
		return true;
	},


	getProgram : function()
	{
		return this._program;
	},

	release : function()
	{
		this._program.release();
		this._texture.release();
	},

});


EGS.TestFilter = EGS.Class(EGS.ImageBaseFilter,
{
	intensity :0,
	intensityIndex : null,

	setParams : function()
	{
		this.setIntensity(0.5);
	},

	setIntensity : function(value)
	{
		this._program.setUniform1f("intensity", value);
	}
});