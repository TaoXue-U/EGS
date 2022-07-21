
EGS.MulMode = 
{
    MUL_FLT : 0,
    MUL_VEC : 1,
    MUL_MAT : 2,
};

EGS.ColorMulFilter = EGS.Class(EGS.ImageBaseFilter,
{
	_paramMulName : "cmul",
	_mulMode : null,
	_mulModeDic : null,
	_p1Code : "",
	_p2Code : "",

	initialize : function( ctx, mulMode)
	{
		this._textures = new Array();
		this.initData();

		this._mulMode = mulMode;
		this.setPCode();

		this._webglContext = ctx;
		this._frameBuffer=ctx.createFramebuffer();
		this._renderBuffer = ctx.createRenderbuffer();
		this.initShaderFromString();
	},

	initShaderFromString : function()
	{
		var vsShaderCode =EGS.VsShader1;
		var FsShaderCode =  EGS.FsShaderTitle + "varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform %s1 cmul;void main(){vec4 src = texture2D(inputImageTexture, vTexCood);    src.rgb *= cmul;    %s2;    gl_FragColor = vec4(src.rgb, src.a);}";
		FsShaderCode =  FsShaderCode.replace(/%s1/, this._p1Code);
		FsShaderCode =  FsShaderCode.replace(/%s2/, this._p2Code);
		this.initProgram(vsShaderCode, FsShaderCode);
	},

	initData : function()
	{
		this._mulModeDic=
		{
			"flt" : EGS.MulMode.MUL_FLT,
			"vec" :EGS.MulMode.MUL_VEC,
			"mat" : EGS.MulMode.MUL_MAT,
		};
	},

	setPCode : function()
	{
		var pFLT = "float";
		var pVEC = "vec3";
		var pMAT = "mat3";

		switch(this._mulModeDic[this._mulMode])
		{
			case EGS.MulMode.MUL_FLT:
			{
				this._p1Code = pFLT;
				this._p2Code = "src.rgb += 1.0 - step(0.0, src.rgb)";
			}
			break;
			case EGS.MulMode.MUL_VEC:
			{
				this._p1Code = pVEC;
				this._p2Code = "src.rgb += 1.0 - step(0.0, src.rgb)";
			}
			break;
			case EGS.MulMode.MUL_MAT:
			{
				this._p1Code = pMAT;
			}
			break;
			default:
			break;
		}
	},

	setParams : function()
	{

	},

	setFLT : function(value)
	{
		this._program.useProgram();
		this._program.setUniform1f(this._paramMulName, value);
	},

	setVEC : function(r, g, b)
	{
		this._program.useProgram();
		this._program.setUniform3f(this._paramMulName, r, g, b);
	},

	setMAT : function(v1, v2, v3, v4, v5, v6, v7, v8, v9)
	{
		var matData = new EGS.Mat3(v1, v2, v3, v4, v5, v6, v7, v8, v9);
		this._program.useProgram();
		this._program.setUniformMat3(this._paramMulName, false, matData.data);
	},

});