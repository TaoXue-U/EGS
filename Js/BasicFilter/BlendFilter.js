"use strict";
EGS.MixMode = 
{
    MIX_BLEND : 0,
    KR_BLEND : 1,
    PIX_BLEND : 2,
    TILE_BLEND : 3,
    VIGNETTE_BLEND : 4,
};

EGS.BlendFilter = EGS.Class(EGS.ImageBaseFilter,
{
	intensityString : "intensity",
	blendColorString : "blendColor",
	ratioAspectString : "ratioAspect",
	scalingRatioString : "scalingRatio",
	
	_intensity : null,
	_blendColor : null,
	_ratioAspect : null,
	_scalinigRatio : null,

	_intensityLocation : null,
	_blendColorLocation : null,
	_ratioAspectLocation :null,
	_scalingRotiolocation : null,

	mode : null,
	blendMode : null,
	_dictionary : null,
	_mixModeDictionary : null,

	//vigblend params
	_vignetteString : "vignette",
	_vignetteCenterString : "vignetteCenter",

	_vignetteCenter : null,
	_vignette : null,

	_vignetteLocation : null,
	_vignetteCenterLocation : null,

	_textures : null,

	initialize : function(ctx, mode, blendMode)
	{
		this._textures = new Array();
		this.initData();
		this.mode = this._mixModeDictionary[mode];
		this.blendMode = this._dictionary[blendMode];

		this._webglContext = ctx;
		this._frameBuffer=ctx.createFramebuffer();
		this._renderBuffer = ctx.createRenderbuffer();
		this.initShaderFromString();
	},

	initData : function()
	{
		this._blendColor = new EGS.Vec4();
		this._ratioAspect = new EGS.Vec4();
		this._scaleinigRatio = new EGS.Vec2();
		this._vignetteCenter = new EGS.Vec2(0.5, 0.5);
		this._vignette = new EGS.Vec2(0.5, 0.5);

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
			"darken" : EGS.TextureBlendMode.BLEND_DARKEN,
			"ol" : EGS.TextureBlendMode.BLEND_OVERLAY,
			"sl" : EGS.TextureBlendMode.BLEND_SOFTLIGHT,
		};

		this._mixModeDictionary=
		{
			"blend" : EGS.MixMode.MIX_BLEND,
			"krblend" :EGS.MixMode.KR_BLEND,
			"pixblend" : EGS.MixMode.PIX_BLEND,
			"tileblend" : EGS.MixMode.TILE_BLEND,
			"vigblend" : EGS.MixMode.VIGNETTE_BLEND,
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
			case EGS.MixMode.TILE_BLEND:
				shadeCode = EGS.FsShaderTitle+"varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform sampler2D blendTexture;uniform float intensity;uniform vec2 scalingRatio;%svoid main(){vec4 src = texture2D(inputImageTexture, vTexCood);vec4 dst = texture2D(blendTexture, mod(vTexCood * scalingRatio, 1.0));gl_FragColor = vec4(blend(src.rgb, dst.rgb, dst.a * intensity), src.a);}";
				break;
			case EGS.MixMode.VIGNETTE_BLEND:
				shadeCode = EGS.FsShaderTitle+"varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform vec4 blendColor;uniform float intensity;uniform vec2 vignette;uniform vec2 vignetteCenter;%s\nvoid main(){vec4 src = texture2D(inputImageTexture, vTexCood);float d = distance(vTexCood, vignetteCenter);float percent = clamp((d - vignette.x) / vignette.y, 0.0, 1.0);percent = percent * percent * (3.0 - 2.0 * percent);gl_FragColor = vec4(blend(src.rgb, blendColor.rgb, intensity * blendColor.a * percent), src.a);}";
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
			case EGS.TextureBlendMode.BLEND_DARKEN:
				shadeCode = "vec3 blend(vec3 src1, vec3 src2, float alpha){return mix(src1, min(src1, src2), alpha);}";
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

	setParamsLocation : function()
	{
		var program = this._program;
		this._intensityLocation = program.uniformLocation(this.intensityString);

		switch(this.mode)
		{
			case EGS.MixMode.PIX_BLEND:
				this._blendColorLocation = program.uniformLocation(this.blendColorString);
				break;
			case EGS.MixMode.KR_BLEND:
				this._ratioAspectLocation = program.uniformLocation(this.ratioAspectString);
				break;
			case EGS.MixMode.TILE_BLEND:
				this._scalingRotiolocation = program.uniformLocation(this.scalingRatioString);
				break;
			case EGS.MixMode.VIGNETTE_BLEND:
				this._blendColorLocation = program.uniformLocation(this.blendColorString);
				this._vignetteLocation = program.uniformLocation(this._vignetteString);
				this._vignetteCenterLocation = program.uniformLocation(this._vignetteCenterString);
				break;
			defalut:
				break;
		}
	},

	//common params
	setIntensity : function(value)
	{
		value = value > 1 ? value/100 : value;
		this._intensity = value;
	},

	//pixblend params
	setColor : function(v1, v2, v3, v4)
	{
		if(v1 >1 || v1 >2 || v3 >1 || v4 >1)
		{
			v1 /= 255;
			v2 /= 255;
			v3 /= 255;
			v4 /= 255;
		}

		this._blendColor.data[0] = v1;
		this._blendColor.data[1] = v2;
		this._blendColor.data[2] = v3;
		this._blendColor.data[3] = v4;
	},

	//krblend params
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
		this._ratioAspect.data[0] = x;
		this._ratioAspect.data[1] = y;
		this._ratioAspect.data[2] = z;
		this._ratioAspect.data[3] = w;
	},

	setScalingRatio : function(v1, v2)
	{
		this._scaleinigRatio.data[0] = v1;
		this._scaleinigRatio.data[1] = v2;
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
	    webgl.uniform1i(uniform, webgl.TEXTURE0 +  this.startIndex);
	    this.startIndex++;
	    this._textures.push(texture);
	},

	//vigblend
	setVignetteCenter : function(x, y)
	{
		this._vignetteCenter.data[0] = x;
		this._vignetteCenter.data[1] = y;
	},

	setVigenette : function(start, range)
	{
		this._vignette.data[0] = start;
		this._vignette.data[1] = range;
	},

	updateParams : function()
	{
		var context = this._webglContext;

		context.uniform1f(this._intensityLocation, this._intensity);

		switch(this.mode)
		{
			case EGS.MixMode.PIX_BLEND:
				context.uniform4f(this._blendColorLocation, this._blendColor.data[0], this._blendColor.data[1], this._blendColor.data[2], this._blendColor.data[3]);
				break;
			case EGS.MixMode.KR_BLEND:
				context.uniform4f(this._ratioAspectLocation, this._ratioAspect.data[0], this._ratioAspect.data[1], this._ratioAspect.data[2], this._ratioAspect.data[3]);		
				break;
			case EGS.MixMode.TILE_BLEND:
				context.uniform2f(this._scalingRotiolocation, this._scaleinigRatio.data[0], this._scaleinigRatio.data[1]);
				break;
			case EGS.MixMode.VIGNETTE_BLEND:
				context.uniform4f(this._blendColorLocation, this._blendColor.data[0], this._blendColor.data[1], this._blendColor.data[2], this._blendColor.data[3]);
				context.uniform2f(this._vignetteLocation, this._vignette.data[0], this._vignette.data[1]);
				context.uniform2f(this._vignetteCenterLocation, this._vignetteCenter.data[0], this._vignetteCenter.data[1]);
				break;
			defalut:
				break;
		}
	},

	release : function()
	{
		this._program.release();
		this._texture.release();

		for (var i = this._textures.length - 1; i >= 0; i--) {
			this._textures[i].release();
			this._textures[i] = null;
		};
	},
});