
(function () 
{
	
	//Setting the stage
	var _Stage  = "gameStage";
	var _Width  = 320;
	var _Height = 480;
	
	//itemの数
	var _itemMax = 10;

	//Stage
	stage = new createjs.Stage(_Stage);

	//タッチデバイスにイベントを対応させる
	createjs.Touch.enable(stage);

	//使用する画像の一覧
	var manifest = [
		{src:"assets/images/bg001.png", id:"ground"},
		{src:"assets/images/player01.png", id:"player01"},
		{src:"assets/images/jewel001.png", id:"jewel001"},
		{src:"assets/images/button01.png", id:"button01"}
	];

	//プリロード用のキューオブジェクトを生成
	var queue = new createjs.LoadQueue(false);

	//ファイルの読み込み
	queue.loadManifest(manifest);

	
	//CastObject
	var PlayerObject, ItemObject, ButtonObject, LeftButtonObject, RightButtonObject;

	//Cast Container
	//var playerContainer, JewelContainer;

	//Part name
	var leftBtnObj, rightBtnObj;
	
	//PlayerObject
	PlayerObject = function (_container) {
		this._container = _container;
	};
	
	//initialization
	PlayerObject.prototype.initialization = function ()
	{
		//var self = this;
		//PlayerのSpriteSheet
		var playerSpriteSheet = new createjs.SpriteSheet({
			
			framerate: 24,
			images: [queue.getResult("player01")],
			frames: {"height": 32, "width": 32, "regX": 0, "regY": 0, "count": 33},
			animations:
			{
				stay:   [0, 2, "stay", 0.5],
				moveL:  [3, 5, "moveL", 0.5],
				moveR:  [6, 8, "moveR", 0.5],
				damage: [18],
				win:    [24,26,"win", 0.25],
				down:   [30]
			}

		});

			this._container = new createjs.Container();
			this._container.width  = 32;
			this._container.height = 32;
			this._container.x      = (_Width / 2) - 32;
			this._container.y      = 300;

			var hitTest = new createjs.Shape();
			this._hitTest = hitTest;
			this._hitTest.y = -32;
			this._hitTest.graphics.beginFill(createjs.Graphics.getRGB(50, 100, 150, 0.2)).drawRect(0, 0, 32, 32);

			//Player
			this._player = new createjs.Sprite(playerSpriteSheet, "stay");
			this._player.x = 0;
			this._player.y = 0;
			this._container.addChild(this._hitTest, this._player);

	};

	//stay
	PlayerObject.prototype.stay = function ()
	{
		this._player.gotoAndPlay("stay");
	};


	PlayerObject.prototype.left = function ()
	{
		this._player.gotoAndPlay("moveL");
	};

	PlayerObject.prototype.right = function ()
	{
		this._player.gotoAndPlay("moveR");
	};

	//moveToLeft
	PlayerObject.prototype.moveToLeft = function ()
	{
		//this._player.gotoAndPlay("moveL");
		//
		this._container.x = this._container.x -5;

		if (this._container.x < 0) 
		{
			this._container.x = 0;
		} 
		
		
	};

	//moveToRight
	PlayerObject.prototype.moveToRight = function ()
	{
		//this._player.gotoAndPlay("moveR");
		this._container.x = this._container.x +5;

		if (this._container.x > _Width - 32) 
		{
			this._container.x = _Width - 32;
			
		}


	};


	//ItemObject
	ItemObject = function (_container) {
		this._container = _container;
	};

	//initialization
	ItemObject.prototype.initialization = function ()
	{
		//var self = this;
		//ItemObjectのSpriteSheet
		var itemsSpriteSheet = new createjs.SpriteSheet({
			images: [queue.getResult("jewel001")],
			frames: {"height":32, "width":32, "regX": 0, "regY": 0, "count": 12},
			animations:
			{
				stay:[6]
			}
			
		});

		this._container  = new createjs.Container();
		this._container.width  = 32;
		this._container.height = 32;
		this._container.x      = 0;
		this._container.y      = 0;
		this._speed            = 3;

		var _item = new createjs.Sprite(itemsSpriteSheet, "stay");
		//bg = new createjs.Shape();
		
		//bg.graphics.beginFill(createjs.Graphics.getRGB(50, 100, 150, 0.9)).drawRect(0, 0, 32, 32);
		this._container.addChild(_item);

	};

	//Move
	ItemObject.prototype.move = function ()
	{
		this._container.y = this._container.y + this._speed;
	};

	ItemObject.prototype.remove = function ()
	{
		MainScene.removeChild(this._container);
		delete this._container;
	};

	//ButtonObject

	ButtonObject = function (_Container) {
		this._container = _Container;
		console.log("ButtonObject:_Container" + this._Button);
	};

	ButtonObject.prototype.initialization = function ()
	{


 		this._container = new createjs.Container();
		this._container.width  = 32;
		this._container.height = 32;
		//ButtonのSpriteSheet
		var buttonSpriteSheet;
		this.SpriteSheet = buttonSpriteSheet;
		this.SpriteSheet = new createjs.SpriteSheet({
			images: [queue.getResult("button01")],
			frames: {"height":54, "width":54, "regX": 0, "regY": 0, "count": 4},
			animations:
			{
				leftOff:[0],
				leftOn :[1],
				rightOff :[2],
				rightOn  :[3]
			}
		});

	};

	//LeftButtonObject
	LeftButtonObject = function (){};
	//ButtonObjectを継承
	LeftButtonObject.prototype = Object.create(ButtonObject.prototype);
	LeftButtonObject.prototype.constructor = LeftButtonObject;
	LeftButtonObject.prototype.setup = function ()
	{
		//var self = this;
		this._container.x = 10;
		this._container.y = 400;
		this._button = new createjs.Sprite(this.SpriteSheet, "leftOff");
		this._container.addChild(this._button);
	};

	//Down
	LeftButtonObject.prototype.MouseDown = function ()
	{
		this._button.gotoAndPlay("leftOn");
	};

	//PressUp
	LeftButtonObject.prototype.PressUp = function ()
	{
		this._button.gotoAndPlay("leftOff");
	};


	//RightButtonObject
	RightButtonObject = function (){};
	//ButtonObjectを継承
	RightButtonObject.prototype = Object.create(ButtonObject.prototype);
	RightButtonObject.prototype.constructor = RightButtonObject;

	RightButtonObject.prototype.setup = function ()
	{
		//var self = this;
		this._container.x = 256;
		this._container.y = 400;
		this._button = new createjs.Sprite(this.SpriteSheet, "rightOff");
		this._container.addChild(this._button);
	};

	//Down
	RightButtonObject.prototype.MouseDown = function ()
	{
		this._button.gotoAndPlay("rightOn");
	};

	//PressUp
	RightButtonObject.prototype.PressUp = function ()
	{
		this._button.gotoAndPlay("rightOff");
	};


	//SceneObject
	var TitleSceneObject, MainSceneObject, ResultSceneObject;

	//Scene Name
	var TitleScene, MainScene, ResultScene;

	//MainScene Cast
	var MainSceneCast = {};

	//MainSceneContainer
	var MainSceneContainer = {};

	//MainSceneCastFlag
	var MainSceneCastFlag = {player: "stay"};


	//TitleObject
	TitleSceneObject = function () {};

	//Initialization
	TitleSceneObject.prototype.initialization = function ()
	{
		//TitleScene タイトル画面 MainScene
		TitleScene = new createjs.Container();
		var bgShape01 = new createjs.Shape();

		bgShape01.graphics.beginFill("#006699").drawRect(0,0,_Width,_Height);
		TitleScene.addChild(bgShape01);
		TitleScene.visible = false;
	};

	//Complete
	TitleSceneObject.prototype.complete  = function () 
	{

		//StartButton
		var startButton  = new LeftButtonObject(leftBtnObj);
		//Initialization
		startButton.initialization();
		//Set UP
		startButton.setup ();

		//click  Go TO Main!!
		startButton._button.on('click',(function () 
		{
			GameManager.Main();
		}));

		TitleScene.addChild(startButton._container);

	};

	//MainManager
	MainSceneObject = function () {};

	//MainManager Initialization
	MainSceneObject.prototype.initialization = function ()
	{
		//MainScene メイン画面 MainScene
		MainScene  = new createjs.Container();
		MainScene.visible = false;
	};

	//Complete
	MainSceneObject.prototype.complete = function ()
	{
		
		//背景
		var groundImg = queue.getResult("ground");
		var ground = new createjs.Shape();
		ground.graphics.beginBitmapFill(groundImg).drawRect(0, 0,  _Width + groundImg.width,  _Height + groundImg.height);

		MainScene.addChild(ground);
		

		//playerObject
		var playerContainer;
		MainSceneContainer.player = playerContainer;

		var player = new PlayerObject (MainSceneContainer.player);
		MainSceneCast.player = player;
		player.initialization ();
		MainScene.addChild(player._container);


		//itemObject
		var items = [];
		var itemsContainer = [];
		var itemsPosX = [0 ,32, 64, 96, 128, 160, 192, 224, 256, 288];
		var itemsPosY = [0 , -32, -64, -96, -128, -160, -192, -224, -256, -288];
		//var itemsSpeed = [3 , 2, 1, 5, 2, 1, 2, 3, 2, 3];

		//itemsの最大数
		MainSceneCast.itemsSum = _itemMax;
		//カウント数の初期化　itemの最大数にする
		MainSceneCast.itemsCount = MainSceneCast.itemsSum;
		//itemが消えた数の初期化
		MainSceneCast.hitCount = 0;
		//itemを獲得した数の初期化
		MainSceneCast.getCount = 0;
		//結果画面の最大Pointを初期化
		GameManager.Result.maxPoint = _itemMax;

		for (var i = 0; i< MainSceneCast.itemsSum ; i ++) {
			var itemName = "items" + i;
			MainSceneContainer[itemName] = itemsContainer[i];

			items[i] = new ItemObject (itemsContainer[i]);
			MainSceneCast[itemName] = items[i];
			items[i].initialization ();

			MainSceneCast[itemName]._container.x = itemsPosX[i];
			MainSceneCast[itemName]._container.y = itemsPosY[i];
			//MainSceneCast[itemName]._speed       = itemsSpeed[i];
			
			MainScene.addChild(items[i]._container);
			MainSceneCastFlag[itemName] = true;
		}

			//MainSceneCast.items0._container.x = 32;
			//MainSceneCast.items1._container.x = 64;
			//MainSceneCast.items2._container.x = 96;

		//var Jewel01 = new JewelObject (JewelContainer);

		console.log(MainSceneCast);
		console.log(MainSceneContainer);
		console.log(MainSceneCastFlag);

		//Left Button
		var leftButton  = new LeftButtonObject(leftBtnObj);
		//Initialization
		leftButton.initialization();
		//Set UP
		leftButton.setup ();

		//MouseDown
		leftButton._button.on('mousedown',(function () 
		{
			leftButton.MouseDown();
			player.left();
			MainSceneCastFlag.player = "Left";
			
		}));

		//pressup
		leftButton._button.on('pressup',(function () 
		{
			leftButton.PressUp();
			player.stay();
			MainSceneCastFlag.player = "stay";
		}));


		MainScene.addChild(leftButton._container);

		//Right Button
		var rightButton  = new RightButtonObject(rightBtnObj);
		//Initialization
		rightButton.initialization();
		//Set UP
		rightButton.setup ();
		
		//MouseDown
		rightButton._button.on('mousedown',(function () 
		{
			rightButton.MouseDown();
			MainSceneCastFlag.player = "Right";
			player.right();
		}));

		//pressup
		rightButton._button.on('pressup',(function () 
		{
			rightButton.PressUp();
			player.stay();
			MainSceneCastFlag.player = "stay";
		}));

		MainScene.addChild(rightButton._container);

	};


	//MainSceneManager
	var MainSceneManager = {
		playerMove :function () {

			//MainSceneManager.playerMove ();
			if (MainSceneCastFlag.player == "Left")
			{
				MainSceneCast.player.moveToLeft();
			}
			
			else if (MainSceneCastFlag.player == "Right") 
			
			{
				MainSceneCast.player.moveToRight();
			}
			
		},

		itemsMove :function () {

			for (var i = 0; i< MainSceneCast.itemsSum; i ++)
			{
				var itemName = "items" + i;

				if (MainSceneCast.itemsCount == 0)
				{
					GameManager.Result.point = MainSceneCast.getCount;
					GameManager.Result();
					return;
				}

				//itemが存在している場合
				if(MainSceneCastFlag[itemName] == true) 
				{
					//移動する
					MainSceneCast[itemName].move();
					
					//ステージの一番下になったら削除
					if (MainSceneCast[itemName]._container.y > 400) 
					{
						//Remove
						MainSceneCast[itemName].remove();
						MainSceneCastFlag[itemName] = false;
						MainSceneCast.itemsCount = MainSceneCast.itemsCount -1;
						//削除したら以降は実行しない
						return;
					}
					
					//Playerの当たり判定Objectと接触したら
					var pointHitTest = MainSceneCast[itemName]._container.localToLocal(0, 0, MainSceneCast.player._hitTest);
					if (MainSceneCast[itemName]._container.hitTest(pointHitTest.x, pointHitTest.y)) 
					{
						//Remove
						MainSceneCast[itemName].remove();
						MainSceneCastFlag[itemName] = false;
						MainSceneCast.getCount      = MainSceneCast.getCount + 1;
						MainSceneCast.itemsCount    = MainSceneCast.itemsCount -1;
						
						//Result
						//GameManager.Result();
					}

				}

			}
			
		}

	};

	//ticker
	MainSceneObject.prototype.ticker = function ()
	{
		//Player
		MainSceneManager.playerMove ();

		//items
		MainSceneManager.itemsMove ();
		console.log("MainSceneCast.itemsCount:" + MainSceneCast.itemsCount);
		
	};


	//ResultSceneObject
	ResultSceneObject = function () {};

	//Initialization
	ResultSceneObject.prototype.initialization = function ()
	{
		//ResultScene 結果画面
		ResultScene = new createjs.Container();
		ResultScene.visible = false;
		var bgShape03 = new createjs.Shape();
		bgShape03.graphics.beginFill("#CCCCCC").drawRect(0,0,_Width,_Height);
		ResultScene.addChild(bgShape03);
	
	};

	//Complete
	ResultSceneObject.prototype.complete = function () 
	{

		//得点
		console.log("得点の最大" + GameManager.Result.maxPoint);
		console.log("得点:" + GameManager.Result.point);


		//GameManager.Result.maxPoint 最大獲得数

		if (GameManager.Result.point == GameManager.Result.maxPoint)
		{
			console.log("ぱーふぇくと");
		}
		//最大獲得数より2少ない
		else if (GameManager.Result.point == GameManager.Result.maxPoint - 1)
		{
			console.log("べーりーぐーど！");
		}
		//最大獲得数の半分以上　最大獲得数より1少ない　以下
		else if (GameManager.Result.point >= (GameManager.Result.maxPoint / 2) && GameManager.Result.point < GameManager.Result.maxPoint - 1 )
		{
			console.log("ぐーど！");
		}
		else
		{
			console.log("がんばろう！");
		}



		//StartButton
		var reStartButton  = new LeftButtonObject(rightBtnObj);

		//Initialization
		reStartButton.initialization();

		//Set UP
		reStartButton.setup ();

		//click  Go TO Main!!
		reStartButton._button.on('click',(function () 
		{
			GameManager.Main();
		}));


		ResultScene.addChild(reStartButton._container);

		console.log("ResultScene:" + ResultScene.numChildren);
		//console.log(stage.numChildren)


		//stage.addChild(ResultScene);
	};


	//SceneObject
	var title  = new TitleSceneObject ();
	var main   = new MainSceneObject ();
	var result = new ResultSceneObject ();

	//Initialization
	title.initialization ();
	main.initialization ();
	result.initialization ();


	//GameManager
	var GameManager = {
		Title :function () {
			TitleScene.visible  = true;
			MainScene.visible   = false;
			ResultScene.visible = false;
			stage.addChild(TitleScene);
			stage.removeChild(MainScene);
			stage.removeChild(ResultScene);
			title.complete();

		},

		Main :function () {
			TitleScene.visible  = false;
			MainScene.visible   = true;
			ResultScene.visible = false;
			stage.addChild(MainScene);
			stage.removeChild(TitleScene);
			stage.removeChild(ResultScene);
			main.complete();
		},

		Result: function () {
			TitleScene.visible  = false;
			MainScene.visible   = false;
			ResultScene.visible = true;
			stage.addChild(ResultScene);
			stage.removeChild(MainScene);
			stage.removeChild(TitleScene);
			result.complete();
		}
	
	};



	//ファイル読み込み中の処理
	var handleProgress = function () 
	{
		console.log("読み込み中");
	};

	//ファイル読み込み完了後の処理
	var handleComplete = function () 
	{
		console.log("読み込み完了");
		
		//読み込み後にTitleSceneへ遷移
		GameManager.Title();

	};

	
	//時間経過の処理
	var Ticker = function ()
	{
		//読み込みが完了しているか
		if(queue.loaded == true)
		{
		//MainSceneが表示されていたら実行
			if (MainScene.visible == true)
			{
				main.ticker();
				
			}
		
		//result.ticker();

		//ステージの更新
		stage.update();
		};

	};

	//ファイル読み込み中
	queue.on('progress',handleProgress);

	//ファイル読み込み完了時
	queue.on('complete', handleComplete);

	//時間経過の一元管理
	createjs.Ticker.addEventListener('tick', Ticker);


}());
