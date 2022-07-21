EGS.ActionInterface =  EGS.Class({
	_bindObj : null,
	_startTime : 0,
	_endTime : 0,
	_isBindObj : false,
	_totalTime : 0,

	initialize : function(startTime, endTime)
	{	
		this._startTime = startTime;
		this._endTime = endTime;
		this._totalTime = endTime - startTime;
	},

	start : function()
	{

	},

	end : function()
	{

	},

	update : function(runTime)
	{
	
	},

	getStartTime : function()
	{
		return this._startTime;
	},

	getEndTime : function()
	{
		return this._endTime;
	},

	bind : function(obj)
	{
		this._bindObj = obj;
		this._isBindObj = true;
	},

	isBind : function()
	{
		return this._isBindObj;
	}

});



EGS.ActionAlpha =  EGS.Class(EGS.ActionInterface,
{
	_bindObj : null,
	_startTime : 0,
	_endTime : 0,
	_isBindObj : false,
	_fromAlpha : 0,
	_endAlpha : 0,
	_totalTime : 0,
	_descAlpha : 0, 

	setAlphaRange : function(fromAlpha, endAlpha)
	{
		this._fromAlpha = fromAlpha;
		this._endAlpha = endAlpha;
		this._descAlpha = endAlpha - fromAlpha;
	},

	start : function()
	{

	},

	end : function()
	{

	},

	update : function(runTime)
	{
		if(runTime > this._totalTime)
		{
			return;
		}

		var p = runTime / this._totalTime;
		var p1 = this._descAlpha*p;

		this._bindObj.setAlpha(this._fromAlpha + p1);
		console.log(p1);
	},

	getStartTime : function()
	{
		return this._startTime;
	},

	getEndTime : function()
	{
		return this._endTime;
	},

	bind : function(obj)
	{
		this._bindObj = obj;
		this._isBindObj = true;
	},

	isBind : function()
	{
		return this._isBindObj;
	}

});

EGS.moveAction = EGS.Class(EGS.ActionInterface, 
{
	_fromX : 0, 
	_fromY : 0, 
	_endX : 0, 
	_endY : 0,
	_moveX : 0,
	_moveY : 0,
	_descX : 0,
	_descY : 0,

	setMoveDis : function(x, y)
	{
		this._moveX = x;
		this._moveY = y;
	},

	setPos : function(fromX, formY, endX, endY)
	{
		this._fromX = fromX;
		this._fromY = formY;
		this._endX = endX;
		this._endY = endY;
		this._descX = endX - fromX;
		this._descY = endY - formY;
	},

	update : function(runTime)
	{

		if(runTime > this._totalTime)
		{
			return;
		}

		var p = runTime / this._totalTime;
		var p1 = this._descX*p*p*p;
		var p2 = this._descY*p*p*p;

		this._bindObj.moveTo(this._fromX + p1,this._fromY + p2);

	},

});



EGS.SpriteAnimitation = EGS.Class({
	
	_startTime : 0,	//Sprite开始创建的时间
	_endTime : 0,	//Sprite结束的时间，在这个时间周期内，才会被执行
	_actionArr : null,
	_totalTime : 0,

	setSpriteAttribute : function(startTime, endTime)
	{
		this._startTime = startTime;
		this._endTime = endTime;
		this._actionArr = new Array();
		this._totalTime = endTime - startTime;
	},

	pushAction : function(action)
	{
		if(action.isBind())
		{
			console.log("action binded more than twice!" );
			return;
		}

		action.bind(this);
		if(this._totalTime >= action.getStartTime())
			this._actionArr.push(action);
	},

	pushActionArr :function(actionArr)
	{
		for(var i in actionArr)
		{
			if(actionArr[i].isBind())
			{
				console.log("action binded more than twice!" );
				continue;
			}

			actionArr[i].bind(this);
			if(this._totalTime >= actionArr[i].getStartTime())
				this._actionArr.push(actionArr[i]);
		}
	},	

	//更新sprite的action数据
	update : function(time)
	{
		if(time < this._startTime || time > this._endTime)
			return;

		var runtime = time - this._startTime;

		for(var i in this._actionArr)
		{
			if(this._actionArr[i].getEndTime() <  runtime){
				//this._actionArr.remove(this._actionArr[i]);
				continue;
			}
			else if(this._actionArr[i].getStartTime > runtime)
			{
				continue;
			}

			this._actionArr[i].update(runtime);
		};
	},

	run : function()
	{

	},

});


EGS.Timeline = EGS.Class(
{
	_startTime : 0,
	_endTime : 10000,
	_time : 0,
	_spriteArr : null,
	_runTime : 0,
	_loopFunc : null,
	_animationRequest : null,
	_lastTime : null,

	initialize : function(startTime, endTime)
	{
		this._startTime = startTime;
		this._endTime = endTime;
		this._spriteArr = new Array();
		this._loopFunc = this.mainLoop.bind(this);
	},

	pushSprite : function(spriteObj)
	{
		this._spriteArr.push(spriteObj);
	},

	start : function()
	{
		var date = new Date();
		this._time = date.getTime();
		this._animationRequest = requestAnimationFrame(this._loopFunc);
	},

	updateTimeline : function()
	{
		
		var date = new Date();
		var time = date.getTime();
		this._runTime = time - this._time;

		if(this._runTime >= this._endTime)
		{
			console.log("time over!");
			return;
		}

		for(var i in this._spriteArr)
		{
			var spriteObj = this._spriteArr[i];
			spriteObj.update(this._runTime);
			spriteObj.render();
		}

		requestAnimationFrame(this.render);
	},

	render : function()
	{
		var date = new Date();
		var time = date.getTime();
		this._runTime = time - this._time;

		if(this._runTime >= this._endTime)
		{
			console.log("time over!");
			return;
		}

		requestAnimationFrame(this.render);
	},

	mainLoop : function()
	{
		var date = new Date();
		var time = date.getTime();
		this._runTime = time - this._time;

		if(this._runTime >= this._endTime)
		{
			console.log("time over!");
			cancelAnimationFrame(this._animationRequest);
			return;
		}

		for(var i in this._spriteArr)
		{
			var spriteObj = this._spriteArr[i];
			spriteObj.update(this._runTime);
			spriteObj.render();
		}


		this._animationRequest = requestAnimationFrame(this._loopFunc);
	},
});


EGS.TestAnSprite = EGS.Class(EGS.SpriteAnimitation, EGS.Sprite2D,
{

});