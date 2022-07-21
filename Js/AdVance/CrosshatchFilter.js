
EGS.CrosshatchFilter = EGS.Class(EGS.ImageBaseFilter,
{
	paramCrosshatchSpacing : "crossHatchSpacing",
	paramLineWidth : "lineWidth",

	initShaderFromString : function()
	{
		var vsShaderCode = EGS.VsShader1;
		var FsShaderCode = EGS.FsShaderTitle + "varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform float crossHatchSpacing;uniform float lineWidth;const vec3 W = vec3(0.2125, 0.7154, 0.0721);void main(){vec4 color = texture2D(inputImageTexture, vTexCood);float luminance = dot(color.rgb, W);vec4 colorToDisplay = vec4(1.0, 1.0, 1.0, color.a);if (luminance < 1.00) {if (mod(vTexCood.x + vTexCood.y, crossHatchSpacing) <= lineWidth) {colorToDisplay.rgb = vec3(0.0, 0.0, 0.0);}}if (luminance < 0.75) {if (mod(vTexCood.x - vTexCood.y, crossHatchSpacing) <= lineWidth) {colorToDisplay.rgb = vec3(0.0, 0.0, 0.0);}}if (luminance < 0.50) {if (mod(vTexCood.x + vTexCood.y - (crossHatchSpacing / 2.0), crossHatchSpacing) <= lineWidth) {colorToDisplay.rgb = vec3(0.0, 0.0, 0.0);}}if (luminance < 0.3) {if (mod(vTexCood.x - vTexCood.y - (crossHatchSpacing / 2.0), crossHatchSpacing) <= lineWidth) {colorToDisplay.rgb = vec3(0.0, 0.0, 0.0);}}gl_FragColor = colorToDisplay;}";
		this.initProgram(vsShaderCode, FsShaderCode);

		this.defaultParam();
	},

	defaultParam : function()
	{
		this.setCrossHatchSpacing(0.03);
		this.setLineWidth(0.003);
	},

	setParams : function()
	{
		
	},

	setLineWidth : function(value)
	{
		this._program.useProgram();
		this._program.setUniform1f(this.paramLineWidth, value);
	},

	setCrossHatchSpacing : function(value)
	{
		this._program.useProgram();
		this._program.setUniform1f(this.paramCrosshatchSpacing, value);
	},
});