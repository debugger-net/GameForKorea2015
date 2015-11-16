//------------------------------------------------------------------------------
// Initialize
//------------------------------------------------------------------------------
$( function() { 
	InitializeExternalUI();

	gameStage = new createjs.Stage("gameCanvas");
	
	createjs.Touch.enable(gameStage);
	
	gameStage.enableMouseOver(10);
	gameStage.mouseMoveOutside = true;
	
	InitializeUI();
	InitializeGameLogic();
	InitializeGameGraphicComponent();
	
	gameStage.update();
	
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener('tick', gameStage);
	
	NextPTurn();
} );

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------
var kLogicBoardWidth = 5;
var kLogicBoardHeight = 5;

var kBoardAreaTop = 100;
var kBoardAreaLeft = 120;
var kBoardCellWidth = 72;
var kBoardCellHeight = 72;
var kBoardCellPadding = 8;

var kBoardNeutralColor = 'LightGrey';
var kBoardSourceColor = 'LightSteelBlue';
var kBoardMovableColor = 'LightGreen';
var kBoardMergableColor = 'LightYellow';
var kBoardPushableColor = 'LightSalmon';
var kBoardLaunchColor = 'LightCoral';

var kBoardCursorColor = 'SlateGray';

var kTransparentColor = 'rgba(0,0,0,0)';

var kWaterColor = 'Aqua';

var kPAddPositions = [ { 'x': 0, 'y': 0 }, { 'x': 1, 'y': 0 }, { 'x': 3, 'y': 0 }, { 'x': 4, 'y': 0 } ];
var kCAddPositions = [ { 'x': 0, 'y': 4 }, { 'x': 1, 'y': 4 }, { 'x': 2, 'y': 4 }, { 'x': 3, 'y': 4 }, { 'x': 4, 'y': 4 } ];
var kCAmbAddPositions = [ { 'x': 0, 'y': 3 }, { 'x': 0, 'y': 2 }, { 'x': 0, 'y': 4 }, { 'x': 0, 'y': 1 } ];

var kFourDirectionMovingArea = [ { 'dx': -1, 'dy': 0 }, { 'dx': 0, 'dy': -1 }, { 'dx': 1, 'dy': 0 }, { 'dx': 0, 'dy': 1 }];

var kCEndingArea = [ { 'x': 0, 'y': 0 }, { 'x': 1, 'y': 0 }, { 'x': 2, 'y': 0 }, { 'x': 3, 'y': 0 }, { 'x': 4, 'y': 0 } ];

var kAmbDispatchDelay = 2;

var kLSSPosX = 2;
var kLSSPosY = 2;

//------------------------------------------------------------------------------
// Game
//------------------------------------------------------------------------------
var gameStage = null;

var logicGameBoard = null;

var graphicUnderLayerContainer = null;
var graphicBoardContainer = null;
var graphicUnitLayerContainer = null;
var graphicOverUnitLayerContainer = null;
var graphicOverLayerContainer = null;

var isControl = false;

var isAmbDispatched = false;
var ambDispatchWaitTurn = -1;
var ambLogicObject = null;

var replayRequested = false;

var lastPTurnPlayed = false;
var lastCTurnPlayed = true;

var inEndingState = false;


function DoReplay()
{
	replayRequested = false;
	inEndingState = false;
	isControl = false;
	isAmbDispatched = false;
	ambDispatchWaitTurn = -1;
	ambLogicObject = null;
	lastCTurnPlayed = true;

	gameStage.removeAllChildren();
	
	InitializeUI();
	InitializeGameLogic();
	InitializeGameGraphicComponent();
	
	gameStage.update();
	
	NextPTurn();
}

function InitializeExternalUI()
{
	$('.endingReplay').on('click', function () {
		DoReplay();
	});
}

function InitializeUI()
{
	var replayButton = new Button('replay', 'Silver');
	replayButton.x = kBoardAreaLeft;
	replayButton.y = kBoardAreaTop + (kBoardCellHeight + kBoardCellPadding) * kLogicBoardHeight;
	replayButton.on('click', function() {
		RequestReplay();
	});
	gameStage.addChild(replayButton);
}

function InitializeGameLogic()
{
	logicGameBoard = new Object();
	for (var i = 0; i < kLogicBoardWidth; ++i)
	{
		logicGameBoard[i] = new Object();
		for (var j = 0; j < kLogicBoardHeight; ++j)
		{
			logicGameBoard[i][j] = new Object();
			logicGameBoard[i][j].logicObject = null;
		}
	}
}

function InitializeGameGraphicComponent()
{
	var tempContainer;

	graphicUnderLayerContainer = new createjs.Container();
	
	tempContainer = new createjs.Container();
	CreateGGGraphicShapeObject(tempContainer);
	graphicUnderLayerContainer.addChild(tempContainer);
	
	gameStage.addChild(graphicUnderLayerContainer);

	// Game Board
	graphicBoardContainer = new createjs.Container();
	for (var i = 0; i < kLogicBoardWidth; ++i)
	{
		for (var j = 0; j < kLogicBoardHeight; ++j)
		{
			if (!IsValidCellPosition(i, j))
				continue;
			var cellGraphic = new createjs.Shape();
			logicGameBoard[i][j].boardFillCommand = cellGraphic.graphics.beginFill(kBoardNeutralColor).command;
			logicGameBoard[i][j].boardStrokeCommand = cellGraphic.graphics.beginStroke(kTransparentColor).command;
			cellGraphic.graphics.setStrokeStyle(3).drawRect(0, 0, kBoardCellWidth, kBoardCellHeight);
			cellGraphic.x = (kBoardCellWidth + kBoardCellPadding) * i;
			cellGraphic.y = (kBoardCellHeight + kBoardCellPadding) * j;
			graphicBoardContainer.addChild(cellGraphic);
		}
	}
	graphicBoardContainer.x = kBoardAreaLeft;
	graphicBoardContainer.y = kBoardAreaTop;
	gameStage.addChild(graphicBoardContainer);
	
	// Unit Layer
	graphicUnitLayerContainer = new createjs.Container();
	graphicUnitLayerContainer.x = kBoardAreaLeft;
	graphicUnitLayerContainer.y = kBoardAreaTop;
	gameStage.addChild(graphicUnitLayerContainer);
	
	graphicOverUnitLayerContainer = new createjs.Container();
	graphicOverUnitLayerContainer.x = kBoardAreaLeft;
	graphicOverUnitLayerContainer.y = kBoardAreaTop;
	gameStage.addChild(graphicOverUnitLayerContainer);
	
	graphicOverLayerContainer = new createjs.Container();
	graphicOverLayerContainer.x = kBoardAreaLeft;
	graphicOverLayerContainer.y = kBoardAreaTop;
	
	tempContainer = new createjs.Container();
	CreateLSSGraphicShapeObject(tempContainer);
	SetBoardCellPosition(tempContainer, kLSSPosX, kLSSPosY);
	graphicOverLayerContainer.addChild(tempContainer);
	
	gameStage.addChild(graphicOverLayerContainer);
}

function ReInitializeBoardFill()
{
	for (var i = 0; i < kLogicBoardWidth; ++i)
	{
		for (var j = 0; j < kLogicBoardHeight; ++j)
		{
			if (!IsValidCellPosition(i, j))
				continue;
			logicGameBoard[i][j].boardFillCommand.style = kBoardNeutralColor;
		}
	}
}

function ReInitializeBoardStroke()
{
	for (var i = 0; i < kLogicBoardWidth; ++i)
	{
		for (var j = 0; j < kLogicBoardHeight; ++j)
		{
			if (!IsValidCellPosition(i, j))
				continue;
			logicGameBoard[i][j].boardStrokeCommand.style = kTransparentColor;
		}
	}
}

function RequestReplay()
{
	if (inEndingState || isControl)
	{
		DoReplay();
	}
	else
	{
		replayRequested = true;
	}
}

function TurnFinishEndingCheck()
{
	if (inEndingState)
	{
		return true;
	}
	
	if (replayRequested)
	{
		DoReplay();
		return true;
	}
	
	if (!lastPTurnPlayed && !lastCTurnPlayed)
	{
		PlayEnding(kEndingTypeNT);
		return true;
	}
	
	for (var i = 0; i < kCEndingArea.length; ++i)
	{
		var x = kCEndingArea[i].x;
		var y = kCEndingArea[i].y;
		if (logicGameBoard[x][y].logicObject != null)
		{
			var currentLogicType = logicGameBoard[x][y].logicObject.type;
			if (GetTeamOfType(currentLogicType) == 'C')
			{
				PlayEnding(kEndingTypeCW);
				return true;
			}
		}
	}
	
	return false;
}

function NextPTurn()
{
	AddP(function() {
		var isControllableObjectExists = false;
		for (var i = 0; i < kLogicBoardWidth; ++i)
		{
			for (var j = 0; j < kLogicBoardHeight; ++j)
			{
				if (logicGameBoard[i][j].logicObject != null)
				{
					if (logicGameBoard[i][j].logicObject.isControllable)
					{
						if (CheckObjectControllable(logicGameBoard[i][j].logicObject))
						{
							isControllableObjectExists = true;
							logicGameBoard[i][j].logicObject.unit.haloFillCommand.style = kPHaloColor;
						}
					}
				}
			}
		}
		if (isControllableObjectExists)
		{
			lastPTurnPlayed = true;
			isControl = true;
		}
		else
		{
			lastPTurnPlayed = false;
			FinishPTurn();
		}
	});
}

function CheckObjectControllable(actionObject)
{
	if (actionObject.type == 'PPump')
	{
		for (var i = 0; i < kFourDirectionMovingArea.length; ++i)
		{
			var curX = actionObject.unit.logicPosition.x + kFourDirectionMovingArea[i].dx;
			var curY = actionObject.unit.logicPosition.y + kFourDirectionMovingArea[i].dy;
			while (IsValidCellPosition(curX, curY))
			{
				var targetObject = logicGameBoard[curX][curY].logicObject;
				if (targetObject == null)
				{
					return true;
				}
				
				var targetTeam = GetTeamOfType(targetObject.type);
				if (targetTeam == 'C')
				{
					return true;
				}
				else
				{
					var targetLevel = GetLevelOfType(targetObject.type);
					if (targetLevel != 0)
						return true;
				}
				break;
			}
		}
		return false;
	}
	else
	{
		if (actionObject.movingArea == null)
			return false;
		for (var i = 0; i < actionObject.movingArea.length; ++i)
		{
			var curX = actionObject.unit.logicPosition.x + actionObject.movingArea[i].dx;
			var curY = actionObject.unit.logicPosition.y + actionObject.movingArea[i].dy;
			if (!IsValidCellPosition(curX, curY))
			{
				continue;
			}
			
			if (IsMovable(actionObject.unit.logicPosition.x, actionObject.unit.logicPosition.y, curX, curY, true))
			{
				return true;
			}
		}
		return false;
	}
}

function FinishPTurn()
{
	isControl = false;
	for (var i = 0; i < kLogicBoardWidth; ++i)
	{
		for (var j = 0; j < kLogicBoardHeight; ++j)
		{
			if (logicGameBoard[i][j].logicObject != null)
			{
				if (logicGameBoard[i][j].logicObject.unit.haloFillCommand != null)
				{
					logicGameBoard[i][j].logicObject.unit.haloFillCommand.style = kTransparentColor;
				}
			}
		}
	}
	ReInitializeBoardFill();
	ReInitializeBoardStroke();
	
	if (TurnFinishEndingCheck())
	{
		return;
	}
	
	setTimeout(NextCTurn, 300);
}

function AddP(finishCallback)
{
	var enableCount = 0;
	var enablePositions = new Array();
	
	for (var i = 0; i < kPAddPositions.length; ++i)
	{
		var x = kPAddPositions[i].x;
		var y = kPAddPositions[i].y;
		if (logicGameBoard[x][y].logicObject != null)
		{
			var currentLogicType = logicGameBoard[x][y].logicObject.type;
			if (GetTeamOfType(currentLogicType) == 'C')
				continue;
			if (currentLogicType == 'PWall' || currentLogicType == 'PPump')
				continue;
		}
		++enableCount;
		enablePositions.push(kPAddPositions[i]);
	}
	
	if (enableCount == 0)
	{
		// No Place to Add New P Unit
		finishCallback();
		return;
	}
	
	var createIndex = Math.floor(Math.random() * enableCount);
	var createPosition = enablePositions[createIndex];
	
	AddPIn(createPosition.x, createPosition.y, finishCallback);
}

function AddPIn(x, y, finishCallback)
{
	PlayPReinforcementMotion(x, y, function() {
		if (logicGameBoard[x][y].logicObject == null)
		{
			CreateP1In(x, y);
		}
		else
		{
			var currentLogicType = logicGameBoard[x][y].logicObject.type;
			RemoveIn(x, y);
			if (currentLogicType == 'P1')
			{
				CreateP2In(x, y);
			}
			else if (currentLogicType == 'P2')
			{
				CreateP3In(x, y);
			}
			else if (currentLogicType == 'P3')
			{
				CreatePWallIn(x, y);
			}
		}
		finishCallback();
	});
}

function PlayPReinforcementMotion(x, y, finishCallback)
{
	if (y != 0)
	{
		finishCallback();
		return;
	}
	
	var unitContainer = new createjs.Container();
	CreateP1GraphicObject(unitContainer);
	SetBoardCellPosition(unitContainer, x, -1);
	graphicUnitLayerContainer.addChild(unitContainer);
	
	createjs.Tween.get(unitContainer).to(GetBoardCellPosition(x, y), 80).
		call(function() {
			graphicUnitLayerContainer.removeChild(unitContainer);
			if (finishCallback != null)
				finishCallback();
		});
}

function NextCTurn()
{
	AddC(function() {
		setTimeout(CTurnMove, 300);
	});
}

function CTurnMove()
{
	var fowardMoves = new Array();
	var backwardMoves = new Array();
	var sideMoves = new Array();
	for (var i = 0; i < kLogicBoardWidth; ++i)
	{
		for (var j = 0; j < kLogicBoardHeight; ++j)
		{
			if (logicGameBoard[i][j].logicObject != null)
			{
				var currentLogicType = logicGameBoard[i][j].logicObject.type;
				if (currentLogicType == 'CAmb')
				{
					continue;
				}
				if (GetTeamOfType(currentLogicType) != 'C')
				{
					continue;
				}
				
				var actionObject = logicGameBoard[i][j].logicObject;
				if (actionObject.movingArea == null)
				{
					continue;
				}
				if (actionObject.isStunned)
				{
					continue;
				}
					
				for (var k = 0; k < actionObject.movingArea.length; ++k)
				{
					var curX = i + actionObject.movingArea[k].dx;
					var curY = j + actionObject.movingArea[k].dy;
					if (!IsValidCellPosition(curX, curY))
					{
						continue;
					}
					if (IsMovable(i, j, curX, curY, true))
					{
						var currentMove = { 
							'fromX': i, 'fromY': j, 
							'toX': curX, 'toY': curY, 
						};
						if (actionObject.movingArea[k].dy > 0)
						{
							backwardMoves.push(currentMove);
						}
						else if (actionObject.movingArea[k].dy < 0)
						{
							fowardMoves.push(currentMove);
						}
						else
						{
							sideMoves.push(currentMove);
						}
					}
				}
			}
		}
	}
	
	var moveIndex;
	var doingMove;
	if (fowardMoves.length > 0 || sideMoves.length > 0)
	{
		if (fowardMoves.length == 0)
		{
			moveIndex = Math.floor(Math.random() * sideMoves.length);
			doingMove = sideMoves[moveIndex];
		}
		else if (sideMoves.length == 0)
		{
			moveIndex = Math.floor(Math.random() * fowardMoves.length);
			doingMove = fowardMoves[moveIndex];
		}
		else
		{
			var fowardDice = Math.floor(Math.random() * 100);
			if (fowardDice > 30)
			{
				moveIndex = Math.floor(Math.random() * fowardMoves.length);
				doingMove = fowardMoves[moveIndex];
			}
			else
			{
				moveIndex = Math.floor(Math.random() * sideMoves.length);
				doingMove = sideMoves[moveIndex];
			}
		}
		lastCTurnPlayed = true;
		DoMove(doingMove.fromX, doingMove.fromY, doingMove.toX, doingMove.toY, FinishCTurn);
	}
	else if (backwardMoves.length > 0)
	{
		moveIndex = Math.floor(Math.random() * backwardMoves.length);
		doingMove = backwardMoves[moveIndex];
		lastCTurnPlayed = true;
		DoMove(doingMove.fromX, doingMove.fromY, doingMove.toX, doingMove.toY, FinishCTurn);
	}
	else
	{
		lastCTurnPlayed = false;
		FinishCTurn();
	}
}

function FinishCTurn()
{
	if (TurnFinishEndingCheck())
	{
		return;
	}
	
	ProcessAmbTurn(function() {
		setTimeout(NextPTurn, 400);
	});
}

function ProcessAmbTurn(finishCallback)
{
	if (isAmbDispatched)
	{
		var currentAmbPosition = GetAmbPosition();
		var onObject = logicGameBoard[currentAmbPosition.x][currentAmbPosition.y].logicObject;
		if (onObject != null)
		{
			if (GetTeamOfType(onObject.type) == 'C' && onObject.isStunned)
			{
				CurePumpHit(onObject);
				finishCallback();
				return;
			}
		}
		
		var nearestObjectX;
		var nearestObjectY;
		var nearestSquareDist;
		var nearestObject = null;
		for (var i = 0; i < kLogicBoardWidth; ++i)
		{
			for (var j = 0; j < kLogicBoardHeight; ++j)
			{
				if (logicGameBoard[i][j].logicObject != null)
				{
					if (GetTeamOfType(logicGameBoard[i][j].logicObject.type) == 'C' && logicGameBoard[i][j].logicObject.isStunned)
					{
						var currentSquareDist = GetSquareDist(logicGameBoard[i][j].logicObject.unit.logicPosition, currentAmbPosition);
						if (currentSquareDist == 0)
							continue;
						if (nearestObject == null)
						{
							nearestObject = logicGameBoard[i][j].logicObject;
							nearestObjectX = i;
							nearestObjectY = j;
							nearestSquareDist = currentSquareDist;
							continue;
						}
						if (currentSquareDist < nearestSquareDist)
						{
							nearestObject = logicGameBoard[i][j].logicObject;
							nearestObjectX = i;
							nearestObjectY = j;
							nearestSquareDist = currentSquareDist;
						}
					}
				}
			}
		}
		
		var moveDestination = null;
		if (nearestObject != null)
		{
			var bfsBoard = new Object();
			for (var i = 0; i < kLogicBoardWidth; ++i)
			{
				bfsBoard[i] = new Object();
				for (var j = 0; j < kLogicBoardHeight; ++j)
				{
					bfsBoard[i][j] = null;
				}
			}
			var bfsQueueX = new Array();
			var bfsQueueY = new Array();
			var currentHead = 0;
			bfsQueueX.push(currentAmbPosition.x);
			bfsQueueY.push(currentAmbPosition.y);
			bfsBoard[currentAmbPosition.x][currentAmbPosition.y] = { 'x': -1, 'y': -1 };
			var isFoundPath = false;
			while (currentHead < bfsQueueX.length)
			{
				var srcX = bfsQueueX[currentHead];
				var srcY = bfsQueueY[currentHead];
				++currentHead;
				for (var k = 0; k < ambLogicObject.movingArea.length; ++k)
				{
					var curX = srcX + ambLogicObject.movingArea[k].dx;
					var curY = srcY + ambLogicObject.movingArea[k].dy;
					if (!IsAmbMovable(curX, curY))
					{
						continue;
					}
					if (bfsBoard[curX][curY] != null)
					{
						continue;
					}
					bfsBoard[curX][curY] = { 'x': srcX, 'y': srcY };
					bfsQueueX.push(curX);
					bfsQueueY.push(curY);
					if (curX == nearestObjectX && curY == nearestObjectY)
					{
						isFoundPath = true;
						break;
					}
				}
				
				if (isFoundPath)
				{
					break;
				}
			}
			if (isFoundPath)
			{
				var curLastPath = { 'x': nearestObjectX, 'y': nearestObjectY };
				while (curLastPath != null)
				{
					var nextPath = bfsBoard[curLastPath.x][curLastPath.y];
					if (nextPath.x == currentAmbPosition.x && nextPath.y == currentAmbPosition.y)
					{
						moveDestination = curLastPath;
						break;
					}
					curLastPath = nextPath;
				}
			}
		}
		if (moveDestination == null)
		{
			// Random Position
			var candidates = new Array();
			for (var k = 0; k < ambLogicObject.movingArea.length; ++k)
			{
				var curX = currentAmbPosition.x + ambLogicObject.movingArea[k].dx;
				var curY = currentAmbPosition.y + ambLogicObject.movingArea[k].dy;
				if (!IsAmbMovable(curX, curY))
				{
					continue;
				}
				candidates.push({ 
					'x': curX, 'y': curY, 
				});
			}
			if (candidates.length > 0)
			{
				var moveIndex = Math.floor(Math.random() * candidates.length);
				moveDestination = candidates[moveIndex];
			}
		}
		
		// Do Move
		if (moveDestination != null)
		{
			ambLogicObject.unit.logicPosition.x = moveDestination.x; ambLogicObject.unit.logicPosition.y = moveDestination.y;
			createjs.Tween.get(ambLogicObject.unit).to(GetBoardCellPosition(moveDestination.x, moveDestination.y), 80).
				call(function() {
					if (finishCallback != null)
						finishCallback();
				});
			return;
		}
	}
	else
	{
		if (ambDispatchWaitTurn == 0)
		{
			ambDispatchWaitTurn = -1;
			DispatchAmb(finishCallback);
			return;
		}
		else if (ambDispatchWaitTurn > 0)
		{
			ambDispatchWaitTurn = ambDispatchWaitTurn - 1;
		}
	}
	
	finishCallback();
}

function DispatchAmb(finishCallback)
{
	var x = 0;
	var y = 0;
	var isFoundDispatchPosition = false;
	for (var i = 0; i < kCAmbAddPositions.length; ++i)
	{
		x = kCAmbAddPositions[i].x;
		y = kCAmbAddPositions[i].y;
		if (!IsAmbMovable(x, y))
		{
			continue;
		}
		isFoundDispatchPosition = true;
		break;
	}
	
	if (!isFoundDispatchPosition)
	{
		// No Place to Add New Amb Unit
		finishCallback();
		return;
	}
	
	PlayCAmbReinforcementMotion(x, y, function() {
		var unitContainer = new createjs.Container();
		CreateCAmbGraphicObject(unitContainer);
		SetBoardCellPosition(unitContainer, x, y);
		graphicOverUnitLayerContainer.addChild(unitContainer);
		
		unitContainer.logicPosition = { 'x': x, 'y': y };
		
		ambLogicObject = new Object();
		ambLogicObject.unit = unitContainer;
		ambLogicObject.type = 'CAmb';
		ambLogicObject.isControllable = false;
		ambLogicObject.movingArea = kFourDirectionMovingArea;
		
		isAmbDispatched = true;
		
		finishCallback();
	});
}

function PlayCAmbReinforcementMotion(x, y, finishCallback)
{
	if (x != 0)
	{
		finishCallback();
		return;
	}
	
	var unitContainer = new createjs.Container();
	CreateCAmbGraphicObject(unitContainer);
	SetBoardCellPosition(unitContainer, -1, y);
	graphicUnitLayerContainer.addChild(unitContainer);
	
	createjs.Tween.get(unitContainer).to(GetBoardCellPosition(x, y), 60).
		call(function() {
			graphicUnitLayerContainer.removeChild(unitContainer);
			if (finishCallback != null)
				finishCallback();
		});
}

function AddC(finishCallback)
{
	var enableCount = 0;
	var enablePositions = new Array();
	
	for (var i = 0; i < kCAddPositions.length; ++i)
	{
		var x = kCAddPositions[i].x;
		var y = kCAddPositions[i].y;
		if (logicGameBoard[x][y].logicObject != null)
		{
			var currentLogicType = logicGameBoard[x][y].logicObject.type;
			if (GetTeamOfType(currentLogicType) == 'P')
				continue;
			if (currentLogicType == 'C4')
				continue;
		}
		++enableCount;
		enablePositions.push(kCAddPositions[i]);
	}
	
	if (enableCount == 0)
	{
		// No Place to Add New P Unit
		finishCallback();
		return;
	}
	
	var createIndex = Math.floor(Math.random() * enableCount);
	var createPosition = enablePositions[createIndex];
	
	AddCIn(createPosition.x, createPosition.y, finishCallback);
}

function AddCIn(x, y, finishCallback)
{
	PlayCReinforcementMotion(x, y, function() {
		if (logicGameBoard[x][y].logicObject == null)
		{
			CreateC1In(x, y);
		}
		else
		{
			var currentLogicType = logicGameBoard[x][y].logicObject.type;
			RemoveIn(x, y);
			if (currentLogicType == 'C1')
			{
				CreateC2In(x, y);
			}
			else if (currentLogicType == 'C2')
			{
				CreateC3In(x, y);
			}
			else if (currentLogicType == 'C3')
			{
				CreateC4In(x, y);
			}
		}
		finishCallback();
	});
}

function PlayCReinforcementMotion(x, y, finishCallback)
{
	if (y != kLogicBoardHeight - 1)
	{
		finishCallback();
		return;
	}
	
	var unitContainer = new createjs.Container();
	CreateC1GraphicObject(unitContainer);
	SetBoardCellPosition(unitContainer, x, kLogicBoardHeight);
	graphicUnitLayerContainer.addChild(unitContainer);
	
	createjs.Tween.get(unitContainer).to(GetBoardCellPosition(x, y), 80).
		call(function() {
			graphicUnitLayerContainer.removeChild(unitContainer);
			if (finishCallback != null)
				finishCallback();
		});
}

function CreateP1In(x, y)
{
	var unitContainer = new createjs.Container();
	CreateP1GraphicObject(unitContainer);
	AttachUnitHalo(unitContainer);
	SetBoardCellPosition(unitContainer, x, y);
	graphicUnitLayerContainer.addChild(unitContainer);
	
	unitContainer.logicPosition = { 'x': x, 'y': y };
	unitContainer.isDragging = false;
	unitContainer.on("mousedown", ControllableMouseDownHandler);
	unitContainer.on("pressmove", ControllablePressMoveHandler);
	unitContainer.on("pressup", ControllablePressUpHandler);
	
	var logicObject = new Object();
	logicObject.unit = unitContainer;
	logicObject.type = 'P1';
	logicObject.isControllable = true;
	logicObject.movingArea = kFourDirectionMovingArea;
	
	logicGameBoard[x][y].logicObject = logicObject;
}

function CreateP2In(x, y)
{
	var unitContainer = new createjs.Container();
	CreateP2GraphicObject(unitContainer);
	AttachUnitHalo(unitContainer);
	SetBoardCellPosition(unitContainer, x, y);
	graphicUnitLayerContainer.addChild(unitContainer);
	
	unitContainer.logicPosition = { 'x': x, 'y': y };
	unitContainer.isDragging = false;
	unitContainer.on("mousedown", ControllableMouseDownHandler);
	unitContainer.on("pressmove", ControllablePressMoveHandler);
	unitContainer.on("pressup", ControllablePressUpHandler);
	
	var logicObject = new Object();
	logicObject.unit = unitContainer;
	logicObject.type = 'P2';
	logicObject.isControllable = true;
	logicObject.movingArea = kFourDirectionMovingArea;
	
	logicGameBoard[x][y].logicObject = logicObject;
}

function CreateP3In(x, y)
{
	var unitContainer = new createjs.Container();
	CreateP3GraphicObject(unitContainer);
	AttachUnitHalo(unitContainer);
	SetBoardCellPosition(unitContainer, x, y);
	graphicUnitLayerContainer.addChild(unitContainer);
	
	unitContainer.logicPosition = { 'x': x, 'y': y };
	unitContainer.isDragging = false;
	unitContainer.on("mousedown", ControllableMouseDownHandler);
	unitContainer.on("pressmove", ControllablePressMoveHandler);
	unitContainer.on("pressup", ControllablePressUpHandler);
	
	var logicObject = new Object();
	logicObject.unit = unitContainer;
	logicObject.type = 'P3';
	logicObject.isControllable = true;
	logicObject.movingArea = kFourDirectionMovingArea;
	
	logicGameBoard[x][y].logicObject = logicObject;
}

function CreatePWallIn(x, y)
{
	var unitContainer = new createjs.Container();
	CreatePWallGraphicObject(unitContainer);
	SetBoardCellPosition(unitContainer, x, y);
	graphicUnitLayerContainer.addChild(unitContainer);
	
	unitContainer.logicPosition = { 'x': x, 'y': y };
	
	var logicObject = new Object();
	logicObject.unit = unitContainer;
	logicObject.type = 'PWall';
	logicObject.isControllable = false;
	
	logicGameBoard[x][y].logicObject = logicObject;
}

function CreatePPumpIn(x, y)
{
	var unitContainer = new createjs.Container();
	CreatePPumpGraphicObject(unitContainer);
	AttachUnitHalo(unitContainer);
	SetBoardCellPosition(unitContainer, x, y);
	graphicUnitLayerContainer.addChild(unitContainer);
	
	unitContainer.logicPosition = { 'x': x, 'y': y };
	unitContainer.isDragging = false;
	unitContainer.on("mousedown", PumpMouseDownHandler);
	unitContainer.on("pressmove", PumpPressMoveHandler);
	unitContainer.on("pressup", PumpPressUpHandler);
	
	var logicObject = new Object();
	logicObject.unit = unitContainer;
	logicObject.type = 'PPump';
	logicObject.isControllable = true;
	
	logicGameBoard[x][y].logicObject = logicObject;
}

function CreateC1In(x, y)
{
	var unitContainer = new createjs.Container();
	CreateC1GraphicObject(unitContainer);
	SetBoardCellPosition(unitContainer, x, y);
	graphicUnitLayerContainer.addChild(unitContainer);
	
	unitContainer.logicPosition = { 'x': x, 'y': y };
	
	var logicObject = new Object();
	logicObject.unit = unitContainer;
	logicObject.type = 'C1';
	logicObject.isControllable = false;
	logicObject.movingArea = kFourDirectionMovingArea;
	logicObject.isStunned = false;
	
	logicGameBoard[x][y].logicObject = logicObject;
}

function CreateC2In(x, y)
{
	var unitContainer = new createjs.Container();
	CreateC2GraphicObject(unitContainer);
	SetBoardCellPosition(unitContainer, x, y);
	graphicUnitLayerContainer.addChild(unitContainer);
	
	unitContainer.logicPosition = { 'x': x, 'y': y };
	
	var logicObject = new Object();
	logicObject.unit = unitContainer;
	logicObject.type = 'C2';
	logicObject.isControllable = false;
	logicObject.movingArea = kFourDirectionMovingArea;
	logicObject.isStunned = false;
	
	logicGameBoard[x][y].logicObject = logicObject;
}

function CreateC3In(x, y)
{
	var unitContainer = new createjs.Container();
	CreateC3GraphicObject(unitContainer);
	SetBoardCellPosition(unitContainer, x, y);
	graphicUnitLayerContainer.addChild(unitContainer);
	
	unitContainer.logicPosition = { 'x': x, 'y': y };
	
	var logicObject = new Object();
	logicObject.unit = unitContainer;
	logicObject.type = 'C3';
	logicObject.isControllable = false;
	logicObject.movingArea = kFourDirectionMovingArea;
	logicObject.isStunned = false;
	
	logicGameBoard[x][y].logicObject = logicObject;
}

function CreateC4In(x, y)
{
	var unitContainer = new createjs.Container();
	CreateC4GraphicObject(unitContainer);
	SetBoardCellPosition(unitContainer, x, y);
	graphicUnitLayerContainer.addChild(unitContainer);
	
	unitContainer.logicPosition = { 'x': x, 'y': y };
	
	var logicObject = new Object();
	logicObject.unit = unitContainer;
	logicObject.type = 'C4';
	logicObject.isControllable = false;
	logicObject.movingArea = kFourDirectionMovingArea;
	logicObject.isStunned = false;
	
	logicGameBoard[x][y].logicObject = logicObject;
}

function ControllableMouseDownHandler(evt)
{
	if (!isControl)
		return;
	this.parent.addChild(this);
	this.offset = { 'x': this.x - evt.stageX, 'y': this.y - evt.stageY };
	HighlightEnableAction(this.logicPosition.x, this.logicPosition.y);
	
	ReInitializeBoardStroke();
	logicGameBoard[this.logicPosition.x][this.logicPosition.y].boardStrokeCommand.style = kBoardCursorColor;
	lastOverCell = { 'x': this.logicPosition.x, 'y': this.logicPosition.y };
	
	this.isDragging = true;
}

var lastOverCell = null;
function ControllablePressMoveHandler(evt)
{
	if (!this.isDragging)
		return;
	this.x = evt.stageX + this.offset.x;
	this.y = evt.stageY + this.offset.y;
	
	var overCell = GetPositionOnCell(evt.stageX, evt.stageY);
	if (lastOverCell != null || overCell != null)
	{
		if (lastOverCell == null)
		{
			if (IsValidCellPosition(overCell.x, overCell.y))
			{
				logicGameBoard[overCell.x][overCell.y].boardStrokeCommand.style = kBoardCursorColor;
			}
		}
		else if (overCell == null)
		{
			ReInitializeBoardStroke();
		}
		else
		{
			if (lastOverCell.x != overCell.x || lastOverCell.y != overCell.y)
			{
				ReInitializeBoardStroke();
				if (IsValidCellPosition(overCell.x, overCell.y))
				{
					logicGameBoard[overCell.x][overCell.y].boardStrokeCommand.style = kBoardCursorColor;
				}
			}
		}
		lastOverCell = overCell;
	}
}

function ControllablePressUpHandler(evt)
{
	if (!this.isDragging)
		return;
	this.isDragging = false;
	
	var releaseCell = GetPositionOnCell(evt.stageX, evt.stageY);
	if (releaseCell == null || !IsMovable(this.logicPosition.x, this.logicPosition.y, releaseCell.x, releaseCell.y))
	{
		SetBoardCellPosition(this, this.logicPosition.x, this.logicPosition.y);
		ReInitializeBoardFill();
		ReInitializeBoardStroke();
		return;
	}
	
	DoMove(this.logicPosition.x, this.logicPosition.y, releaseCell.x, releaseCell.y, FinishPTurn);
}

function PumpMouseDownHandler(evt)
{
	if (!isControl)
		return;
	
	var targetAimContainer = new createjs.Container();
	CreatePTargetGraphicObject(targetAimContainer);
	targetAimContainer.x = evt.stageX - kBoardAreaLeft;
	targetAimContainer.y = evt.stageY - kBoardAreaTop;
	graphicUnitLayerContainer.addChild(targetAimContainer);
	this.targetAim = targetAimContainer;
	
	HighlightPumpable(this.logicPosition.x, this.logicPosition.y);
	
	ReInitializeBoardStroke();
	logicGameBoard[this.logicPosition.x][this.logicPosition.y].boardStrokeCommand.style = kBoardCursorColor;
	lastOverCell = { 'x': this.logicPosition.x, 'y': this.logicPosition.y };
	
	this.isDragging = true;
}

function PumpPressMoveHandler(evt)
{
	if (!this.isDragging)
		return;
	if (this.targetAim == null)
		return;
	this.targetAim.x = evt.stageX - kBoardAreaLeft;
	this.targetAim.y = evt.stageY - kBoardAreaTop;
	
	var overCell = GetPositionOnCell(evt.stageX, evt.stageY);
	if (lastOverCell != null || overCell != null)
	{
		if (lastOverCell == null)
		{
			logicGameBoard[overCell.x][overCell.y].boardStrokeCommand.style = kBoardCursorColor;
		}
		else if (overCell == null)
		{
			ReInitializeBoardStroke();
		}
		else
		{
			if (lastOverCell.x != overCell.x || lastOverCell.y != overCell.y)
			{
				ReInitializeBoardStroke();
				logicGameBoard[overCell.x][overCell.y].boardStrokeCommand.style = kBoardCursorColor;
			}
		}
		lastOverCell = overCell;
	}
}

function PumpPressUpHandler(evt)
{
	if (!this.isDragging)
		return;
	this.isDragging = false;
	
	this.targetAim.parent.removeChild(this.targetAim);
	this.targetAim = null;
	
	var releaseCell = GetPositionOnCell(evt.stageX, evt.stageY);
	if (releaseCell == null || !IsPumpable(this.logicPosition.x, this.logicPosition.y, releaseCell.x, releaseCell.y))
	{
		ReInitializeBoardFill();
		ReInitializeBoardStroke();
		return;
	}
	
	DoPump(this.logicPosition.x, this.logicPosition.y, releaseCell.x, releaseCell.y, FinishPTurn);
}

function RemoveIn(x, y)
{
	if (logicGameBoard[x][y].logicObject != null)
	{
		logicGameBoard[x][y].logicObject.unit.parent.removeChild(logicGameBoard[x][y].logicObject.unit);
	}
	logicGameBoard[x][y].logicObject = null;
}

function IsMovable(fromX, fromY, toX, toY, skipMovingCheck)
{
	if (skipMovingCheck == null)
		skipMovingCheck = false;

	if (!IsValidCellPosition(fromX, fromY) || !IsValidCellPosition(toX, toY))
		return false;

	var movingObject = logicGameBoard[fromX][fromY].logicObject;
	if (movingObject == null)
		return false;
		
	if (!skipMovingCheck)
	{	
		if (movingObject.movingArea == null)
			return false;
		var isFoundValidMove = false;
		for (var i = 0; i < movingObject.movingArea.length; ++i)
		{
			if (fromX + movingObject.movingArea[i].dx == toX && fromY + movingObject.movingArea[i].dy == toY)
			{
				isFoundValidMove = true;
				break;
			}
		}
		if (!isFoundValidMove)
			return false;
	}
	
	var movingTeam = GetTeamOfType(movingObject.type);
	if (movingTeam == 'P' && IsAmbPosition(toX, toY))
		return false;
	
	var targetObject = logicGameBoard[toX][toY].logicObject;
	if (targetObject == null)
		return true;
	
	var targetTeam = GetTeamOfType(targetObject.type);
	var targetLevel = GetLevelOfType(targetObject.type);
	if (targetLevel == 0)
	{
		// Non-Stackable
		return false;
	}
	
	var movingLevel = GetLevelOfType(movingObject.type);
	if (movingTeam == targetTeam)
	{
		if (targetTeam == 'C' && (targetLevel >= 4 || movingLevel >= 4))
		{
			if (targetLevel >= 4)
			{
				return false;
			}
			if (!targetObject.isStunned)
			{
				return false;
			}
		}
		if (targetTeam == 'C' && targetLevel > movingLevel && targetObject.isStunned)
			return false;
		return true;
	}
	
	if (movingTeam == 'P' && (targetLevel <= movingLevel))
		return true;
	if (movingTeam == 'C' && (targetLevel < movingLevel))
		return true;
	
	return false;
}

function IsPumpable(fromX, fromY, toX, toY)
{
	if (!IsValidCellPosition(fromX, fromY) || !IsValidCellPosition(toX, toY))
		return false;

	var pumpObject = logicGameBoard[fromX][fromY].logicObject;
	if (pumpObject == null)
		return false;
		
	if (fromX != toX && fromY != toY)
		return false;
	if (fromX == toX && fromY == toY)
		return false;
		
	var dx = 0;
	var dy = 0;
	if (fromX != toX)
	{
		if (fromX > toX)
			dx = -1;
		else
			dx = 1;
	}
	else
	{
		if (fromY > toY)
			dy = -1;
		else
			dy = 1;
	}
	
	var curX = fromX + dx;
	var curY = fromY + dy;
	while (IsValidCellPosition(curX, curY))
	{
		var targetObject = logicGameBoard[curX][curY].logicObject;
		if (curX == toX && curY == toY)
		{
			if (targetObject == null)
			{
				return true;
			}
			
			var targetTeam = GetTeamOfType(targetObject.type);
			if (targetTeam == 'C')
				return true;
			var targetLevel = GetLevelOfType(targetObject.type);
			if (targetLevel != 0)
				return true;				
			
			return false;
		}
		if (targetObject != null)
			return false;
		if (IsAmbPosition(curX, curY))
		{
			return false;
		}
		
		curX = curX + dx;
		curY = curY + dy;
	}
	
	return false;
}

function DoMove(fromX, fromY, toX, toY, finishCallback)
{
	if (!IsValidCellPosition(fromX, fromY) || !IsValidCellPosition(toX, toY))
	{
		if (finishCallback != null)
			finishCallback();
		return;
	}
	
	var movingObject = logicGameBoard[fromX][fromY].logicObject;
	if (movingObject == null)
	{
		if (finishCallback != null)
			finishCallback();
		return;
	}
		
	var targetObject = logicGameBoard[toX][toY].logicObject;
	if (targetObject != null)
	{
		var targetTeam = GetTeamOfType(targetObject.type);
		var movingTeam = GetTeamOfType(movingObject.type);
		if (movingTeam == targetTeam)
		{
			Merge(movingObject, targetObject, finishCallback);
			return;
		}
		
		Push(movingObject, targetObject);
	}
	
	// Move Object
	logicGameBoard[fromX][fromY].logicObject = null;
	logicGameBoard[toX][toY].logicObject = movingObject;
	movingObject.unit.logicPosition.x = toX; movingObject.unit.logicPosition.y = toY;
	createjs.Tween.get(movingObject.unit).to(GetBoardCellPosition(toX, toY), 100).
		call(function() {
			if (finishCallback != null)
				finishCallback();
		});
}

function DoPump(fromX, fromY, toX, toY, finishCallback)
{
	if (!IsValidCellPosition(fromX, fromY) || !IsValidCellPosition(toX, toY))
	{
		if (finishCallback != null)
			finishCallback();
		return;
	}
	
	var pumpObject = logicGameBoard[fromX][fromY].logicObject;
	if (pumpObject == null)
	{
		if (finishCallback != null)
			finishCallback();
		return;
	}
	
	var waterGraphic = null;
	var fromBoardCellPosition = GetBoardCellPosition(fromX, fromY);
	var moveLength = 0;
	if (fromX == toX)
	{
		waterGraphic = new createjs.Shape();
		waterGraphic.graphics.beginFill(kWaterColor).drawRect(32, 8, 8, 56);
		waterGraphic.x = fromBoardCellPosition.x; waterGraphic.y = fromBoardCellPosition.y;
		graphicUnitLayerContainer.addChild(waterGraphic);
		moveLength = Math.abs(fromY - toY);
	}
	else
	{
		waterGraphic = new createjs.Shape();
		waterGraphic.graphics.beginFill(kWaterColor).drawRect(8, 32, 56, 8);
		waterGraphic.x = fromBoardCellPosition.x; waterGraphic.y = fromBoardCellPosition.y;
		graphicUnitLayerContainer.addChild(waterGraphic);
		moveLength = Math.abs(fromX - toX);
	}
	createjs.Tween.get(waterGraphic).to(GetBoardCellPosition(toX, toY), moveLength * 80).
		to({ 'alpha': 0 }, 150).
		call(function() {
			waterGraphic.parent.removeChild(waterGraphic);
			if (IsAmbPosition(toX, toY))
			{
				PlayEnding(kEndingTypeAmb);
				return;
			}
			var targetObject = logicGameBoard[toX][toY].logicObject;
			if (targetObject != null)
			{
				var targetTeam = GetTeamOfType(targetObject.type);
				var targetLevel = GetLevelOfType(targetObject.type);
				if (targetTeam == 'P')
				{
					PlayEnding(kEndingTypeTK);
					return;
				}
				else if (targetTeam == 'C')
				{
					PumpHit(targetObject);
				}
				if ((fromX - toX) == 1 || (fromX - toX) == -1 || (fromY - toY) == 1 || (fromY - toY) == -1)
				{
					var pushResult = Push(pumpObject, targetObject);
					if (pushResult != kPushResultMerged)
					{
						if (targetLevel == 1)
						{
							PlayEnding(kEndingTypeInj);
							return;
						}
					}
				}
			}
			if (finishCallback != null)
				finishCallback();
		});
}

function PumpHit(targetObject)
{
	if (targetObject.isStunned)
	{
		// Already Stunned
		return;
	}
	targetObject.isStunned = true;
	
	var targetLevel = GetLevelOfType(targetObject.type);
	
	var unitContainer = new createjs.Container();
	if (targetLevel == 1)
	{
		CreateStunnedC1GraphicObject(unitContainer);
	}
	else if (targetLevel == 2)
	{
		CreateStunnedC2GraphicObject(unitContainer);
	}
	else if (targetLevel == 3)
	{
		CreateStunnedC3GraphicObject(unitContainer);
	}
	else
	{
		CreateStunnedC4GraphicObject(unitContainer);
	}
	SetBoardCellPosition(unitContainer, targetObject.unit.logicPosition.x, targetObject.unit.logicPosition.y);
	unitContainer.logicPosition = targetObject.unit.logicPosition;
	
	targetObject.unit.parent.removeChild(targetObject.unit);
	graphicUnitLayerContainer.addChild(unitContainer);
	targetObject.unit = unitContainer;
	
	if (!isAmbDispatched)
	{
		if (ambDispatchWaitTurn < 0)
			ambDispatchWaitTurn = kAmbDispatchDelay;
	}
}

function CurePumpHit(targetObject)
{
	if (!targetObject.isStunned)
	{
		return;
	}
	targetObject.isStunned = false;
	
	var targetLevel = GetLevelOfType(targetObject.type);
	
	var unitContainer = new createjs.Container();
	if (targetLevel == 1)
	{
		CreateC1GraphicObject(unitContainer);
	}
	else if (targetLevel == 2)
	{
		CreateC2GraphicObject(unitContainer);
	}
	else if (targetLevel == 3)
	{
		CreateC3GraphicObject(unitContainer);
	}
	else
	{
		CreateC4GraphicObject(unitContainer);
	}
	SetBoardCellPosition(unitContainer, targetObject.unit.logicPosition.x, targetObject.unit.logicPosition.y);
	unitContainer.logicPosition = targetObject.unit.logicPosition;
	
	targetObject.unit.parent.removeChild(targetObject.unit);
	graphicUnitLayerContainer.addChild(unitContainer);
	targetObject.unit = unitContainer;
}

function Merge(movingObject, targetObject, finishCallback)
{
	var targetTeam = GetTeamOfType(targetObject.type);
	var movingTeam = GetTeamOfType(movingObject.type);
	var targetLevel = GetLevelOfType(targetObject.type);
	var movingLevel = GetLevelOfType(movingObject.type);
	var resultLevel = targetLevel + movingLevel;
	
	var fromX = movingObject.unit.logicPosition.x;
	var fromY = movingObject.unit.logicPosition.y;
	var toX = targetObject.unit.logicPosition.x;
	var toY = targetObject.unit.logicPosition.y;
	
	var isNeedToStun = false;
	if (targetTeam == 'C')
	{
		if (movingObject.isStunned && targetObject.isStunned)
		{
			isNeedToStun = true;
		}
		else if ((movingObject.isStunned && movingLevel > targetLevel) || (targetObject.isStunned && targetLevel > movingLevel))
		{
			isNeedToStun = true;
		}
	}
	
	logicGameBoard[fromX][fromY].logicObject = null;
	createjs.Tween.get(movingObject.unit).to(GetBoardCellPosition(toX, toY), 100).
		call(function() {
			movingObject.unit.parent.removeChild(movingObject.unit);
			RemoveIn(toX, toY);
			if (targetTeam == 'C' && resultLevel == 2)
			{
				CreateC2In(toX, toY);
			}
			else if (targetTeam == 'C' && resultLevel == 3)
			{
				CreateC3In(toX, toY);
			}
			else if (targetTeam == 'C' && resultLevel >= 4)
			{
				CreateC4In(toX, toY);
			}
			else if (targetTeam == 'P' && resultLevel == 2)
			{
				CreateP2In(toX, toY);
			}
			else if (targetTeam == 'P' && resultLevel == 3)
			{
				CreateP3In(toX, toY);
			}
			else if (targetTeam == 'P' && resultLevel == 4)
			{
				CreatePWallIn(toX, toY);
			}
			else if (targetTeam == 'P' && resultLevel >= 5)
			{
				CreatePPumpIn(toX, toY);
			}
			if (isNeedToStun)
			{
				PumpHit(logicGameBoard[toX][toY].logicObject);
			}
			if (finishCallback != null)
				finishCallback();
		});
}

var kPushResultPushed = 0;
var kPushResultMerged = 1;
var kPushResultDestroyed = 2;
function Push(movingObject, targetObject)
{
	var fromX = movingObject.unit.logicPosition.x;
	var fromY = movingObject.unit.logicPosition.y;
	var toX = targetObject.unit.logicPosition.x;
	var toY = targetObject.unit.logicPosition.y;
	
	var targetTeam = GetTeamOfType(targetObject.type);
	
	var pushDX = toX - fromX;
	var pushDY = toY - fromY;
	
	var pushCandidates = new Array();
	var emptyPushCandidates = new Array();
	for (var i = 0; i < kFourDirectionMovingArea.length; ++i)
	{
		var curX = toX + kFourDirectionMovingArea[i].dx;
		var curY = toY + kFourDirectionMovingArea[i].dy;
		if (!IsValidCellPosition(curX, curY))
		{
			continue;
		}
		if (fromX == curX && fromY == curY)
		{
			continue;
		}
		
		var pushTargetObject = logicGameBoard[curX][curY].logicObject;
		if (pushTargetObject == null)
		{
			emptyPushCandidates.push({ 'x': curX, 'y': curY });
			continue;
		}
		
		var pushTargetTeam = GetTeamOfType(pushTargetObject.type);
		var pushTargetLevel = GetLevelOfType(pushTargetObject.type);
		if (pushTargetLevel == 0 || targetTeam != pushTargetTeam)
		{
			continue;
		}
		
		pushCandidates.push({ 'x': curX, 'y': curY, 'mergeTo': pushTargetObject });
	}
	
	if (pushCandidates.length == 0 && emptyPushCandidates.length == 0)
	{
		// Destroy
		logicGameBoard[toX][toY].logicObject = null;
		createjs.Tween.get(targetObject.unit).to({ 'alpha': 0 }, 80).
			call(function() {
				targetObject.unit.parent.removeChild(targetObject.unit);
			});
		return kPushResultDestroyed;
	}
	
	var targetX;
	var targetY;
	if (emptyPushCandidates.length > 0)
	{
		// Move
		for (var i = 0; i < emptyPushCandidates.length; ++i)
		{
			var curX = emptyPushCandidates[i].x;
			var curY = emptyPushCandidates[i].y;
			targetX = curX;
			targetY = curY;
			if (curX == toX + pushDX && curY == toY + pushDY)
			{
				break;
			}
		}
		
		logicGameBoard[toX][toY].logicObject = null;
		logicGameBoard[targetX][targetY].logicObject = targetObject;
		targetObject.unit.logicPosition.x = targetX; targetObject.unit.logicPosition.y = targetY;
		createjs.Tween.get(targetObject.unit).to(GetBoardCellPosition(targetX, targetY), 100);
		
		return kPushResultPushed;
	}
	
	// Merge
	var targetMergeObject;
	for (var i = 0; i < pushCandidates.length; ++i)
	{
		var curX = pushCandidates[i].x;
		var curY = pushCandidates[i].y;
		targetMergeObject = pushCandidates[i].mergeTo;
		if (curX == toX + pushDX && curY == toY + pushDY)
		{
			break;
		}
	}
	
	Merge(targetObject, targetMergeObject);
	
	return kPushResultMerged;
}

function HighlightEnableAction(objectX, objectY)
{
	if (!IsValidCellPosition(objectX, objectY))
		return;

	var actionObject = logicGameBoard[objectX][objectY].logicObject;
	if (actionObject == null)
		return;
		
	logicGameBoard[objectX][objectY].boardFillCommand.style = kBoardSourceColor;
		
	if (actionObject.movingArea == null)
		return false;
	for (var i = 0; i < actionObject.movingArea.length; ++i)
	{
		var curX = objectX + actionObject.movingArea[i].dx;
		var curY = objectY + actionObject.movingArea[i].dy;
		if (!IsValidCellPosition(curX, curY))
		{
			continue;
		}
		
		if (IsMovable(objectX, objectY, curX, curY, true))
		{
			var targetObject = logicGameBoard[curX][curY].logicObject;
			if (targetObject == null)
			{
				logicGameBoard[curX][curY].boardFillCommand.style = kBoardMovableColor;
			}
			else
			{
				var targetTeam = GetTeamOfType(targetObject.type);
				var actionTeam = GetTeamOfType(actionObject.type);
				if (targetTeam == actionTeam)
				{
					logicGameBoard[curX][curY].boardFillCommand.style = kBoardMergableColor;
				}
				else
				{
					logicGameBoard[curX][curY].boardFillCommand.style = kBoardPushableColor;
				}
			}			
		}
	}
}

function HighlightPumpable(objectX, objectY)
{
	if (!IsValidCellPosition(objectX, objectY))
		return;

	var actionObject = logicGameBoard[objectX][objectY].logicObject;
	if (actionObject == null)
		return;
		
	logicGameBoard[objectX][objectY].boardFillCommand.style = kBoardSourceColor;
	
	for (var i = 0; i < kFourDirectionMovingArea.length; ++i)
	{
		var curX = objectX + kFourDirectionMovingArea[i].dx;
		var curY = objectY + kFourDirectionMovingArea[i].dy;
		while (IsValidCellPosition(curX, curY))
		{
			var targetObject = logicGameBoard[curX][curY].logicObject;
			if (targetObject == null)
			{
				logicGameBoard[curX][curY].boardFillCommand.style = kBoardLaunchColor;
				if (IsAmbPosition(curX, curY))
				{
					break;
				}
				curX = curX + kFourDirectionMovingArea[i].dx;
				curY = curY + kFourDirectionMovingArea[i].dy;
				continue;
			}
			
			var targetTeam = GetTeamOfType(targetObject.type);
			if (targetTeam == 'C')
			{
				logicGameBoard[curX][curY].boardFillCommand.style = kBoardLaunchColor;
			}
			else
			{
				var targetLevel = GetLevelOfType(targetObject.type);
				if (targetLevel != 0)
					logicGameBoard[curX][curY].boardFillCommand.style = kBoardLaunchColor;
			}
			break;
		}
	}
}

function GetTeamOfType(typeString)
{
	return typeString[0];
}

function GetLevelOfType(typeString)
{
	var intResult = parseInt(typeString[1]);
	if (isNaN(intResult))
		return 0;
	return intResult;
}

function GetPositionOnCell(x, y)
{
	var lowerX = Math.floor((x - kBoardAreaLeft) / (kBoardCellWidth + kBoardCellPadding));
	if (lowerX < 0 || lowerX >= kLogicBoardWidth)
	{
		return null;
	}
	var higherX = Math.floor((x - kBoardAreaLeft + kBoardCellPadding) / (kBoardCellWidth + kBoardCellPadding));
	if (higherX != lowerX)
	{
		return null;
	}
	
	var lowerY = Math.floor((y - kBoardAreaTop) / (kBoardCellHeight + kBoardCellPadding));
	if (lowerY < 0 || lowerY >= kLogicBoardHeight)
	{
		return null;
	}
	var higherY = Math.floor((y - kBoardAreaTop + kBoardCellPadding) / (kBoardCellHeight + kBoardCellPadding));
	if (higherY != lowerY)
	{
		return null;
	}
	
	return { 'x': lowerX, 'y': lowerY };
}

function IsValidCellPosition(x, y)
{
	if (x < 0 || x >= kLogicBoardWidth)
	{
		return false;
	}
	if (y < 0 || y >= kLogicBoardHeight)
	{
		return false;
	}
	if (x == kLSSPosX && y == kLSSPosY)
		return false;
	return true;
}

function GetAmbPosition()
{
	if (ambLogicObject == null)
		return null;
	return { 'x': ambLogicObject.unit.logicPosition.x, 'y': ambLogicObject.unit.logicPosition.y };
}

function IsAmbPosition(x, y)
{
	var ambPosition = GetAmbPosition();
	if (ambPosition == null)
		return false;
	if (x == ambPosition.x && y == ambPosition.y)
		return true;
	return false;
}

function IsAmbMovable(x, y)
{
	if (!IsValidCellPosition(x, y))
	{
		return false;
	}
	if (logicGameBoard[x][y].logicObject != null)
	{
		if (GetTeamOfType(logicGameBoard[x][y].logicObject.type) == 'P')
			return false;
	}
	return true;
}

function GetSquareDist(a, b)
{
	var dx = a.x - b.x;
	var dy = a.y - b.y;
	return dx * dx + dy * dy;
}

function AttachUnitHalo(targetUnit)
{
	var tempGraphic = new createjs.Shape();
	targetUnit.haloFillCommand = tempGraphic.graphics.beginFill(kTransparentColor).command;
	tempGraphic.graphics.drawCircle(0, 0, kBoardCellWidth / 2.0);
	tempGraphic.x = kBoardCellWidth / 2.0; tempGraphic.y = kBoardCellWidth / 2.0;
	targetUnit.addChild(tempGraphic);
}

function SetBoardCellPosition(targetObject, cellX, cellY)
{
	var position = GetBoardCellPosition(cellX, cellY);
	targetObject.x = position.x;
	targetObject.y = position.y;
}

function GetBoardCellPosition(cellX, cellY)
{
	return { 'x': (kBoardCellWidth + kBoardCellPadding) * cellX, 'y': (kBoardCellHeight + kBoardCellPadding) * cellY };
}

var kEndingTypeNT = 0;
var kEndingTypeCW = 1;
var kEndingTypeAmb = 2;
var kEndingTypeInj = 3;
var kEndingTypeTK = 4;
function PlayEnding(endingType)
{
	inEndingState = true;
	
	if (endingType == kEndingTypeCW)
	{
		$('#endingModalCW').modal('show');
	}
	else if (endingType == kEndingTypeAmb)
	{
		$('#endingModalAmb').modal('show');
	}
	else if (endingType == kEndingTypeInj)
	{
		$('#endingModalInj').modal('show');
	}
	else if (endingType == kEndingTypeTK)
	{
		$('#endingModalTK').modal('show');
	}
	else
	{
		$('#endingModalNT').modal('show');
	}	
}
