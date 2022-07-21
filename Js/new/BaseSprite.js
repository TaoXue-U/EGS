//定义Sprite的标准接口
EGS.BaseSprite = EGS.Class(
{
	initialize : function(){},

	//旋转
	rotateX : function(rad){},
	rotateY : function(rad){},
	rotateZ : function(rad){},
	rotate : function(rad, axis){},

	//平移
	translate : function(transVec){},

	//缩放
	scale : function(scaleVec){},
});


EGS.GlBaseSprite = EGS.Class(EGS.BaseSprite
{
	_webglContext : null,
	_webglCanvas : null,

	_modalMatrix : null,
	_viewMatrix : null,
	_projectionMatrix : null,
	_mvpMatrix : null,

	_vsCode : "",
	_fsCode : "",

	initialize : function(webgl, canvas)
	{
		this._webglContext = webgl;
		this._webglCanvas = canvas;
		this.initMatrix();
	},

	initMatrix : function()
	{
		this._modalMatrix = EGS.mat4Identity();
		this._modalMatrix = EGS.mat4Identity();
		this._modalMatrix = EGS.mat4Identity();
	},

	updateMVPMatrix : function()
	{
		var matrix = EGS.mat4Mul(this._viewMatrix, this._modalMatrix);
		this._mvpMatrix = EGS.mat4Mul(this._projectionMatrix, matrix);
	},

	rotateX : function(rad)
	{
		this._modalMatrix.rotateX(rad);
	},

	rotateY : function(rad)
	{
		this._modalMatrix.rotateY(rad);
	},

	rotateZ : function(rad)
	{
		this._modalMatrix.rotateZ(rad);
	},

	rotate : function(rad, axis)
	{
		this._modalMatrix.rotate(rad, axis[0], axis[1], axis[2]);
	},

	translate : function(transVec)
	{
		this._modalMatrix.translateX(transVec[0]);
		this._modalMatrix.translateY(transVec[1]);
		this._modalMatrix.translateZ(transVec[2]);
	},

	scale : function(scaleVec)
	{
		this._modalMatrix.scale(scaleVec[0], scaleVec[1], scaleVec[2]);
	},

	render : function()
	{

	},

	initShaderCode : function()
	{
		this._vsCode = "";
		this._fsCode = "";
	},

	intProgram : function()
	{
		
	},
});