version = "20170601a";
setVersion("Pixel Wars v",version);

COMMON.tileEngineMode = "confined";

function Team(name,color){
	this.name = name;
	this.color = color;
}

function Tile(team,power){
	this.team = team;
	this.power = power;
}

teams = [
	new Team("red","#F00"),
	new Team("blue","#00F"),
	new Team("green","#0F0"),
	new Team("yellow","#FF0")
];

function render(){
	draw.clear();
	renderTileMap(
		function(ct){
			draw.rect(ct.x,ct.y,getTileSize(),getTileSize(),ct.data.team.color);
		}
	);
}

function genMap(){
	genTileMap(
		function(){
			return new Tile(teams[randNum(0,teams.length-1)],randNum(2,8));
		}
	);
}

function calcWar(){
	renderTileMap(
		function(ct){
			var C = canvasCoordsToTile(ct.x,ct.y);
			var nghbrs = getNeighbors(C.x,C.y,true);
			var rNeighbor = nghbrs[randNum(0,nghbrs.length-1)];
			rNeighbor.tile = tileMap[rNeighbor.x][rNeighbor.y];
			if(rNeighbor.tile.team.name==ct.data.team.name){
				if(randNum(0,9)>5 || ct.data.power==0){
					tileMap[C.x][C.y].power++;
				}else{
					qwerty = randNum(1,ct.data.power);
					tileMap[rNeighbor.x][rNeighbor.y].power += qwerty;
					tileMap[C.x][C.y].power -= qwerty;
				}
			}else{
				if(randNum(0,9)>4 || ct.data.power==0){
					tileMap[C.x][C.y].power++;
				}else{
					if(ct.data.power > rNeighbor.tile.power){
						tileMap[rNeighbor.x][rNeighbor.y].power = Math.abs(ct.data.power - randNum(1,20));
						tileMap[C.x][C.y].power = 0;
						tileMap[rNeighbor.x][rNeighbor.y].team = ct.data.team;
					}else{
						tileMap[rNeighbor.x][rNeighbor.y].power -= ct.data.power;
						tileMap[C.x][C.y].power = 0;
					}
				}
			}
		}
	);
}

var running = 0;

function run(){
	calcWar();
	render();
}

function lol(a,b,c){
	for(lel=0;lel<randNum(16,21);lel++){
		tileMap[randNum(0,canvasWidthInTiles()-1)][randNum(0,canvasHeightInTiles()-1)] = new Tile(new Team(a,b),c);
	}
}

function getInputs(){
	return {
		name:document.getElementById("inp-name").value,
		color:document.getElementById("inp-color").value,
		power:document.getElementById("inp-power").value
	};
}

function saveMap(){
	savedMap = clone(tileMap);
}

function loadMap(){
	tileMap = clone(savedMap);
	render();
}

function spawn(){
	qqq = getInputs();
	lol(qqq.name,qqq.color,qqq.power);
	render();
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

genMap();
saveMap();
render();