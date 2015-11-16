//------------------------------------------------------------------------------
// Constant
//------------------------------------------------------------------------------
var kPColor = 'DimGrey';
var kPEquipColor = 'Black';
var kPEquipGlassColor = 'LightSkyBlue';
var kPTargetColor = 'Orange';

var kPHaloColor = 'rgba(0,0,0,0.1)';

//------------------------------------------------------------------------------
// Graphic by Code
//------------------------------------------------------------------------------
function CreateP1GraphicObject(objContainer)
{
	var tempGraphic;

	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPColor).drawCircle(0, 0, 10);
	tempGraphic.x = 36; tempGraphic.y = 18;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPColor).drawRoundRectComplex(0, 0, 24, 34, 4, 4, 0, 0);
	tempGraphic.x = 24; tempGraphic.y = 28;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipColor).drawRect(0, 0, 20, 36);
	tempGraphic.x = 18; tempGraphic.y = 32;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipColor).drawRect(0, 0, 4, 24, 2);
	tempGraphic.x = 40; tempGraphic.y = 22;
	objContainer.addChild(tempGraphic);
}

function CreateP2GraphicObject(objContainer)
{
	var tempGraphic;

	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPColor).drawCircle(0, 0, 10);
	tempGraphic.x = 26; tempGraphic.y = 18;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPColor).drawRoundRectComplex(0, 0, 24, 34, 4, 4, 0, 0);
	tempGraphic.x = 14; tempGraphic.y = 28;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPColor).drawCircle(0, 0, 10);
	tempGraphic.x = 54; tempGraphic.y = 18;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPColor).drawRoundRectComplex(0, 0, 24, 34, 4, 4, 0, 0);
	tempGraphic.x = 42; tempGraphic.y = 28;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipColor).drawRect(0, 0, 20, 36);
	tempGraphic.x = 8; tempGraphic.y = 32;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipColor).drawRect(0, 0, 4, 24, 2);
	tempGraphic.x = 30; tempGraphic.y = 22;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipColor).drawRect(0, 0, 20, 36);
	tempGraphic.x = 36; tempGraphic.y = 32;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipColor).drawRect(0, 0, 4, 24, 2);
	tempGraphic.x = 58; tempGraphic.y = 22;
	objContainer.addChild(tempGraphic);
}

function CreateP3GraphicObject(objContainer)
{
	var tempGraphic;

	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPColor).drawCircle(0, 0, 10);
	tempGraphic.x = 15; tempGraphic.y = 18;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPColor).drawRoundRectComplex(0, 0, 24, 34, 4, 4, 0, 0);
	tempGraphic.x = 3; tempGraphic.y = 28;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPColor).drawCircle(0, 0, 10);
	tempGraphic.x = 37; tempGraphic.y = 18;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPColor).drawRoundRectComplex(0, 0, 24, 34, 4, 4, 0, 0);
	tempGraphic.x = 25; tempGraphic.y = 28;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPColor).drawCircle(0, 0, 10);
	tempGraphic.x = 59; tempGraphic.y = 18;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPColor).drawRoundRectComplex(0, 0, 24, 34, 4, 4, 0, 0);
	tempGraphic.x = 47; tempGraphic.y = 28;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipColor).drawRect(0, 0, 20, 36);
	tempGraphic.x = 2; tempGraphic.y = 32;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipColor).drawRect(0, 0, 4, 24, 2);
	tempGraphic.x = 16; tempGraphic.y = 22;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipColor).drawRect(0, 0, 20, 36);
	tempGraphic.x = 24; tempGraphic.y = 32;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipColor).drawRect(0, 0, 4, 24, 2);
	tempGraphic.x = 38; tempGraphic.y = 22;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipColor).drawRect(0, 0, 20, 36);
	tempGraphic.x = 46; tempGraphic.y = 32;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipColor).drawRect(0, 0, 4, 24, 2);
	tempGraphic.x = 60; tempGraphic.y = 22;
	objContainer.addChild(tempGraphic);
}

function CreatePWallGraphicObject(objContainer)
{
	var tempGraphic;
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipColor).drawRoundRectComplex(0, 0, 68, 36, 6, 4, 4, 4);
	tempGraphic.x = 2; tempGraphic.y = 20;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipColor).drawCircle(0, 0, 8);
	tempGraphic.x = 16; tempGraphic.y = 52;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipColor).drawCircle(0, 0, 8);
	tempGraphic.x = 56; tempGraphic.y = 52;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipGlassColor).drawRect(0, 0, 4, 16);
	tempGraphic.x = 2; tempGraphic.y = 28;
	objContainer.addChild(tempGraphic);
}

function CreatePPumpGraphicObject(objContainer)
{
	var tempGraphic;

	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipColor).drawRoundRectComplex(0, 0, 22, 36, 4, 0, 0, 0);
	tempGraphic.x = 4; tempGraphic.y = 24;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipColor).drawRoundRectComplex(0, 0, 40, 32, 4, 8, 0, 0);
	tempGraphic.x = 28; tempGraphic.y = 28;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipColor).drawCircle(0, 0, 8);
	tempGraphic.x = 16; tempGraphic.y = 58;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipColor).drawCircle(0, 0, 8);
	tempGraphic.x = 56; tempGraphic.y = 58;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipGlassColor).drawRect(0, 0, 4, 16);
	tempGraphic.x = 4; tempGraphic.y = 32;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipColor).drawRect(0, 0, 12, 4);
	tempGraphic.x = 2; tempGraphic.y = 19;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPEquipColor).drawRect(0, 0, 42, 6);
	tempGraphic.x = 18; tempGraphic.y = 6;
	tempGraphic.rotation = 22;
	objContainer.addChild(tempGraphic);
}

function CreatePTargetGraphicObject(objContainer)
{
	var tempGraphic;
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginStroke(kPTargetColor).setStrokeStyle(4).drawCircle(0, 0, 12);
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPTargetColor).drawRect(0, 0, 36, 4);
	tempGraphic.x = -18; tempGraphic.y = -2;
	objContainer.addChild(tempGraphic);
	
	tempGraphic = new createjs.Shape();
	tempGraphic.graphics.beginFill(kPTargetColor).drawRect(0, 0, 4, 36);
	tempGraphic.x = -2; tempGraphic.y = -18;
	objContainer.addChild(tempGraphic);
}
