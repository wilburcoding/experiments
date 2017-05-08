var canvas = document.getElementById("window");
var xyz = canvas.getContext("2d");

var common = {
  canvasSize:{x:600,y:400},
  cellSize:10
};

var renderEngine = {
  draw:{
    rectangle:function(a,b,c,d,e){
      xyz.fillStyle = e;
      xyz.fillRect(a,b,c,d);
    },
    text:function(textstring,x,y,fontsize,color,fontface){
      if(fontface === undefined){
	    xyz.font = fontsize + "px Calibri";
	  }else{
	    xyz.font = fontsize + "px " + fontface;
	  }
	  if(color === undefined){
	    xyz.fillStyle = "#000";
	  }else{
	    xyz.fillStyle = color;
	  }
	  xyz.fillText(textstring,x,y);
    }
  },
  clearcanvas:function(){
    this.draw.rectangle(0,0,common.canvasSize.x,common.canvasSize.y,"#FFFFFF");
  },
  startRenderInterval:function(){
    RenderInterval = setInterval(renderFrame,15);
  },
  stopRenderInterval:function(){
    clearInterval(RenderInterval);
  }
};

function renderFrame(){
  //BG.calcBG();
  phySystem.calcMotion();
  renderEngine.clearcanvas();
  //BG.renderBG();
  testtext();
  phySystem.renderEntities();
}

var phySystem = {
  entities:[],
  fntn:0,
  splicewarning:0,
  addEntity:function(posx,posy,velx,vely,xOff,yOff,w,h,c){
    q = {
      pos:{
	    x:posx,
	    y:posy
	  },
	  vel:{
	    x:velx,
	    y:vely
	  },
	  props:{
	    xOffset:xOff,
	    yOffset:yOff,
	    width:w,
	    height:h,
	    color:c
	  }
    };
    this.entities.push(q);
  },
  go:function(){
	p = getInputs();
	if(p.c=="random"){
	  jklmn = "#" + randhex() + randhex() + randhex() + randhex() + randhex() + randhex();
	  this.addEntity(p.x,p.y,randnum(-5,5),randnum(-5,5),randnum(-4,4),randnum(-4,4),p.w,p.h,jklmn);
	}else{
      this.addEntity(p.x,p.y,randnum(-5,5),randnum(-5,5),randnum(-4,4),randnum(-4,4),p.w,p.h,p.c);
	}
  },
  clicked:function(theevent){
    p = getInputs();
	mousepos = getMousePos(theevent);
	if(p.c=="random"){
	  jklmn = "#" + randhex() + randhex() + randhex() + randhex() + randhex() + randhex();
	  this.addEntity(mousepos.x,mousepos.y,randnum(-5,5),randnum(-5,5),randnum(-4,4),randnum(-4,4),p.w,p.h,jklmn);
	}else{
      this.addEntity(mousepos.x,mousepos.y,randnum(-5,5),randnum(-5,5),randnum(-4,4),randnum(-4,4),p.w,p.h,p.c);
	}
  },
  renderEntities:function(){
    for(i=0;i<this.entities.length;i++){
      thing = this.entities[i];
	  renderEngine.draw.rectangle(thing.pos.x + thing.props.xOffset,thing.pos.y + thing.props.yOffset,thing.props.width,thing.props.height,thing.props.color);
    }
  },
  calcMotion:function(){
    for(i=0;i<this.entities.length;i++){
      thing = this.entities[i];
	  thing.pos.x = thing.pos.x + thing.vel.x;
	  thing.pos.y = thing.pos.y + thing.vel.y;
	  bounds = this.getEntityBounds(i);
	  if(bounds.bBottom<common.canvasSize.y){
	    thing.vel.y = thing.vel.y + 0.3;
	  }
	  if(bounds.bRight>=common.canvasSize.x || bounds.bLeft<=0){
	    thing.vel.x = thing.vel.x * -1;
	  }
	  if(bounds.bTop<=0 && thing.vel.y < 0){
	    thing.vel.y = thing.vel.y * -1;
	  }
	  if(bounds.bBottom>=common.canvasSize.y){
	    if(this.fntn==1){
	      this.entities.splice(i,1);
		  this.splicewarning = 1;
	    }else{
	      if(thing.vel.y > 0){
	        thing.vel.y = thing.vel.y * -0.7;
	      }
	      if(Math.abs(thing.vel.x)<0.1){
	        thing.vel.x = 0;
	      }else{
	        thing.vel.x = thing.vel.x * 0.9;
	      }
	    }
	  }
	  if(this.splicewarning==0){
	    this.entities[i] = thing;
	  }else{
	    i = i - 1;
	    this.splicewarning = 0;
	  }
    }
  },
  getEntityBounds:function(ind){
    entity = this.entities[ind];
    return {
      bLeft: entity.pos.x + entity.props.xOffset,
	  bRight: entity.pos.x + entity.props.xOffset + entity.props.width,
	  bTop: entity.pos.y + entity.props.yOffset,
	  bBottom: entity.pos.y + entity.props.yOffset + entity.props.height
    };
  },
  kick:function(){
    ind = randnum(0,this.entities.length-1);
    cba = this.entities[ind];
    cba.vel.x = randnum(-5,5);
    cba.vel.y = randnum(-4,-8);
    this.entities[ind] = cba;
  },
  fountain:function(){
    if(this.fntn==1){
      this.fntn = 0;
	  clearInterval(fntain);
    }else{
      this.fntn = 1;
	  fntain = setInterval(function(){phySystem.go();},45);
    }
  }
};

function getMousePos(evt){
  qwe = canvas.getBoundingClientRect();
  return {x: evt.clientX - qwe.left, y: evt.clientY - qwe.top};
}

function randnum(min,max){
  var jkl = Math.floor((Math.random()*((max-min)+1))+min);
  return jkl;
}

var hexs = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];

function randhex(){
  return hexs[randnum(0,15)];
}

function getInputs(){
  boxx = Number(document.getElementById("inpx").value);
  boxy = Number(document.getElementById("inpy").value);
  boxw = Number(document.getElementById("inpw").value);
  boxh = Number(document.getElementById("inph").value);
  boxc = document.getElementById("inpc").value;
  boxt = document.getElementById("inpt").value;
  return {x:boxx,y:boxy,w:boxw,h:boxh,c:boxc,t:boxt};
}

function testtext(){
  theinputs = getInputs();
  renderEngine.draw.text(theinputs.t,10,390,200,"#CCC","Times New Roman");
}

var BG = {
  cellMap:[],
  genCellMap:function(){
    for(n=0;n<(common.canvasSize.x/common.cellSize);n++){
	  ewq = [];
	  for(m=0;m<(common.canvasSize.y/common.cellSize);m++){
	    if(randnum(0,500)>499){
		  fdsa=1;
		}else{
		  fdsa=0;
		}
		ewq.push({val:10,special:fdsa});
	  }
	  this.cellMap.push(ewq);
	}
  },
  renderBG:function(){
    for(n=0;n<(common.canvasSize.x/common.cellSize);n++){
	  for(m=0;m<(common.canvasSize.y/common.cellSize);m++){
	    if(this.cellMap[n][m].val<10){
		  colorcolor="#DDDDFF";
		}else if(this.cellMap[n][m].val<50){
		  colorcolor="#AAAAFF";
		}else if(this.cellMap[n][m].val<100){
		  colorcolor="#7777FF";
		}else if(this.cellMap[n][m].val<400){
		  colorcolor="#4444FF";
		}else if(this.cellMap[n][m].val<1000){
		  colorcolor="#0000FF";
		}else if(this.cellMap[n][m].val<2000){
		  colorcolor="#0000CC";
		}else if(this.cellMap[n][m].val<5000){
		  colorcolor="#000099";
		}else if(this.cellMap[n][m].val<10000){
		  colorcolor="#000066";
		}else if(this.cellMap[n][m].val<30000){
		  colorcolor="#000033";
		}else{
		  colorcolor="#000000";
		}
		draw.rectangle(
		  common.cellSize*n,
		  common.cellSize*m,
		  common.cellSize,
		  common.cellSize,
		  colorcolor
		);
	  }
	}
  },
  calcBG:function(){
    for(n=0;n<(common.canvasSize.x/common.cellSize);n++){
	  for(m=0;m<(common.canvasSize.y/common.cellSize);m++){
	    neighbors=[];
		if(n>0){
		  neighbors.push({x:n-1,y:m});
		}
		if(m>0){
		  neighbors.push({x:n,y:m-1});
		}
		if(n<(common.canvasSize.x/common.cellSize)-1){
		  neighbors.push({x:n+1,y:m});
		}
		if(m<(common.canvasSize.y/common.cellSize)-1){
		  neighbors.push({x:n,y:m+1});
		}
		rNeighbor=neighbors[randnum(0,neighbors.length-1)];
		if(this.cellMap[n][m].val>0){
		  if(this.cellMap[n][m].special==1){
		    fghj=randnum(1,Math.round(this.cellMap[n][m].val/4));
		  }else{
		    fghj=randnum(1,this.cellMap[n][m].val);
		  }
		  this.cellMap[n][m].val = this.cellMap[n][m].val - fghj;
		  this.cellMap[rNeighbor.x][rNeighbor.y].val = this.cellMap[rNeighbor.x][rNeighbor.y].val + fghj;
		}else{
		  this.cellMap[n][m].val++;
		}
	  }
	}
  }
};

/*addEntity(0,0,4,2,0,0,10,10,"#00F");
addEntity(80,100,-3,4,-3,-3,20,20,"#F00");
addEntity(74,92,-3,4,-3,-3,20,20,"#F0F");*/

//BG.genCellMap();
renderEngine.startRenderInterval();