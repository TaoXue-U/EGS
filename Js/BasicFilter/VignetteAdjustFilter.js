
EGS.VignetteAdjustFilter = EGS.Class(EGS.ImageBaseFilter,
{
	vignetteString : "vignette",
	vignetteCenterString : "vignetteCenter",

	_vignette : null,
	_vignetteCenter : 1.0,

	_vignetteLocation : null,
	_vignetteCenterLocation : null,

	initShaderFromString : function()
	{
		this.initData();
		var vsShaderCode =EGS.VsShader1;
		var FsShaderCode = EGS.FsShaderTitle + "varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform vec2 vignette;uniform vec2 vignetteCenter;void main(){vec4 src = texture2D(inputImageTexture, vTexCood);float d = distance(vTexCood, vignetteCenter);float percent = clamp((d - vignette.x) / vignette.y, 0.0, 1.0);float alpha = 1.0 - percent;gl_FragColor = vec4(src.rgb * alpha, src.a);}";
		this.initProgram(vsShaderCode, FsShaderCode);
	},

	initData : function()
	{
		this._vignette = new EGS.Vec2(0.0, 0.0);
		this._vignetteCenter = new EGS.Vec2(0.5, 0.5);
	},

	setVignette : function(v1, v2)
	{
		this._vignette.data[0] = v1;
		this._vignette.data[1] = v2;
	},

	setVignetteCenter : function(v1, v2)
	{
		this._vignetteCenter.data[0] = v1;
		this._vignetteCenter.data[1] = v2;
	},

	setParamsLocation : function()
	{
		var program = this._program;
		this._vignetteLocation = program.uniformLocation(this.vignetteString);
		this._vignetteCenterLocation = program.uniformLocation(this.vignetteCenterString);
	},

	updateParams : function()
	{
		var context = this._webglContext;

		context.uniform2f(this._vignetteLocation, this._vignette.data[0], this._vignette.data[1]);
		context.uniform2f(this._vignetteCenterLocation, this._vignetteCenter.data[0], this._vignetteCenter.data[1]);
	},

});