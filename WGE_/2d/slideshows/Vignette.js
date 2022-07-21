//这里统一时间线，音乐等，继承公共类SlideshowInterface

WGE.bounceRange = 
{
    range : 50,
};

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

var MyLogicSprite  = WGE.Class(WGE.LogicSprite, WGE.AnimationWithChildrenInterface2d,
{
	initialize : function(startTime, endTime)
	{
		WGE.AnimationWithChildrenInterface2d.initialize.call(this, startTime, endTime);
		WGE.LogicSprite.initialize.call(this);
	}
});



WGE.Vignette = WGE.Class(WGE.FotorSlideshowInterface,
{
    config: 1,
    audioFileName : ["assets/FT/slideshow_love.OGG","assets/FT/slideshow_love.mp3"],
    blurImages : [],
    totalTime : 0,
    musicTime : 217000,
    recycleTimes: 0,

    _imageRatioX: null,
    _imageRatioY: null,

    _syncTime : 2000,

    _queue: null,

    _timerID: null,
    _finishCallback: null,
    _loadingFinish: false,
    anImg : null,
    assetsDir : "",
    _bgImageURL : "",
    initTimeline : function(config)
    {
        //this.handleImgs();

        this.calculateTime();
        this.timeline = new WGE.TimeLine(this.totalTime);   
        this.recycleAnimation();
        var spiteLomo = new mySprite(0, this.totalTime, this.anImg, -1);
        spiteLomo.zIndex = 100000;
        this.timeline.push(spiteLomo);
    },

    initialize : function(element, options, template, callback, scope, lastPhotoCallback)
    {
        this._bgImageURL = this.assetsDir + "assets/FT/m1.png";
        this.srcImages = [];
        this._imageRatioX = 1;
        this._imageRatioY = 1+50*2/WGE.SlideshowSettings.height;
        WGE.FotorSlideshowInterface.initialize.apply(this, arguments);
        if(template.config.assetsDir) {
            this.assetsDir = template.config.assetsDir;
        }

    },

    loadEximage : function(imgURLs, callback)
    {
        var img = new Image();
        img.src = imgURLs;
        var self = this;
        img.onload = function()
        {
            self.anImg = img;
            callback.call();
        }
    },



    calculateTime : function()
    {
        var recycleTime = Math.floor(this.srcImages.length / 5);
        var animationTime = recycleTime*29000 - (recycleTime + 1)*1000;
        var leftNum = this.srcImages.length % 5;
        if(leftNum <= 3)
            animationTime += leftNum > 0 ? leftNum*6000 - (leftNum-1)*1000 : 0;
        else 
            animationTime += 3*6000 + 4000 - 2000;

        this.totalTime =  animationTime;
        this.recycleTimes = Math.floor(this.totalTime/29000) + 1;

    },

    recycleAnimation: function ()
    {
        var currentTime = 0;
        //var rctimes = Math.floor(this.srcImages.length / 5) + 1;
        for (var i = 0; i < this.recycleTimes; i++) {
            this.CombineScence(i*29000 - i*1000);
        };
    },


    handleImgs : function()
    {
        for (var i = 0; i < this.srcImages.length; i++) {
            var width = this.srcImages[i].width;
            var height = this.srcImages[i].height;
            var srcimage = this.srcImages[i];
            var blurCanvas = document.createElement('canvas');
            blurCanvas.width = srcimage.width;
            blurCanvas.height = srcimage.height;
            var c = blurCanvas.getContext('2d');
            c.clearRect(0, 0, c.width, c.height);
            c.globalAlpha = (1.0 / (10.0 / 2.0));
            for (var j = 0; j < 120.0; j += 2.0)
                c.drawImage(srcimage, 0, j);
            this.blurImages.push(blurCanvas);
         }
    },

   
    _dealLoadingImage: function (img, index, n)
    {
        // this.loadEximage(this._bgImageURL, function()
        // {
        //     console.log("lomo image loaded");
        // });
        if (!this._queue)
            this._queue = [];
        this._queue.push({ IMAGE: img, INDEX: index, TOTAL: n });

        if (!this._timerID)
            this._timerID = setTimeout(this._processingQueue.bind(this), 20);
    },

    _loadImages: function (imgURLs, finishCallback, eachCallback)
    {
        var self = this;
        this._finishCallback = finishCallback;
        this._eachCallback = eachCallback;
         WGE.loadImages( [self._bgImageURL], function (imgArr)
        {
           self.anImg = imgArr[0];
            WGE.loadImages(imgURLs, function (imgArr)
            {
                if (typeof self._dealFinishLoadingImage == 'function')
                    self._dealFinishLoadingImage(imgArr);
                else
                    self.srcImages = WGE.slideshowFitImages(imgArr, self._imageRatioX, self._imageRatioY);

            }, function (img, n, imageIndex)
            {
                if (typeof self._dealLoadingImage == 'function')
                    self._dealLoadingImage(img, imageIndex, n);
            });
        })
    },

    _processingQueue: function ()
    {
        if (!(this._queue instanceof Array && this._queue.length > 0))
        {
            this._queue = null;
            this._timerID = null;
            if (this._loadingFinish)
            {
                if (this.config)
                    this.initTimeline(this.config);
                if (this._finishCallback)
                    this._finishCallback(this.srcImages || imgArr, this);
                this.config = null;
            }
            return;
        }
        var obj = this._queue.shift();
        this._processingImage(obj);
        this._timerID = setTimeout(this._processingQueue.bind(this), 20);
    },

    _dealFinishLoadingImage: function (imgArr)
    {
        this._loadingFinish = true;
        if (!this._timerID)
        {
            if (this.config)
                this.initTimeline(this.config);
            if (this.finishCallback)
                this.finishCallback(this.srcImages || imgArr, this);
            this.config = null;
        }
        
        // this.loadEximage(this._bgImageURL, function()
        // {
        //     console.log("lomo image loaded");
        // });
    },

    _processingImage: function (obj)
    {
        var index = obj.INDEX;
        var img = obj.IMAGE;
        this.srcImages[index] = WGE.slideshowFitImage(img, 1, 1+ 100/WGE.SlideshowSettings.height);
        if(index % 5 == 4)
            this.handbleBlur(this.srcImages[index], index);
        this._eachCallback(img, obj.TOTAL, this);
    },


    handbleBlur : function (srcImg, imageIndex)
    {
        var blurCanvas = document.createElement('canvas');
        blurCanvas.width = this.srcImages[imageIndex].width;
        blurCanvas.height = this.srcImages[imageIndex].height;
        var c = blurCanvas.getContext('2d');
        c.clearRect(0, 0, c.width, c.height);
        c.globalAlpha = (1.0 / (10.0 / 2.0));
        for (var j = 0; j < 120.0; j += 2.0)
            c.drawImage(this.srcImages[imageIndex], 0, j);

        this.blurImages[Math.floor(imageIndex/5)] = blurCanvas;
    },

    CombineScence : function(start)
    {   
        var sprite = new mySprite(start, start+6000, WGE.rotateArray(this.srcImages), -1);
        var sprite1 = new mySprite(start+5000, start+11000, WGE.rotateArray(this.srcImages), -1);
        var sprite2 = new mySprite(start+10000, start+16000, WGE.rotateArray(this.srcImages), -1); 
        var sprite3 = new mySprite(start+15000,start+21000, WGE.rotateArray(this.srcImages), -1); 
        var logicSprite = new MyLogicSprite(start+19000, start+29000);
        logicSprite.setHotspot2Center();


        sprite3.setHotspot(0, 1);
        sprite1.setHotspot(0, 1);
        sprite2.setHotspot(0, 1);
        sprite.setHotspot(0, 1);
        logicSprite.setHotspot(0, 1);
         var topPos = -50;

        //[0-5000],动作两个
        {
            var action0 = new WGE.Actions.UniformAlphaAction([0, 1000], 0, 1, 1);

            var action = new WGE.Actions.acceleratedMoveAction([0000, 5000], [WGE.SlideshowSettings.width/2, topPos], 
            [WGE.SlideshowSettings.width/2, topPos], 1);
        
            var action2 = new WGE.Actions.MoveRightAction([5000, 6000], [WGE.SlideshowSettings.width/2, 0], [WGE.SlideshowSettings.width/2+sprite1.size.data[0], topPos], 1);
            action2.setDistance((sprite.size.data[0]+sprite1.size.data[0])/2);

            sprite.push(action0);
            sprite.push(action);
            sprite.push(action2);

        }

        //[5000 - 10000]
         {
            var action3 = new WGE.Actions.MoveRightAction([0, 1000], [WGE.SlideshowSettings.width/2 - (sprite.size.data[0]+sprite1.size.data[0])/2, topPos], [WGE.SlideshowSettings.width/2, topPos], 1);
            action3.setDistance((sprite.size.data[0]+sprite1.size.data[0])/2);
           
            var action4 = new WGE.Actions.acceleratedMoveAction([1000, 5000], [WGE.SlideshowSettings.width/2, topPos], 
            [WGE.SlideshowSettings.width/2, topPos], 1);

            var action5 = new WGE.Actions.MoveRightAction([5000, 6000], [WGE.SlideshowSettings.width/2, topPos], [WGE.SlideshowSettings.width/2+sprite2.size.data[0], topPos], 1);
            action5.setDistance((sprite2.size.data[0]+sprite1.size.data[0])/2);

             sprite1.push(action3);
             sprite1.push(action4);
             sprite1.push(action5);

        }     

        //[10000 - 15000]
        {
             var action6 = new WGE.Actions.MoveRightAction([0, 1000], [WGE.SlideshowSettings.width/2 - (sprite2.size.data[0]+sprite1.size.data[0])/2 , topPos], [WGE.SlideshowSettings.width/2, topPos], 1);
             action6.setDistance((sprite2.size.data[0]+sprite1.size.data[0])/2);
           
            var action7 = new WGE.Actions.acceleratedMoveAction([1000, 5000], [WGE.SlideshowSettings.width/2,topPos], 
            [WGE.SlideshowSettings.width/2, topPos], 1);

             var action10 = new WGE.Actions.MoveDownAction([5000, 6000], [WGE.SlideshowSettings.width/2, topPos], [WGE.SlideshowSettings.width/2, topPos], 1);
             action10.setDistance(sprite3.size.data[1]);

             sprite2.push(action6);
             sprite2.push(action7);
             sprite2.push(action10);
        }  

        var img1 = WGE.rotateArray(this.blurImages);

        //[10000 - 15000]
        {
             var action8 = new WGE.Actions.MoveDownAction([0, 1000], [WGE.SlideshowSettings.width/2  , topPos- sprite3.size.data[1]], [WGE.SlideshowSettings.width/2 , topPos], 1);
             action8.setDistance(sprite3.size.data[1]);
           

             var action19 = new WGE.Actions.acceleratedMoveAction([1000, 4000], [WGE.SlideshowSettings.width/2, topPos], 
            [WGE.SlideshowSettings.width/2, topPos], 1);

             var actionMove1=  new WGE.Actions.MoveSlideRightAction([4000, 5000], [WGE.SlideshowSettings.width/2 - (img1.width+sprite3.size.data[0])/2 , topPos], [WGE.SlideshowSettings.width/2, topPos], 1);
             actionMove1.setDistance((img1.width+sprite3.size.data[0])/2 );

             sprite3.push(action8);
             sprite3.push(action19);
             sprite3.push(actionMove1)

        }  

        //拖尾效果
        {
            var sprites = [];
            var h = topPos;
            var spriteLength = 10;
            var descDis = 300;

            var img =  WGE.rotateArray(this.srcImages);
            sprites[0]= new mySprite(18000, 24000, img, -1); 
            sprites[0].setHotspot(0, 1);
            sprites[0].moveTo(0, h);
            h += sprites[0].size.data[1];
            logicSprite.addChild(sprites[0]);

            for (var i = 1; i < spriteLength; i++) {

                sprites[i] = new mySprite(18000, 24000, img1, -1); 
                sprites[i].setHotspot(0, 1);
                sprites[i].moveTo(0, h);
                h += sprites[i].size.data[1];
                logicSprite.addChild(sprites[i]);
            }
            
            for (var i = 0; i < 2; i++) {
                sprites[spriteLength + i] = new mySprite(18000, 24000, img, -1); 
                sprites[spriteLength + i].setHotspot(0, 1);
                sprites[spriteLength + i].moveTo(0, h);
                h += sprites[spriteLength + i].size.data[1];
                logicSprite.addChild(sprites[spriteLength + i]);
            };

            spriteLength += 2;

            var actionMove =  new WGE.Actions.MoveSlideRightAction([0, 1000], [WGE.SlideshowSettings.width/2 - (img.width+sprite3.size.data[0])/2 , topPos], [WGE.SlideshowSettings.width/2, topPos], 1);
            actionMove.setDistance((img.width+sprite3.size.data[0])/2 );

            var action22 = new WGE.Actions.acceleratedSlideMoveAction([1000, 3000], [WGE.SlideshowSettings.width/2, topPos], 
            [WGE.SlideshowSettings.width/2, topPos], 1);

            var action18 = new WGE.Actions.MoveSlideAction([3000, 7000], [WGE.SlideshowSettings.width/2  , topPos], [WGE.SlideshowSettings.width/2 , topPos], 1);
            logicSprite.push(action18);
            action18.setDescDistance(descDis);
            action18.setDistance(h - sprites[spriteLength - 1].size.data[1]  - sprites[spriteLength - 2].size.data[1]+ descDis -topPos );

            var action20 = new WGE.Actions.acceleratedSlideMoveAction([7000, 10000], [WGE.SlideshowSettings.width/2, topPos], 
            [WGE.SlideshowSettings.width/2, topPos], 1);

            var action21 = new WGE.Actions.MoveSlideRightAction([9000, 10000], [WGE.SlideshowSettings.width/2 - (sprite2.size.data[0]+sprite1.size.data[0])/2 , WGE.SlideshowSettings.height/2], [WGE.SlideshowSettings.width/2, WGE.SlideshowSettings.height/2], 1);
            action21.setDistance(1024);

            logicSprite.push(action20);
            logicSprite.push(action22);
            logicSprite.push(actionMove);
        }

        this.timeline.push(sprite, sprite1,sprite2, sprite3,logicSprite);
    },

});