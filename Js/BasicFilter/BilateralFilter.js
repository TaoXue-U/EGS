
EGS.BilateralFilter = EGS.Class(EGS.ImageBaseFilter,
{
	paramBlurFactors : "blurFactors",
	paramDistanceNormalizationFactor : "distanceNormalizationFactor",
	paramBlurSamplerScale : "blurSamplerScale",
	paramSamplerSteps : "samplerSteps",

	initShaderFromString : function()
	{
		var vsShaderCode =EGS.VsShader1;
		var FsShaderCode = EGS.FsShaderTitle + "varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform float blurFactors[9];uniform float distanceNormalizationFactor;uniform float blurSamplerScale;uniform vec2 samplerSteps;const int samplerRadius = 4;float random(vec2 seed){return fract(sin(dot(seed ,vec2(12.9898,78.233))) * 43758.5453);}void main(){vec4 centralColor = texture2D(inputImageTexture, vTexCood);float gaussianWeightTotal = blurFactors[4];vec4 sum = centralColor * blurFactors[4];vec2 stepScale = blurSamplerScale * samplerSteps;float offset = random(vTexCood) - 0.5;    for(int i = 0; i < samplerRadius; ++i){vec2 dis = (float(i) + offset) * stepScale;        float blurfactor = blurFactors[samplerRadius-i];{vec4 sampleColor1 = texture2D(inputImageTexture, vTexCood + dis);float distanceFromCentralColor1 = min(distance(centralColor, sampleColor1) * distanceNormalizationFactor, 1.0);            float gaussianWeight1 = blurfactor * (1.0 - distanceFromCentralColor1);gaussianWeightTotal += gaussianWeight1;sum += sampleColor1 * gaussianWeight1;}{vec4 sampleColor2 = texture2D(inputImageTexture, vTexCood - dis);float distanceFromCentralColor2 = min(distance(centralColor, sampleColor2) * distanceNormalizationFactor, 1.0);            float gaussianWeight2 = blurfactor * (1.0 - distanceFromCentralColor2);gaussianWeightTotal += gaussianWeight2;sum += sampleColor2 * gaussianWeight2;}}gl_FragColor = sum / gaussianWeightTotal;}";
		this.initProgram(vsShaderCode, FsShaderCode);
		this.setDefault();
	},

	setParams : function()
	{

	},

	setDefault : function()
	{
		this.setBlurFactory();
	},

	setBlurScale : function(value, w, h)
	{
		this._program.useProgram();
		value = 200.0 * Math.pow(0.5, value / 50.0);
		var min = Math.min(w, h);
		var scale = min / value;
		this._program.setUniform1f(this.paramBlurSamplerScale, scale / 4.0);
	},

	setDistanceNormalizationFactor : function(v)
	{
		this._program.useProgram();
		this._program.setUniform1f(this.paramDistanceNormalizationFactor, v);
	},

	setSamplerSteps : function(w, h)
	{
		this._program.useProgram();
		this._program.setUniform2f(this.paramSamplerSteps, 1.0/ w, 1.0 / h);
	},	

	setBlurFactory : function()
	{
		var loc = this._program.uniformLocation(this.paramBlurFactors);
		var data = new Float32Array([0.05, 0.09, 0.9, 0.15, 0.18, 0.15, 0.12, 0.09, 0.2]);
		this._webglContext.uniform1fv(loc, data);
	},	

});