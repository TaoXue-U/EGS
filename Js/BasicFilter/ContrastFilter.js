
EGS.ContrastFilter = EGS.Class(EGS.ImageBaseFilter,
{
	intensityString : "intensity",


	initShaderFromString : function()
	{
		var vsShaderCode = EGS.VsShader1;
		var FsShaderCode = EGS.FsShaderTitle +"varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform float intensity;void main(){vec4 textureColor = texture2D(inputImageTexture, vTexCood);gl_FragColor = vec4(((textureColor.rgb - vec3(0.5)) * intensity + vec3(0.5)), textureColor.a);}";
		this.initProgram(vsShaderCode, FsShaderCode);
	},

	setParams : function()
	{
	},

	setIntensity : function(value)
	{
		this._program.useProgram();
		this._program.setUniform1f(this.intensityString, value);
	},
});