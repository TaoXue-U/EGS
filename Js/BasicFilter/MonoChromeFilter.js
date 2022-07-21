
EGS.MonoChromeFilter = EGS.Class(EGS.ImageBaseFilter,
{
	_paramRed : "red",
	_paramGreen : "green",
	_paramBlue : "blue",
	_paramCyan : "cyan",
	_paramMagenta : "magenta",
	_paramYellow : "yellow",

	initShaderFromString : function()
	{
		var vsShaderCode =EGS.VsShader1;
		var FsShaderCode = EGS.FsShaderTitle + "varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform float red;uniform float green;uniform float blue;uniform float cyan;uniform float magenta;uniform float yellow;void main(){vec4 src = texture2D(inputImageTexture, vTexCood);float maxc = max(max(src.r, src.g), src.b);float minc = min(min(src.r, src.g), src.b);float midc = src.r + src.g + src.b - maxc - minc;if(maxc == minc)gl_FragColor = src;vec3 ratioMax, ratioMin;ratioMax.xy = vec2(equal(src.rg, vec2(maxc)));float max_neg = 1.0 - ratioMax.x;ratioMax.y *= max_neg;ratioMax.z = (1.0 - ratioMax.y) * max_neg;vec3 compMax = vec3(red, green, blue) * ratioMax;ratioMin.xy = vec2(equal(src.rg, vec2(minc)));float min_neg = 1.0 - ratioMin.x;ratioMin.y *= min_neg;ratioMin.z = (1.0 - ratioMin.y) * min_neg;vec3 compMaxMid = vec3(cyan, magenta, yellow) * ratioMin;float total = (compMax.x + compMax.y + compMax.z) * (maxc - midc) + (compMaxMid.x + compMaxMid.y + compMaxMid.z) * (midc - minc) + minc;gl_FragColor = vec4(total, total, total, 1.0);}";
		this.initProgram(vsShaderCode, FsShaderCode);
	},


	setMonoParams : function(v1, v2, v3, v4, v5, v6)
	{
		this.setRed(v1);
		this.setGreen(v2);
		this.setBlue(v3);
		this.setCyan(v4);
		this.setMagenta(v5);
		this.setYellow(v6);
	},

	setRed : function(value)
	{
		this._program.useProgram();
		this._program.setUniform1f(this._paramRed, value);
	},

	setGreen : function(value)
	{
		this._program.useProgram();
		this._program.setUniform1f(this._paramGreen, value);
	},

	setBlue : function(value)
	{
		this._program.useProgram();
		this._program.setUniform1f(this._paramBlue, value);
	},

	setCyan : function(value)
	{
		this._program.useProgram();
		this._program.setUniform1f(this._paramCyan, value);
	},

	setMagenta : function(value)
	{
		this._program.useProgram();
		this._program.setUniform1f(this._paramMagenta, value);
	},

	setYellow : function(value)
	{
		this._program.useProgram();
		this._program.setUniform1f(this._paramYellow, value);
	},

});