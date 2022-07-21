EGS.HazeFilter = EGS.Class(EGS.ImageBaseFilter,
{
	paramDistance : "distance",
	paramSlope : "slope",
	paramHazeColor : "hazeColor",

	initShaderFromString : function()
	{
		var vsShaderCode = EGS.VsShader1;
		var FsShaderCode = EGS.FsShaderTitle + "varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform float distance;uniform float slope;uniform vec3 hazeColor;void main(){float d = vTexCood.y * slope + distance;vec4 c = texture2D(inputImageTexture, vTexCood);c.rgb = (c.rgb - d * hazeColor.rgb) / (1.0 -d);gl_FragColor = c;}";
		this.initProgram(vsShaderCode, FsShaderCode);

		this.defaultParam();
	},

	defaultParam : function()
	{
	},

	setParams : function()
	{
		
	},

	setParamDistance : function(value)
	{
		this._program.useProgram();
		this._program.setUniform1f(this.paramDistance, value);
	},

	setParamSlope : function(value)
	{
		this._program.useProgram();
		this._program.setUniform1f(this.paramSlope, value);
	},

	setparamHazeColor : function(r, g, b)
	{
		this._program.useProgram();
		this._program.setUniform3f(this.paramHazeColor, r, g, b);
	},

});