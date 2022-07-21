//../EGSCore.js
"use strict";

/********************************************************************
	created:	2014/11/18
	created:	18:11:2014   16:35
	file base:	EGSCore
	file ext:	js
	author:		ixshells
	
	purpose:	EGS JavaScript core code
*********************************************************************/

window.EGS =
{
    VERSION: '1.0'
};

EGS.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);


EGS.clone = function (myObj) {
    if (!myObj)
        return myObj;
    else if (myObj instanceof Array)
        return myObj.slice(0);
    else if (!(myObj instanceof Object))
        return myObj;
    var myNewObj = {};
    for (var i in myObj) {
        try {
            myNewObj[i] = EGS.clone(myObj[i]);
        } catch (e) { }
    }
    return myNewObj;
};


EGS.extend = function (dst, src) {
    for (var i in src) {
        try {
            dst[i] = src[i];
        } catch (e) { }
    }
    return dst;

};


EGS.ClassInitWithArr = {};

EGS.Class = function () {
    var c = function(bInitWithArr, argArray)
    {
        if(this.initialize && this.initialize.apply)
        {
            if (bInitWithArr === EGS.ClassInitWithArr)
                this.initialize.apply(this, argArray);
            else
                this.initialize.apply(this, arguments);
        }
    };

    c.ancestors = EGS.clone(arguments);
    c.prototype = {};
    for (var i = 0; i < arguments.length; i++) {
        var a = arguments[i]
        if (a.prototype) {
            EGS.extend(c.prototype, a.prototype);
        }
        else {
            EGS.extend(c.prototype, a);
        }
    }
    EGS.extend(c, c.prototype);
    return c;
};


EGS.release = function(myObj)
{
    if(!(myObj instanceof Object))
        return;
    for(var i in myObj)
    {
        try{
            delete myObj[i];
        }
        catch(ex)
        {
            alert(ex.toString());
        }
    }
};


EGS.deepRelease = function (myObj)
{
    if (!(myObj instanceof Object))
        return;
    if(myObj instanceof Array)
    {
        for(var i in myObj)
        {
            EGS.release(myObj[i]);
        }
    }

    for(var i in myObj)
    {
        try
        {
           EGS.release(myObj[i]);
           delete myObj[i];
        }
        catch(ex)
        {
            alert(ex.toString());
        }
    }
};

EGS.TextureBlendMode = 
{
    BLEND_MIX : 0,          // 0
    BLEND_OVERLAY : 1,      // 1
    BLEND_HARDLIGHT : 2,        // 2
    BLEND_SOFTLIGHT : 3,        // 3
    BLEND_SCREEN : 4,       // 4
    BLEND_LINEARLIGHT : 5,  // 5
    BLEND_VIVIDLIGHT : 6,   // 6
    BLEND_MULTIPLY : 7,     // 7
    BLEND_EXCLUDE : 8,      // 8
    BLEND_COLORBURN : 9,        // 9
    BLEND_DARKEN : 10,      // 10
    BLEND_LIGHTEN : 11,     // 11
    BLEND_COLORDODGE : 12,  // 12
    BLEND_COLORDODGEADOBE : 13,// 13
    BLEND_LINEARDODGE : 14, // 14
    BLEND_LINEARBURN : 15,  // 15
    BLEND_PINLIGHT : 16,        // 16
    BLEND_HARDMIX : 17,     // 17
    BLEND_DIFFERENCE : 18,  // 18
    BLEND_ADD : 19,         // 19
    BLEND_COLOR : 20,       // 20

    /////////////    Special blend mode below     //////////////

    BlEND_ADD_REVERSE : 21, // 21
    BLEND_COLOR_BW : 22,        // 22

    /////////////    Special blend mode above     //////////////

    BLEND_MAX_NUM : 23 //Its value defines the max num of blend.
};

EGS.MixMode = 
{
    MIX_BLEND : 0,
    KR_BLEND : 1,
    PIX_BLEND : 2,
};

EGS.FsShaderTitle="#ifdef GL_FRAGMENT_PRECISION_HIGH\n precision highp float;\n #else\n precision mediump float; \n #endif \n";
EGS.VsShader1 = "attribute vec3 v3Position;varying vec2 vTexCood;void main(){vTexCood = (vec2(v3Position.x, v3Position.y) + 1.0) / 2.0;gl_Position = vec4(v3Position, 1.0);}";
EGS.VsShader2 = "attribute vec3 v3Position;varying vec2 vTexCood;void main(){vTexCood = (vec2(v3Position.x, -v3Position.y) + 1.0) / 2.0;gl_Position = vec4(v3Position, 1.0);}";


EGS.loadShaderSourceFromScript = function(scriptID)
{
    var shaderScript = document.getElementById(scriptID);
    if (shaderScript == null) return "";

    var sourceCode = "";
    var child = shaderScript.firstChild;
    while (child)
    {
        if (child.nodeType == child.TEXT_NODE) sourceCode += child.textContent;
        child = child.nextSibling;
    }

    return sourceCode;
};


EGS.requestTextByURL = function(url, callback)
{
    var async = callback ? true : false;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('get', url, async);
    if(async)
    {
        xmlHttp.onreadystatechange = function() 
        {
            if(xmlHttp.readyState == 4)
            {
                callback(xmlHttp.responseText, xmlHttp);
            }       
        };
    }
    xmlHttp.send();
    return xmlHttp.responseText;
};


EGS.initCanvas = function(myCanvasObject)
{
        
       
        var context = null;
        try
        {
            context = myCanvasObject.getContext("experimental-webgl");
        } catch (ex)
        {
            ex.toString();
        }

        if (!context)
        {
            alert("not support webgl");
            return null;
        }

         
        context.viewport(0, 0, myCanvasObject.width, myCanvasObject.height);

        return context;
};





EGS.shaderSourceFromScript = function(scriptID)
{
    var shaderScript = document.getElementById(scriptID);
    if (shaderScript == null) return "";

    var sourceCode = "";
    var child = shaderScript.firstChild;
    while (child)
    {
        if (child.nodeType == child.TEXT_NODE) sourceCode += child.textContent;
        child = child.nextSibling;
    }

    return sourceCode;
};


EGS.compileShader = function(webgl, shaderVectexCode, shaderFramentCode, vertexShaderObj, fragmentShaderObj)
{
    
    webgl.shaderSource(vertexShaderObj, shaderVectexCode);
    webgl.shaderSource(fragmentShaderObj, shaderFramentCode);

    
    webgl.compileShader(vertexShaderObj);
    webgl.compileShader(fragmentShaderObj);

    
    if (!webgl.getShaderParameter(vertexShaderObj, webgl.COMPILE_STATUS))
    {
        alert("error:vertexShaderObject");
        return;
    }

    if (!webgl.getShaderParameter(fragmentShaderObj, webgl.COMPILE_STATUS))
    {
        alert("error:framentShaderObject");
        return;
    }
};


EGS.linkShader = function(webgl, programObj, vertexShaderObj, fragmentShaderObj)
{
    
    webgl.attachShader(programObj, vertexShaderObj);
    webgl.attachShader(programObj, fragmentShaderObj);

    
    // webgl.bindAttribLocation(programObj, v3PositionIndex, "v3Position");
    webgl.linkProgram(programObj);

  
    if (!webgl.getProgramParameter(programObj, webgl.LINK_STATUS))
    {
        alert("error:ProgramObject");
        return;
    }

    return programObj;
};


EGS.initShaderWidthString  = function(webgl, vertextShaderCode, fragmentShaderCode, bindVariableData)
{
     
    var vertexShaderObject = webgl.createShader(webgl.VERTEX_SHADER);
    var fragmentShaderObject = webgl.createShader(webgl.FRAGMENT_SHADER);

    if (fragmentShaderCode == "")
    {
        //this.loadFragmentShaderFromFile(framentShaderId);
        fragmentShaderCode =  this.shaderSourceFromScript(framentShaderId);
    }

    
    EGS.compileShader(webgl, vertextShaderCode, fragmentShaderCode, vertexShaderObject, fragmentShaderObject);


    var programObject = webgl.createProgram();
    if(!bindVariableData instanceof Array )
    {
        alert("param error");
        return;
    }

    for (var i = 0; i < bindVariableData.length; i++)
    {
        webgl.bindAttribLocation(programObject, bindVariableData[i][0], bindVariableData[i][1]);
    }

    programObject = EGS.linkShader(webgl, programObject, vertexShaderObject, fragmentShaderObject);

    return programObject;
};


//../Js/ShaderOperator.js
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



//../Js/BaseFilter.js
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
	_canvas : null,
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


	initialize : function(canvas, ctx)
	{
		this._canvas = canvas;
		this._webglContext = ctx || this._canvas.getContext('experimental-webgl');

		this.initShaderFromString();
	},



	renderImage : function(dstTexture)
	{
	    var webglContext = this._webglContext;
		this._frameBuffer=this._webglContext.createFramebuffer();
		this._renderBuffer = this._webglContext.createRenderbuffer();

	    this._program.useProgram();
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
	    this.startIndex++

	    this._webglContext.drawArrays(this._webglContext.TRIANGLE_STRIP, 0, 4);	

	    this._texture.bindToIndex(this.startIndex);
	    this._webglContext.uniform1i(this._sampleTexIndex, this.startIndex);
	    this.startIndex++
	    context.bindFramebuffer(context.FRAMEBUFFER, null);
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

	getProgram : function()
	{
		return this._program;
	},

	release : function()
	{
		this._program.release();
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

//../Js/BasicFilter/BrightnessFilter.js

EGS.BrightnessFilter = EGS.Class(EGS.ImageBaseFilter,
{
	intensityString : "intensity",


	initShaderFromString : function()
	{
		var vsShaderCode = EGS.VsShader1;
		var FsShaderCode = EGS.FsShaderTitle + "varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform float intensity;const float SQRT2 = 1.41421;void main(){vec4 tmp = texture2D(inputImageTexture, vTexCood);vec3 src = tmp.rgb;float alpha = tmp.a;if (intensity != 0.0){float fac = SQRT2 / intensity;if(intensity > 0.0){src = 1.0 - src - (fac / SQRT2) + sqrt(1.0 - SQRT2*fac + (2.0*SQRT2) * src * fac + 0.5 * fac * fac);}else{src = 1.0 - src - (fac / SQRT2) - sqrt(1.0 - SQRT2*fac + (2.0*SQRT2) * src * fac + 0.5 * fac * fac);}}gl_FragColor = vec4(src, alpha);}";
		this.initProgram(vsShaderCode, FsShaderCode);
	},

	setParams : function()
	{
		
	},

	setIntensity : function(value)
	{
		this._program.useProgram();
		this._program.setUniform1f(this.intensityString, value);
	},
});

//../Js/BasicFilter/ContrastFilter.js

EGS.ContrastFilter = EGS.Class(EGS.ImageBaseFilter,
{
	intensityString : "intensity",


	initShaderFromString : function()
	{
		var vsShaderCode = EGS.VsShader1;
		var FsShaderCode = EGS.FsShaderTitle +"varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform float intensity;void main(){vec4 textureColor = texture2D(inputImageTexture, vTexCood);gl_FragColor = vec4(((textureColor.rgb - vec3(0.5)) * intensity + vec3(0.5)), textureColor.a);}";
		this.initProgram(vsShaderCode, FsShaderCode);
	},

	setParams : function()
	{
	},

	setIntensity : function(value)
	{
		this._program.useProgram();
		this._program.setUniform1f(this.intensityString, value);
	},
});

//../Js/BasicFilter/SaturationFilter.js

EGS.SaturationFilter = EGS.Class(EGS.ImageBaseFilter,
{
	intensityString : "intensity",


	initShaderFromString : function()
	{
		var vsShaderCode =EGS.VsShader1;
		// var FsShaderCode = EGS.requestTextByURL(EGS.ShaderDir+"SaturationShader.txt");
		var FsShaderCode = EGS.FsShaderTitle + "varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform float intensity;void main(){vec4 src = texture2D(inputImageTexture,vTexCood);float lum = (max(max(src.r,src.g),src.b) + min(min(src.r,src.g),src.b)) / 2.0;gl_FragColor = vec4(mix(vec3(lum),src.rgb,intensity),src.a);}";
		this.initProgram(vsShaderCode, FsShaderCode);
	},

	setParams : function()
	{
	},

	setIntensity : function(value)
	{
		this._program.useProgram();		
		this._program.setUniform1f(this.intensityString, value);
	},
});

//../Js/BasicFilter/SelectiveColorFilter.js

EGS.SelectiveColorFilter = EGS.Class(EGS.ImageBaseFilter,
{
	redString : "red",
	yellowString : "yellow",
	greenString : "green",
	cyanString : "cyan",
	blueString : "blue",
	magentaString : "magenta",
	whiteString : "white",
	grayString : "gray",
	blackString : "black",

	initShaderFromString : function()
	{
		var vsShaderCode = EGS.VsShader1;
		var FsShaderCode = EGS.FsShaderTitle +"varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform vec4 red;uniform vec4 yellow;uniform vec4 green;uniform vec4 cyan;uniform vec4 blue;uniform vec4 magenta;uniform vec4 white;uniform vec4 gray;uniform vec4 black;vec4 getFac(vec4 facPre,vec4 facNex,float h,float s,float v){vec4 ret = mix(facPre,facNex,h); vec4 rets0;v = v * 2.0 - 1.0;if(v > 0.0){rets0 = mix(gray,white,v); }else{rets0 = mix(gray,black,-v); }s = 1.0 - s;s = s * s * s;s = 1.0 - s;return mix(rets0,ret,s);}vec3 adjColor(vec3 src,float a,vec4 fac){vec3 tfac = fac.xyz *  vec3(fac.w,fac.w,fac.w);tfac = min(tfac,vec3(2.0,2.0,2.0));vec3 tfc1 = clamp(tfac - vec3(1.0,1.0,1.0),0.0,0.5);vec3 tfc2 = max(tfac - vec3(1.5,1.5,1.5),0.0);src = vec3(1.0,1.0,1.0) - src;src = src * (tfac -  src * (src * (tfc1 - tfc2) + vec3(2.0,2.0,2.0) * tfc2));return vec3(1.0,1.0,1.0) - src;}vec3 hsvAdjust(vec3 src){vec3 temp;vec4 color1, color2;if(src.r > src.g){if(src.g > src.b){temp = src.rgb;color1 = red;color2 = yellow;}else if(src.b > src.r){temp = src.brg;color1 = blue;color2 = magenta;}else{temp = src.rbg;color1 = red;color2 = magenta;}}else{if(src.r > src.b){temp = src.grb;color1 = green;color2 = yellow;}else if(src.b > src.g){temp = src.bgr;color1 = blue;color2 = cyan;}else{temp = src.gbr;color1 = green;color2 = cyan;}}float d = temp.x - temp.z + 0.0001;float s = temp.y - temp.z;vec4 fac = getFac(color1, color2, s/d, d, temp.x);return adjColor(src, temp.x, fac);}void main(){vec4 src = texture2D(inputImageTexture, vTexCood);src.rgb = hsvAdjust(src.rgb);gl_FragColor = src;}";
		this.initProgram(vsShaderCode, FsShaderCode);
		this.setDefault();

	},

	setParams : function()
	{
		
	},

	setDefault : function()
	{
		this.setRed(0,0, 0, 0);
		this.setYellow(0,0, 0, 0);
		this.setGreen(0,0, 0, 0);
		this.setCyan(0,0, 0, 0);
		this.setBlue(0,0, 0, 0);
		this.setMagenta(0,0, 0, 0);
		this.setWhite(0,0, 0, 0);
		this.setGray(0,0, 0, 0);
		this.setBlack(0,0, 0, 0);
	},

	setRed : function(v1, v2, v3, v4)
	{
		v1 /= 100 ;
		v2 /= 100 ;
		v3 /= 100 ;
		v4 /= 100 ;
		v1 += 1;
		v2 += 1 ;
		v3 += 1 ;
		v4 += 1 ;
		this._program.useProgram();
		this._program.setUniform4f(this.redString, v1, v2, v3, v4);
	},

	setYellow : function(v1, v2, v3, v4)
	{
		v1 /= 100 ;
		v2 /= 100 ;
		v3 /= 100 ;
		v4 /= 100 ;
		v1 += 1;
		v2 += 1 ;
		v3 += 1 ;
		v4 += 1 ;
		this._program.useProgram();
		this._program.setUniform4f(this.yellowString, v1, v2, v3, v4);
	},

	setGreen : function(v1, v2, v3, v4)
	{
		v1 /= 100 ;
		v2 /= 100 ;
		v3 /= 100 ;
		v4 /= 100 ;
		v1 += 1;
		v2 += 1 ;
		v3 += 1 ;
		v4 += 1 ;
		this._program.useProgram();
		this._program.setUniform4f(this.greenString, v1, v2, v3, v4);
	},

	setCyan : function(v1, v2, v3, v4)
	{
		v1 /= 100 ;
		v2 /= 100 ;
		v3 /= 100 ;
		v4 /= 100 ;
		v1 += 1;
		v2 += 1 ;
		v3 += 1 ;
		v4 += 1 ;
		this._program.useProgram();
		this._program.setUniform4f(this.cyanString, v1, v2, v3, v4);
	},

	setBlue : function(v1, v2, v3, v4)
	{
		v1 /= 100 ;
		v2 /= 100 ;
		v3 /= 100 ;
		v4 /= 100 ;
		v1 += 1;
		v2 += 1 ;
		v3 += 1 ;
		v4 += 1 ;
		this._program.useProgram();
		this._program.setUniform4f(this.blueString, v1, v2, v3, v4);
	},

	setMagenta : function(v1, v2, v3, v4)
	{
		v1 /= 100 ;
		v2 /= 100 ;
		v3 /= 100 ;
		v4 /= 100 ;
		v1 += 1;
		v2 += 1 ;
		v3 += 1 ;
		v4 += 1 ;
		this._program.useProgram();
		this._program.setUniform4f(this.magentaString, v1, v2, v3, v4);
	},

	setWhite : function(v1, v2, v3, v4)
	{
		v1 /= 100 ;
		v2 /= 100 ;
		v3 /= 100 ;
		v4 /= 100 ;
		v1 += 1;
		v2 += 1 ;
		v3 += 1 ;
		v4 += 1 ;
		this._program.useProgram();
		this._program.setUniform4f(this.whiteString, v1, v2, v3, v4);
	},

	setGray : function(v1, v2, v3, v4)
	{
		v1 /= 100 ;
		v2 /= 100 ;
		v3 /= 100 ;
		v4 /= 100 ;
		v1 += 1;
		v2 += 1 ;
		v3 += 1 ;
		v4 += 1 ;
		this._program.useProgram();
		this._program.setUniform4f(this.grayString, v1, v2, v3, v4);
	},

	setBlack : function(v1, v2, v3, v4)
	{
		v1 /= 100 ;
		v2 /= 100 ;
		v3 /= 100 ;
		v4 /= 100 ;
		v1 += 1;
		v2 += 1 ;
		v3 += 1 ;
		v4 += 1 ;
		this._program.useProgram();
		this._program.setUniform4f(this.blackString, v1, v2, v3, v4);
	},

});

//../Js/BasicFilter/CurveAdjustFilter.js

EGS.CurveAdjustFilter = EGS.Class(EGS.ImageBaseFilter,
{
	curveR: null,
	curveG: null,
	curveB: null,
	curveRGB: null,
	pointR : null,
	pointG : null, 
	pointB : null,
	pointRGB : null,
	currentPoints : null,
	currentCurve : null,
	precision : 256,
	curveTex : null,
	intensityString : "intensity",

	initShaderFromString : function()
	{
		this.curveR = new Array();
		this.curveG = new Array();
		this.curveB = new Array();
		this.curveRGB = new Array();
		this.pointR = new Array();
		this.pointG = new Array();
		this.pointB = new Array();
		this.pointRGB = new Array();

		var vsShaderCode = EGS.VsShader1;
		var FsShaderCode =EGS.FsShaderTitle + "varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform sampler2D curveTexture; uniform float intensity;void main(){vec3 src = texture2D(inputImageTexture, vTexCood).rgb;vec3 dst = vec3(texture2D(curveTexture, vec2(src.r, 0.0)).r,texture2D(curveTexture, vec2(src.g, 0.0)).g,texture2D(curveTexture, vec2(src.b, 0.0)).b);gl_FragColor = vec4(mix(src, dst, intensity), 1.0);}";
		this.initProgram(vsShaderCode, FsShaderCode);
	},



	createPoint : function(px, py)
	{
		var obj = {};
		obj.x = px;
		obj.y = py;
		return obj;
	},

    setCurrentCurveByIndex : function(index)
	{
		switch(index)
		{
		case 1:
			this.currentCurve = this.curveR;
			this.currentPoints = this.pointR;
			break;
		case 2:
			this.currentCurve = this.curveG;
			this.currentPoints = this.pointG;
			break;
		case 3:
			this.currentCurve = this.curveB;
			this.currentPoints = this.pointB;
			break;
		default:
			this.currentCurve = this.curveRGB;
			this.currentPoints = this.pointRGB;
			break;
		}
	},

	genCurve : function(pnts, curve)
	{
		var precision = this.precision;
		if(curve.length != precision) this.resetCurve(curve);
		if(pnts.length <= 1 || pnts == null)
		{
			resetCurve(curve);
			uiAppendLog("Invalid Curve Points!");
			return false;
		}
		var cnt = pnts.length;
		var u = new Array();
		var ypp = new Array();
		ypp[0] = u[0] = 0.0;
		for(var i=1; i != cnt-1; ++i)
		{
			var sig = (pnts[i].x - pnts[i - 1].x) / (pnts[i + 1].x - pnts[i - 1].x);
			var p = sig * ypp[i - 1] + 2.0;
			ypp[i] = (sig - 1.0) / p;
			u[i] = ((pnts[i + 1].y - pnts[i].y)/ (pnts[i + 1].x - pnts[i].x) - (pnts[i].y - pnts[i - 1].y) / (pnts[i].x - pnts[i - 1].x));
			u[i] = (6.0 * u[i] / (pnts[i + 1].x - pnts[i - 1].x) - sig * u[i - 1]) / p;
		}
		ypp[cnt - 1] = 0.0;
		for(var i = cnt - 2; i >= 0; --i)
		{
			ypp[i] = ypp[i] * ypp[i+1] + u[i];
		}
		var kL = -1, kH = 0;
		for(var i = 0; i != precision; ++i)
		{
			var t = i/(precision - 1);
			while(kH < cnt && t > pnts[kH].x)
			{
				kL = kH;
				++kH;
			}
			if(kH == cnt)
			{
				curve[i] = pnts[cnt-1].y;
				continue;
			}
			if(kL == -1)
			{
				curve[i] = pnts[0].y;
				continue;
			}
			var h = pnts[kH].x - pnts[kL].x;
			var a = (pnts[kH].x - t) / h;
			var b = (t - pnts[kL].x) / h;
			var g = a * pnts[kL].y + b*pnts[kH].y + ((a*a*a - a)*ypp[kL] + (b*b*b - b) * ypp[kH]) * (h*h) / 6.0;
			curve[i] = g > 0.0 ? (g < 1.0 ? g : 1.0) : 0.0;
		}
		return true;
	},

	mergeCurve : function(cvDst, cvFirst, cvLast)
	{
		var precision = this.precision;
		var vMax = precision - 1;
		for(var i = 0; i != precision; ++i)
		{
			cvDst[i] = cvLast[parseInt(cvFirst[i] * vMax)];
		}
	},

	createTextureByCurveBuffer : function(curveBuffer)
	{
		var webgl = this._webglContext;
		webgl.activeTexture(webgl.TEXTURE0 + 0); 
		var textureObject = webgl.createTexture();
		webgl.bindTexture(webgl.TEXTURE_2D, textureObject);
		webgl.texImage2D(webgl.TEXTURE_2D,0,webgl.RGB, curveBuffer.length / 3,1,0,webgl.RGB, webgl.UNSIGNED_BYTE,new Uint8Array(curveBuffer));
		webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST);
		webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST);
		webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
		webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);

		return textureObject;
	},

	renderPicture : function(cvRGB, cvR, cvG, cvB)
	{
		var precision = this.precision;
		var cvDstR = this.curveR.concat();
		var cvDstG = this.curveG.concat();
		var cvDstB = this.curveB.concat();
		this.mergeCurve(cvDstR, cvRGB, this.curveR);
		this.mergeCurve(cvDstG, cvRGB, this.curveG);
		this.mergeCurve(cvDstB, cvRGB, this.curveB);
		var cvDst = new Array();
		for(var i = 0; i != precision; ++i)
		{
			cvDst.push(parseInt(cvDstR[i] * 255));
			cvDst.push(parseInt(cvDstG[i] * 255));
			cvDst.push(parseInt(cvDstB[i] * 255));
		}
		var texCurve = this.createTextureByCurveBuffer(cvDst, precision);
		return texCurve;
	},

	resetCurve : function(cv)
	{
		var precision = this.precision;
		for(var i = 0; i != precision; ++i)
		{
			cv[i] = i / (precision - 1);
		}
	},

	initCurve : function()
	{
		if(!this.curveR.length)
		{
			var rInit = new Array();
			rInit.push(this.createPoint(0,0));
			rInit.push(this.createPoint(255,255));
			this.pushBackPoints(rInit, 1);
		}

		if(!this.curveG.length)
		{
			var gInit = new Array();
			gInit.push(this.createPoint(0,0));
			gInit.push(this.createPoint(255,255));
			this.pushBackPoints(gInit, 2);
		}

		if(!this.curveB.length)
		{
			var bInit = new Array();
			bInit.push(this.createPoint(0,0));
			bInit.push(this.createPoint(255,255));
			this.pushBackPoints(bInit, 3);
		}

		if(!this.curveRGB.length)
		{
			var rgbInit = new Array();
			rgbInit.push(this.createPoint(0,0));
			rgbInit.push(this.createPoint(255,255));
			this.pushBackPoints(rgbInit, 0);
		}


	},

	deleteTex : function()
	{
		this._webglContext.deleteTexture(this.curveTex);
	},

	genTex: function()
	{
		 this.initCurve();
		 var webgl = this._webglContext;
		 this.curveTex = this.renderPicture(this.curveRGB, this.curveR, this.curveG, this.curveB);
		 webgl.activeTexture(webgl.TEXTURE0 +  this.startIndex);
		 webgl.bindTexture(webgl.TEXTURE_2D, this.curveTex);

		 this._program.useProgram();
		 var uniform = this._program.uniformLocation("curveTexture");
	     webgl.uniform1i(uniform, this.startIndex);
	    

  // 		var tex = document.getElementById("tex1");
  // 		var texture = new EGS.Texture2d(this._webglContext);
		// texture.initByImage(tex);

		// webgl.activeTexture(webgl.TEXTURE0 + this.startIndex);
		//  webgl.bindTexture(webgl.TEXTURE_2D, texture.texture);

		//  this._program.useProgram();
		//  var uniform = this._program.uniformLocation("curveTexture");
	 //     webgl.uniform1i(uniform,  this.startIndex);
	      this.startIndex++;


	},

	setParams : function()
	{
		this.setIntensity(1.0);
	},

	setIntensity : function(value)
	{
		this._program.useProgram();
		this._program.setUniform1f(this.intensityString, value);
	},

	pushBackPoints : function(obj, index)
	{
		this.setCurrentCurveByIndex(index);
		for (var i = 0; i < obj.length; i++) {
			var x = obj[i].x / 255;
			var y = obj[i].y / 255;
			this.currentPoints.push(this.createPoint(x, y));
		};
		this.currentPoints.sort(function(a, b){return a.x - b.x;});
		this.genCurve(this.currentPoints, this.currentCurve);
	},
});

//../Js/BasicFilter/BlendFilter.js
EGS.MixMode = 
{
    MIX_BLEND : 0,
    KR_BLEND : 1,
    PIX_BLEND : 2,
};

EGS.BlendFilter = EGS.Class(EGS.ImageBaseFilter,
{
	intensityString : "intensity",
	blendColorString : "blendColor",
	ratioAspectString : "ratioAspect",
	mode : null,
	blendMode : null,
	_dictionary : null,
	_mixModeDictionary : null,

	initialize : function(canvas, ctx, mode, blendMode)
	{
		this.initDic();
		this.mode = this._mixModeDictionary[mode];
		this.blendMode = this._dictionary[blendMode];

		this._canvas = canvas;
		this._webglContext = ctx || this._canvas.getContext('experimental-webgl');
		this._frameBuffer=ctx.createFramebuffer();
		this._renderBuffer = ctx.createRenderbuffer();
		this.initShaderFromString();
	},

	initDic : function()
	{
		this._dictionary=
		{	
			"mix" : EGS.TextureBlendMode.BLEND_MIX,
			"overlay" : EGS.TextureBlendMode.BLEND_OVERLAY,
			"hardlight" : EGS.TextureBlendMode.BLEND_HARDLIGHT,
			"softlight" : EGS.TextureBlendMode.BLEND_SOFTLIGHT,
			"screen" : EGS.TextureBlendMode.BLEND_SCREEN,
			"linearlight" : EGS.TextureBlendMode.BLEND_LINEARLIGHT,
			"vividlight" : EGS.TextureBlendMode.BLEND_VIVIDLIGHT,
			"multiply" : EGS.TextureBlendMode.BLEND_MULTIPLY,
			"exclude" : EGS.TextureBlendMode.BLEND_EXCLUDE,
			"colorburn" : EGS.TextureBlendMode.BLEND_COLORBURN,
			"colordodge" : EGS.TextureBlendMode.BLEND_COLORDODGE,
			"lighten" : EGS.TextureBlendMode.BLEND_LIGHTEN,
			"pinlight" : EGS.TextureBlendMode.BLEND_PINLIGHT,
		};

		this._mixModeDictionary=
		{
			"blend" : EGS.MixMode.MIX_BLEND,
			"krblend" :EGS.MixMode.KR_BLEND,
			"pixblend" : EGS.MixMode.PIX_BLEND,
		};
	},	

	initShaderFromString : function()
	{
		var vsShaderCode = EGS.VsShader1;
		var FsShaderCode = this.getBlendCode();
		var blendFunctionCode = this.getBlendModeCode();
		FsShaderCode =  FsShaderCode.replace(/%s/, blendFunctionCode);
		this.initProgram(vsShaderCode, FsShaderCode);
	},

	getBlendCode : function()
	{
		var shadeCode = "";
		switch(this.mode)
		{
			case EGS.MixMode.MIX_BLEND:	
				shadeCode = EGS.FsShaderTitle +"varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform sampler2D blendTexture;uniform float intensity;%svoid main(){	vec4 src = texture2D(inputImageTexture, vTexCood);	vec4 dst = texture2D(blendTexture, vTexCood);	gl_FragColor = vec4(blend(src.rgb, dst.rgb, dst.a * intensity), src.a);}";
				break;
			case EGS.MixMode.KR_BLEND:
				shadeCode = EGS.FsShaderTitle+"varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform sampler2D blendTexture;uniform float intensity;uniform vec4 ratioAspect;%s\nvoid main(){vec4 src = texture2D(inputImageTexture, vTexCood);vec4 dst = texture2D(blendTexture, (vTexCood * ratioAspect.xy) + ratioAspect.zw);gl_FragColor = vec4(blend(src.rgb, dst.rgb, dst.a * intensity), src.a);}";
				break;
			case EGS.MixMode.PIX_BLEND:
				shadeCode = EGS.FsShaderTitle+"varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform vec4 blendColor;uniform float intensity;%s\nvoid main(){vec4 src = texture2D(inputImageTexture, vTexCood);gl_FragColor = vec4(blend(src.rgb, blendColor.rgb, intensity * blendColor.a), src.a);}";
				break;
			defalut:
				break;
		}
		return shadeCode;
	},

	getBlendModeCode : function()
	{
		var shadeCode = "";
		switch(this.blendMode)
		{
			case EGS.TextureBlendMode.BLEND_MIX:	
				shadeCode = "vec3 blend(vec3 src1, vec3 src2, float alpha){return mix(src1, src2, alpha);}";
				break;
			case EGS.TextureBlendMode.BLEND_OVERLAY:
				 shadeCode = "vec3 blend(vec3 src1, vec3 src2, float alpha){if(src1.r < 0.5)	src2.r = (src1.r * src2.r) * 2.0;else src2.r = (src1.r + src2.r) * 2.0 - (src1.r * src2.r) * 2.0 - 1.0;if(src1.g < 0.5)	src2.g = (src1.g * src2.g) * 2.0;else src2.g = (src1.g + src2.g) * 2.0 - (src1.g * src2.g) * 2.0 - 1.0;if(src1.b < 0.5)	src2.b = (src1.b * src2.b) * 2.0;else src2.b = (src1.b + src2.b) * 2.0 - (src1.b * src2.b) * 2.0 - 1.0;return mix(src1, src2, alpha);}";
				break;
			case EGS.TextureBlendMode.BLEND_HARDLIGHT:
				shadeCode = "vec3 blend(vec3 src1, vec3 src2, float alpha){if(src2.r < 0.5)src2.r = (src1.r * src2.r) * 2.0;else src2.r = (src1.r + src2.r) * 2.0 - (src1.r * src2.r) * 2.0 - 1.0;if(src2.g < 0.5)src2.g = (src1.g * src2.g) * 2.0;else src2.g = (src1.g + src2.g) * 2.0 - (src1.g * src2.g) * 2.0 - 1.0;if(src2.b < 0.5)src2.b = (src1.b * src2.b) * 2.0;else src2.b = (src1.b + src2.b) * 2.0 - (src1.b * src2.b) * 2.0 - 1.0;return mix(src1, src2, alpha);}";
				break;
			case EGS.TextureBlendMode.BLEND_SOFTLIGHT:
				shadeCode = "vec3 blend(vec3 src1, vec3 src2, float alpha){if(src2.r < 0.5)src2.r = (src2.r * 2.0 - 1.0) * (src1.r - (src1.r * src1.r)) + src1.r;else src2.r = ((src2.r * 2.0 - 1.0) * (sqrt(src1.r) - src1.r)) + src1.r;if(src2.g < 0.5)src2.g = (src2.g * 2.0 - 1.0) * (src1.g - (src1.g * src1.g)) + src1.g;else src2.g = ((src2.g * 2.0 - 1.0) * (sqrt(src1.g) - src1.g)) + src1.g;if(src2.b < 0.5)src2.b = (src2.b * 2.0 - 1.0) * (src1.b - (src1.b * src1.b)) + src1.b;else src2.b = ((src2.b * 2.0 - 1.0) * (sqrt(src1.b) - src1.b)) + src1.b;return mix(src1, src2, alpha);}";
				break;
			case EGS.TextureBlendMode.BLEND_SCREEN:
				shadeCode = "vec3 blend(vec3 src1, vec3 src2, float alpha){return mix(src1, src1 + src2 - src1 * src2, alpha);}";
				break;
			case EGS.TextureBlendMode.BLEND_LINEARLIGHT:
				shadeCode = "vec3 blend(vec3 src1, vec3 src2, float alpha){return mix(src1, clamp(src1 + src2 * 2.0 - 1.0, 0.0, 1.0), alpha);}";
				break;
			case EGS.TextureBlendMode.BLEND_VIVIDLIGHT:
				shadeCode = "vec3 blend(vec3 src1, vec3 src2, float alpha){src2.r = src2.r < 0.5 ? 1.0 - (1.0 - src1.r) / (src2.r * 2.0) : src1.r / (1.0 - src2.r) * 0.5;src2.g = src2.g < 0.5 ? 1.0 - (1.0 - src1.g) / (src2.g * 2.0) : src1.g / (1.0 - src2.g) * 0.5;src2.b = src2.b < 0.5 ? 1.0 - (1.0 - src1.b) / (src2.b * 2.0) : src1.b / (1.0 - src2.b) * 0.5;return mix(src1, clamp(src2, 0.0, 1.0) , alpha);}";
				break;
			case EGS.TextureBlendMode.BLEND_MULTIPLY:
				shadeCode = "vec3 blend(vec3 src1, vec3 src2, float alpha){return mix(src1, src1 * src2, alpha);}";
				break;
			case EGS.TextureBlendMode.BLEND_EXCLUDE:
				shadeCode = "vec3 blend(vec3 src1, vec3 src2, float alpha){return mix(src1, src1 + src2 - src1 * src2 * 2.0, alpha);}";
				break;
			case EGS.TextureBlendMode.BLEND_COLORBURN:
				shadeCode = "vec3 blend(vec3 src1, vec3 src2, float alpha){return mix(src1, 1.0 - min((1.0 - src1) / (src2 + 0.00003), 1.0), alpha);}";
				break;
			case EGS.TextureBlendMode.BLEND_COLORDODGE:
				shadeCode = "vec3 blend(vec3 src1, vec3 src2, float alpha){return mix(src1, min(src1 / (1.0 - src2), 1.0), alpha);}";
			case EGS.TextureBlendMode.BLEND_LIGHTEN:
				shadeCode = "vec3 blend(vec3 src1, vec3 src2, float alpha){return mix(src1, max(src1, src2), alpha);}";
				break;
			case EGS.TextureBlendMode.BLEND_PINLIGHT:
				shadeCode = "vec3 blend(vec3 src1, vec3 src2, float alpha){src2 *= 2.0;if(src2.r > src1.r){src2.r = src2.r - 1.0;if(src2.r < src1.r)src2.r = src1.r;}if(src2.g > src1.g){src2.g = src2.g - 1.0;if(src2.g < src1.g)src2.g = src1.g;}if(src2.b > src1.b){src2.b = src2.b - 1.0;if(src2.b < src1.b)src2.b = src1.b;}return mix(src1, src2, alpha);}";
				break;
			defalut:
				break;
		}
		return shadeCode;
	},	

	setParams : function()
	{
		//this.setTexture();
		//this.setIntensity(0.8);
	},

	setIntensity : function(value)
	{
		value = value > 1 ? value/100 : value;
		this._program.useProgram();
		this._program.setUniform1f(this.intensityString, value);
	},

	setColor : function(v1, v2, v3, v4)
	{
		v1 = v1 > 1 ? v1/255 : v1;
		v2 = v2 > 1 ? v2/255 : v2;
		v3 = v3 > 1 ? v3/255 : v3;
		v4 = v4 > 1 ? v4/255 : v4;
		this._program.useProgram();
		this._program.setUniform4f(this.blendColorString, v1, v2, v3, v4);
	},

	setRatioAspect : function(asSrc, asTex)
	{
		var x,y,z,w;
		if(asSrc > asTex)
		{
			x = 1;
			y = asTex / asSrc;
			z = 0;
			w = (1 - y) / 2;
		}
		else
		{
			x = asSrc / asTex;
			y = 1;
			z = (1 - x) / 2;
			w = 0;
		}
		this._program.useProgram();
		this._program.setUniform4f(this.ratioAspectString, x, y, z, w);
	},

	setTexture : function(tex)
	{
		var webgl = this._webglContext;
  		var texture = new EGS.Texture2d(this._webglContext);
		texture.initByImage(tex);

		webgl.activeTexture(webgl.TEXTURE0 + this.startIndex);
		webgl.bindTexture(webgl.TEXTURE_2D, texture.texture);

		this._program.useProgram();
		var uniform = this._program.uniformLocation("blendTexture");
	    webgl.uniform1i(uniform, + this.startIndex);
	    this.startIndex++;
	}


});

//../Js/BasicFilter/DrawResultFilter.js

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

//../Js/BasicFilter/ImageFilterManager.js
/*
 * ImageFilterFactory.js
 *
 *  Created on: 2015-3-31
 *      Author: ixshells
 *        blog: http://nbcoders.com
 */


EGS.ImageFilterFactory = EGS.Class(
{
	_canvas : null,
	_webglContext : null,

	initialize : function (canvas, ctx)
	{
		this._canvas = canvas;
		this._webglContext = ctx; 
	},

	create : function(filterName)
	{
		var obj = null;
		switch(filterName)
		{
			case "brightness":
				obj = new EGS.BrightnessFilter(this._canvas, this._webglContext);
				break;
			case "contrast":
				obj = new EGS.ContrastFilter(this._canvas, this._webglContext);
			default:
				break;
		}
		return obj;
	},

});


EGS.EffectManager = EGS.Class(
{
	_canvas : null,
	_webglContext : null,
	_srcTex : null,
	_dstTex : null,
	_filterVec : null,
	_filter : null,
	_index : 0,

	initialize : function(canvas, ctx)
	{
		this._canvas = canvas;
		this._webglContext = ctx;
		this._filterVec = new Array();
	},

	initTexture : function(tex1, tex2)
	{
		this._srcTex = tex1;
		this._dstTex = tex2;
	},

	initTex : function(img)
	{
		var webgl = this._webglContext;
		this._srcTex = new EGS.Texture2d(webgl);
		this._srcTex.initByImage(img);

		this._dstTex = new EGS.Texture2d(webgl);
		this._dstTex.initByImage(img);
	},

	addFilter : function(obj)
	{
		this._filterVec.push(obj);
		var src = this._index % 2 == 0 ? this._srcTex : this._dstTex;
		var dst = (this._index  + 1)% 2 == 0 ? this._srcTex : this._dstTex;
		this._index++;

		obj.initRenderTexture(src);
		obj.renderImage(dst);
		// this._filter = obj;
	},

	runEffects : function()
	{
		for (var i = 0; i < this._filterVec.length; i++) {
			var src = this._index % 2 == 0 ? this._srcTex : this._dstTex;
			var dst = (this._index  + 1)% 2 == 0 ? this._srcTex : this._dstTex;
			this._index++;

			this._filterVec[i].initRenderTexture(src);
			this._filterVec[i].renderImage(dst);
		};

	},

	removeFilter : function(obj)
	{
		this._filterVec.remove(obj);
	},

	releaseAll : function()
	{
		while(this._filterVec.length != 0)
		{
			var filter = this._filterVec.pop();
			filter.release();
			filter = null;
		}

		this._srcTex.release();this._srcTex = null;
		this._dstTex.release();this._dstTex = null;
	},

});

//../Js/BasicFilter/ConfigParser.js
EGS.ParserEngine = EGS.Class({
	_sourceString : "",
	_manager : null,
	_webglCanas : null,
	_webglContext : null,
	_texSource : null,

	initialize : function(algorithmSource, manager, canvas, context, texSource)
	{
		this._sourceString = algorithmSource;
		this._texSource = texSource;
		this._manager = manager;
		this._webglCanas = canvas;
		this._webglContext = context;
		this.parser();
	},

	createPoint : function(px, py)
	{
		var obj = {};
		obj.x = px;
		obj.y = py;
		return obj;
	},

	parser : function()
	{
		var sourceStr = this._sourceString;
		var filterStrings = sourceStr.split("@");

		for (var i = 1; i < filterStrings.length; i++) {
			var tmpStr = filterStrings[i];
			if(tmpStr.indexOf("pixblend") >=0)
			{
				this.pixblendParser(tmpStr);
			}
			else if(tmpStr.indexOf("blend") >= 0 || tmpStr.indexOf("krblend") >= 0)
			{
				this.blendParser(tmpStr);
			}
			else if(tmpStr.indexOf("curve") >= 0)
			{
				this.curveParser(tmpStr);
			}
			else if(tmpStr.indexOf("adjust") >= 0)
			{
				this.adjustParser(tmpStr);
			}
			else if(tmpStr.indexOf("selcolor") >= 0)
			{
				this.selectColorParser(tmpStr);
			}

		};

	},

	selectColorParser : function(parserString)
	{
		var webglCanvas = this._webglCanas;
		var webglContext = this._webglContext;

		var indexs = new Array();

		var selectColorFilter = new EGS.SelectiveColorFilter(webglCanvas, webglContext);

		var redindex = parserString.indexOf("red");
		if(redindex >= 0)
			indexs.push(redindex);

		var yellowindex = parserString.indexOf("yellow");
		if(yellowindex >= 0)
			indexs.push(yellowindex);
		var greenindex = parserString.indexOf("green");
		if(greenindex >= 0)
			indexs.push(greenindex);
		var cyanindex = parserString.indexOf("cyan");
		if(cyanindex >= 0)
			indexs.push(cyanindex);
		var blueindex = parserString.indexOf("blue");
		if(blueindex >= 0)
			indexs.push(blueindex);
		var magentaindex = parserString.indexOf("magenta");
		if(magentaindex >= 0)
			indexs.push(magentaindex);
		var whiteindex = parserString.indexOf("white");
		if(whiteindex >= 0)
			indexs.push(whiteindex);
		var grayindex = parserString.indexOf("gray");
		if(grayindex >= 0)
			indexs.push(grayindex);
		var blackindex = parserString.indexOf("black");
		if(blackindex >= 0)
			indexs.push(blackindex);

		var strArr = new Array(); 
		for (var i = 0; i < indexs.length - 1; i++) {
			var tmpstr  = parserString.slice(indexs[i], indexs[i+1]);
			strArr.push(tmpstr);
		};

		for (var i = 0; i < strArr.length; i++) {
			var tmp = strArr[i];
			var nums = tmp.match(/\d+/g);

			if(parserString.indexOf("yellow") >= 0)
			{
				selectColorFilter.setRed(nums[0],nums[1], nums[2], nums[3]);
			}
			else if(parserString.indexOf("green") >= 0)
			{
				selectColorFilter.setGreen(nums[0],nums[1], nums[2], nums[3]);
			}
			else if(parserString.indexOf("cyan") >= 0)
			{
				selectColorFilter.setCyan(nums[0],nums[1], nums[2], nums[3]);
			}
			else if( parserString.indexOf("blue") >= 0)
			{
				selectColorFilter.setBlue(nums[0],nums[1], nums[2], nums[3]);
			}
			else if( parserString.indexOf("magenta") >= 0)
			{
				selectColorFilter.setMagenta(nums[0],nums[1], nums[2], nums[3]);
			}
			else if(parserString.indexOf("white") >= 0)
			{
				selectColorFilter.setWhite(nums[0],nums[1], nums[2], nums[3]);
			}
			else if(parserString.indexOf("gray") >= 0)
			{
				selectColorFilter.setGray(nums[0],nums[1], nums[2], nums[3]);
			}
			else if(parserString.indexOf("black") >= 0)
			{
				selectColorFilter.setBlack(nums[0],nums[1], nums[2], nums[3]);
			}
		}

		this._manager.addFilter(selectColorFilter);
	},

	curveParser : function(parserString)
	{
		var webglCanvas = this._webglCanas;
		var webglContext = this._webglContext;

		var indexs = new Array();

		var curveFilter = new EGS.CurveAdjustFilter(webglCanvas, webglContext);


		for (var i = 1; i < parserString.length - 1; i++) {
			var ch2 = parserString.charAt(i-1)
			var ch = parserString.charAt(i);
			var ch1 = parserString.charAt(i+1);
			if((ch == 'R' && ch1=='(') || (ch == 'G' && ch1=='(') || (ch == 'B' && ch1=='('  && ch2 != 'G'))
				indexs.push(i);
			if((ch == 'B' && ch1=='('  && ch2 == 'G'))
				indexs.push(i-2);
		};

		var strArr = new Array(); 
		for (var i = 0; i < indexs.length - 1; i++) {
			var tmpstr  = parserString.slice(indexs[i], indexs[i+1]);
			strArr.push(tmpstr);
		};
		strArr.push(parserString.slice(indexs[indexs.length - 1]));

		for (var i = 0; i < strArr.length; i++) {
			var tmp = strArr[i];
			var nums = tmp.match(/\d+/g);
			var points = new Array(); 
			for (var j = 0; j < nums.length/2; j++) {
				points.push(this.createPoint(nums[j*2], nums[j*2+1]));
			};
			if(tmp.indexOf("RGB(") >= 0)
			{
				curveFilter.pushBackPoints(points, 0);
			}
			else if(tmp.indexOf("R")>=0 && tmp.indexOf("RGB") < 0)
			{
				curveFilter.pushBackPoints(points, 1);
			}
			else if(tmp.indexOf("G")>=0 && tmp.indexOf("RGB") < 0)
			{
				curveFilter.pushBackPoints(points, 2);
			}
			else if(tmp.indexOf("B")>=0 && tmp.indexOf("RGB") < 0)
			{
				curveFilter.pushBackPoints(points, 3);
			}
		};

		curveFilter.genTex();
		this._manager.addFilter(curveFilter);
	},

	blendParser : function(parserString)
	{
		var webglCanvas = this._webglCanas;
		var webglContext = this._webglContext;

		var data = parserString.match(/\S+/g);
		if(data.length != 4)
		{
			console.error("blend effcet params error");
			return;
		}
		var blendFilter = new EGS.BlendFilter(webglCanvas, webglContext, data[0], data[1]);
		blendFilter.setIntensity(data[3]);
		var tex = document.getElementById(data[2]);
		if(data[0] == "krblend")
		{
			blendFilter.setRatioAspect(this._manager._srcTex.width/this._manager._srcTex.height, tex.width/ tex.height);
		}
		
		blendFilter.setTexture(tex);

		// if(data[0] == "krblend")
		// {
		// 	blendFilter.setRatioAspect(this._manager._srcTex.width/this._manager._srcTex.height, this._texSource[data[2]].width/ this._texSource[data[2]].height);
		// }

		// blendFilter.setTexture(this._texSource[data[2]]);
		this._manager.addFilter(blendFilter);
	},

	pixblendParser : function(parserString)
	{

		var webglCanvas = this._webglCanas;
		var webglContext = this._webglContext;

		var data = parserString.match(/\S+/g);
		if(data.length != 7)
		{
			console.error("blend effcet params error");
			return;
		}
		var blendFilter = new EGS.BlendFilter(webglCanvas, webglContext, data[0], data[1]);
		blendFilter.setIntensity(data[6]);
		blendFilter.setColor(data[2],data[3],data[4],data[5]);

		this._manager.addFilter(blendFilter);
	},

	adjustParser : function(parserString)
	{
		var webglCanvas = this._webglCanas;
		var webglContext = this._webglContext;

		var data = parserString.match(/\S+/g);
		if(parserString.indexOf("brightness") >= 0)
		{
			var brightnessFilter = new EGS.BrightnessFilter(webglCanvas, webglContext);
			brightnessFilter.setIntensity(data[2]);
			this._manager.addFilter(brightnessFilter);
		}
		else if(parserString.indexOf("contrast") >= 0)
		{
			var contrastFilter = new EGS.ContrastFilter(webglCanvas, webglContext);
			contrastFilter.setIntensity(data[2]);
			this._manager.addFilter(contrastFilter);
		}
		else if(parserString.indexOf("saturation") >= 0)
		{
			var saturationFilter = new EGS.SaturationFilter(webglCanvas, webglContext);
			saturationFilter.setIntensity(data[2])
			this._manager.addFilter(saturationFilter);
		}
	}

});

//../Js/zip/zip.js
/*
 Copyright (c) 2013 Gildas Lormeau. All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 1. Redistributions of source code must retain the above copyright notice,
 this list of conditions and the following disclaimer.

 2. Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in
 the documentation and/or other materials provided with the distribution.

 3. The names of the authors may not be used to endorse or promote products
 derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

(function(obj) {
	"use strict";

	var ERR_BAD_FORMAT = "File format is not recognized.";
	var ERR_CRC = "CRC failed.";
	var ERR_ENCRYPTED = "File contains encrypted entry.";
	var ERR_ZIP64 = "File is using Zip64 (4gb+ file size).";
	var ERR_READ = "Error while reading zip file.";
	var ERR_WRITE = "Error while writing zip file.";
	var ERR_WRITE_DATA = "Error while writing file data.";
	var ERR_READ_DATA = "Error while reading file data.";
	var ERR_DUPLICATED_NAME = "File already exists.";
	var CHUNK_SIZE = 512 * 1024;
	
	var TEXT_PLAIN = "text/plain";

	var appendABViewSupported;
	try {
		appendABViewSupported = new Blob([ new DataView(new ArrayBuffer(0)) ]).size === 0;
	} catch (e) {
	}

	function Crc32() {
		this.crc = -1;
	}
	Crc32.prototype.append = function append(data) {
		var crc = this.crc | 0, table = this.table;
		for (var offset = 0, len = data.length | 0; offset < len; offset++)
			crc = (crc >>> 8) ^ table[(crc ^ data[offset]) & 0xFF];
		this.crc = crc;
	};
	Crc32.prototype.get = function get() {
		return ~this.crc;
	};
	Crc32.prototype.table = (function() {
		var i, j, t, table = []; // Uint32Array is actually slower than []
		for (i = 0; i < 256; i++) {
			t = i;
			for (j = 0; j < 8; j++)
				if (t & 1)
					t = (t >>> 1) ^ 0xEDB88320;
				else
					t = t >>> 1;
			table[i] = t;
		}
		return table;
	})();
	
	// "no-op" codec
	function NOOP() {}
	NOOP.prototype.append = function append(bytes, onprogress) {
		return bytes;
	};
	NOOP.prototype.flush = function flush() {};

	function blobSlice(blob, index, length) {
		if (index < 0 || length < 0 || index + length > blob.size)
			throw new RangeError('offset:' + index + ', length:' + length + ', size:' + blob.size);
		if (blob.slice)
			return blob.slice(index, index + length);
		else if (blob.webkitSlice)
			return blob.webkitSlice(index, index + length);
		else if (blob.mozSlice)
			return blob.mozSlice(index, index + length);
		else if (blob.msSlice)
			return blob.msSlice(index, index + length);
	}

	function getDataHelper(byteLength, bytes) {
		var dataBuffer, dataArray;
		dataBuffer = new ArrayBuffer(byteLength);
		dataArray = new Uint8Array(dataBuffer);
		if (bytes)
			dataArray.set(bytes, 0);
		return {
			buffer : dataBuffer,
			array : dataArray,
			view : new DataView(dataBuffer)
		};
	}

	// Readers
	function Reader() {
	}

	function TextReader(text) {
		var that = this, blobReader;

		function init(callback, onerror) {
			var blob = new Blob([ text ], {
				type : TEXT_PLAIN
			});
			blobReader = new BlobReader(blob);
			blobReader.init(function() {
				that.size = blobReader.size;
				callback();
			}, onerror);
		}

		function readUint8Array(index, length, callback, onerror) {
			blobReader.readUint8Array(index, length, callback, onerror);
		}

		that.size = 0;
		that.init = init;
		that.readUint8Array = readUint8Array;
	}
	TextReader.prototype = new Reader();
	TextReader.prototype.constructor = TextReader;

	function Data64URIReader(dataURI) {
		var that = this, dataStart;

		function init(callback) {
			var dataEnd = dataURI.length;
			while (dataURI.charAt(dataEnd - 1) == "=")
				dataEnd--;
			dataStart = dataURI.indexOf(",") + 1;
			that.size = Math.floor((dataEnd - dataStart) * 0.75);
			callback();
		}

		function readUint8Array(index, length, callback) {
			var i, data = getDataHelper(length);
			var start = Math.floor(index / 3) * 4;
			var end = Math.ceil((index + length) / 3) * 4;
			var bytes = obj.atob(dataURI.substring(start + dataStart, end + dataStart));
			var delta = index - Math.floor(start / 4) * 3;
			for (i = delta; i < delta + length; i++)
				data.array[i - delta] = bytes.charCodeAt(i);
			callback(data.array);
		}

		that.size = 0;
		that.init = init;
		that.readUint8Array = readUint8Array;
	}
	Data64URIReader.prototype = new Reader();
	Data64URIReader.prototype.constructor = Data64URIReader;

	function BlobReader(blob) {
		var that = this;

		function init(callback) {
			that.size = blob.size;
			callback();
		}

		function readUint8Array(index, length, callback, onerror) {
			var reader = new FileReader();
			reader.onload = function(e) {
				callback(new Uint8Array(e.target.result));
			};
			reader.onerror = onerror;
			try {
				reader.readAsArrayBuffer(blobSlice(blob, index, length));
			} catch (e) {
				onerror(e);
			}
		}

		that.size = 0;
		that.init = init;
		that.readUint8Array = readUint8Array;
	}
	BlobReader.prototype = new Reader();
	BlobReader.prototype.constructor = BlobReader;

	// Writers

	function Writer() {
	}
	Writer.prototype.getData = function(callback) {
		callback(this.data);
	};

	function TextWriter(encoding) {
		var that = this, blob;

		function init(callback) {
			blob = new Blob([], {
				type : TEXT_PLAIN
			});
			callback();
		}

		function writeUint8Array(array, callback) {
			blob = new Blob([ blob, appendABViewSupported ? array : array.buffer ], {
				type : TEXT_PLAIN
			});
			callback();
		}

		function getData(callback, onerror) {
			var reader = new FileReader();
			reader.onload = function(e) {
				callback(e.target.result);
			};
			reader.onerror = onerror;
			reader.readAsText(blob, encoding);
		}

		that.init = init;
		that.writeUint8Array = writeUint8Array;
		that.getData = getData;
	}
	TextWriter.prototype = new Writer();
	TextWriter.prototype.constructor = TextWriter;

	function Data64URIWriter(contentType) {
		var that = this, data = "", pending = "";

		function init(callback) {
			data += "data:" + (contentType || "") + ";base64,";
			callback();
		}

		function writeUint8Array(array, callback) {
			var i, delta = pending.length, dataString = pending;
			pending = "";
			for (i = 0; i < (Math.floor((delta + array.length) / 3) * 3) - delta; i++)
				dataString += String.fromCharCode(array[i]);
			for (; i < array.length; i++)
				pending += String.fromCharCode(array[i]);
			if (dataString.length > 2)
				data += obj.btoa(dataString);
			else
				pending = dataString;
			callback();
		}

		function getData(callback) {
			callback(data + obj.btoa(pending));
		}

		that.init = init;
		that.writeUint8Array = writeUint8Array;
		that.getData = getData;
	}
	Data64URIWriter.prototype = new Writer();
	Data64URIWriter.prototype.constructor = Data64URIWriter;

	function BlobWriter(contentType) {
		var blob, that = this;

		function init(callback) {
			blob = new Blob([], {
				type : contentType
			});
			callback();
		}

		function writeUint8Array(array, callback) {
			blob = new Blob([ blob, appendABViewSupported ? array : array.buffer ], {
				type : contentType
			});
			callback();
		}

		function getData(callback) {
			callback(blob);
		}

		that.init = init;
		that.writeUint8Array = writeUint8Array;
		that.getData = getData;
	}
	BlobWriter.prototype = new Writer();
	BlobWriter.prototype.constructor = BlobWriter;

	/** 
	 * inflate/deflate core functions
	 * @param worker {Worker} web worker for the task.
	 * @param initialMessage {Object} initial message to be sent to the worker. should contain
	 *   sn(serial number for distinguishing multiple tasks sent to the worker), and codecClass.
	 *   This function may add more properties before sending.
	 */
	function launchWorkerProcess(worker, initialMessage, reader, writer, offset, size, onprogress, onend, onreaderror, onwriteerror) {
		var chunkIndex = 0, index, outputSize, sn = initialMessage.sn, crc;

		function onflush() {
			worker.removeEventListener('message', onmessage, false);
			onend(outputSize, crc);
		}

		function onmessage(event) {
			var message = event.data, data = message.data, err = message.error;
			if (err) {
				err.toString = function () { return 'Error: ' + this.message; };
				onreaderror(err);
				return;
			}
			if (message.sn !== sn)
				return;
			if (typeof message.codecTime === 'number')
				worker.codecTime += message.codecTime; // should be before onflush()
			if (typeof message.crcTime === 'number')
				worker.crcTime += message.crcTime;

			switch (message.type) {
				case 'append':
					if (data) {
						outputSize += data.length;
						writer.writeUint8Array(data, function() {
							step();
						}, onwriteerror);
					} else
						step();
					break;
				case 'flush':
					crc = message.crc;
					if (data) {
						outputSize += data.length;
						writer.writeUint8Array(data, function() {
							onflush();
						}, onwriteerror);
					} else
						onflush();
					break;
				case 'progress':
					if (onprogress)
						onprogress(index + message.loaded, size);
					break;
				case 'importScripts': //no need to handle here
				case 'newTask':
				case 'echo':
					break;
				default:
					console.warn('zip.js:launchWorkerProcess: unknown message: ', message);
			}
		}

		function step() {
			index = chunkIndex * CHUNK_SIZE;
			if (index < size) {
				reader.readUint8Array(offset + index, Math.min(CHUNK_SIZE, size - index), function(array) {
					if (onprogress)
						onprogress(index, size);
					var msg = index === 0 ? initialMessage : {sn : sn};
					msg.type = 'append';
					msg.data = array;
					worker.postMessage(msg, [array.buffer]);
					chunkIndex++;
				}, onreaderror);
			} else {
				worker.postMessage({
					sn: sn,
					type: 'flush'
				});
			}
		}

		outputSize = 0;
		worker.addEventListener('message', onmessage, false);
		step();
	}

	function launchProcess(process, reader, writer, offset, size, crcType, onprogress, onend, onreaderror, onwriteerror) {
		var chunkIndex = 0, index, outputSize = 0,
			crcInput = crcType === 'input',
			crcOutput = crcType === 'output',
			crc = new Crc32();
		function step() {
			var outputData;
			index = chunkIndex * CHUNK_SIZE;
			if (index < size)
				reader.readUint8Array(offset + index, Math.min(CHUNK_SIZE, size - index), function(inputData) {
					var outputData;
					try {
						outputData = process.append(inputData, function(loaded) {
							if (onprogress)
								onprogress(index + loaded, size);
						});
					} catch (e) {
						onreaderror(e);
						return;
					}
					if (outputData) {
						outputSize += outputData.length;
						writer.writeUint8Array(outputData, function() {
							chunkIndex++;
							setTimeout(step, 1);
						}, onwriteerror);
						if (crcOutput)
							crc.append(outputData);
					} else {
						chunkIndex++;
						setTimeout(step, 1);
					}
					if (crcInput)
						crc.append(inputData);
					if (onprogress)
						onprogress(index, size);
				}, onreaderror);
			else {
				try {
					outputData = process.flush();
				} catch (e) {
					onreaderror(e);
					return;
				}
				if (outputData) {
					if (crcOutput)
						crc.append(outputData);
					outputSize += outputData.length;
					writer.writeUint8Array(outputData, function() {
						onend(outputSize, crc.get());
					}, onwriteerror);
				} else
					onend(outputSize, crc.get());
			}
		}

		step();
	}

	function inflate(worker, sn, reader, writer, offset, size, computeCrc32, onend, onprogress, onreaderror, onwriteerror) {
		var crcType = computeCrc32 ? 'output' : 'none';
		if (obj.zip.useWebWorkers) {
			var initialMessage = {
				sn: sn,
				codecClass: 'Inflater',
				crcType: crcType,
			};
			launchWorkerProcess(worker, initialMessage, reader, writer, offset, size, onprogress, onend, onreaderror, onwriteerror);
		} else
			launchProcess(new obj.zip.Inflater(), reader, writer, offset, size, crcType, onprogress, onend, onreaderror, onwriteerror);
	}

	function deflate(worker, sn, reader, writer, level, onend, onprogress, onreaderror, onwriteerror) {
		var crcType = 'input';
		if (obj.zip.useWebWorkers) {
			var initialMessage = {
				sn: sn,
				options: {level: level},
				codecClass: 'Deflater',
				crcType: crcType,
			};
			launchWorkerProcess(worker, initialMessage, reader, writer, 0, reader.size, onprogress, onend, onreaderror, onwriteerror);
		} else
			launchProcess(new obj.zip.Deflater(), reader, writer, 0, reader.size, crcType, onprogress, onend, onreaderror, onwriteerror);
	}

	function copy(worker, sn, reader, writer, offset, size, computeCrc32, onend, onprogress, onreaderror, onwriteerror) {
		var crcType = 'input';
		if (obj.zip.useWebWorkers && computeCrc32) {
			var initialMessage = {
				sn: sn,
				codecClass: 'NOOP',
				crcType: crcType,
			};
			launchWorkerProcess(worker, initialMessage, reader, writer, offset, size, onprogress, onend, onreaderror, onwriteerror);
		} else
			launchProcess(new NOOP(), reader, writer, offset, size, crcType, onprogress, onend, onreaderror, onwriteerror);
	}

	// ZipReader

	function decodeASCII(str) {
		var i, out = "", charCode, extendedASCII = [ '\u00C7', '\u00FC', '\u00E9', '\u00E2', '\u00E4', '\u00E0', '\u00E5', '\u00E7', '\u00EA', '\u00EB',
				'\u00E8', '\u00EF', '\u00EE', '\u00EC', '\u00C4', '\u00C5', '\u00C9', '\u00E6', '\u00C6', '\u00F4', '\u00F6', '\u00F2', '\u00FB', '\u00F9',
				'\u00FF', '\u00D6', '\u00DC', '\u00F8', '\u00A3', '\u00D8', '\u00D7', '\u0192', '\u00E1', '\u00ED', '\u00F3', '\u00FA', '\u00F1', '\u00D1',
				'\u00AA', '\u00BA', '\u00BF', '\u00AE', '\u00AC', '\u00BD', '\u00BC', '\u00A1', '\u00AB', '\u00BB', '_', '_', '_', '\u00A6', '\u00A6',
				'\u00C1', '\u00C2', '\u00C0', '\u00A9', '\u00A6', '\u00A6', '+', '+', '\u00A2', '\u00A5', '+', '+', '-', '-', '+', '-', '+', '\u00E3',
				'\u00C3', '+', '+', '-', '-', '\u00A6', '-', '+', '\u00A4', '\u00F0', '\u00D0', '\u00CA', '\u00CB', '\u00C8', 'i', '\u00CD', '\u00CE',
				'\u00CF', '+', '+', '_', '_', '\u00A6', '\u00CC', '_', '\u00D3', '\u00DF', '\u00D4', '\u00D2', '\u00F5', '\u00D5', '\u00B5', '\u00FE',
				'\u00DE', '\u00DA', '\u00DB', '\u00D9', '\u00FD', '\u00DD', '\u00AF', '\u00B4', '\u00AD', '\u00B1', '_', '\u00BE', '\u00B6', '\u00A7',
				'\u00F7', '\u00B8', '\u00B0', '\u00A8', '\u00B7', '\u00B9', '\u00B3', '\u00B2', '_', ' ' ];
		for (i = 0; i < str.length; i++) {
			charCode = str.charCodeAt(i) & 0xFF;
			if (charCode > 127)
				out += extendedASCII[charCode - 128];
			else
				out += String.fromCharCode(charCode);
		}
		return out;
	}

	function decodeUTF8(string) {
		return decodeURIComponent(escape(string));
	}

	function getString(bytes) {
		var i, str = "";
		for (i = 0; i < bytes.length; i++)
			str += String.fromCharCode(bytes[i]);
		return str;
	}

	function getDate(timeRaw) {
		var date = (timeRaw & 0xffff0000) >> 16, time = timeRaw & 0x0000ffff;
		try {
			return new Date(1980 + ((date & 0xFE00) >> 9), ((date & 0x01E0) >> 5) - 1, date & 0x001F, (time & 0xF800) >> 11, (time & 0x07E0) >> 5,
					(time & 0x001F) * 2, 0);
		} catch (e) {
		}
	}

	function readCommonHeader(entry, data, index, centralDirectory, onerror) {
		entry.version = data.view.getUint16(index, true);
		entry.bitFlag = data.view.getUint16(index + 2, true);
		entry.compressionMethod = data.view.getUint16(index + 4, true);
		entry.lastModDateRaw = data.view.getUint32(index + 6, true);
		entry.lastModDate = getDate(entry.lastModDateRaw);
		if ((entry.bitFlag & 0x01) === 0x01) {
			onerror(ERR_ENCRYPTED);
			return;
		}
		if (centralDirectory || (entry.bitFlag & 0x0008) != 0x0008) {
			entry.crc32 = data.view.getUint32(index + 10, true);
			entry.compressedSize = data.view.getUint32(index + 14, true);
			entry.uncompressedSize = data.view.getUint32(index + 18, true);
		}
		if (entry.compressedSize === 0xFFFFFFFF || entry.uncompressedSize === 0xFFFFFFFF) {
			onerror(ERR_ZIP64);
			return;
		}
		entry.filenameLength = data.view.getUint16(index + 22, true);
		entry.extraFieldLength = data.view.getUint16(index + 24, true);
	}

	function createZipReader(reader, callback, onerror) {
		var inflateSN = 0;

		function Entry() {
		}

		Entry.prototype.getData = function(writer, onend, onprogress, checkCrc32) {
			var that = this;

			function testCrc32(crc32) {
				var dataCrc32 = getDataHelper(4);
				dataCrc32.view.setUint32(0, crc32);
				return that.crc32 == dataCrc32.view.getUint32(0);
			}

			function getWriterData(uncompressedSize, crc32) {
				if (checkCrc32 && !testCrc32(crc32))
					onerror(ERR_CRC);
				else
					writer.getData(function(data) {
						onend(data);
					});
			}

			function onreaderror(err) {
				onerror(err || ERR_READ_DATA);
			}

			function onwriteerror(err) {
				onerror(err || ERR_WRITE_DATA);
			}

			reader.readUint8Array(that.offset, 30, function(bytes) {
				var data = getDataHelper(bytes.length, bytes), dataOffset;
				if (data.view.getUint32(0) != 0x504b0304) {
					onerror(ERR_BAD_FORMAT);
					return;
				}
				readCommonHeader(that, data, 4, false, onerror);
				dataOffset = that.offset + 30 + that.filenameLength + that.extraFieldLength;
				writer.init(function() {
					if (that.compressionMethod === 0)
						copy(that._worker, inflateSN++, reader, writer, dataOffset, that.compressedSize, checkCrc32, getWriterData, onprogress, onreaderror, onwriteerror);
					else
						inflate(that._worker, inflateSN++, reader, writer, dataOffset, that.compressedSize, checkCrc32, getWriterData, onprogress, onreaderror, onwriteerror);
				}, onwriteerror);
			}, onreaderror);
		};

		function seekEOCDR(eocdrCallback) {
			// "End of central directory record" is the last part of a zip archive, and is at least 22 bytes long.
			// Zip file comment is the last part of EOCDR and has max length of 64KB,
			// so we only have to search the last 64K + 22 bytes of a archive for EOCDR signature (0x06054b50).
			var EOCDR_MIN = 22;
			if (reader.size < EOCDR_MIN) {
				onerror(ERR_BAD_FORMAT);
				return;
			}
			var ZIP_COMMENT_MAX = 256 * 256, EOCDR_MAX = EOCDR_MIN + ZIP_COMMENT_MAX;

			// In most cases, the EOCDR is EOCDR_MIN bytes long
			doSeek(EOCDR_MIN, function() {
				// If not found, try within EOCDR_MAX bytes
				doSeek(Math.min(EOCDR_MAX, reader.size), function() {
					onerror(ERR_BAD_FORMAT);
				});
			});

			// seek last length bytes of file for EOCDR
			function doSeek(length, eocdrNotFoundCallback) {
				reader.readUint8Array(reader.size - length, length, function(bytes) {
					for (var i = bytes.length - EOCDR_MIN; i >= 0; i--) {
						if (bytes[i] === 0x50 && bytes[i + 1] === 0x4b && bytes[i + 2] === 0x05 && bytes[i + 3] === 0x06) {
							eocdrCallback(new DataView(bytes.buffer, i, EOCDR_MIN));
							return;
						}
					}
					eocdrNotFoundCallback();
				}, function() {
					onerror(ERR_READ);
				});
			}
		}

		var zipReader = {
			getEntries : function(callback) {
				var worker = this._worker;
				// look for End of central directory record
				seekEOCDR(function(dataView) {
					var datalength, fileslength;
					datalength = dataView.getUint32(16, true);
					fileslength = dataView.getUint16(8, true);
					if (datalength < 0 || datalength >= reader.size) {
						onerror(ERR_BAD_FORMAT);
						return;
					}
					reader.readUint8Array(datalength, reader.size - datalength, function(bytes) {
						var i, index = 0, entries = [], entry, filename, comment, data = getDataHelper(bytes.length, bytes);
						for (i = 0; i < fileslength; i++) {
							entry = new Entry();
							entry._worker = worker;
							if (data.view.getUint32(index) != 0x504b0102) {
								onerror(ERR_BAD_FORMAT);
								return;
							}
							readCommonHeader(entry, data, index + 6, true, onerror);
							entry.commentLength = data.view.getUint16(index + 32, true);
							entry.directory = ((data.view.getUint8(index + 38) & 0x10) == 0x10);
							entry.offset = data.view.getUint32(index + 42, true);
							filename = getString(data.array.subarray(index + 46, index + 46 + entry.filenameLength));
							entry.filename = ((entry.bitFlag & 0x0800) === 0x0800) ? decodeUTF8(filename) : decodeASCII(filename);
							if (!entry.directory && entry.filename.charAt(entry.filename.length - 1) == "/")
								entry.directory = true;
							comment = getString(data.array.subarray(index + 46 + entry.filenameLength + entry.extraFieldLength, index + 46
									+ entry.filenameLength + entry.extraFieldLength + entry.commentLength));
							entry.comment = ((entry.bitFlag & 0x0800) === 0x0800) ? decodeUTF8(comment) : decodeASCII(comment);
							entries.push(entry);
							index += 46 + entry.filenameLength + entry.extraFieldLength + entry.commentLength;
						}
						callback(entries);
					}, function() {
						onerror(ERR_READ);
					});
				});
			},
			close : function(callback) {
				if (this._worker) {
					this._worker.terminate();
					this._worker = null;
				}
				if (callback)
					callback();
			},
			_worker: null
		};

		if (!obj.zip.useWebWorkers)
			callback(zipReader);
		else {
			createWorker('inflater',
				function(worker) {
					zipReader._worker = worker;
					callback(zipReader);
				},
				function(err) {
					onerror(err);
				}
			);
		}
	}

	// ZipWriter

	function encodeUTF8(string) {
		return unescape(encodeURIComponent(string));
	}

	function getBytes(str) {
		var i, array = [];
		for (i = 0; i < str.length; i++)
			array.push(str.charCodeAt(i));
		return array;
	}

	function createZipWriter(writer, callback, onerror, dontDeflate) {
		var files = {}, filenames = [], datalength = 0;
		var deflateSN = 0;

		function onwriteerror(err) {
			onerror(err || ERR_WRITE);
		}

		function onreaderror(err) {
			onerror(err || ERR_READ_DATA);
		}

		var zipWriter = {
			add : function(name, reader, onend, onprogress, options) {
				var header, filename, date;
				var worker = this._worker;

				function writeHeader(callback) {
					var data;
					date = options.lastModDate || new Date();
					header = getDataHelper(26);
					files[name] = {
						headerArray : header.array,
						directory : options.directory,
						filename : filename,
						offset : datalength,
						comment : getBytes(encodeUTF8(options.comment || ""))
					};
					header.view.setUint32(0, 0x14000808);
					if (options.version)
						header.view.setUint8(0, options.version);
					if (!dontDeflate && options.level !== 0 && !options.directory)
						header.view.setUint16(4, 0x0800);
					header.view.setUint16(6, (((date.getHours() << 6) | date.getMinutes()) << 5) | date.getSeconds() / 2, true);
					header.view.setUint16(8, ((((date.getFullYear() - 1980) << 4) | (date.getMonth() + 1)) << 5) | date.getDate(), true);
					header.view.setUint16(22, filename.length, true);
					data = getDataHelper(30 + filename.length);
					data.view.setUint32(0, 0x504b0304);
					data.array.set(header.array, 4);
					data.array.set(filename, 30);
					datalength += data.array.length;
					writer.writeUint8Array(data.array, callback, onwriteerror);
				}

				function writeFooter(compressedLength, crc32) {
					var footer = getDataHelper(16);
					datalength += compressedLength || 0;
					footer.view.setUint32(0, 0x504b0708);
					if (typeof crc32 != "undefined") {
						header.view.setUint32(10, crc32, true);
						footer.view.setUint32(4, crc32, true);
					}
					if (reader) {
						footer.view.setUint32(8, compressedLength, true);
						header.view.setUint32(14, compressedLength, true);
						footer.view.setUint32(12, reader.size, true);
						header.view.setUint32(18, reader.size, true);
					}
					writer.writeUint8Array(footer.array, function() {
						datalength += 16;
						onend();
					}, onwriteerror);
				}

				function writeFile() {
					options = options || {};
					name = name.trim();
					if (options.directory && name.charAt(name.length - 1) != "/")
						name += "/";
					if (files.hasOwnProperty(name)) {
						onerror(ERR_DUPLICATED_NAME);
						return;
					}
					filename = getBytes(encodeUTF8(name));
					filenames.push(name);
					writeHeader(function() {
						if (reader)
							if (dontDeflate || options.level === 0)
								copy(worker, deflateSN++, reader, writer, 0, reader.size, true, writeFooter, onprogress, onreaderror, onwriteerror);
							else
								deflate(worker, deflateSN++, reader, writer, options.level, writeFooter, onprogress, onreaderror, onwriteerror);
						else
							writeFooter();
					}, onwriteerror);
				}

				if (reader)
					reader.init(writeFile, onreaderror);
				else
					writeFile();
			},
			close : function(callback) {
				if (this._worker) {
					this._worker.terminate();
					this._worker = null;
				}

				var data, length = 0, index = 0, indexFilename, file;
				for (indexFilename = 0; indexFilename < filenames.length; indexFilename++) {
					file = files[filenames[indexFilename]];
					length += 46 + file.filename.length + file.comment.length;
				}
				data = getDataHelper(length + 22);
				for (indexFilename = 0; indexFilename < filenames.length; indexFilename++) {
					file = files[filenames[indexFilename]];
					data.view.setUint32(index, 0x504b0102);
					data.view.setUint16(index + 4, 0x1400);
					data.array.set(file.headerArray, index + 6);
					data.view.setUint16(index + 32, file.comment.length, true);
					if (file.directory)
						data.view.setUint8(index + 38, 0x10);
					data.view.setUint32(index + 42, file.offset, true);
					data.array.set(file.filename, index + 46);
					data.array.set(file.comment, index + 46 + file.filename.length);
					index += 46 + file.filename.length + file.comment.length;
				}
				data.view.setUint32(index, 0x504b0506);
				data.view.setUint16(index + 8, filenames.length, true);
				data.view.setUint16(index + 10, filenames.length, true);
				data.view.setUint32(index + 12, length, true);
				data.view.setUint32(index + 16, datalength, true);
				writer.writeUint8Array(data.array, function() {
					writer.getData(callback);
				}, onwriteerror);
			},
			_worker: null
		};

		if (!obj.zip.useWebWorkers)
			callback(zipWriter);
		else {
			createWorker('deflater',
				function(worker) {
					zipWriter._worker = worker;
					callback(zipWriter);
				},
				function(err) {
					onerror(err);
				}
			);
		}
	}

	function resolveURLs(urls) {
		var a = document.createElement('a');
		return urls.map(function(url) {
			a.href = url;
			return a.href;
		});
	}

	var DEFAULT_WORKER_SCRIPTS = {
		deflater: ['/images2/lib/z-worker.js', '/images2/lib/deflate.js'],
		inflater: ['/images2/lib/z-worker.js', '/images2/lib/inflate.js']
	};
	function createWorker(type, callback, onerror) {
		if (obj.zip.workerScripts !== null && obj.zip.workerScriptsPath !== null) {
			onerror(new Error('Either zip.workerScripts or zip.workerScriptsPath may be set, not both.'));
			return;
		}
		var scripts;
		if (obj.zip.workerScripts) {
			scripts = obj.zip.workerScripts[type];
			if (!Array.isArray(scripts)) {
				onerror(new Error('zip.workerScripts.' + type + ' is not an array!'));
				return;
			}
			scripts = resolveURLs(scripts);
		} else {
			scripts = DEFAULT_WORKER_SCRIPTS[type].slice(0);
			scripts[0] = (obj.zip.workerScriptsPath || '') + scripts[0];
		}
		var worker = new Worker(scripts[0]);
		// record total consumed time by inflater/deflater/crc32 in this worker
		worker.codecTime = worker.crcTime = 0;
		worker.postMessage({ type: 'importScripts', scripts: scripts.slice(1) });
		worker.addEventListener('message', onmessage);
		function onmessage(ev) {
			var msg = ev.data;
			if (msg.error) {
				worker.terminate(); // should before onerror(), because onerror() may throw.
				onerror(msg.error);
				return;
			}
			if (msg.type === 'importScripts') {
				worker.removeEventListener('message', onmessage);
				worker.removeEventListener('error', errorHandler);
				callback(worker);
			}
		}
		// catch entry script loading error and other unhandled errors
		worker.addEventListener('error', errorHandler);
		function errorHandler(err) {
			worker.terminate();
			onerror(err);
		}
	}

	function onerror_default(error) {
		console.error(error);
	}
	obj.zip = {
		Reader : Reader,
		Writer : Writer,
		BlobReader : BlobReader,
		Data64URIReader : Data64URIReader,
		TextReader : TextReader,
		BlobWriter : BlobWriter,
		Data64URIWriter : Data64URIWriter,
		TextWriter : TextWriter,
		createReader : function(reader, callback, onerror) {
			onerror = onerror || onerror_default;

			reader.init(function() {
				createZipReader(reader, callback, onerror);
			}, onerror);
		},
		createWriter : function(writer, callback, onerror, dontDeflate) {
			onerror = onerror || onerror_default;
			dontDeflate = !!dontDeflate;

			writer.init(function() {
				createZipWriter(writer, callback, onerror, dontDeflate);
			}, onerror);
		},
		useWebWorkers : true,
		/**
		 * Directory containing the default worker scripts (z-worker.js, deflate.js, and inflate.js), relative to current base url.
		 * E.g.: zip.workerScripts = './';
		 */
		workerScriptsPath : null,
		/**
		 * Advanced option to control which scripts are loaded in the Web worker. If this option is specified, then workerScriptsPath must not be set.
		 * workerScripts.deflater/workerScripts.inflater should be arrays of urls to scripts for deflater/inflater, respectively.
		 * Scripts in the array are executed in order, and the first one should be z-worker.js, which is used to start the worker.
		 * All urls are relative to current base url.
		 * E.g.:
		 * zip.workerScripts = {
		 *   deflater: ['z-worker.js', 'deflate.js'],
		 *   inflater: ['z-worker.js', 'inflate.js']
		 * };
		 */
		workerScripts : null,
	};

})(this);


//../Js/BasicFilter/ZipHandle.js
EGS.ZipHandle = EGS.Class({
	_webglCanvas : null,
	_webglContext : null,
	_srcImg : null,
	_id : null,

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
		console.log("yohohoho111111");
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
				        // var pic = "data:image/"+"jpeg"+";base64,"+base64data;
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
					               // callback(img.width, img.height);
					               // img.onload = null;
					               // self.allDone();
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

			//totalCount=entries.length;
			entries.forEach(function(entry) {
				var filename = entry.filename;
				
				console.log("len:"+len);

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
	
	allDone:function(){

			var self = this;
			console.log("yohohoho222222");
     				    			
    		var webglCanvas = self._webglCanvas;
			var webglContext = self._webglContext;

		   // var img = document.getElementById("texImg");
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

	 		var s = webglCanvas.toDataURL("image/jpeg", 1);
	 		webGLEffect(s, null, this._id);
	 		console.log("start1");
	 		console.log("effect end!");
	 		
	 		manager.releaseAll();

	},

	imgDataParser : function(picBase, zipData, id)
	{
		this._id = id;
		var self = this;
		var showpic = picBase;
   
	   if(this._srcImg == null)
	        this._srcImg = document.createElement("img");
	    showpic = "data:image/jpeg;base64,"+showpic;

	    var imgLoad = function (url) {
	        self._srcImg.src = url;
	        if (self._srcImg.complete)
	        {
	            self.zipParser(zipData, self._srcImg);
	        } else {
	             self._srcImg.onload = function () {
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
			//alert("not support webgl");
			console.log("not support webgl");
		}

		this._webglContext.viewport(0, 0,  this._webglCanvas.width,  this._webglCanvas.height);	
	},

	zipParser : function(zip)
	{
		var blob = this.b64toBlob(zip);
		this.initCanvas();
		// var blob = zip;
   		this.parser(blob);
	}


});

//../Js/BasicFilter/Main.js
 
 function doWebGLEffect(pic_base,effect, id)
 {
 	var ziphandle = new EGS.ZipHandle();
 	ziphandle.imgDataParser(pic_base, effect, id);
 };

