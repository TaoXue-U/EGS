
EGS.ShadowHighlightFilter = EGS.Class(EGS.ImageBaseFilter,
{
	shadowsString : "shadows",
	highlightsString : "highlights",

	_shadows : 0.0,
	_highlights : 0.0, 

	_shadowsLocation : null,
	_highlightsLocation : null,


	initShaderFromString : function()
	{
		var vsShaderCode = EGS.VsShader1;
		var FsShaderCode = EGS.FsShaderTitle + "varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform float shadows;uniform float highlights;vec3 highlightAndShadow(vec3 src, float l, float d) {    if(src.r < 0.5){src.r = 4.0 * (d - 1.0) * src.r * src.r * src.r + 4.0 * (1.0 - d) * src.r * src.r + d * src.r;}else{src.r = 4.0 * (l - 1.0) * src.r * src.r * src.r + 8.0 * (1.0 - l) * src.r * src.r + (5.0 * l - 4.0) * src.r + 1.0 - l;}if(src.g < 0.5){src.g = 4.0 * (d - 1.0) * src.g * src.g * src.g + 4.0 * (1.0 - d) * src.g * src.g + d * src.g;}else{src.g = 4.0 * (l - 1.0) * src.g * src.g * src.g + 8.0 * (1.0 - l) * src.g * src.g + (5.0 * l - 4.0) * src.g + 1.0 - l;}if(src.b < 0.5){src.b = 4.0 * (d - 1.0) * src.b * src.b * src.b + 4.0 * (1.0 - d) * src.b * src.b + d * src.b;}else{src.b = 4.0 * (l - 1.0) * src.b * src.b * src.b + 8.0 * (1.0 - l) * src.b * src.b + (5.0 * l - 4.0) * src.b + 1.0 - l;}return src;}void main(){vec4 src = texture2D(inputImageTexture, vTexCood);src.rgb = highlightAndShadow(src.rgb * src.a, highlights, shadows);gl_FragColor = src;}";
		this.initProgram(vsShaderCode, FsShaderCode);
	},

	setShadows : function(value)
	{
		if(value > 0.0) value *= 0.68;
		var va = parseInt(value) + 100;
		var vb = va * (3.14159 / 400.0);
		value = Math.tan(vb);
		this._shadows = value;
	},

	setHighlights : function(value)
	{
		value = parseInt(value);
		value = -value;
		if(value > 0.0) value *= 0.68;
		value = Math.tan((value + 100.0) * (3.14159 / 400.0));
		this._highlights = value;
	},

	setParamsLocation : function()
	{
		var program = this._program;
		this._shadowsLocation = program.uniformLocation(this.shadowsString);
		this._highlightsLocation = program.uniformLocation(this.highlightsString);
	},

	updateParams : function()
	{
		var context = this._webglContext;

		context.uniform1f(this._shadowsLocation, this._shadows);
		context.uniform1f(this._highlightsLocation, this._highlights);
	},
});