EGS.TextureTriangle = EGS.Class(EGS.Base,
{
	_textureString : "sTexture",
	_textureLocation : null,
	_startIndex : 0,
	_img : null,
	_vsCode : "attribute vec3 v3Position;varying vec2 vTexCood;void main(){vTexCood = vec2((v3Position.x+1.0)/2.0, 1.0-(v3Position.y+1.0)/2.0);gl_Position = vec4(v3Position, 1.0);}",
	_fsCode : "precision mediump float;varying vec2 vTexCood;uniform sampler2D sTexture;void main(){vec3 src = texture2D(sTexture, vTexCood).rgb;gl_FragColor = vec4(src, 1.0);}",


	initialize : function(img)
	{
		EGS.Base.initialize.apply(this, arguments);
		this.render();
	},

	setImg : function(img)
	{
		this._img = img;
	},

	getTextureObj : function(img, blendName)
	{
		var webgl = this._webglContext;
  		var texture = new EGS.Texture2d(this._webglContext);
		texture.initByImage(img);

		webgl.activeTexture(webgl.TEXTURE0 + this._startIndex);
		webgl.bindTexture(webgl.TEXTURE_2D, texture.texture);

		this._program.useProgram();
		var uniform = this._program.uniformLocation(blendName);
	    webgl.uniform1i(uniform, webgl.TEXTURE0 + this._startIndex);
	    this._startIndex++;
	},

	initData : function()
	{
		var program = this._program;
		this.getTextureObj(this.img, this._textureString);
	},

	render : function()
	{
		var webgl = this._webglContext;
		webgl.clearColor(0.0, 0.0, 0.0, 1.0);
	    webgl.clear(webgl.COLOR_BUFFER_BIT);
	    webgl.bindBuffer(webgl.ARRAY_BUFFER, this._vertexBuffer);
	    webgl.enableVertexAttribArray(this._v3PositionIndex);
	    webgl.vertexAttribPointer(this._v3PositionIndex, 3, webgl.FLOAT, false, 0, 0);

	    
	    

        webgl.drawArrays(webgl.TRIANGLES, 0, 3);
	},
});