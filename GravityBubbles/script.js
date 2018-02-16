version = "20180216a";
setVersion("Gravity Bubbles v",version);

bubbles=[];

function Bubble(pos,r,fc,sc,vel){
	this.pos = pos || new Coord(theBox.width/2,theBox.height/2);
	this.size = r || 10;
	this.color = {fill:fc||"#000",stroke:sc||"#000"};
	this.vel = vel || new Coord(0,0);
	bubbles.push(this);
}

function onCanvasClick(mousePos){
	new Bubble(mousePos,randNum(10,20),randColor(),randColor(),new Coord((Math.random()*6)-3,(Math.random()*6)-3));
}

function render(){
	draw.clear();
	if(theBox.width != document.body.clientWidth || theBox.height != document.body.clientHeight){
		theBox.width = document.body.clientWidth;
		theBox.height = document.body.clientHeight;
	}
	for(var i=0;i<bubbles.length;i++){
		draw.circle(bubbles[i].pos.x,bubbles[i].pos.y,bubbles[i].size,bubbles[i].color.fill);
		draw.circle(bubbles[i].pos.x,bubbles[i].pos.y,bubbles[i].size,bubbles[i].color.stroke,true);
	}
}

function unitVector(x,y,u){
	return new Coord(Math.cos(Math.atan(y/x))*Math.sign(x)*(u?u:(u==0?0:1)),Math.sin(Math.atan(y/x))*(Math.sign(x)==0?1:Math.sign(x))*(u?u:(u==0?0:1)));
}

function RUN(){
	for(var i=0;i<bubbles.length;i++){
		bubbles[i].vel.x += ((bubbles[i].pos.x-bubbles[i].size)<0)?Math.pow(1.1,-(bubbles[i].pos.x-bubbles[i].size)):0;
		bubbles[i].vel.x -= ((bubbles[i].pos.x+bubbles[i].size)>theBox.width)?Math.pow(1.1,(bubbles[i].pos.x+bubbles[i].size)-theBox.width):0;
		bubbles[i].vel.y += ((bubbles[i].pos.y-bubbles[i].size)<0)?Math.pow(1.1,-(bubbles[i].pos.y-bubbles[i].size)):0;
		bubbles[i].vel.y -= ((bubbles[i].pos.y+bubbles[i].size)>theBox.height)?Math.pow(1.1,(bubbles[i].pos.y+bubbles[i].size)-theBox.height):0;
		for(var j=i+1;j<bubbles.length;j++){
			var dist = bubbles[i].pos.distanceTo(bubbles[j].pos);
			var gVector = unitVector(bubbles[i].pos.x-bubbles[j].pos.x,bubbles[i].pos.y-bubbles[j].pos.y,-0.05*Math.pow(0.99,dist));
			var bVector = unitVector(gVector.x,gVector.y,((dist<bubbles[i].size+bubbles[j].size)?-0.03*Math.pow(1.2,bubbles[i].size+bubbles[j].size-dist):0));
			bubbles[i].vel.x += (gVector.x + bVector.x);
			bubbles[i].vel.y += (gVector.y + bVector.y);
			bubbles[j].vel.x -= (gVector.x + bVector.x);
			bubbles[j].vel.y -= (gVector.y + bVector.y);
			if(dist<(bubbles[i].size+bubbles[j].size+5)){
				bubbles[i].vel.x += (((bubbles[i].vel.x+bubbles[j].vel.x)/2)-bubbles[i].vel.x)*0.01;
				bubbles[i].vel.y += (((bubbles[i].vel.y+bubbles[j].vel.y)/2)-bubbles[i].vel.y)*0.01;
				bubbles[j].vel.x += (((bubbles[i].vel.x+bubbles[j].vel.x)/2)-bubbles[j].vel.x)*0.01;
				bubbles[j].vel.y += (((bubbles[i].vel.y+bubbles[j].vel.y)/2)-bubbles[j].vel.y)*0.01;
			}
		}
		var dist = bubbles[i].pos.distanceTo(new Coord(theBox.width/2,theBox.height/2));
		var rVector = unitVector(bubbles[i].pos.x-(theBox.width/2),bubbles[i].pos.y-(theBox.height/2),0.05*Math.pow(0.99,dist));
		bubbles[i].vel.x += rVector.x;
		bubbles[i].vel.y += rVector.y;
	}
	for(var i=0;i<bubbles.length;i++){
		bubbles[i].pos.x += bubbles[i].vel.x;
		bubbles[i].pos.y += bubbles[i].vel.y;
		if(isNaN(bubbles[i].pos.x)||isNaN(bubbles[i].pos.y)){
			bubbles.splice(i,1);
			i--;
		}
	}
	render();
	frameLoop = setTimeout(RUN,30);
}

RUN();