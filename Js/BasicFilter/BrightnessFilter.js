
EGS.BrightnessFilter = EGS.Class(EGS.ImageBaseFilter,
{
	intensityString : "intensity",


	initShaderFromString : function()
	{
		var vsShaderCode = EGS.VsShader1;
		var FsShaderCode = EGS.FsShaderTitle + "varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform float intensity;const float SQRT2 = 1.41421;void main(){vec4 tmp = texture2D(inputImageTexture, vTexCood);vec3 src = tmp.rgb;float alpha = tmp.a;if (intensity != 0.0){float fac = SQRT2 / intensity;if(intensity > 0.0){src = 1.0 - src - (fac / SQRT2) + sqrt(1.0 - SQRT2*fac + (2.0*SQRT2) * src * fac + 0.5 * fac * fac);}else{src = 1.0 - src - (fac / SQRT2) - sqrt(1.0 - SQRT2*fac + (2.0*SQRT2) * src * fac + 0.5 * fac * fac);}}gl_FragColor = vec4(src, alpha);}";
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