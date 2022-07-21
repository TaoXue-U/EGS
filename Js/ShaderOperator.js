/*
 * ShaderOperator.js
 *
 *  Created on: 2014-12-13
 *      Author: ixshells
 *        blog: http://nbcoders.com
 */

 /*
	 packaging shader program 
 */


EGS.ShaderCodeOperator  = EGS.Class(
{
	_webglContext : null,
	shaderType : null,
	shaderCode : null, 
	shader : null,

	initialize : function (context, type, code)
	{
		this._webglContext = context;
		this.shaderType = type;
		this.shaderCode = code;
		this.shader = this._webglContext.createShader(this.shaderType);

		if(this.shaderCode)
		{
			this.compile(this.shaderCode);
		}
	},

	loadShaderCode : function (shaderCode)
	{
		this.shaderCode = shaderCode;
		var context = this._webglContext;
		context.shaderSource(this.shader, this.shaderCode);
		context.compileShader(this.shader);

		if (!context.getShaderParameter(this.shader, context.COMPILE_STATUS))
        {
            console.error(context.getShaderInfoLog(this.shader), this.shaderType);
            return false
        }
        return true;
	}, 

	release : function()
	{
		this._webglContext.deleteShader(this.shader);
		this.shader = this.shaderType = null;
	},

	loadShaderFromTScriptID : function(scriptId)
	{
		return this.loadShaderCode(EGS.loadShaderSourceFromScript(scriptId));
	},

	loadShaderFromUrl : function(url)
	{
		return this.loadShaderCode(EGS.requestTextByURL(url));
	},

});


EGS.ShaderProgramOperator = EGS.Class(
{
	_webglContext : null,
	vShader : null,
	fShader : null,
	shaderProgram: null,

	initialize : function (webglConext)
	{
		this._webglContext = webglConext;
		this.shaderProgram = webglConext.createProgram();
		this.vShader = new EGS.ShaderCodeOperator(webglConext, webglConext.VERTEX_SHADER);
		this.fShader = new EGS.ShaderCodeOperator(webglConext, webglConext.FRAGMENT_SHADER);
	},

	release : function()
	{
		this._webglContext.deleteProgram(this.shaderProgram);
		this.vShader.release();
		this.fShader.release();
		this._webglContext = null;
		this.vShader = null;
		this.fShader = null;
		this.shaderProgram = null;
	},


	initWithShaderCode : function(vsh, fsh)
	{
		if(!(vsh && fsh))
			return false;
		return this.vShader.loadShaderCode(vsh) &&
				this.fShader.loadShaderCode(fsh);
	},


	linkShader : function()
	{
		var context = this._webglContext;
		context.attachShader(this.shaderProgram, this.vShader.shader);
		context.attachShader(this.shaderProgram, this.fShader.shader);
		context.linkProgram(this.shaderProgram);
		if (!context.getProgramParameter(this.shaderProgram, context.LINK_STATUS))
		{
		    console.error(context.getProgramInfoLog(this.shaderProgram));
			return false;
		}
		return true;
	},

	useProgram : function()
	{
		this._webglContext.useProgram(this.shaderProgram);
	},

	uniformLocation : function(uniformName)
	{
		var uniformLoc = this._webglContext.getUniformLocation(this.shaderProgram, uniformName);
		if(!uniformLoc)
		{
			console.error("Uniform " +  uniformName + "error");
		}
		return uniformLoc;
	},

	attributeLocation : function(attributeName)
	{
		var attriLoc = this._webglContext.getAttribLocation(this.shaderProgram, attriName);
		if(!attriLoc)
		{
			console.error("attribete " + attributeName + "error");
		}
		return attriLoc;
	},

	bindAttributeLocation : function(attributeName, location)
	{
		this._webglContext.bindAttribLocation(this.shaderProgram, location, attributeName);
	},

	setUniform1f : function(uniformName, v1)
	{
		var uniform1fLoc = this.uniformLocation(uniformName);
		this._webglContext.uniform1f(uniform1fLoc, v1);
	},

	setUniform2f : function(uniformName, v1, v2)
	{
		var loc = this.uniformLocation(uniformName);
		this._webglContext.uniform2f(loc, v1, v2);
	},

	setUniform3f : function(uniformName, v1, v2, v3)
	{
		var loc = this.uniformLocation(uniformName);
		this._webglContext.uniform3f(loc, v1, v2, v3);
	},

	setUniform4f : function(uniformName, v1, v2, v3, v4)
	{
		var loc = this.uniformLocation(uniformName);
		this._webglContext.uniform4f(loc, v1, v2, v3, v4);
	},

	setUniform1i : function(uniformName, v1)
	{
		var loc = this.uniformLocation(uniformName);
		this._webglContext.uniform1i(loc, v1);
	},

	setUniform2i : function(uniformName, v1, v2)
	{
		var loc = this.uniformLocation(uniformName);
		this._webglContext.uniform1i(loc, v1, v2);
	},

	setUniform3i : function(uniformName, v1, v2, v3, v4)
	{
		var loc = this.uniformLocation(uniformName);
		this._webglContext.uniform1i(loc, v1, v2, v3);
	},

	setUniform4i : function(uniformName, v1, v2, v3, v4)
	{
		var loc = this.uniformLocation(uniformName);
		this._webglContext.uniform1i(loc, v1, v2, v3, v4);
	},

	setUniformMat2 : function(uniformName, transpose, matrix)
	{
		var loc = this.uniformLocation(uniformName);
		this._webglContext.uniformMatrix2fv(loc, transpose, matrix);
	},

	setUniformMat3 : function(uniformName, transpose, matrix)
	{
		var loc = this.uniformLocation(uniformName);
		this._webglContext.uniformMatrix3fv(loc, transpose, matrix);
	},

	setUniformMat4 : function(uniformName, transpose, matrix)
	{
		var loc = this.uniformLocation(uniformName);
		this._webglContext.uniformMatrix4fv(loc, transpose, matrix);
	},

});


EGS.Texture2d = EGS.Class({
	texture : null, 
	width : 0,
	height : 0,
	_webglContext : null, 

	initialize : function(context)
	{
		this._webglContext = context;
	},

	initByTexture : function(texObj, w, h, context)
	{
		if(!texObj)
			return;
		this.width = w;
		this.height = h;
		this._webglContext = context;
	},

	initByImage : function(imgObj)
	{
		if(!imgObj)
			return;

		var context = this._webglContext;
		this.width = imgObj.width;
		this.height = imgObj.height;

		this.texture = context.createTexture();
		context.bindTexture(context.TEXTURE_2D, this.texture);
		context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, imgObj);

		context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST);
 		context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST);
 		context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
 		context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
	},

	bindToIndex : function(index)
	{
		var context = this._webglContext;
		context.activeTexture(context.TEXTURE0 + index);
		context.bindTexture(context.TEXTURE_2D, this.texture);
	},

	release : function()
	{
		var context = this._webglContext;

		if(context && this.texture)
		{
			context.deleteTexture(this.texture);
		}
		this.texture = null;
		this._webglContext = null;
	}

});

