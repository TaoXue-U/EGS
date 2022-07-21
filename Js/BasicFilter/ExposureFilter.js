
EGS.ExposureFilter = EGS.Class(EGS.ImageBaseFilter,
{
	intensityString : "exposure",


	initShaderFromString : function()
	{
		var vsShaderCode =EGS.VsShader1;
		var FsShaderCode = EGS.FsShaderTitle + "varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform float exposure;void main(){vec4 color = texture2D(inputImageTexture, vTexCood);gl_FragColor = vec4(color.rgb * exp2(exposure), color.a);}";
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