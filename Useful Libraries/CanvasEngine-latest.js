//Make sure your canvas's id is "thebox"

theBox = document.getElementById("thebox");
ctx = theBox.getContext("2d");

draw = {};

draw.rect = function(a,b,c,d,e){
	if(e==undefined){
		ctx.fillStyle = "#000";
	}else{
		ctx.fillStyle = e;
	}
	ctx.fillRect(a,b,c,d);
};

draw.circle = function(a,b,c,d){
	if(d==undefined){
		ctx.fillStyle = "#000";
	}else{
		ctx.fillStyle = d;
	}
	ctx.beginPath();
	ctx.arc(a,b,c,0,Math.PI*2);
	ctx.fill();
};

draw.clear = function(){
	ctx.clearRect(0,0,theBox.width,theBox.height);
}

COMMON = {};

COMMON.borderwidth = parseInt(getComputedStyle(theBox).borderWidth);

function getMousePos(evt){
  qwe = theBox.getBoundingClientRect();
  return {x: evt.clientX - qwe.left - COMMON.borderwidth, y: evt.clientY - qwe.top - COMMON.borderwidth};
}

function canvasClicked(theEvent,doThis){
	mousePos = getMousePos(theEvent);
	doThis(mousePos);
}