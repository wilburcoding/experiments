version = "20170714a";
setVersion("Conway's Game of Life v",version);

COMMON.tileEngineMode = "confined";

function runCGoL(){
	var changes = [];
	for(var i=0;i<canvasWidthInTiles();i++){
		for(var j=0;j<canvasHeightInTiles();j++){
			var Neighbors = getNeighbors(i,j,false,true);
			var livingCount=0;
			for(var k=0;k<Neighbors.length;k++){
				if(tileMap[Neighbors[k].x][Neighbors[k].y]==1){
					livingCount++;
				}
			}
			if(tileMap[i][j]==0 && livingCount==3){
				changes.push({x:i,y:j});
			}else if(tileMap[i][j]==1 && (livingCount!=2 && livingCount!=3)){
				changes.push({x:i,y:j});
			}
		}
	}
	for(var i=0;i<changes.length;i++){
		tileMap[changes[i].x][changes[i].y] = Math.abs(tileMap[changes[i].x][changes[i].y]-1);
	}
}

function render(){
	draw.clear();
	renderTileMap(function(currentTile){
		if(currentTile.data==0){
			var theColor = "#FFF";
		}else if(currentTile.data==1){
			var theColor = "#000";
		}
		draw.rect(currentTile.x,currentTile.y,getTileSize(),getTileSize(),theColor);
	});
}

function step(){
	runCGoL();
	render();
}

function RUN(){
	step();
	frameLoop = setTimeout(RUN,50);
}

function onCanvasClick(theMousePos){
	var tileCoords = canvasCoordsToTile(theMousePos.x,theMousePos.y);
	tileMap[tileCoords.x][tileCoords.y] = Math.abs(tileMap[tileCoords.x][tileCoords.y]-1);
	render();
}

function pause(){
	if(running){
		running = false;
		clearTimeout(frameLoop);
		render();
		document.getElementById("pause").innerHTML = "Resume";
	}else{
		running = true;
		RUN();
		document.getElementById("pause").innerHTML = "Pause";
	}
}

genTileMap(function(){
	if(Math.random()<0.3){
		return 1;
	}else{
		return 0;
	}
});
RUN();
running = true;