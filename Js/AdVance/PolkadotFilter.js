EGS.PolkadotFilter = EGS.Class(EGS.HalftoneFilter,
{
	paramDotScaling : "dotScaling",

	initShaderFromString : function()
	{
		var vsShaderCode = EGS.VsShader1;
		var FsShaderCode = EGS.FsShaderTitle + "varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform vec2 dotPercent;uniform float aspectRatio;uniform float dotScaling;void main(){vec2 samplePos = vTexCood - mod(vTexCood, dotPercent) + 0.5 * dotPercent;vec2 coordToUse = vec2(vTexCood.x, (vTexCood.y - 0.5) * aspectRatio + 0.5);vec2 adjustedPos = vec2(samplePos.x, (samplePos.y - 0.5) * aspectRatio + 0.5);float dis = distance(coordToUse, adjustedPos);float checkForPresenceWithinDot = step(dis, (dotPercent.x * 0.5) * dotScaling);vec4 color = texture2D(inputImageTexture, samplePos);gl_FragColor = vec4(color.rgb * checkForPresenceWithinDot, color.a);}";
		this.initProgram(vsShaderCode, FsShaderCode);

		this.defaultParam();
	},

	defaultParam : function()
	{

	},

	setParams : function()
	{
		
	},

	setDotScaling : function(value)
	{
		this._program.useProgram();
		this._program.setUniform1f(this.paramDotScaling, value);
	},

});