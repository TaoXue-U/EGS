EGS.HalftoneFilter = EGS.Class(EGS.ImageBaseFilter,
{
	paramAspectRatio : "aspectRatio",
	paramDotPercent : "dotPercent",

	initShaderFromString : function()
	{
		var vsShaderCode = EGS.VsShader1;
		var FsShaderCode = EGS.FsShaderTitle + "varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform vec2 dotPercent;uniform float aspectRatio;void main(){vec2 samplePos = vTexCood - mod(vTexCood, dotPercent) + 0.5 * dotPercent;vec2 coordToUse = vec2(vTexCood.x, (vTexCood.y - 0.5) * aspectRatio + 0.5);vec2 adjustedPos = vec2(samplePos.x, (samplePos.y - 0.5) * aspectRatio + 0.5);float dis = distance(coordToUse, adjustedPos);vec4 color = texture2D(inputImageTexture, samplePos);vec3 dotScaling = 1.0 - color.rgb;vec3 presenceDot = 1.0 - step(dis, dotPercent.x * dotScaling * 0.5);gl_FragColor = vec4(presenceDot, color.a);}";
		this.initProgram(vsShaderCode, FsShaderCode);

		this.defaultParam();
	},

	defaultParam : function()
	{
	},

	setParams : function()
	{
		
	},

	setAllParams : function(dotSize, w, h)
	{
		var aspectRatio = w / h;
		var dotPercent = dotSize / w;

		this._program.useProgram();
		this._program.setUniform1f(this.paramAspectRatio, aspectRatio);
		this._program.setUniform2f(this.paramDotPercent, dotPercent, dotPercent / aspectRatio);
	},

});