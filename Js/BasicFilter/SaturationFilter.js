
EGS.SaturationFilter = EGS.Class(EGS.ImageBaseFilter,
{
	intensityString : "intensity",


	initShaderFromString : function()
	{
		var vsShaderCode =EGS.VsShader1;
		// var FsShaderCode = EGS.requestTextByURL(EGS.ShaderDir+"SaturationShader.txt");
		var FsShaderCode = EGS.FsShaderTitle + "varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform float intensity;void main(){vec4 src = texture2D(inputImageTexture,vTexCood);float lum = (max(max(src.r,src.g),src.b) + min(min(src.r,src.g),src.b)) / 2.0;gl_FragColor = vec4(mix(vec3(lum),src.rgb,intensity),src.a);}";
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