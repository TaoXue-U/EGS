EGS.Triangle = EGS.Class(EGS.Base,
{
	initialize : function(context)
	{
		EGS.Base.initialize.apply(this, arguments);
		this.render();
	},

	initPostionData : function()
	{
		 this._vertexData = [
              0.0, 1.0, 0.0,
             -1.0, 0.0, -1.0,
              1.0, 0.0, 0.0
         ];
	},
});


EGS.ColorTriangle = EGS.Class(EGS.Base, 
{
	_colorBuffer : null,
	_v3ColorIndex : 1,
	_loopFunc : null,
	_animationRequest : null,
	_color : null,
	_isDesc : false,

	_vsCode : "attribute vec3 v3Position;attribute vec3 av3Color;varying vec3 vv3Color;void main(void){vv3Color = av3Color;gl_Position = vec4(v3Position, 1.0);}",
	_fsCode : "precision mediump float;varying vec3 vv3Color;void main(void){gl_FragColor = vec4(vv3Color,1.0);}",

	initialize : function(context)
	{
		this._color = new EGS.Vec3(1, 1, 1);
		this._loopFunc = this.mainLoop.bind(this);
		EGS.Base.initialize.apply(this, arguments);
		//this.render();
		this.mainLoop();
	},

	initData : function()
	{
		this._program.bindAttributeLocation("av3Color", this._v3ColorIndex);

		 var jsArrayColor = [
            1.0, 0.0, 0.0,//上顶点
            0.0, 1.0, 0.0,//左顶点
            0.0, 0.0, 1.0 //右顶点
         ];

         this._colorBuffer = webgl.createBuffer();
         webgl.bindBuffer(webgl.ARRAY_BUFFER, this._colorBuffer);
         webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(jsArrayColor), webgl.STATIC_DRAW);

	},

	render : function()
	{
		var webgl = this._webglContext;
		webgl.clearColor(0.0, 0.0, 0.0, 1.0);
	    webgl.clear(webgl.COLOR_BUFFER_BIT);
	    webgl.bindBuffer(webgl.ARRAY_BUFFER, this._vertexBuffer);
	    webgl.enableVertexAttribArray(this._v3PositionIndex);
	    webgl.vertexAttribPointer(this._v3PositionIndex, 3, webgl.FLOAT, false, 0, 0);

	    
	    webgl.bindBuffer(webgl.ARRAY_BUFFER, this._colorBuffer);
	    webgl.enableVertexAttribArray(this._v3ColorIndex);
	    webgl.vertexAttribPointer(this._v3ColorIndex, 3, webgl.FLOAT, false, 0, 0);

	    webgl.drawArrays(webgl.TRIANGLES, 0, 3);
	},

	mainLoop : function()
	{
		 if (this._isDesc && this._color.data[0] <= 0.0)
             this._isDesc = false;
         if (!this._isDesc && this._color.data[0] >= 1.0)
             this._isDesc = true;

		 !this._isDesc ?  this._color.data[0] += 0.01 : this._color.data[0] -= 0.01;
         !this._isDesc ?  this._color.data[1] += 0.01 : this._color.data[1] -= 0.01;
         !this._isDesc ?  this._color.data[2] += 0.01 : this._color.data[2] -= 0.01;

         var jsArrayColor = [
            this._color.data[0], 0.0, 0.0,//上顶点
            0.0, this._color.data[1], 0.0,//左顶点
            0.0, 0.0, this._color.data[2]//右顶点
        ];

         webgl.bindBuffer(webgl.ARRAY_BUFFER, this._colorBuffer);
         webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(jsArrayColor), webgl.STATIC_DRAW);
         this.render();

		this._animationRequest = requestAnimationFrame(this._loopFunc);
	},
	
}); 