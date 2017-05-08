var canvas = document.getElementById("window");
var ctx = canvas.getContext("2d");

var common = {
  canvasSize:{x:1000,y:600},
  cellSize:10
};

var renderEngine = {
  draw:{
    rectangle:function(a,b,c,d,e){
      ctx.fillStyle = e;
      ctx.fillRect(a,b,c,d);
    },
    text:function(textstring,x,y,fontsize,color,fontface){
      if(fontface === undefined){
	    ctx.font = fontsize + "px Calibri";
	  }else{
	    ctx.font = fontsize + "px " + fontface;
	  }
	  if(color === undefined){
	    ctx.fillStyle = "#000";
	  }else{
	    ctx.fillStyle = color;
	  }
	  ctx.fillText(textstring,x,y);
    }
  },
  clearcanvas:function(){
    this.draw.rectangle(0,0,common.canvasSize.x,common.canvasSize.y,"#FFFFFF");
  },
  startRenderInterval:function(){
    RenderInterval = setInterval(renderFrame,30);
  },
  stopRenderInterval:function(){
    clearInterval(RenderInterval);
  }
};

function renderFrame(){
  Turmite.calcTurmite();
  Turmite.renderTurmite.markedCells();
}

var Turmite = {
  cellMap:[],
  genCellMap:function(){
    for(n=0;n<(common.canvasSize.x/common.cellSize);n++){
	  ewq = [];
	  for(m=0;m<(common.canvasSize.y/common.cellSize);m++){
		ewq.push(0);
	  }
	  this.cellMap.push(ewq);
	}
  },
  renderTurmite:{
    outdatedCells:[],
	markCellForUpdate:function(cellX,cellY){
      if(cellX=="clear"){
	    this.outdatedCells = [];
	  }else{
	    this.outdatedCells.push({x:cellX,y:cellY});
	  }
    },
	full:function(){
      renderEngine.clearcanvas();
	  for(n=0;n<(common.canvasSize.x/common.cellSize);n++){
	    for(m=0;m<(common.canvasSize.y/common.cellSize);m++){
	      this.cell(n,m);
	    }
	  }
	},
	cell:function(cellX,cellY){
	  if(cellX==Turmite.ant.pos.x && cellY==Turmite.ant.pos.y){
		colorcolor="#FF0000";
	  }else{
	    if(Turmite.cellMap[cellX][cellY]==0){
	      colorcolor="#FFFFFF";
	    }else if(Turmite.cellMap[cellX][cellY]==1){
	      colorcolor="#FFFF00";
	    }else if(Turmite.cellMap[cellX][cellY]==2){
	      colorcolor="#00FF00";
	    }else if(Turmite.cellMap[cellX][cellY]==3){
	      colorcolor="#00FFFF";
	    }else if(Turmite.cellMap[cellX][cellY]==4){
	      colorcolor="#0000FF";
	    }else{
	      colorcolor="#000000";
	    }
	  }
	  renderEngine.draw.rectangle(
	    common.cellSize*cellX,
	    common.cellSize*cellY,
	    common.cellSize,
	    common.cellSize,
	    colorcolor
	  );
	},
	markedCells:function(){
	  for(var i=0;i<this.outdatedCells.length;i++){
	    this.cell(this.outdatedCells[i].x,this.outdatedCells[i].y);
	  }
	  this.markCellForUpdate("clear");
	}
  },
  ant:{
    pos:{x:Math.round((common.canvasSize.x/common.cellSize)/2),y:Math.round((common.canvasSize.y/common.cellSize)/2)},
	direction:1,
	getAbsDir:function(LR){
	  if(LR=="left"){
	    var absDir=this.direction - 1;
	  }else if(LR=="right"){
	    var absDir=this.direction + 1;
	  }
	  if(absDir==0){
	    absDir=4;
	  }else if(absDir==5){
	    absDir=1;
	  }
	  return absDir;
	},
	turn:function(LR){
	  this.direction = this.getAbsDir(LR);
	},
	move:function(){
	  if(this.direction==1){
	    this.pos.y--;
		if(this.pos.y<0){
		  this.pos.y=(common.canvasSize.y/common.cellSize)-1;
		}
	  }
	  if(this.direction==2){
	    this.pos.x++;
		if(this.pos.x>(common.canvasSize.x/common.cellSize)-1){
		  this.pos.x=0;
		}
	  }
	  if(this.direction==3){
	    this.pos.y++;
		if(this.pos.y>(common.canvasSize.y/common.cellSize)-1){
		  this.pos.y=0;
		}
	  }
	  if(this.direction==4){
	    this.pos.x--;
		if(this.pos.x<0){
		  this.pos.x=(common.canvasSize.x/common.cellSize)-1;
		}
	  }
	  Turmite.renderTurmite.markCellForUpdate(this.pos.x,this.pos.y);
	}
  },
  calcTurmite:function(){
    var xPos = this.ant.pos.x;
	var yPos = this.ant.pos.y;
	if(this.cellMap[xPos][yPos]==0){
	  this.cellMap[xPos][yPos] = this.ant.direction;
	  this.ant.turn("right");
	}else if(this.cellMap[xPos][yPos]==this.ant.direction){
	  this.cellMap[xPos][yPos] = this.ant.getAbsDir("right");
	  this.ant.turn("left");
	}else{
	  this.cellMap[xPos][yPos] = 0;
	}
	this.renderTurmite.markCellForUpdate(xPos,yPos);
	this.ant.move();
  }
};

Turmite.genCellMap();
Turmite.renderTurmite.full();
renderEngine.startRenderInterval();