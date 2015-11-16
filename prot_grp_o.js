//------------------------------------------------------------------------------
// Constant
//------------------------------------------------------------------------------
var kLSSBaseColor = 'DarkGray';
var kLSSColor = 'DarkSlateGray';
var kLSSSwordColor = 'Teal';
var kGGTopColor = 'SlateGray';
var kGGMidColor = 'Tan';
var kGGBaseColor = 'Beige';
var kGGDoorColor = 'DimGrey';

//------------------------------------------------------------------------------
// Graphic by Code
//------------------------------------------------------------------------------
function CreateLSSGraphicShapeObject(objContainer)
{
	var tempGraphic;
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kLSSBaseColor).drawRect(0, 0, 32, 18);
	tempGraphic.x = 20; tempGraphic.y = 50;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kLSSColor).drawCircle(0, 0, 10);
	tempGraphic.x = 36; tempGraphic.y = -10;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kLSSColor).drawRoundRectComplex(0, 0, 28, 50, 6, 6, 0, 0);
	tempGraphic.x = 22; tempGraphic.y = 0;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kLSSSwordColor).drawRect(0, 0, 4, 42);
	tempGraphic.x = 16; tempGraphic.y = 8;
	objContainer.addChild(tempGraphic);
}

function CreateGGGraphicShapeObject(objContainer)
{
	var tempGraphic;
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kGGTopColor);
	tempGraphic.graphics.moveTo(200, 24);
	tempGraphic.graphics.lineTo(320, 0);
	tempGraphic.graphics.lineTo(440, 24);
	tempGraphic.graphics.closePath();
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kGGMidColor).drawRect(0, 0, 160, 20);
	tempGraphic.x = 240; tempGraphic.y = 26;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kGGBaseColor);
	tempGraphic.graphics.moveTo(40, 64);
	tempGraphic.graphics.lineTo(160, 48);
	tempGraphic.graphics.lineTo(480, 48);
	tempGraphic.graphics.lineTo(600, 64);
	tempGraphic.graphics.lineTo(600, 92);
	tempGraphic.graphics.lineTo(40, 92);
	tempGraphic.graphics.closePath();
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kGGDoorColor).drawRect(0, 0, 32, 22);
	tempGraphic.x = 304; tempGraphic.y = 70;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kGGDoorColor).drawRect(0, 0, 20, 18);
	tempGraphic.x = 272; tempGraphic.y = 74;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kGGDoorColor).drawRect(0, 0, 20, 18);
	tempGraphic.x = 348; tempGraphic.y = 74;
	objContainer.addChild(tempGraphic);
}
