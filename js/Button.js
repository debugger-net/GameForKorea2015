(function() {

function Button(label, color) {
	this.Container_constructor();
	
	this.color = color;
	this.label = label;
	
	this.setup();
}
var p = createjs.extend(Button, createjs.Container);


p.setup = function() {
	var text = new createjs.Text(this.label, "20px Arial", "DimGrey");
	text.textBaseline = "top";
	text.textAlign = "center";
	
	var width = text.getMeasuredWidth()+30;
	var height = text.getMeasuredHeight()+20;
	
	text.x = width/2;
	text.y = 10;
	
	var background = new createjs.Shape();
	background.graphics.beginFill(this.color).drawRoundRect(0,0,width,height,10);
	
	this.addChild(background, text); 
	this.on("rollover", this.handleRollOver);
	this.on("rollout", this.handleRollOver);
	this.cursor = "pointer";

	this.mouseChildren = false;
} ;

p.handleClick = function (event) {
	alert("You clicked on a button: "+this.label);
} ;

p.handleRollOver = function(event) {       
	this.alpha = event.type == "rollover" ? 0.4 : 1;
};

window.Button = createjs.promote(Button, "Container");
}());