/*
 * ImageFilterFactory.js
 *
 *  Created on: 2015-3-31
 *      Author: ixshells
 *        blog: http://nbcoders.com
 */


EGS.ImageFilterFactory = EGS.Class(
{
	_webglContext : null,

	initialize : function (ctx)
	{
		this._webglContext = ctx; 
	},

	create : function(filterName)
	{
		var obj = null;
		switch(filterName)
		{
			case "brightness":
				obj = new EGS.BrightnessFilter(this._webglContext);
				break;
			case "contrast":
				obj = new EGS.ContrastFilter(this._webglContext);
			default:
				break;
		}
		return obj;
	},

});


EGS.EffectManager = EGS.Class(
{
	_webglContext : null,
	_srcTex : null,
	_dstTex : null,
	_filterVec : null,
	_filter : null,
	_index : 0,

	initialize : function(ctx)
	{
		this._webglContext = ctx;
		this._filterVec = new Array();
	},

	initTexture : function(tex1, tex2)
	{
		this._srcTex = tex1;
		this._dstTex = tex2;
	},

	initTex : function(img)
	{
		var webgl = this._webglContext;
		this._srcTex = new EGS.Texture2d(webgl);
		this._srcTex.initByImage(img);

		this._dstTex = new EGS.Texture2d(webgl);
		this._dstTex.initByImage(img);
	},

	addFilter : function(obj)
	{
		this._filterVec.push(obj);
		var src = this._index % 2 == 0 ? this._srcTex : this._dstTex;
		var dst = (this._index  + 1)% 2 == 0 ? this._srcTex : this._dstTex;
		this._index++;

		obj.initRenderTexture(src);
		obj.renderImage(dst);
		// this._filter = obj;
	},

	runEffects : function()
	{
		for (var i = 0; i < this._filterVec.length; i++) {
			var src = this._index % 2 == 0 ? this._srcTex : this._dstTex;
			var dst = (this._index  + 1)% 2 == 0 ? this._srcTex : this._dstTex;
			this._index++;

			this._filterVec[i].initRenderTexture(src);
			this._filterVec[i].renderImage(dst);
		};

	},

	removeFilter : function(obj)
	{
		this._filterVec.remove(obj);
	},

	releaseAll : function()
	{
		while(this._filterVec.length != 0)
		{
			var filter = this._filterVec.pop();
			filter.release();
			filter = null;
		}

		this._srcTex.release();this._srcTex = null;
		this._dstTex.release();this._dstTex = null;
	},

});