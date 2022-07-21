 "use strict";
var v3PositionIndex = 0;
var sampleTexIndex = -1;
var triangleBuffer = null;
var triangleBuffer = null;
var textObj = null;
var sampleTexObj1 = null;
var sampleTexObj2 = null;
var sampleTexObj3 = null;
var sampIndex1 = 0;
var sampIndex2 = 1;
var sampIndex3 = 2;
var imgTag = null;
var webglCanvas = null;
var s = null;
var time =  0;
var d  = null;
var img = null;

function initData(webgl)
{
    //顶点坐标
    var jsArrayData = [
           1.0, 1.0, 1.0, 
           1.0, -1.0, 1.0, 
           -1.0, -1.0, 1.0, 

           -1.0, -1.0, 1.0, 
           -1.0, 1.0, 1.0,
           1.0, 1.0, 1.0,
    ]

    //创建一个webgl能够访问的缓冲
    triangleBuffer = webgl.createBuffer();
    //绑定buffer
    webgl.bindBuffer(webgl.ARRAY_BUFFER, triangleBuffer);
    //将js数据拷贝到buffer上
    webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(jsArrayData), webgl.STATIC_DRAW);


    //创建一个纹理对象区间
    textObj = webgl.createTexture();
    //绑定文理对象
    webgl.bindTexture(webgl.TEXTURE_2D, textObj);
    //获得html中的原始图片
    //将图片数据拷贝到纹理中
    webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGB, webgl.RGB, webgl.UNSIGNED_BYTE, img);
    //插值计算
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);


}

function renderScene(webgl)
{
    //清空屏幕
    webgl.clearColor(0.0, 0.0, 0.0, 1.0);
    webgl.clear(webgl.COLOR_BUFFER_BIT);

    //绑定顶点数据
    webgl.bindBuffer(webgl.ARRAY_BUFFER, triangleBuffer);
    //启动开关
    webgl.enableVertexAttribArray(v3PositionIndex);
    //制定数据索引原则
    webgl.vertexAttribPointer(v3PositionIndex, 3, webgl.FLOAT, false, 0, 0);

    //激活纹理标示0
    webgl.activeTexture(webgl.TEXTURE0);
    webgl.bindTexture(webgl.TEXTURE_2D, textObj);
    webgl.uniform1i(sampleTexIndex, 0);

    //绘制数据
    webgl.drawArrays(webgl.TRIANGLES, 0, 6);

    webgl.deleteTexture(textObj);
    webgl.deleteBuffer(triangleBuffer);

     d = new Date();
     time = d.getTime();
     s = webglCanvas.toDataURL("image/jpeg", 1);

     d = new Date();
     var ds = d.getTime() - time;

    console.log("toDataURL:" + ds);
    time = d.getTime();


     document.getElementById("HaoZhaoPian").test3(s);

     s = null;
}

function init()
{
    var  vertexShader = "attribute vec3 v3Position;varying vec2 vTexCood;void main(){vTexCood = vec2((v3Position.x+1.0)/2.0, 1.0-(v3Position.y+1.0)/2.0);gl_Position = vec4(v3Position, 1.0);}";;
    var fragmentShader =  "precision mediump float;varying vec2 vTexCood;uniform sampler2D sTexture;      void main(){vec3 src = texture2D(sTexture, vTexCood).rgb;vec3 dst;dst.r = 0.3*src.r + 0.59*src.g + 0.11*src.b;dst.g = 0.3*src.r + 0.59*src.g + 0.11*src.b;dst.b = 0.3*src.r + 0.59*src.g + 0.11*src.b;gl_FragColor = vec4(dst, 1.0);}";
    if(webglCanvas == null)
         webglCanvas = document.createElement("canvas");
    // webglCanvas = document.getElementById("webglCanvas");

    // img = document.getElementById("myTexture");

    webglCanvas.width = img.width;
    webglCanvas.height = img.height;

    console.log("width:"+ img.width + "height:"+img.height);

    //获取webgl canvas
    var canvas = EGS.initCanvas(webglCanvas);
    //初始化shader程序
    var bind1 = [v3PositionIndex, "v3Position"];
    var bindData = new Array();
    bindData.push(bind1);
    var shaderProgramObject = EGS.initShaderWidthString(canvas, vertexShader, fragmentShader, bindData);

    //获取Uniform变量在链接时生成的索引
    sampleTexIndex = canvas.getUniformLocation(shaderProgramObject, "sTexture");
    canvas.useProgram(shaderProgramObject);

    //初始化顶点数据
    initData(canvas);

    //渲染场景
    renderScene(canvas);
}



//开始时间
function test1()
{
    d = new Date();
    time = d.getTime();
    startTime = d.getTime();
    console.log("fisrt enter");
}

//传数据
function test2(picBase)
{
    d = new Date();
    
    var ds = d.getTime() - time;
    console.log("Base64 in"+ds);
    time = d.getTime();
    var showpic = picBase;
   
   if(img == null)
        img = document.createElement("img");
    showpic = "data:image/jpeg;base64,"+showpic;

    var imgLoad = function (url) {
        
        img.src = url;
        if (img.complete)
        {
            //alert("init");

            init();
        } else {
             img.onload = function () {
                callback(img.width, img.height);
                img.onload = null;
            };
        };
    };

    imgLoad(showpic);
    console.log(d.time() - time);
    time = d.getTime();
}

function test4()
{
    d = new Date();
var ds =  d.getTime() - time;
    console.log("flash recieve base64:" + ds);
    time = d.getTime();
}

function test5()
{
    d = new Date();
    var ds1 =  d.getTime() - time;
    var ds2 =  d.getTime() - startTime;
    console.log("flash encode:" + ds1);
    console.log("total:" +ds2);
}



function loadSwf()
{
        var version ="1";
        var swfVersionStr = "11.5.0";
        var xiSwfUrlStr = "/v4/swf/playerProductInstall.swf";
        var flashvars = {};0
        flashvars.version = version;
        var params = {};
        params.quality = "high";
        params.bgcolor = "#bababa";
        params.allowscriptaccess = "always";
        params.allowfullscreen = "true";
        params.allowFullScreenInteractive = "true";
        params.wmode = "opaque";
        var attributes = {};
        attributes.id = "HaoZhaoPian";
        attributes.name = "HaoZhaoPian";
        attributes.align = "middle";
        swfobject.embedSWF(
            "../swf/TestReceiver.swf?v"+version, "flashContent",
            "100%", "100%",
            swfVersionStr, xiSwfUrlStr,
            flashvars, params, attributes);
        swfobject.createCSS("#flashContent", "");

}

