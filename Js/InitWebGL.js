//初始化canvas
function initCanvas(canvasId)
{
    //获取绘制上下文
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

    //设置视口
    context.viewport(0, 0, myCanvasObject.width, myCanvasObject.height);

    return context;
}


//解析Shader代码
function shaderSourceFromScript(scriptID)
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
}

//编译shader
function compileShader(webgl, shaderVectexCode, shaderFramentCode, vertexShaderObj, fragmentShaderObj)
{
    //将shader代码装载到shader Object中
    webgl.shaderSource(vertexShaderObj, shaderVectexCode);
    webgl.shaderSource(fragmentShaderObj, shaderFramentCode);

    //编译shader代码
    webgl.compileShader(vertexShaderObj);
    webgl.compileShader(fragmentShaderObj);

    //检查是否编译成功
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
}

//链接Shader程序
function linkShader(webgl, programObj, vertexShaderObj, fragmentShaderObj)
{
    //一个程序对象只能并且必须附带一个顶点着色器和片段着色器
    webgl.attachShader(programObj, vertexShaderObj);
    webgl.attachShader(programObj, fragmentShaderObj);

    //将着色器变量关联到一个属性索引
   // webgl.bindAttribLocation(programObj, v3PositionIndex, "v3Position");
    webgl.linkProgram(programObj);

    //检查是否链接成功
    if (!webgl.getProgramParameter(programObj, webgl.LINK_STATUS))
    {
        alert("error:ProgramObject");
        return;
    }

    return programObj;
}

//初始化Shader程序，返回链接好的程序对象
function initShaders(webgl, vertexShaderId, framentShaderId, bindVariableData)
{
    //生成shaderobject
    var vertexShaderObject = webgl.createShader(webgl.VERTEX_SHADER);
    var fragmentShaderObject = webgl.createShader(webgl.FRAGMENT_SHADER);

    //编译
    compileShader(webgl, shaderSourceFromScript(vertexShaderId), shaderSourceFromScript(framentShaderId), vertexShaderObject, fragmentShaderObject);

    
    //链接shader
    //创建一个程序对象
    programObject = webgl.createProgram();
    //将着色器变量关联到一个属性索引，该操作必须在链接之前进行
    if(!bindVariableData instanceof Array )
    {
        alert("输入参数有错");
        return;
    }

    for (var i = 0; i < bindVariableData.length; i++)
    {
        webgl.bindAttribLocation(programObject, bindVariableData[i][0], bindVariableData[i][1]);
    }

    programObject = linkShader(webgl, programObject, vertexShaderObject, fragmentShaderObject);

    return programObject;
}

