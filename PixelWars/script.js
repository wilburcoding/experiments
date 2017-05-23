version = "20170523a";
setVersion("Pixel Wars v",version);

var canvas = document.getElementById("theCanvas");
var ctx = canvas.getContext("2d");

var common = {
	canvasSize:{
		x:600,
		y:400
	},
	tileSize:10
};

var draw = {
	rect:function(a,b,c,d,e){
		ctx.fillStyle = e;
		ctx.fillRect(a,b,c,d);
	},
	clear:function(){
		ctx.clearRect(0,0,common.canvasSize.x,common.canvasSize.y);
	}
};

var tileEngine = {
	map:[],
	createTile:function(a,b){
		q = {
			team:a,
			power:b,
			disease:0
		};
		return q;
	},
	addCol:function(){
		qr = [];
		for(i=0;i<(common.canvasSize.y / common.tileSize);i++){
			qr.push(this.createTile(this.teams[randnum(0,this.teams.length-1)],randnum(2,8)));
		}
		this.map.push(qr);
	},
	teams:[
		{name:"red",color:"#F00"},
		{name:"blue",color:"#00F"},
		{name:"green",color:"#0F0"},
		{name:"yellow",color:"#FF0"}
	],
	genMap:function(){
		for(j=0;j<(common.canvasSize.x / common.tileSize);j++){
			this.addCol();
		}
	},
	renderMap:function(){
		for(i=0;i<this.map.length;i++){
			for(j=0;j<this.map[i].length;j++){
				draw.rect(
					common.tileSize * i,
					common.tileSize * j,
					common.tileSize,
					common.tileSize,
					this.map[i][j].team.color
				);
			}
		}
	},
	getNeighbors:function(i,j){
		ngbrs = [];
		if(i>0){
			ngbrs.push({tile:this.map[i-1][j],x:i-1,y:j});
		}
		if(j>0){
			ngbrs.push({tile:this.map[i][j-1],x:i,y:j-1});
		}
		if(i<(common.canvasSize.x / common.tileSize)-1){
			ngbrs.push({tile:this.map[i+1][j],x:i+1,y:j});
		}
		if(j<(common.canvasSize.y / common.tileSize)-1){
			ngbrs.push({tile:this.map[i][j+1],x:i,y:j+1});
		}
		return ngbrs;
	},
	calcWar:function(){
		for(i=0;i<(common.canvasSize.x / common.tileSize);i++){
			for(j=0;j<(common.canvasSize.y / common.tileSize);j++){
				nghbrs = this.getNeighbors(i,j);
				rNeighbor = nghbrs[randnum(0,nghbrs.length-1)];
				if(rNeighbor.tile.team.name==this.map[i][j].team.name){
					if(randnum(0,9)>5 || this.map[i][j].power==0){
						this.map[i][j].power++;
					}else{
						qwerty = randnum(1,this.map[i][j].power);
						this.map[rNeighbor.x][rNeighbor.y].power = this.map[rNeighbor.x][rNeighbor.y].power + qwerty;
						this.map[i][j].power = this.map[i][j].power - qwerty;
					}
					if(this.map[i][j].disease==1){
						if(this.map[i][j].power>1){
							this.map[i][j].power = Math.round(this.map[i][j].power / 2);
						}
						this.map[rNeighbor.x][rNeighbor.y].disease = 1;
					}else{
						if(randnum(0,6000000)>5999999){
							/*this.map[i][j].disease = 1;*/
							/*alertforrevolt = setInterval(revoltalert(this.map[i][j].team.name),100);*/
							/*document.getElementById("redalert").innerHTML = document.getElementById("redalert").innerHTML + "<br>A disease has broken out in " + this.map[i][j].team.name + "!";*/
						}
					}
				}else{
					if(randnum(0,9)>4 || this.map[i][j].power==0){
						this.map[i][j].power++;
					}else{
						if(this.map[i][j].power > rNeighbor.tile.power){
							this.map[rNeighbor.x][rNeighbor.y].power = Math.abs(this.map[i][j].power - randnum(1,20));
							this.map[i][j].power = 0;
							this.map[rNeighbor.x][rNeighbor.y].team = this.map[i][j].team;
							this.map[rNeighbor.x][rNeighbor.y].disease = this.map[i][j].disease;
						}else{
							this.map[rNeighbor.x][rNeighbor.y].power = this.map[rNeighbor.x][rNeighbor.y].power - this.map[i][j].power;
							this.map[i][j].power = 0;
						}
					}
				}
			}
		}
	}
};

var running = 0;

/*var alertactive = 0;

function revoltalert(a){
	if(alertactive==0){
		alertactive=1;
		alerttimer=50;
		document.getElementById("redalert").innerHTML = "A disease has broken out in " + a + "!";
	}else{
		if(alerttimer==0){
			alertactive=0;
			document.getElementById("redalert").innerHTML = "";
			clearInterval(alertforrevolt);
		}else{
			alerttimer--;
		}
	}
}*/

function randnum(min,max){
	mundnar = Math.floor((Math.random() * (max - min + 1)) + min);
	return mundnar;
}

function run(){
	tileEngine.calcWar();
	draw.clear();
	tileEngine.renderMap();
}

function lol(a,b,c){
	for(lel=0;lel<randnum(16,21);lel++){
		tileEngine.map[randnum(0,(common.canvasSize.x / common.tileSize)-1)][randnum(0,(common.canvasSize.y / common.tileSize)-1)] = {team:{name:a,color:b},power:c,disease:0};
	}
}

function getInputs(){
	return {
		name:document.getElementById("inp-name").value,
		color:document.getElementById("inp-color").value,
		power:document.getElementById("inp-power").value
	};
}

function clone(a){
	copy = JSON.parse(JSON.stringify(a));
	return copy;
}

function saveMap(){
	savedMap = clone(tileEngine.map);
}

function loadMap(){
	tileEngine.map = clone(savedMap);
	tileEngine.renderMap();
}

function spawn(){
	qqq = getInputs();
	lol(qqq.name,qqq.color,qqq.power);
	tileEngine.renderMap();
}

function start(){
	if(running==0){
		getrekt = setInterval(run,25);
		running=1;
		document.getElementById("gobutton").innerHTML = "Pause";
	}else{
		clearInterval(getrekt);
		running=0;
		document.getElementById("gobutton").innerHTML = "Resume";
	}
}

tileEngine.genMap();
saveMap();
tileEngine.renderMap();