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
    TILE_BLEND : 3,
    VIGNETTE_BLEND : 4,
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

 function initCanvasById(canvasId)
{
    var myCanvasObject = document.getElementById(canvasId);
    var context = null;
    try
    {
        context = myCanvasObject.getContext("experimental-webgl");
    } catch (ex)
    {
        
    }

    if (!context)
    {
        alert("我靠， 你的浏览器不支持WebGL,换个浏览器吧");
        return null;
    }

    context.viewport(0, 0, myCanvasObject.width, myCanvasObject.height);

    return context;
};

EGS.loadImage = function (url, callback) {
    var img = new Image();

    img.src = url;
    if (img.complete) {
        callback(img);
    } else {
        img.onload = function () {
            callback(img.width, img.height);
            img.onload = null;
        };
    };

};