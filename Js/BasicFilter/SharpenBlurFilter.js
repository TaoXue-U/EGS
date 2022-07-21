
EGS.SharpenBlurFilter = EGS.Class(EGS.ImageBaseFilter,
{
	paramSamplerSteps : "samplerSteps",
	paramBlurSamplerScale : "blurSamplerScale",
	paramIntesnsity : "intensity",

	initShaderFromString : function()
	{
		var vsShaderCode =EGS.VsShader1;
		var FsShaderCode = EGS.FsShaderTitle + "varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform vec2 samplerSteps;uniform float blurSamplerScale;uniform float intensity;void main(){vec4 src = texture2D(inputImageTexture, vTexCood);vec4 tmp = src +texture2D(inputImageTexture, vTexCood + blurSamplerScale * vec2(-samplerSteps.x, 0.0)) +texture2D(inputImageTexture, vTexCood + blurSamplerScale * vec2(samplerSteps.x, 0.0)) +texture2D(inputImageTexture, vTexCood + blurSamplerScale * vec2(0.0, -samplerSteps.y)) +texture2D(inputImageTexture, vTexCood + blurSamplerScale * vec2(0.0, samplerSteps.y));gl_FragColor = mix(tmp / 5.0, src, intensity);}";
		this.initProgram(vsShaderCode, FsShaderCode);
		this.setDefault();

	},

	setParams : function()
	{

	},

	setDefault : function()
	{
		this.setBlurSamplerScale(1.0);
		
	},

	setSamplerSteps : function(w, h)
	{
		this._program.useProgram();
		this._program.setUniform2f(this.paramSamplerSteps, 1.0/ w, 1.0 / h);
	},

	setBlurSamplerScale : function(v)
	{
		this._program.useProgram();
		this._program.setUniform1f(this.paramBlurSamplerScale, v);
	},

	setIntensity : function(v)
	{
		this._program.useProgram();
		this._program.setUniform1f(this.paramIntesnsity, v);
	},

	setSharpenIntensity : function(value)
	{
		if(value < 0.0) value = 0.0;
		this.setIntensity(value + 1.0);
	},

	setBlurIntensity : function(value)
	{
		if(value < 0.0) value = 0.0;
		if(value > 1.0) value = 1.0;

		this.setIntensity(1.0 - value);
	},

});