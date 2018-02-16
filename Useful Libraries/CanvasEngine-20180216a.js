//v20180216a

//Make sure your canvas's id is "thebox" because I'm retarded

theBox = document.getElementById("thebox"); //Me from the past, this is retarded
ctx = theBox.getContext("2d");

draw = {};

draw.rect = function(a,b,c,d,e,f){
	if(e===undefined){
		ctx.fillStyle = "#000";
		ctx.strokeStyle = "#000";
	}else{
		ctx.fillStyle = e;
		ctx.strokeStyle = e;
	}
	if(f){
		ctx.strokeRect(a,b,c,d);
	}else{
		ctx.fillRect(a,b,c,d);
	}
};

draw.circle = function(a,b,c,d,e){
	if(d==undefined){
		ctx.fillStyle = "#000";
		ctx.strokeStyle = "#000";
	}else{
		ctx.fillStyle = d;
		ctx.strokeStyle = d;
	}
	ctx.beginPath();
	ctx.arc(a,b,c,0,Math.PI*2);
	if(e){
		ctx.stroke();
	}else{
		ctx.fill();
	}
};

draw.clear = function(){
	ctx.clearRect(0,0,theBox.width,theBox.height);
}

COMMON = {};

COMMON.borderwidth = parseInt(getComputedStyle(theBox).borderWidth);

function Coord(x,y){
	this.x = x;
	this.y = y;
	this.distanceTo = function(coord){
		if(coord.__proto__.constructor.name==="Coord"){
			return Math.sqrt(Math.pow(this.x-coord.x,2)+Math.pow(this.y-coord.y,2));
		}
		return undefined;
	};
}

function getMousePos(evt){
	qwe = theBox.getBoundingClientRect();
	return new Coord(evt.clientX - qwe.left - COMMON.borderwidth,evt.clientY - qwe.top - COMMON.borderwidth);
}

function canvasClicked(theEvent,doThis){ //retarded click function for retarded canvas initialization
	mousePos = getMousePos(theEvent);
	doThis(mousePos);
}