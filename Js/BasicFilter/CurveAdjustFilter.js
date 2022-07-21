
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