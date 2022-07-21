
EGS.ColorLevelFilter = EGS.Class(EGS.ImageBaseFilter,
{
	colorlevelString : "colorLevel",
	gammaString : "gamma",

	_colorLevel : null,
	_gamma : 1.0,

	_colorLevelLocation : null,
	_gammaLocation : null,

	initShaderFromString : function()
	{
		this.initData();
		var vsShaderCode =EGS.VsShader1;
		var FsShaderCode = EGS.FsShaderTitle + "varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform vec2 colorLevel;uniform float gamma;vec3 levelFunc(vec3 src, vec2 colorLevel) {return clamp((src - colorLevel.x) / (colorLevel.y - colorLevel.x), 0.0, 1.0);}vec3 gammaFunc(vec3 src, float value){return clamp(pow(src, vec3(value)), 0.0, 1.0);}void main(){vec4 src = texture2D(inputImageTexture, vTexCood);src.rgb = levelFunc(src.rgb, colorLevel);src.rgb = gammaFunc(src.rgb, gamma);gl_FragColor = src;}";
		this.initProgram(vsShaderCode, FsShaderCode);
	},

	initData : function()
	{
		this._colorLevel = new EGS.Vec2(0.0, 1.0);
	},

	setColorLevel : function(v1, v2)
	{
		this._colorLevel.data[0] = v1;
		this._colorLevel.data[1] = v2;
	},

	setGamma : function(value)
	{
		this._gamma = value;
	},

	setParamsLocation : function()
	{
		var program = this._program;
		this._colorLevelLocation = program.uniformLocation(this.colorlevelString);
		this._gammaLocation = program.uniformLocation(this.gammaString);
	},

	updateParams : function()
	{
		var context = this._webglContext;

		context.uniform2f(this._colorLevelLocation, this._colorLevel.data[0], this._colorLevel.data[1]);
		context.uniform1f(this._gammaLocation, this._gamma);
	},

});