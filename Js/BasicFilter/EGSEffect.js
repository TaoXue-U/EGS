
function EGSTest(img, canvas, webglContext)
{

	var tex = document.getElementById("tex");
	var texture = new EGS.Texture2d(webglContext);
	texture.initByImage(img);



	var dstTexture = new EGS.Texture2d(webglContext);
	dstTexture.initByImage(img);
	var manager = new EGS.EffectManager(webglCanvas, webglContext);
	manager.initTexture(texture, dstTexture);
	
	

	

	 var drawResultFilter = new EGS.DrawResultFilter(webglCanvas, webglContext);
	 manager.addFilter(drawResultFilter);
	
	 //manager.runEffects();
	 manager.releaseAll();

}

function EGSTest1(img, canvas, webglContext)
{

	var tex = document.getElementById("tex");
	var texture = new EGS.Texture2d(webglContext);
	texture.initByImage(img);



	var dstTexture = new EGS.Texture2d(webglContext);
	dstTexture.initByImage(img);
	var manager = new EGS.EffectManager(webglCanvas, webglContext);
	manager.initTexture(texture, dstTexture);

	var curveRGB = new Array();
	curveRGB.push(createPoint(0,0));

	curveRGB.push(createPoint(255,255));

	var curveR = new Array();
	curveR.push(createPoint(0,0));

	curveR.push(createPoint(255,255));

	var curveG = new Array();
	curveG.push(createPoint(0,0));
	curveG.push(createPoint(255,255));

	var curveB = new Array();
	curveB.push(createPoint(0,0));
	curveB.push(createPoint(255,255));

	

	
	// manager.addFilter(baseFilter1);
	var baseFilter2 = new EGS.ContrastFilter(webglCanvas, webglContext);
	baseFilter2.setIntensity(1.5);
	baseFilter2.initRenderTexture(dstTexture);
	manager.addFilter(baseFilter2);
	 //baseFilter2.renderImage(texture)

	 var baseFilter = new EGS.CurveAdjustFilter(webglCanvas, webglContext);
	baseFilter.pushBackPoints(curveRGB, 0);
	baseFilter.pushBackPoints(curveR, 1);
	baseFilter.pushBackPoints(curveG, 2);
	baseFilter.pushBackPoints(curveB, 3);
	baseFilter.genTex();
	 manager.addFilter(baseFilter);


	// baseFilter.initRenderTexture(texture);
	// //baseFilter.renderImage(dstTexture);

	//  var drawResultFilter = new EGS.DrawResultFilter(webglCanvas, webglContext);
	//  	drawResultFilter.initRenderTexture(dstTexture);
	// //drawResultFilter.renderImage(texture);
	// var baseFilter3 = new EGS.BrightnessFilter(webglCanvas, webglContext);
	// baseFilter3.setIntensity(0.5);
	//  manager.addFilter(baseFilter3);

	var saturationFilter = new EGS.SaturationFilter(webglCanvas, webglContext);
	saturationFilter.setIntensity(0.0);
	manager.addFilter(saturationFilter);

	//manager.addFilter(baseFilter);

	var baseFilter1 = new EGS.BlendFilter(webglCanvas, webglContext, EGS.MixMode.MIX_BLEND, "overlay");
	baseFilter1.setTexture(tex);
	baseFilter1.setIntensity(1.0);
	manager.addFilter(baseFilter1);

	var slcolor = new EGS.SelectiveColorFilter(webglCanvas, webglContext);
	manager.addFilter(slcolor);
			var d = new Date();
	var t = d.getTime();

	var algorithmString = "@adjust saturation 0 "

	var parserEngine = new EGS.ParserEngine(algorithmString, manager, webglCanvas, webglContext);
	

	 var drawResultFilter = new EGS.DrawResultFilter(webglCanvas, webglContext);
	 manager.addFilter(drawResultFilter);
	
	 //manager.runEffects();
	 manager.releaseAll();

	 d = new Date();
	 console.log(d.getTime() - t);
}