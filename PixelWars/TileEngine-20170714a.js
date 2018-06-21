// Requires CanvasEngine.js -- use <script src="CanvasEngine.js"></script>

COMMON.baseTileSize = 10;
COMMON.tileEngineMode = undefined;

tileMap = []; //used if COMMON.tileEngineMode is "confined"

chunks = []; //used if COMMON.tileEngineMode is "chunks"
panOffset = {x:0,y:0};
COMMON.chunkSize = 20;
zoomFactor = 1;

function modeError(){
	return new Error("Please set COMMON.tileEngineMode to either \"confined\" or \"chunks\"");
}

function getTileSize(){
	if(COMMON.tileEngineMode=="confined"){
		return COMMON.baseTileSize;
	}else if(COMMON.tileEngineMode=="chunks"){
		return Math.ceil(COMMON.baseTileSize*zoomFactor);
	}else{
		throw modeError();
	}
}

function canvasWidthInTiles(){
	return Math.ceil(theBox.width/getTileSize());
}

function canvasHeightInTiles(){
	return Math.ceil(theBox.height/getTileSize());
}

function chunkExists(x,y){
	return (Array.isArray(chunks[x]) && chunks[x][y]!=undefined);
}

function tileCoordsToChunk(x,y){
	var cCoords = {};
	cCoords.x = Math.floor(x/COMMON.chunkSize);
	cCoords.y = Math.floor(y/COMMON.chunkSize);
	cCoords.localTileX = x-(cCoords.x*COMMON.chunkSize);
	cCoords.localTileY = y-(cCoords.y*COMMON.chunkSize);
	return cCoords;
}

function canvasCoordsToTile(x,y){
	var tCoords = {};
	if(COMMON.tileEngineMode=="confined"){
		tCoords.x = Math.floor(x/getTileSize());
		tCoords.y = Math.floor(y/getTileSize());
	}else if(COMMON.tileEngineMode=="chunks"){
		tCoords.x = Math.floor((x+panOffset.x)/getTileSize());
		tCoords.y = Math.floor((y+panOffset.y)/getTileSize());
		tCoords.chunk = tileCoordsToChunk(tCoords.x,tCoords.y);
	}else{
		throw modeError();
	}
	return tCoords;
}

function renderTileMap(tileRender,defaultRender){
	if(COMMON.tileEngineMode=="confined"){
		for(var i=0;i<tileMap.length;i++){
			for(var j=0;j<tileMap[i].length;j++){
				var currentTile = {};
				currentTile.x = i*getTileSize();
				currentTile.y = j*getTileSize();
				currentTile.data = tileMap[i][j];
				tileRender(currentTile);
			}
		}
	}else if(COMMON.tileEngineMode=="chunks"){
		var tileOffsetX = Math.floor(panOffset.x/getTileSize());
		var tileOffsetY = Math.floor(panOffset.y/getTileSize());
		for(var i=tileOffsetX;i<(tileOffsetX+canvasWidthInTiles());i++){
			for(var j=tileOffsetY;j<(tileOffsetY+canvasHeightInTiles());j++){
				var currentTile = {};
				currentTile.x = (i*getTileSize())-panOffset.x;
				currentTile.y = (j*getTileSize())-panOffset.y;
				currentTile.chunk = tileCoordsToChunk(i,j);
				currentTile.tile = {x:i,y:j};
				if(chunkExists(currentTile.chunk.x,currentTile.chunk.y)){
					currentTile.data = chunks[currentTile.chunk.x][currentTile.chunk.y][currentTile.chunk.localTileX][currentTile.chunk.localTileY];
				}else{
					currentTile.data = undefined;
				}
				if(currentTile.data==undefined){
					if(defaultRender!=undefined){
						defaultRender(currentTile);
					}else{
						draw.rect(currentTile.x,currentTile.y,getTileSize(),getTileSize(),"#DDD");
					}
				}else{
					tileRender(currentTile);
				}
			}
		}
	}else{
		throw modeError();
	}
}

function genTileMap(tileGen){
	for(var i=0;i<canvasWidthInTiles();i++){
		var q = [];
		for(var j=0;j<canvasHeightInTiles();j++){
			q.push(tileGen());
		}
		tileMap.push(q);
	}
}

function genChunk(x,y,tileGen){
	var u = [];
	for(var i=0;i<COMMON.chunkSize;i++){
		var q = [];
		for(var j=0;j<COMMON.chunkSize;j++){
			q.push(tileGen());
		}
		u.push(q);
	}
	if(!Array.isArray(chunks[x])){
		chunks[x] = [];
	}
	chunks[x][y] = u;
}

function getNeighbors(x,y,orthogonal,wrap){
	var theNeighbors = [];
	if(COMMON.tileEngineMode=="confined"){
		if(x>0){
			theNeighbors.push({x:x-1,y:y});
			if(!orthogonal){
				if(y>0){
					theNeighbors.push({x:x-1,y:y-1});
				}else if(wrap){
					theNeighbors.push({x:x-1,y:(canvasHeightInTiles())-1});
				}
				if(y<(canvasHeightInTiles())-1){
					theNeighbors.push({x:x-1,y:y+1});
				}else if(wrap){
					theNeighbors.push({x:x-1,y:0});
				}
			}
		}else if(wrap){
			theNeighbors.push({x:(canvasWidthInTiles())-1,y:y});
			if(!orthogonal){
				if(y>0){
					theNeighbors.push({x:(canvasWidthInTiles())-1,y:y-1});
				}else{
					theNeighbors.push({x:(canvasWidthInTiles())-1,y:(canvasHeightInTiles())-1});
				}
				if(y<(canvasHeightInTiles())-1){
					theNeighbors.push({x:(canvasWidthInTiles())-1,y:y+1});
				}else{
					theNeighbors.push({x:(canvasWidthInTiles())-1,y:0});
				}
			}
		}
		if(x<(canvasWidthInTiles())-1){
			theNeighbors.push({x:x+1,y:y});
			if(!orthogonal){
				if(y>0){
					theNeighbors.push({x:x+1,y:y-1});
				}else if(wrap){
					theNeighbors.push({x:x+1,y:(canvasHeightInTiles())-1});
				}
				if(y<(canvasHeightInTiles())-1){
					theNeighbors.push({x:x+1,y:y+1});
				}else if(wrap){
					theNeighbors.push({x:x+1,y:0});
				}
			}
		}else if(wrap){
			theNeighbors.push({x:0,y:y});
			if(!orthogonal){
				if(y>0){
					theNeighbors.push({x:0,y:y-1});
				}else{
					theNeighbors.push({x:0,y:(canvasHeightInTiles())-1});
				}
				if(y<(canvasHeightInTiles())-1){
					theNeighbors.push({x:0,y:y+1});
				}else{
					theNeighbors.push({x:0,y:0});
				}
			}
		}
		if(y>0){
			theNeighbors.push({x:x,y:y-1});
		}else if(wrap){
			theNeighbors.push({x:x,y:(canvasHeightInTiles())-1});
		}
		if(y<(canvasHeightInTiles())-1){
			theNeighbors.push({x:x,y:y+1});
		}else if(wrap){
			theNeighbors.push({x:x,y:0});
		}
	}else if(COMMON.tileEngineMode=="chunks"){
		var chunkCoords = tileCoordsToChunk(x,y);
		if(chunkCoords.localTileX>0 || chunkExists(chunkCoords.x-1,chunkCoords.y)){
			theNeighbors.push({x:x-1,y:y});
		}
		if(chunkCoords.localTileX<(COMMON.chunkSize-1) || chunkExists(chunkCoords.x+1,chunkCoords.y)){
			theNeighbors.push({x:x+1,y:y});
		}
		if(chunkCoords.localTileY>0 || chunkExists(chunkCoords.x,chunkCoords.y-1)){
			theNeighbors.push({x:x,y:y-1});
		}
		if(chunkCoords.localTileY<(COMMON.chunkSize-1) || chunkExists(chunkCoords.x,chunkCoords.y+1)){
			theNeighbors.push({x:x,y:y+1});
		}
		if(!orthogonal){
			if((chunkCoords.localTileX>0 && chunkCoords.localTileY>0) || (chunkCoords.localTileX>0 && chunkExists(chunkCoords.x,chunkCoords.y-1)) || (chunkExists(chunkCoords.x-1,chunkCoords.y) && chunkCoords.localTileY>0) || (chunkCoords.localTileX==0 && chunkCoords.localTileY==0 && chunkExists(chunkCoords.x-1,chunkCoords.y-1))){
				theNeighbors.push({x:x-1,y:y-1});
			}
			if((chunkCoords.localTileX>0 && chunkCoords.localTileY<(COMMON.chunkSize-1)) || (chunkCoords.localTileX>0 && chunkExists(chunkCoords.x,chunkCoords.y+1)) || (chunkExists(chunkCoords.x-1,chunkCoords.y) && chunkCoords.localTileY<(COMMON.chunkSize-1)) || (chunkCoords.localTileX==0 && chunkCoords.localTileY==(COMMON.chunkSize-1) && chunkExists(chunkCoords.x-1,chunkCoords.y+1))){
				theNeighbors.push({x:x-1,y:y+1});
			}
			if((chunkCoords.localTileX<(COMMON.chunkSize-1) && chunkCoords.localTileY>0) || (chunkCoords.localTileX<(COMMON.chunkSize-1) && chunkExists(chunkCoords.x,chunkCoords.y-1)) || (chunkExists(chunkCoords.x+1,chunkCoords.y) && chunkCoords.localTileY>0) || (chunkCoords.localTileX==(COMMON.chunkSize-1) && chunkCoords.localTileY==0 && chunkExists(chunkCoords.x+1,chunkCoords.y-1))){
				theNeighbors.push({x:x+1,y:y-1});
			}
			if((chunkCoords.localTileX<(COMMON.chunkSize-1) && chunkCoords.localTileY<(COMMON.chunkSize-1)) || (chunkCoords.localTileX<(COMMON.chunkSize-1) && chunkExists(chunkCoords.x,chunkCoords.y+1)) || (chunkExists(chunkCoords.x+1,chunkCoords.y) && chunkCoords.localTileY<(COMMON.chunkSize-1)) || (chunkCoords.localTileX==(COMMON.chunkSize-1) && chunkCoords.localTileY==(COMMON.chunkSize-1) && chunkExists(chunkCoords.x+1,chunkCoords.y+1))){
				theNeighbors.push({x:x+1,y:y+1});
			}
		}
	}else{
		throw modeError();
	}
	return theNeighbors;
}