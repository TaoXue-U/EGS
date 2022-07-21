EGS.HSLAdjust = EGS.Class(EGS.ImageBaseFilter,
{
	hueString : "hue",
	saturationString : "saturation",
	LuminanceString : "luminance",

	_hue : 0.0,
	_saturation : 0.0,
	_luminance : 0.0,

	_hueLocation : null,
	_saturationLocation : null,
	_luminanceLocation : null,

	initShaderFromString : function()
	{
		this.initData();
		var vsShaderCode =EGS.VsShader1;
		var FsShaderCode = EGS.FsShaderTitle + "varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform float saturation;uniform float hue;uniform float luminance;vec3 RGB2HSL(vec3 src){float maxc = max(max(src.r, src.g), src.b);float minc = min(min(src.r, src.g), src.b);float L = (maxc + minc) / 2.0;if(maxc == minc)return vec3(0.0, 0.0, L);float H, S;if(L < 0.5)S = (maxc - minc) / (maxc + minc);else S = (maxc - minc) / (2.0 - maxc - minc);if(maxc == src.r)H = (src.g - src.b) / (maxc - minc);else if(maxc == src.g)H = 2.0 + (src.b - src.r) / (maxc - minc);else H = 4.0 + (src.r - src.g) / (maxc - minc);H *= 60.0;if(H < 0.0) H += 360.0;return vec3(H / 360.0, S, L); }vec3 HSL2RGB(vec3 src) {if(src.y <= 0.0)return vec3(src.z, src.z, src.z);float q = (src.z < 0.5) ? src.z * (1.0 + src.y) : (src.z + src.y - (src.y * src.z));float p = 2.0 * src.z - q;vec3 dst = vec3(src.x + 0.333, src.x, src.x - 0.333);if(dst.r < 0.0) dst.r += 1.0;else if(dst.r > 1.0) dst.r -= 1.0;if(dst.g < 0.0) dst.g += 1.0;else if(dst.g > 1.0) dst.g -= 1.0;if(dst.b < 0.0) dst.b += 1.0;else if(dst.b > 1.0) dst.b -= 1.0;if(dst.r < 1.0 / 6.0)dst.r = p + (q - p) * 6.0 * dst.r;else if(dst.r < 0.5)dst.r = q;else if(dst.r < 2.0 / 3.0)dst.r = p + (q - p) * ((2.0 / 3.0) - dst.r) * 6.0;else dst.r = p;if(dst.g < 1.0 / 6.0)dst.g = p + (q - p) * 6.0 * dst.g;else if(dst.g < 0.5)dst.g = q;else if(dst.g < 2.0 / 3.0)dst.g = p + (q - p) * ((2.0 / 3.0) - dst.g) * 6.0;else dst.g = p;if(dst.b < 1.0 / 6.0)dst.b = p + (q - p) * 6.0 * dst.b;else if(dst.b < 0.5)dst.b = q;else if(dst.b < 2.0 / 3.0)dst.b = p + (q - p) * ((2.0 / 3.0) - dst.b) * 6.0;else dst.b = p;return dst;}vec3 adjustColor(vec3 src, float h, float s, float l) {src = RGB2HSL(src);src.x += h;src.y *= 1.0 + s;src.z *= 1.0 + l;return HSL2RGB(src);}void main(){vec4 src = texture2D(inputImageTexture, vTexCood);src.rgb = adjustColor(src.rgb, hue, saturation, luminance);gl_FragColor = src;}";
		this.initProgram(vsShaderCode, FsShaderCode);
	},

	initData : function()
	{

	},

	setHue : function(value)
	{
		this._hue = value;
	},

	setSaturation : function(value)
	{
		this._saturation = value;
	},

	setLuminance : function(value)
	{
		this._luminance = value;
	},

	setParamsLocation : function()
	{
		var program = this._program;
		this._hueLocation = program.uniformLocation(this.hueString);
		this._saturationLocation = program.uniformLocation(this.saturationString);
		this._luminanceLocation = program.uniformLocation(this.LuminanceString);
	},

	updateParams : function()
	{
		var context = this._webglContext;

		context.uniform1f(this._hueLocation, this._hue);
		context.uniform1f(this._saturationLocation, this._saturation);
		context.uniform1f(this._luminanceLocation, this._luminance);
	},

});