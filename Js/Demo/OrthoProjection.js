EGS.OrthoProjection = EGS.Class(EGS.Base, 
{
	_colorBuffer : null,
	_v3ColorIndex : 1,
	_loopFunc : null,
	_animationRequest : null,
	_color : null,
	_isDesc : false,
	_projectionMatrix : null,
	earthRotationMatrix : null,
	lastMouseX : 0,
	lastMouseY : 0,
	_loopFunc : null,
	_meshIndexVBO : null,
	_meshIndexSize : 0,
	_lookmaxtrix : null,
	_distance : 5,

	_vsCode : "uniform mat4 modelMatrix;uniform mat4 lookMatrix;uniform mat4 proMaxtix;attribute vec3 v3Position;attribute vec3 av3Color;varying vec3 vv3Color;void main(void){vv3Color = av3Color;gl_Position =  proMaxtix *(lookMatrix*modelMatrix)* vec4(v3Position, 1.0);}",
	_fsCode : "precision mediump float;varying vec3 vv3Color;void main(void){gl_FragColor = vec4(vv3Color,1.0);}",

	initialize : function(context, canvas)
	{
		this._loopFunc = this.mainLoop.bind(this);
		context.enable(context.DEPTH_TEST);
		this._color = new EGS.Vec3(1, 1, 1);
		EGS.Base.initialize.apply(this, arguments);
		this.initMatrix();
		this.onCanvasResize();
		this.handlePos(300, 200);
		this.mainLoop();
	},


	setCameraDistance : function(v)
	{
		this._distance = v;
		this.setLook();
	},

	getCameraDistance : function()
	{
		return this._distance;
	},

	setLook : function()
	{
		this._lookmaxtrix = EGS.makeLookAt(0, 0, this._distance, 0, 0, 0, 0, 1, 0);
	},

	initPostionData : function()
	{
         this._vertexData = [
        	1, 1, 1,  -1, 1, 1,  -1,-1, 1,  1,-1, 1, 
            1, 1, 1,  1,-1, 1,  1,-1,-1,  1, 1,-1,
            1, 1, 1,  1, 1,-1,  -1, 1,-1,  -1, 1, 1,
            -1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,
            -1,-1,-1,  1,-1,-1,  1,-1, 1,  -1,-1, 1,
            1,-1,-1,  -1,-1,-1,  -1, 1,-1,  1, 1,-1
          ];
	},


	initData : function()
	{
		this._program.bindAttributeLocation("av3Color", this._v3ColorIndex);

		 var jsArrayColor = [
            1.0, 0.0, 0.0,
            0.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            0.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 
            1.0, 0.0, 0.0,
            0.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            1.0, 0.0, 1.0, 
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0, 
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0, 
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0, 
            1.0, 0.0, 0.0,
         ];

      this._colorBuffer = webgl.createBuffer();
      webgl.bindBuffer(webgl.ARRAY_BUFFER, this._colorBuffer);
      webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(jsArrayColor), webgl.STATIC_DRAW);

       var indexArr = [0, 1, 2,  0, 2, 3,
                        4, 5, 6,  4, 6, 7,
                        8, 9,10,  8,10,11,
                        12,13,14,  12,14,15,
                        16,17,18,  16,18,19,
                        20,21,22,  20,22,23
                      ];

	 	this._meshIndexVBO = webgl.createBuffer();
        var indexData = new Uint16Array(indexArr);
        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, this._meshIndexVBO);
        webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, indexData, webgl.STATIC_DRAW);
        this._meshIndexSize = indexArr.length;
	},

	onCanvasResize : function()
	{
		var w = 4, h = 4;
		var z =  2.0;
		//this._projectionMatrix = mat4.create();
		//mat4.perspective(30, w/h, 0.1, 20000, this._projectionMatrix );
		//this._projectionMatrix = EGS.makeFrustum(-2, 2, -2, 2, 3.0, 2000);

		this._projectionMatrix = EGS.makePerspective(Math.PI/4, w/h, 1, 100);
		this._lookmaxtrix = EGS.makeLookAt(0, 0, 5, 0, 0, 0, 0, 1, 0);
		//this._projectionMatrix = EGS.mat4Mul(this._projectionMatrix, lookmaxtrix);
		 //this._projectionMatrix = EGS.makeOrtho(-w/2, w/2, -h/2, h/2, -z, z);
		this._program.useProgram();
		this._program.setUniformMat4("proMaxtix", false, this._projectionMatrix.data);
		this._program.setUniformMat4("lookMatrix", false, this._lookmaxtrix.data);
	},

	render : function()
	{
		this._program.useProgram();
		this._program.setUniformMat4("modelMatrix", false, this.earthRotationMatrix);
		this._program.setUniformMat4("lookMatrix", false, this._lookmaxtrix.data);

		var webgl = this._webglContext;
		webgl.clearColor(0.0, 0.0, 0.0, 1.0);
	    webgl.clear(webgl.COLOR_BUFFER_BIT);
	    webgl.bindBuffer(webgl.ARRAY_BUFFER, this._vertexBuffer);
	    webgl.enableVertexAttribArray(this._v3PositionIndex);
	    webgl.vertexAttribPointer(this._v3PositionIndex, 3, webgl.FLOAT, false, 0, 0);

	    
	    webgl.bindBuffer(webgl.ARRAY_BUFFER, this._colorBuffer);
	    webgl.enableVertexAttribArray(this._v3ColorIndex);
	    webgl.vertexAttribPointer(this._v3ColorIndex, 3, webgl.FLOAT, false, 0, 0);

	    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, this._meshIndexVBO);
	    webgl.drawElements(webgl.TRIANGLES, this._meshIndexSize, webgl.UNSIGNED_SHORT, 0);
	},

	initMatrix : function()
	{
       	this.earthRotationMatrix = mat4.create();
        mat4.identity(this.earthRotationMatrix);
        this._program.useProgram();
		this._program.setUniformMat4("modelMatrix", false, this.earthRotationMatrix);
	},

	degToRad : function(degrees) {
    	return degrees * Math.PI / 180;
	},

	handlePos : function(newX, newY) 
     {
        var dx = newX - this.lastMouseX;
        var newRotateMatrix = mat4.create();
        mat4.identity(newRotateMatrix);
        mat4.rotate(newRotateMatrix, this.degToRad(dx / 10.0), [0, 1, 0]);
        var dy = newY - this.lastMouseY;
        mat4.rotate(newRotateMatrix, this.degToRad(dy / 10.0), [1, 0, 0]);
        mat4.multiply(newRotateMatrix, this.earthRotationMatrix, this.earthRotationMatrix);

        this.lastMouseX = newX;
        this.lastMouseY = newY;
    },

    setLastPos : function(lastX, lastY)
    {
    	this.lastMouseX = lastX;
    	this.lastMouseY = lastY;
    },

    mainLoop : function() {
       this.render();
	   this._animationRequest = requestAnimationFrame(this._loopFunc);
	}

	
}); 