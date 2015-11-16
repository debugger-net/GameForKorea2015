//------------------------------------------------------------------------------
// Constant
//------------------------------------------------------------------------------
var kCColor = 'GhostWhite';
var kCBackColor = 'AntiqueWhite';
var kCCrossColor = 'Red';
var kCTireColor = 'DimGrey';
var kCStunnedColor = 'Red';

//------------------------------------------------------------------------------
// Graphic by Code
//------------------------------------------------------------------------------
function CreateC1GraphicObject(objContainer)
{
	CreateC1GraphicShapeObject(objContainer, kCColor);
}

function CreateC2GraphicObject(objContainer)
{
	CreateC2GraphicShapeObject(objContainer, kCColor);
}

function CreateC3GraphicObject(objContainer)
{
	CreateC3GraphicShapeObject(objContainer, kCColor, kCBackColor);
}

function CreateC4GraphicObject(objContainer)
{
	CreateC4GraphicShapeObject(objContainer, kCColor, kCBackColor);
}

function CreateStunnedC1GraphicObject(objContainer)
{
	CreateC1GraphicShapeObject(objContainer, kCStunnedColor);
}

function CreateStunnedC2GraphicObject(objContainer)
{
	CreateC2GraphicShapeObject(objContainer, kCStunnedColor);
}

function CreateStunnedC3GraphicObject(objContainer)
{
	CreateC3GraphicShapeObject(objContainer, kCStunnedColor, kCStunnedColor);
}

function CreateStunnedC4GraphicObject(objContainer)
{
	CreateC4GraphicShapeObject(objContainer, kCStunnedColor, kCStunnedColor);
}

function CreateC1GraphicShapeObject(objContainer, firstColor)
{
	var tempGraphic;
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(firstColor).drawCircle(0, 0, 10);
	tempGraphic.x = 36; tempGraphic.y = 20;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(firstColor).drawRoundRectComplex(0, 0, 24, 34, 6, 6, 0, 0);
	tempGraphic.x = 24; tempGraphic.y = 30;
	objContainer.addChild(tempGraphic);
}

function CreateC2GraphicShapeObject(objContainer, firstColor)
{
	var tempGraphic;
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(firstColor).drawCircle(0, 0, 10);
	tempGraphic.x = 22; tempGraphic.y = 20;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(firstColor).drawRoundRectComplex(0, 0, 24, 34, 6, 6, 0, 0);
	tempGraphic.x = 10; tempGraphic.y = 30;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(firstColor).drawCircle(0, 0, 10);
	tempGraphic.x = 50; tempGraphic.y = 20;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(firstColor).drawRoundRectComplex(0, 0, 24, 34, 6, 6, 0, 0);
	tempGraphic.x = 38; tempGraphic.y = 30;
	objContainer.addChild(tempGraphic);
}

function CreateC3GraphicShapeObject(objContainer, firstColor, secondColor)
{
	var tempGraphic;
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(secondColor).drawCircle(0, 0, 10);
	tempGraphic.x = 36; tempGraphic.y = 14;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(secondColor).drawRoundRectComplex(0, 0, 24, 34, 6, 6, 0, 0);
	tempGraphic.x = 24; tempGraphic.y = 24;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(firstColor).drawCircle(0, 0, 10);
	tempGraphic.x = 18; tempGraphic.y = 22;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(firstColor).drawRoundRectComplex(0, 0, 24, 34, 6, 6, 0, 0);
	tempGraphic.x = 6; tempGraphic.y = 32;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(firstColor).drawCircle(0, 0, 10);
	tempGraphic.x = 54; tempGraphic.y = 22;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(firstColor).drawRoundRectComplex(0, 0, 24, 34, 6, 6, 0, 0);
	tempGraphic.x = 42; tempGraphic.y = 32;
	objContainer.addChild(tempGraphic);
}

function CreateC4GraphicShapeObject(objContainer, firstColor, secondColor)
{
	var tempGraphic;
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(secondColor).drawCircle(0, 0, 10);
	tempGraphic.x = 26; tempGraphic.y = 14;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(secondColor).drawRoundRectComplex(0, 0, 24, 34, 6, 6, 0, 0);
	tempGraphic.x = 14; tempGraphic.y = 24;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(secondColor).drawCircle(0, 0, 10);
	tempGraphic.x = 54; tempGraphic.y = 14;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(secondColor).drawRoundRectComplex(0, 0, 24, 34, 6, 6, 0, 0);
	tempGraphic.x = 42; tempGraphic.y = 24;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(firstColor).drawCircle(0, 0, 10);
	tempGraphic.x = 17; tempGraphic.y = 22;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(firstColor).drawRoundRectComplex(0, 0, 24, 34, 6, 6, 0, 0);
	tempGraphic.x = 5; tempGraphic.y = 32;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(firstColor).drawCircle(0, 0, 10);
	tempGraphic.x = 45; tempGraphic.y = 22;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(firstColor).drawRoundRectComplex(0, 0, 24, 34, 6, 6, 0, 0);
	tempGraphic.x = 31; tempGraphic.y = 32;
	objContainer.addChild(tempGraphic);
}

function CreateCAmbGraphicObject(objContainer)
{
	var tempGraphic;
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kCTireColor).drawCircle(0, 0, 8);
	tempGraphic.x = 24; tempGraphic.y = 56;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kCTireColor).drawCircle(0, 0, 8);
	tempGraphic.x = 48; tempGraphic.y = 56;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kCColor).drawRect(0, 0, 54, 42);
	tempGraphic.x = 9; tempGraphic.y = 14;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipGlassColor).drawRect(0, 0, 4, 20);
	tempGraphic.x = 59; tempGraphic.y = 24;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kCCrossColor).drawRect(0, 0, 20, 8);
	tempGraphic.x = 24; tempGraphic.y = 32;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kCCrossColor).drawRect(0, 0, 8, 20);
	tempGraphic.x = 30; tempGraphic.y = 26;
	objContainer.addChild(tempGraphic);
}
