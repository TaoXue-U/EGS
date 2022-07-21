
EGS.EmbossFilter = EGS.Class(EGS.ImageBaseFilter,
{
	intensityString : "intensity",
	strideString : "stride",
	normString : "norm",
	paramSamplerSteps : "samplerSteps",

	initShaderFromString : function()
	{
		var vsShaderCode = EGS.VsShader1;
		var FsShaderCode = EGS.FsShaderTitle + "uniform sampler2D inputImageTexture;varying vec2 vTexCood;uniform vec2 samplerSteps;uniform float stride;uniform float intensity;uniform vec2 norm;void main() {  vec4 src = texture2D(inputImageTexture, vTexCood);  vec3 tmp = texture2D(inputImageTexture, vTexCood + samplerSteps * stride * norm).rgb - src.rgb + 0.5;  float f = (tmp.r + tmp.g + tmp.b) / 3.0;  gl_FragColor = vec4(mix(src.rgb, vec3(f, f, f), intensity), src.a);}";
		this.initProgram(vsShaderCode, FsShaderCode);
	},

	setParams : function()
	{
		
	},

	setNorm : function(value)
	{
		var mat2 = EGS.mat2Rotation(value);
		var vec2 = new EGS.Vec2(1.0, 0.0);
		var v2 =  EGS.mat2MulVec2(mat2, vec2);
		this._program.useProgram();
		this._program.setUniform2f(this.normString, v2.data[0], v2.data[1]);
	},

	setStride : function(value)
	{
		this._program.useProgram();
		this._program.setUniform1f(this.strideString, value);
	},

	setIntensity : function(value)
	{
		this._program.useProgram();
		this._program.setUniform1f(this.intensityString, value);
	},

	setSamplerSteps : function(w, h)
	{
		this._program.useProgram();
		this._program.setUniform2f(this.paramSamplerSteps, 1.0/ w, 1.0 / h);
	},
});