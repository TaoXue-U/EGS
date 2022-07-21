//这里统一时间线，音乐等，继承公共类SlideshowInterface


var mySprite = WGE.Class(WGE.Sprite, WGE.AnimationWithChildrenInterface2d,
{
	initialize : function(startTime, endTime, img, w, h)
	{
		this.setAttrib(startTime, endTime);
		this.timeActions = [];
		if(img)
		{
			WGE.Sprite.initialize.call(this, img, w, h);
		}
	}
});


WGE.Burst = WGE.Class(WGE.SlideshowInterface,
{
	config: 1,
	audioFileName : "Inspiration.mp3",
	totalTime :　0,

	getTimeline : function()
	{
		var time = this.srcImages.length*3000 - ( this.srcImages.length - 1)*500;
		this.totalTime = time > 30000 ? time : 30000; 
	},

	recycleAnimation : function()
	{
		var times =  Math.ceil(this.srcImages.length / 2);
		for (var i = 0; i < times; i++) {
			this.actions(i*5500 - 500*i);
		};
	},

	initTimeline : function(config)
	{
		this.getTimeline();
		this.timeline = new WGE.TimeLine(this.totalTime);  
		this.recycleAnimation();
	},

	actions : function(start)
	{
		var sprite = new mySprite(start, start+3000, this.srcImages[0], -1);
		sprite.moveTo(WGE.SlideshowSettings.width/2, WGE.SlideshowSettings.height/2);
		sprite.setHotspotWithRatio(0.5, 0.5);

		var sprite1 = new mySprite(start+2500, start+5500, this.srcImages[1], -1);
		sprite1.moveTo(WGE.SlideshowSettings.width/2, WGE.SlideshowSettings.height/2);
		sprite1.setHotspotWithRatio(0.5, 0.5);



		var action11 = new WGE.Actions.UniformScaleAction([0, 2500], [1.5, 1.5], [1.0, 1.0], 1);
		var action21 = new WGE.Actions.UniformScaleAction([0, 2500], [1.0, 1.0], [1.5, 1.5], 1);
		var action12 = new WGE.Actions.UniformAlphaAction([2500, 3000], 0, 1, 1);

		
		sprite.push(action11);
		sprite.push(action12);
		sprite1.push(action21);
		sprite1.push(action12);

		this.timeline.push(sprite);
		this.timeline.push(sprite1)
		this.timeline.start(0);
	},


});