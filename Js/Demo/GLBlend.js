EGS.GlBlend = EGS.Class(
{
	_webglContext : null,
	_webglCanvas : null,
	_teapotModal : null,
	_earthModal : null,

	initialize :function(webgl, canvas)
	{
		this._webglContext = webgl;
		this._webglCanvas = canvas;
		this._earthModal = new EGS.Earth(webgl, canvas);
		this._teapotModal = new EGS.NormalMap(webgl, canvas);
	},		


	render : function()
	{
		
	}


});