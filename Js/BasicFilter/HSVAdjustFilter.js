
EGS.HSVAdjustFilter = EGS.Class(EGS.ImageBaseFilter,
{
	vColor1Name : "vColor1",
	vColor2Name : "vColor2",

	initShaderFromString : function()
	{
		var vsShaderCode =EGS.VsShader1;
		var FsShaderCode = EGS.FsShaderTitle + "varying vec2 vTexCood;uniform sampler2D inputImageTexture;uniform vec3 vColor1;uniform vec3 vColor2;vec3 hsvAdjust(vec3 src, vec3 color1, vec3 color2){float fmax = max(src.r,max(src.g,src.b));float fmin = min(src.r,min(src.g,src.b));float fdelta = fmax - fmin;float fs_off;vec3 hsv;hsv.z = fmax;if(0.0 == fdelta){return src;}hsv.y = fdelta/fmax;if(fmax == src.r){if(src.g >= src.b){hsv.x = (src.g - src.b)/fdelta;fs_off = (color2.g - color1.r)*hsv.x + color1.r;hsv.y = hsv.y*(1.0 + fs_off);clamp(hsv.y, 0.0, 1.0);src.r = hsv.z;src.b = hsv.z*(1.0 - hsv.y);src.g = hsv.z*(1.0 - hsv.y + hsv.y*hsv.x);}else{hsv.x = (src.r - src.b)/fdelta;fs_off = (color1.r - color2.r)*hsv.x + color2.r;hsv.y = hsv.y*(1.0 + fs_off);clamp(hsv.y, 0.0, 1.0);src.r = hsv.z;src.g = hsv.z*(1.0 - hsv.y);src.b = hsv.z*(1.0 - hsv.y*hsv.x);}}else if(fmax == src.g){if(src.r > src.b){hsv.x = (src.g - src.r)/fdelta;fs_off = (color1.g - color2.g)*hsv.x + color2.g;hsv.y = hsv.y*(1.0 + fs_off);clamp(hsv.y, 0.0, 1.0);src.g = hsv.z;src.r = hsv.z*(1.0 - hsv.y*hsv.x);src.b = hsv.z*(1.0 - hsv.y);}else{hsv.x = (src.b - src.r)/fdelta;fs_off = (color2.b - color1.g)*hsv.x + color1.g;hsv.y = hsv.y*(1.0 + fs_off);clamp(hsv.y, 0.0, 1.0);src.g = hsv.z;src.r = hsv.z*(1.0 - hsv.y);src.b = hsv.z*(1.0 - hsv.y + hsv.y*hsv.x);}}else{if(src.g > src.r){hsv.x = (src.b - src.g)/fdelta;fs_off = (color1.b - color2.b)*hsv.x + color2.b;hsv.y = hsv.y*(1.0 + fs_off);clamp(hsv.y, 0.0, 1.0);src.b = hsv.z;src.r = hsv.z*(1.0 - hsv.y);src.g = hsv.z*(1.0 - hsv.y*hsv.x);}else{hsv.x = (src.r - src.g)/fdelta;fs_off = (color2.r - color1.b)*hsv.x + color1.b;hsv.y = hsv.y*(1.0 + fs_off);clamp(hsv.y, 0.0, 1.0);src.b = hsv.z;src.r = hsv.z*(1.0 - hsv.y + hsv.y*hsv.x);src.g = hsv.z*(1.0 - hsv.y);}}return src;}void main(){vec4 src = texture2D(inputImageTexture, vTexCood);src.rgb = hsvAdjust(src.rgb, vColor1, vColor2);gl_FragColor = src;}";
		this.initProgram(vsShaderCode, FsShaderCode);
	},

	setParams : function()
	{
	},

	setVColor1 : function(r, g, b)
	{
		this._program.useProgram();
		this._program.setUniform3f(this.vColor1Name, r, g, b);
	},

	setVColor2 : function(magenta, yellow, cyan)
	{
		this._program.useProgram();
		this._program.setUniform3f(this.vColor2Name, magenta, yellow, cyan);
	},

});