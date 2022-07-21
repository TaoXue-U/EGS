
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
		var FsShaderCode = EGS.FsShaderTitle +"varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform vec4 red;uniform vec4 yellow;uniform vec4 green;uniform vec4 cyan;uniform vec4 blue;uniform vec4 magenta;uniform vec4 white;uniform vec4 gray;uniform vec4 black;vec4 getFac(vec4 facPre,vec4 facNex,float h,float s,float v){vec4 ret = mix(facPre,facNex,h); vec4 rets0;v = v * 2.0 - 1.0;if(v > 0.0){rets0 = mix(gray,white,v); }else{rets0 = mix(gray,black,-v); }s = 1.0 - s;s = s * s * s;s = 1.0 - s;return mix(rets0,ret,s);}vec3 adjColor(vec3 src,float a,vec4 fac){vec3 tfac = fac.xyz *  vec3(fac.w,fac.w,fac.w);tfac = min(tfac,vec3(2.0,2.0,2.0));vec3 tfc1 = clamp(tfac - vec3(1.0,1.0,1.0),0.0,0.5);vec3 tfc2 = max(tfac - vec3(1.5,1.5,1.5),0.0);src = vec3(1.0,1.0,1.0) - src;src = src * (tfac -  src * (src * (tfc1 - tfc2) + vec3(2.0,2.0,2.0) * tfc2));return vec3(1.0,1.0,1.0) - src;}vec3 hsvAdjust(vec3 src){vec3 temp;vec4 color1, color2;if(src.r > src.g){if(src.g > src.b){temp = src.rgb;color1 = red;color2 = yellow;}else if(src.b > src.r){temp = src.brg;color1 = blue;color2 = magenta;}else{temp = src.rbg;color1 = red;color2 = magenta;}}else{if(src.r > src.b){temp = src.grb;color1 = green;color2 = yellow;}else if(src.b > src.g){temp = src.bgr;color1 = blue;color2 = cyan;}else{temp = src.gbr;color1 = green;color2 = cyan;}}float d = temp.x - temp.z + 0.0001;float s = temp.y - temp.z;vec4 fac = getFac(color1, color2, s/d, d, temp.x);return adjColor(src, temp.x, fac);}void main(){vec4 src = texture2D(inputImageTexture, vTexCood);src.rgb = hsvAdjust(src.rgb);gl_FragColor = src;}";
		this.initProgram(vsShaderCode, FsShaderCode);
		this.setDefault();

	},

	setParams : function()
	{
		
	},

	setDefault : function()
	{
		this.setRed(0,0, 0, 0);
		this.setYellow(0,0, 0, 0);
		this.setGreen(0,0, 0, 0);
		this.setCyan(0,0, 0, 0);
		this.setBlue(0,0, 0, 0);
		this.setMagenta(0,0, 0, 0);
		this.setWhite(0,0, 0, 0);
		this.setGray(0,0, 0, 0);
		this.setBlack(0,0, 0, 0);
	},

	setRed : function(v1, v2, v3, v4)
	{
		v1 /= 100 ;
		v2 /= 100 ;
		v3 /= 100 ;
		v4 /= 100 ;
		v1 += 1;
		v2 += 1 ;
		v3 += 1 ;
		v4 += 1 ;
		this._program.useProgram();
		this._program.setUniform4f(this.redString, v1, v2, v3, v4);
	},

	setYellow : function(v1, v2, v3, v4)
	{
		v1 /= 100 ;
		v2 /= 100 ;
		v3 /= 100 ;
		v4 /= 100 ;
		v1 += 1;
		v2 += 1 ;
		v3 += 1 ;
		v4 += 1 ;
		this._program.useProgram();
		this._program.setUniform4f(this.yellowString, v1, v2, v3, v4);
	},

	setGreen : function(v1, v2, v3, v4)
	{
		v1 /= 100 ;
		v2 /= 100 ;
		v3 /= 100 ;
		v4 /= 100 ;
		v1 += 1;
		v2 += 1 ;
		v3 += 1 ;
		v4 += 1 ;
		this._program.useProgram();
		this._program.setUniform4f(this.greenString, v1, v2, v3, v4);
	},

	setCyan : function(v1, v2, v3, v4)
	{
		v1 /= 100 ;
		v2 /= 100 ;
		v3 /= 100 ;
		v4 /= 100 ;
		v1 += 1;
		v2 += 1 ;
		v3 += 1 ;
		v4 += 1 ;
		this._program.useProgram();
		this._program.setUniform4f(this.cyanString, v1, v2, v3, v4);
	},

	setBlue : function(v1, v2, v3, v4)
	{
		v1 /= 100 ;
		v2 /= 100 ;
		v3 /= 100 ;
		v4 /= 100 ;
		v1 += 1;
		v2 += 1 ;
		v3 += 1 ;
		v4 += 1 ;
		this._program.useProgram();
		this._program.setUniform4f(this.blueString, v1, v2, v3, v4);
	},

	setMagenta : function(v1, v2, v3, v4)
	{
		v1 /= 100 ;
		v2 /= 100 ;
		v3 /= 100 ;
		v4 /= 100 ;
		v1 += 1;
		v2 += 1 ;
		v3 += 1 ;
		v4 += 1 ;
		this._program.useProgram();
		this._program.setUniform4f(this.magentaString, v1, v2, v3, v4);
	},

	setWhite : function(v1, v2, v3, v4)
	{
		v1 /= 100 ;
		v2 /= 100 ;
		v3 /= 100 ;
		v4 /= 100 ;
		v1 += 1;
		v2 += 1 ;
		v3 += 1 ;
		v4 += 1 ;
		this._program.useProgram();
		this._program.setUniform4f(this.whiteString, v1, v2, v3, v4);
	},

	setGray : function(v1, v2, v3, v4)
	{
		v1 /= 100 ;
		v2 /= 100 ;
		v3 /= 100 ;
		v4 /= 100 ;
		v1 += 1;
		v2 += 1 ;
		v3 += 1 ;
		v4 += 1 ;
		this._program.useProgram();
		this._program.setUniform4f(this.grayString, v1, v2, v3, v4);
	},

	setBlack : function(v1, v2, v3, v4)
	{
		v1 /= 100 ;
		v2 /= 100 ;
		v3 /= 100 ;
		v4 /= 100 ;
		v1 += 1;
		v2 += 1 ;
		v3 += 1 ;
		v4 += 1 ;
		this._program.useProgram();
		this._program.setUniform4f(this.blackString, v1, v2, v3, v4);
	},

});