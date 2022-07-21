
EGS.SelectiveColorFilter = EGS.Class(EGS.ImageBaseFilter,
{
	redString : "red",
	yellowString : "yellow",
	greenString : "green",
	cyanString : "cyan",
	blueString : "blue",
	magentaString : "magenta",
	whiteString : "white",
	grayString : "gray",
	blackString : "black",

	initShaderFromString : function()
	{
		var vsShaderCode = EGS.VsShader1;
		var FsShaderCode = EGS.requestTextByURL(EGS.ShaderDir+"SelectiveColorShader.txt");
		this.initProgram(vsShaderCode, FsShaderCode);
	},

	setParams : function()
	{
		// this.setIntensity(2.0);
		//this.setRed(1.0,1.1	, 0.5, 1.0);
		// this.setYellow(0.0,0.5, 0.5, 1.0);
		// this.setGreen(0.0,0.5, 0.5, 1.0);
		// this.setCyan(0.0,0.5, 0.5, 1.0);
		// this.setBlue(0.0,0.5, 0.5, 1.0);
		// this.setMagenta(1.0,0.5, 0.5, 1.0);
		// this.setWhite(1.0,0.5, 0.5, 1.0);
		// this.setGray(1.0,0.5, 0.5, 1.0);
		// this.setBlack(1.0,0.5, 0.5, 1.0);
	},

	// setIntensity : function(value)
	// {
	// 	this._program.setUniform1f(this.intensityString, value);
	// },

	setRed : function(v1, v2, v3, v4)
	{
		this._program.useProgram();
		this._program.setUniform4f(this.redString, v1, v2, v3, v4);
	},

	setYellow : function(v1, v2, v3, v4)
	{
		this._program.useProgram();
		this._program.setUniform4f(this.yellowString, v1, v2, v3, v4);
	},

	setGreen : function(v1, v2, v3, v4)
	{
		this._program.useProgram();
		this._program.setUniform4f(this.greenString, v1, v2, v3, v4);
	},

	setCyan : function(v1, v2, v3, v4)
	{
		this._program.useProgram();
		this._program.setUniform4f(this.cyanString, v1, v2, v3, v4);
	},

	setBlue : function(v1, v2, v3, v4)
	{
		this._program.useProgram();
		this._program.setUniform4f(this.blueString, v1, v2, v3, v4);
	},

	setMagenta : function(v1, v2, v3, v4)
	{
		this._program.useProgram();
		this._program.setUniform4f(this.magentaString, v1, v2, v3, v4);
	},

	setWhite : function(v1, v2, v3, v4)
	{
		this._program.useProgram();
		this._program.setUniform4f(this.whiteString, v1, v2, v3, v4);
	},

	setGray : function(v1, v2, v3, v4)
	{
		this._program.useProgram();
		this._program.setUniform4f(this.grayString, v1, v2, v3, v4);
	},

	setBlack : function(v1, v2, v3, v4)
	{
		this._program.useProgram();
		this._program.setUniform4f(this.blackString, v1, v2, v3, v4);
	},

});