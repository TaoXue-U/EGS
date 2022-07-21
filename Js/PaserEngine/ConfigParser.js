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
			if(tmpStr.indexOf("vigblend") >= 0)
			{
				this.vigBlendParser(tmpStr);
			}
			else if(tmpStr.indexOf("pixblend") >=0)
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
			else if(tmpStr.indexOf("vignette") >= 0)
			{
				this.vignetteParser(tmpStr);
			}
			else if(tmpStr.indexOf("colormul") >= 0)
			{
				this.colorMulParser(tmpStr);
			}
			else if(tmpStr.indexOf("beautify") >= 0)
			{
				this.beautifyParser(tmpStr);
			}
			else if(tmpStr.indexOf("style") >= 0)
			{
				this.styleParser(tmpStr);
			}
			

		};

	},

	selectColorParser : function(parserString)
	{
		var webglContext = this._webglContext;

		var indexs = new Array();

		var selectColorFilter = new EGS.SelectiveColorFilter( webglContext);

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

		indexs.sort(function(a,b){return a-b});

		var strArr = new Array(); 
		for (var i = 0; i < indexs.length - 1; i++) {
			var tmpstr  = parserString.slice(indexs[i], indexs[i+1]);
			strArr.push(tmpstr);
		};

		var tmpStr1 = parserString.slice(indexs[indexs.length - 1], parserString.length - 1);
		strArr.push(tmpStr1);

		for (var i = 0; i < strArr.length; i++) {
			var tmp = strArr[i];
			var nums = tmp.match(/-?\d+/g);

			if(tmp.indexOf("yellow") >= 0)
			{
				selectColorFilter.setYellow(nums[0],nums[1], nums[2], nums[3]);
			}
			else if(tmp.indexOf("green") >= 0)
			{
				selectColorFilter.setGreen(nums[0],nums[1], nums[2], nums[3]);
			}
			else if(tmp.indexOf("cyan") >= 0)
			{
				selectColorFilter.setCyan(nums[0],nums[1], nums[2], nums[3]);
			}
			else if( tmp.indexOf("blue") >= 0)
			{
				selectColorFilter.setBlue(nums[0],nums[1], nums[2], nums[3]);
			}
			else if( tmp.indexOf("magenta") >= 0)
			{
				selectColorFilter.setMagenta(nums[0],nums[1], nums[2], nums[3]);
			}
			else if(tmp.indexOf("white") >= 0)
			{
				selectColorFilter.setWhite(nums[0],nums[1], nums[2], nums[3]);
			}
			else if(tmp.indexOf("gray") >= 0)
			{
				selectColorFilter.setGray(nums[0],nums[1], nums[2], nums[3]);
			}
			else if(tmp.indexOf("black") >= 0)
			{
				selectColorFilter.setBlack(nums[0],nums[1], nums[2], nums[3]);
			}
			else if(tmp.indexOf("red") >= 0)
			{
				selectColorFilter.setRed(nums[0],nums[1], nums[2], nums[3]);
			}
		}

		this._manager.addFilter(selectColorFilter);
	},

	curveParser : function(parserString)
	{
		parserString = parserString.toUpperCase();
		var webglContext = this._webglContext;

		var indexs = new Array();

		var curveFilter = new EGS.CurveAdjustFilter( webglContext);


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

		var rgbPntArr = new Array();
		var isNotRgb = false;

		for (var i = 0; i < strArr.length; i++) {
			var tmp = strArr[i];
			var nums = tmp.match(/\d+/g);
			var points = new Array(); 
			for (var j = 0; j < nums.length/2; j++) {
				points.push(this.createPoint(nums[j*2], nums[j*2+1]));
			};
			if(tmp.indexOf("RGB(") >= 0)
			{
				if(i < 1){
					var curveFilter1 = new EGS.CurveAdjustFilter(webglContext);
					curveFilter1.pushBackPoints(points, 0);
					curveFilter1.genTex();
					this._manager.addFilter(curveFilter1);
				}
				else
				{
					rgbPntArr = points;
				}
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

		if(rgbPntArr.length > 0)
		{
			var curveFilter2 = new EGS.CurveAdjustFilter(webglContext);
			curveFilter2.pushBackPoints(rgbPntArr, 0);
			curveFilter2.genTex();
			this._manager.addFilter(curveFilter2);
		}

	},

	blendParser : function(parserString)
	{
		var webglContext = this._webglContext;

		var data = parserString.match(/\S+/g);
		if(data.length != 4)
		{
			console.error("blend effcet params error");
			return;
		}
		var blendFilter = new EGS.BlendFilter( webglContext, data[0], data[1]);
		blendFilter.setIntensity(data[3]);
		
		if(data[0] == "krblend")
		{
			blendFilter.setRatioAspect(this._manager._srcTex.width/this._manager._srcTex.height, this._texSource[data[2]].width/ this._texSource[data[2]].height);
		}

		switch(data[0])
		{
			case "krblend":
				blendFilter.setRatioAspect(this._manager._srcTex.width/this._manager._srcTex.height, this._texSource[data[2]].width/ this._texSource[data[2]].height);
				break;
			case "tileblend":
				blendFilter.setScalingRatio(this._manager._srcTex.width/this._texSource[data[2]].width, this._manager._srcTex.height/this._texSource[data[2]].height);
				break;
			default:
				break;
		}
		blendFilter.setTexture(this._texSource[data[2]]);
		this._manager.addFilter(blendFilter);
	},

	pixblendParser : function(parserString)
	{

		var webglContext = this._webglContext;

		var data = parserString.match(/\S+/g);
		if(data.length != 7)
		{
			console.error("blend effcet params error");
			return;
		}
		var blendFilter = new EGS.BlendFilter(webglContext, data[0], data[1]);
		blendFilter.setIntensity(data[6]);
		blendFilter.setColor(data[2],data[3],data[4],data[5]);

		this._manager.addFilter(blendFilter);
	},

	vigBlendParser : function(parserString)
	{
		var webglContext = this._webglContext;

		var data = parserString.match(/\S+/g);
		if(data.length != 12)
		{
			console.error("blend effcet params error");
			return;
		}
		var blendFilter = new EGS.BlendFilter( webglContext, data[0], data[1]);
		blendFilter.setIntensity(data[6]);
		blendFilter.setColor(data[2],data[3],data[4],data[5]);
		blendFilter.setVigenette(data[7],data[8]);
		blendFilter.setVignetteCenter(data[9], data[10]);

		this._manager.addFilter(blendFilter);
	},

	adjustParser : function(parserString)
	{
		var webglContext = this._webglContext;

		var data = parserString.match(/\S+/g);
		if(parserString.indexOf("brightness") >= 0)
		{
			var brightnessFilter = new EGS.BrightnessFilter( webglContext);
			brightnessFilter.setIntensity(data[2]);
			this._manager.addFilter(brightnessFilter);
		}
		else if(parserString.indexOf("contrast") >= 0)
		{
			var contrastFilter = new EGS.ContrastFilter( webglContext);
			contrastFilter.setIntensity(data[2]);
			this._manager.addFilter(contrastFilter);
		}
		else if(parserString.indexOf("saturation") >= 0)
		{
			var saturationFilter = new EGS.SaturationFilter( webglContext);
			saturationFilter.setIntensity(data[2])
			this._manager.addFilter(saturationFilter);
		}
		else if(parserString.indexOf("level") >= 0)
		{
			var colorLevelFilter  = new EGS.ColorLevelFilter( webglContext);
			colorLevelFilter.setColorLevel(data[2], data[3]);
			colorLevelFilter.setGamma(data[4]);
			this._manager.addFilter(colorLevelFilter);
		}
		else if(parserString.indexOf("whitebalance") >= 0)
		{
		    var whitebalanceFilter  = new EGS.WhiteBalanceFilter(webglContext);
		    whitebalanceFilter.setTemperature(data[2]);
			whitebalanceFilter.setTint(data[3]);
			this._manager.addFilter(whitebalanceFilter);
		}
		else if(parserString.indexOf("hsl") >= 0)
		{
			var hslAdjust = new EGS.HSLAdjust( webglContext);
			hslAdjust.setHue(data[2]);
			hslAdjust.setSaturation(data[3]);
			hslAdjust.setLuminance(data[4]);
			this._manager.addFilter(hslAdjust);
		}
		else if(parserString.indexOf("shadowhighlight") >= 0)
		{
			var shadowhighlightFilter  = new EGS.ShadowHighlightFilter( webglContext);
			var data = parserString.match(/\S+/g);
			shadowhighlightFilter.setShadows(data[2]);
			shadowhighlightFilter.setHighlights(data[3]);

			this._manager.addFilter(shadowhighlightFilter);
		}
		else if(parserString.indexOf("colorbalance") >= 0)
		{
			this.colorbalanceParser(parserString);
		}
		else if(parserString.indexOf("hsv") >= 0)
		{
			this.hsvParser(parserString);
		}
		else if(parserString.indexOf("exposure") >= 0)
		{
			this.exposureParser(parserString);
		}
		else if(parserString.indexOf("monochrome") >= 0)
		{
			this.monochromeParser(parserString);
		}
		else if(parserString.indexOf("blur") >= 0 || parserString.indexOf("sharpen") >= 0)
		{
			this.sharpenBlurParser(parserString);
		}
	},

	vignetteParser : function(parserString)
	{
		var webglContext = this._webglContext;

	    var vignetteAdjustFilter  = new EGS.VignetteAdjustFilter( webglContext);

		var data = parserString.match(/\S+/g);
		if(data.length == 3)
		{
			 vignetteAdjustFilter.setVignette(data[1], data[2]);
			 vignetteAdjustFilter.setVignetteCenter(0.5, 0.5);
		}
		else if(data.length == 5)
		{
			 vignetteAdjustFilter.setVignette(data[1], data[2]);
			 vignetteAdjustFilter.setVignetteCenter(data[3], data[4]);
		}
		this._manager.addFilter(vignetteAdjustFilter);
	},

	shadowhighlightParser : function(parserString)
	{

		var webglContext = this._webglContext;

	    var shadowhighlightFilter  = new EGS.ShadowHighlightFilter( webglContext);

		var data = parserString.match(/\S+/g);

		shadowhighlightFilter.setShadows(data[1]);
		shadowhighlightFilter.setHighlights(data[2]);

		this._manager.addFilter(shadowhighlightFilter);
	},

	colorLevelParser : function(parserString)
	{
		
		var webglContext = this._webglContext;

	    var colorLevelFilter  = new EGS.ColorLevelFilter(webglContext);
	    
	    var data = parserString.match(/\S+/g);

		colorLevelFilter.setColorLevel(data[1], data[2]);
		colorLevelFilter.setGamma(data[3]);

		this._manager.addFilter(colorLevelFilter);
	},

	whiteBalanceParser : function(parserString)
	{
	
		var webglContext = this._webglContext;

	    var whitebalanceFilter  = new EGS.WhiteBalanceFilter( webglContext);
	    
	    var data = parserString.match(/\S+/g);

	    whitebalanceFilter.setColorLevel(data[1]);
		whitebalanceFilter.setGamma(data[2]);

		this._manager.addFilter(whitebalanceFilter);
	},

	colorbalanceParser : function(parserString)
	{
		
		var webglContext = this._webglContext;

	    var colorBalanceFilter  = new EGS.ColorBalanceFilter( webglContext);
	    
	    var data = parserString.match(/\S+/g);

	    colorBalanceFilter.setRed(data[2]);
	    colorBalanceFilter.setGreen(data[3]);
	    colorBalanceFilter.setBlue(data[4]);

		this._manager.addFilter(colorBalanceFilter);
	},

	hsvParser : function(parserString)
	{
		
		var webglContext = this._webglContext;

		var data = parserString.match(/\S+/g);

	    var hsvFilter  = new EGS.HSVAdjustFilter( webglContext);
	    hsvFilter.setVColor1(data[2], data[3], data[4]);
	    hsvFilter.setVColor2(data[5], data[6], data[7]);

	    this._manager.addFilter(hsvFilter);
	},

	exposureParser : function(parserString)
	{
		
		var webglContext = this._webglContext;

		var data = parserString.match(/\S+/g);

	    var exposureFilter  = new EGS.ExposureFilter( webglContext);
	    exposureFilter.setIntensity(data[2]);

	    this._manager.addFilter(exposureFilter);
	},

	monochromeParser : function(parserString)
	{
		
		var webglContext = this._webglContext;

		var data = parserString.match(/\S+/g);

	    var monoChromeFilter  = new EGS.MonoChromeFilter(webglContext);
	    monoChromeFilter.setMonoParams(data[2], data[3], data[4], data[5], data[6], data[7]);

	    this._manager.addFilter(monoChromeFilter);
	},

	colorMulParser : function(parserString)
	{
		
		var webglContext = this._webglContext;

		var data = parserString.match(/\S+/g);
		var colorMulFilter;
		if(parserString.indexOf("flt") >= 0 || parserString.indexOf("FLT") >= 0)
		{
			 colorMulFilter  = new EGS.ColorMulFilter(webglContext, "flt");
			 colorMulFilter.setFLT(data[2]);
		}
		else if(parserString.indexOf("vec") >= 0)
		{
			colorMulFilter  = new EGS.ColorMulFilter(webglContext, "vec");
			colorMulFilter.setVEC(data[2], data[3], data[4]);
		}
		else if(parserString.indexOf("mat") >= 0)
		{
			colorMulFilter  = new EGS.ColorMulFilter(webglContext, "mat");
			colorMulFilter.setMAT(data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[9], data[10]);
		}

	    this._manager.addFilter(colorMulFilter);
	},

	beautifyParser : function(parserString)
	{
		var webglCanvas = this._webglCanas;
		var webglContext = this._webglContext;

		var data = parserString.match(/\S+/g);
		
		if(parserString.indexOf("bilateral") >= 0)
		{
			var repeatTimes = data[4];
			for (var i = 0; i < repeatTimes; i++) {
				var bilateralFilter = new EGS.BilateralFilter(webglCanvas, webglContext);
				bilateralFilter.setBlurScale(data[2], webglCanvas.width, webglCanvas.height);
				bilateralFilter.setDistanceNormalizationFactor(data[3]);
				bilateralFilter.setSamplerSteps(webglCanvas.width, webglCanvas.height);

				this._manager.addFilter(bilateralFilter);
			};
		}

	},

	sharpenBlurParser : function(parserString)
	{
		var webglCanvas = this._webglCanas;
		var webglContext = this._webglContext;

		var data = parserString.match(/\S+/g);

		var sharpenBlurFilter = new EGS.SharpenBlurFilter(webglCanvas, webglContext);
		sharpenBlurFilter.setBlurSamplerScale(data[3]);
		sharpenBlurFilter.setSamplerSteps(webglCanvas.width, webglCanvas.height);

		if(parserString.indexOf("blur") >= 0)
		{
			sharpenBlurFilter.setBlurSamplerScale(data[2]);
		}
		else if(parserString.indexOf("sharpen") >= 0)
		{
			sharpenBlurFilter.setSharpenIntensity(data[2]);
		}

		this._manager.addFilter(sharpenBlurFilter);
	},	

	styleParser : function(parserString)
	{
		var webglCanvas = this._webglCanas;
		var webglContext = this._webglContext;

		var data = parserString.match(/\S+/g);

		if(parserString.indexOf("crosshatch") >= 0)
		{
			var crosshatchFilter = new EGS.CrosshatchFilter(webglContext);
			crosshatchFilter.setCrossHatchSpacing(data[2]);
			crosshatchFilter.setLineWidth(data[3]);

			this._manager.addFilter(crosshatchFilter);
		}
		else if(parserString.indexOf("emboss") >= 0)
		{
			var embossFilter = new EGS.EmbossFilter(webglContext);

			embossFilter.setIntensity(data[2]);
			embossFilter.setStride(data[3]);
			embossFilter.setNorm(data[4]);
			embossFilter.setSamplerSteps(webglCanvas.width, webglCanvas.height);
			this._manager.addFilter(embossFilter);
		}
		else if(parserString.indexOf("halftone") >= 0)
		{
			var halfltoneFilter = new EGS.HalftoneFilter(webglContext);
			halfltoneFilter.setAllParams(data[2], webglCanvas.width, webglCanvas.height);

			this._manager.addFilter(halfltoneFilter);
		}
		else if(parserString.indexOf("haze") >= 0) 
		{
			var hazeFilter = new EGS.HazeFilter(webglContext);
			hazeFilter.setParamDistance(data[2]);
			hazeFilter.setParamSlope(data[3]);
			hazeFilter.setparamHazeColor(data[4], data[5], data[6]);

			this._manager.addFilter(hazeFilter);
		}
		else if(parserString.indexOf("polkadot") >= 0)
		{
			var polkadotFilter = new EGS.PolkadotFilter(webglContext);
			polkadotFilter.setAllParams(1.0, webglCanvas.width, webglCanvas.height);
			polkadotFilter.setDotScaling(data[2]);

			this._manager.addFilter(polkadotFilter);
		}
	},


});