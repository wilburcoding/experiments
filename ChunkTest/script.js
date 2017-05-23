version = "20170523a";
setVersion("Chunk Test v",version);

COMMON.tileEngineMode = "chunks";
COMMON.chunkSize = 100;

panTo = {x:0,y:0};
//zoomLevel = 200;
//zoomTo = 200;
panBars = 0.05;
panBarColor = "rgba(170,170,200,0.5)";
selectedTile = {x:undefined,y:undefined};

function onCanvasClick(mousePos){
	var panned = false;
	if(mousePos.x < (theBox.width*panBars)){
		panned = true;
		panTo.x -= 500;
	}
	if(mousePos.x > (theBox.width*(1-panBars))){
		panned = true;
		panTo.x += 500;
	}
	if(mousePos.y < (theBox.height*panBars)){
		panned = true;
		panTo.y -= 400;
	}
	if(mousePos.y > (theBox.height*(1-panBars))){
		panned = true;
		panTo.y += 400;
	}
	if(!panned){
		var tileCoords = canvasCoordsToTile(mousePos.x,mousePos.y);
		if(!chunkExists(tileCoords.chunk.x,tileCoords.chunk.y)){
			genChunk(tileCoords.chunk.x,tileCoords.chunk.y,function(){
				if(Math.random()<0.2){
					return true;
				}else{
					return false;
				}
			});
			selectedTile = {x:undefined,y:undefined};
		}else{
			if(tileCoords.x==selectedTile.x && tileCoords.y==selectedTile.y){
				selectedTile.x = undefined;
				selectedTile.y = undefined;
			}else{
				selectedTile.x = tileCoords.x;
				selectedTile.y = tileCoords.y;
			}
		}
	}
}

/*function zoom(out){
	if(out){
		zoomTo -= 200;
	}else{
		zoomTo += 200;
	}
}*/

function render(){
	draw.clear();
	if(theBox.width != document.body.clientWidth || theBox.height != document.body.clientHeight){
		theBox.width = document.body.clientWidth;
		theBox.height = document.body.clientHeight;
	}
	renderTileMap(function(q){
		if(q.data){
			var tileColor = "#0F0";
		}else{
			var tileColor = "#07F";
		}
		draw.rect(q.x,q.y,getTileSize(),getTileSize(),tileColor);
		if(q.tile.x==selectedTile.x && q.tile.y==selectedTile.y){
			ctx.strokeStyle = "#F00";
			ctx.strokeRect(q.x,q.y,getTileSize(),getTileSize());
		}
	});
	draw.rect(0,0,theBox.width*panBars,theBox.height,panBarColor);
	draw.rect(0,0,theBox.width,theBox.height*panBars,panBarColor);
	draw.rect(theBox.width*(1-panBars),0,theBox.width*panBars,theBox.height,panBarColor);
	draw.rect(0,theBox.height*(1-panBars),theBox.width,theBox.height*panBars,panBarColor);
}

function RUN(){
	var panRate = {x:0,y:0};
	//var zoomRate = Math.round(Math.abs(zoomLevel - zoomTo)/10);
	panRate.x = Math.round(Math.abs(panOffset.x - panTo.x)/10);
	panRate.y = Math.round(Math.abs(panOffset.y - panTo.y)/10);
	if(panRate.x<1){
		panRate.x = 1;
	}
	if(panRate.y<1){
		panRate.y = 1;
	}
	/*if(zoomRate<1){
		zoomRate = 1;
	}*/
	if(panOffset.x < panTo.x){
		panOffset.x += panRate.x;
	}else if(panOffset.x > panTo.x){
		panOffset.x -= panRate.x;
	}
	if(panOffset.y < panTo.y){
		panOffset.y += panRate.y;
	}else if(panOffset.y > panTo.y){
		panOffset.y -= panRate.y;
	}
	/*if(zoomLevel < zoomTo){
		zoomLevel += zoomRate;
	}else{
		zoomLevel -= zoomRate;
	}*/
	/*if(Math.abs(panOffset.x - panTo.x) < 2){
		panOffset.x = panTo.x;
	}
	if(Math.abs(panOffset.y - panTo.y) < 2){
		panOffset.y = panTo.y;
	}*/
	/*if(Math.abs(zoomLevel - zoomTo) < 3){
		zoomLevel = zoomTo;
	}
	zoomFactor = Math.pow(1.5,(zoomLevel/200));*/
	render();
	frameLoop = setTimeout(RUN,35);
}

genChunk(0,0,function(){
	if(Math.random()<0.2){
		return true;
	}else{
		return false;
	}
});
RUN();