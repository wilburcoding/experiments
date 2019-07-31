const VERSION = "20190731a";

const CELL_SIZE = 24;
const LAND_NOISE_ZOOM = 12.5;
const ANT_START_FOOD = 100;

var mWidth,
    mHeight,
    mapXOff,
    mapYOff,
    cellMap,
    ants,
    nests;

function setup(){
    setVersion("M99's Ant Farm v",VERSION);

    createCanvas(document.body.clientWidth, document.body.clientHeight);
    cellMap = [];
    ants = [];
    nests = [];
    mWidth = floor(width/CELL_SIZE);
    mHeight = floor(height/CELL_SIZE);
    mapXOff = floor((width-mWidth*CELL_SIZE)/2);
    mapYOff = floor((height-mHeight*CELL_SIZE)/2);
    for(let i=0;i<mWidth;i++){
        cellMap[i] = [];
        for(let j=0;j<mHeight;j++) cellMap[i][j] = new Cell(i,j);
    }
    let c;
    do{
        c = cellMap[floor(random()*mWidth)][floor(random()*mHeight)];
    }while(!c.land);
    let n = new Nest(c,400);
    nests.push(n);
    let l = c.location();
    for(let i=0;i<floor(random(3,6));i++){
        let a = new Ant(n,l.x+random()*CELL_SIZE,l.y+random()*CELL_SIZE);
        ants.push(a);
    }
}

function draw(){
    clear();
    Nest.updateAll();
    Cell.drawMap();
    Ant.updateAndRenderAll();
}

class Cell{
    constructor(i,j){
        this.land = noise(i/LAND_NOISE_ZOOM,j/LAND_NOISE_ZOOM)>0.5;
        this.nest = undefined;
        this.owner = undefined;
        this.mapCoords = {};
        this.mapCoords.i = i;
        this.mapCoords.j = j;
        this.antsHere = [];
        this.ruin = false;
    }

    location(center){
        return Cell.cellLocation(this.mapCoords.i,this.mapCoords.j,center);
    }

    static drawMap(){
        translate(mapXOff,mapYOff);
        for(let i=0;i<mWidth;i++){
            for(let j=0;j<mHeight;j++){
                noStroke();
                let c = cellMap[i][j];
                if(c.owner && c.owner.dead) c.owner = undefined;
                let cw;
                let cn;
                if(i>0) cw = cellMap[i-1][j];
                if(j>0) cn = cellMap[i][j-1];
                if(!c.land) fill(40,70,160);
                else if(c.owner) fill(c.owner.color);
                else fill(20,180,20);
                rect(0,0,CELL_SIZE,CELL_SIZE);
                if(c.ruin){
                    fill(70);
                    rect(10,3,4,18);
                    rect(7,8,10,4);
                }
                if(c.nest){
                    fill(180,85,20);
                    if(c.nest===c.nest.hive.crownNest()) stroke(0,255,0);
                    if(c.nest.size===3) triangle(12,5,19,19,5,19);
                    else if(c.nest.size===2) triangle(12,7,17,17,7,17);
                    else triangle(12,9,15,15,9,15);
                }
                stroke(0);
                if(cn && c.land && cn.land && c.owner!==cn.owner) line(0,0,CELL_SIZE,0);
                if(cw && c.land && cw.land && c.owner!==cw.owner) line(0,0,0,CELL_SIZE);
                translate(0,CELL_SIZE);
            }
            translate(CELL_SIZE,-CELL_SIZE*mHeight);
        }
        translate(-CELL_SIZE*mWidth-mapXOff,-mapYOff);
    }

    static cellLocation(i,j,center){
        let x = i*CELL_SIZE+mapXOff;
        let y = j*CELL_SIZE+mapYOff;
        if(center){
            x += CELL_SIZE/2;
            y += CELL_SIZE/2;
        }
        return {x,y};
    }

    static cellAtLocation(x,y){
        if(x<mapXOff) return null;
        if(y<mapYOff) return null;
        x -= mapXOff;
        y -= mapYOff;
        let i = floor(x/CELL_SIZE);
        let j = floor(y/CELL_SIZE);
        if(i>=mWidth) return null;
        if(j>=mHeight) return null;
        return cellMap[i][j];
    }
}

class Nest{
    constructor(cell,food,hive){
        this.cell = cell instanceof Cell && cell;
        this.cell.nest = this;
        this.hive = hive instanceof Hive && hive;
        if(this.hive) this.hive.nests.push(this);
        this.size = 1;
        this.food = food;
        this.dead = false;
        this.brood = [];
    }

    update(){
        if(this.brood.length<1){
            this.dead = true;
            return;
        }
        if(!this.hive || this.hive.dead){
            let oldhive = this.hive;
            this.hive = new Hive(this.brood[floor(random()*this.brood.length)]);
            for(let a of this.brood){
                if(!a.cell.owner || a.cell.owner===oldhive) this.hive.claimCell(a.cell);
            }
        }
        if(this.brood.length>=5 && this.size<2) this.size++;
        if(this.brood.length>=15 && this.size<3) this.size++;
        let l = this.cell.location();
        let spawnrate;
        if(this.size===1) spawnrate = 0.02;
        else if(this.size===2) spawnrate = 0.05;
        else if(this.size===3) spawnrate = 0.1;
        if(random()<spawnrate && this.food>=ANT_START_FOOD){
            ants.push(new Ant(this,l.x+random()*CELL_SIZE,l.y+random()*CELL_SIZE));
            this.food -= ANT_START_FOOD;
        }
        let maxfood =
            this.size===1 ? 500 :
            this.size===2 ? 1500 :
            this.size===3 ? 5000 : 0;
        let foodgrowth = this.hive.territory*5/this.hive.nests.length;
        if(this.food<maxfood && random()<0.5) this.food += foodgrowth;
    }

    static updateAll(){
        for(let i=nests.length-1;i>=0;i--){
            nests[i].update();
            if(nests[i].dead){
                nests[i].cell.nest = undefined;
                nests[i].cell.ruin = true;
                if(nests[i].hive){
                    for(let q=nests[i].hive.nests.length-1;q>=0;q--){
                        if(nests[i].hive.nests[q]===nests[i]) nests[i].hive.nests.splice(q,1);
                    }
                }
                nests.splice(i,1);
            }
        }
    }
}

class Hive{
    constructor(queen){
        this.color = color(random()*255,random()*255,random()*255);
        this.queen = queen instanceof Ant && queen;
        this.expanding = false;
        this.nests = [];
        this.nests.push(this.queen.nest);
        this.territory = 0;
    }

    claimCell(cell){
        if(cell instanceof Cell){
            cell.owner = this;
            this.territory++;
        }
    }

    population(){
        let p = 0;
        for(let n of this.nests){
            p += n.brood.length;
        }
        return p;
    }

    crownNest(){
        if(!this.queen) return null;
        return this.queen.nest;
    }
}

class Ant{
    constructor(nest,x,y){
        this.pos = createVector(x,y);
        this.dir = random(0,2*PI);
        this.nest = nest instanceof Nest && nest;
        this.nest.brood.push(this);
        this.cell = Cell.cellAtLocation(x,y);
        this.cell.antsHere.push(this);
        this.mode = 0;
        this.energy = ANT_START_FOOD;
        this.dead = false;
    }

    update(){
        let h = this.home();
        let hd = sqrt(sq(h.x-this.pos.x)+sq(h.y-this.pos.y));
        if(this.isQueen() && this.mode!==2) this.mode = 1;
        if(this.mode===0){
            if(hd>=this.energy-5) this.mode = 1;
            else if(hd>100 && !this.cell.nest && (random()<0.05 || this.cell.ruin)){
                let farenoughaway = true;
                for(let i=0;i<nests.length;i++){
                    let l = nests[i].cell.location(true);
                    let d = sqrt(sq(l.x-this.pos.x)+sq(l.y-this.pos.y));
                    if(d<75) farenoughaway = false;
                }
                if(farenoughaway){
                    for(let q=this.nest.brood.length-1;q>=0;q--){
                        if(this.nest.brood[q]===this) this.nest.brood.slice(q,1);
                    }
                    let h = this.hive();
                    this.nest = new Nest(this.cell,floor(2*this.energy/3),h);
                    nests.push(this.nest);
                    this.cell.ruin = false;
                    this.energy -= this.nest.food;
                    this.nest.brood.push(this);
                }
            }
        }else if(this.mode===1){
            let x1 = h.x-this.pos.x;
            let y1 = h.y-this.pos.y;
            let dirTarget = atan(y1/x1);
            if(x1<0) dirTarget += PI;
            this.dir = lerp(this.dir+(dirTarget-this.dir>PI ? 2*PI : dirTarget-this.dir<-PI ? -2*PI : 0),dirTarget,0.1);
            if(this.cell===this.nest.cell) this.mode = 2;
        }else if(this.mode===2){
            if(this.energy>=100 && random()<0.05) this.mode = 0;
        }
        if(this.isQueen()){
            if(this.hive().territory>=this.hive().population()) this.hive().expanding = false;
            else this.hive().expanding = true;
        }
        this.dir += random(-PI/16,PI/16);
        let newX = this.pos.x + cos(this.dir);
        let newY = this.pos.y + sin(this.dir);
        let goingIntoCell = Cell.cellAtLocation(newX,newY);
        if(goingIntoCell){
            let enterable = true;
            if(!goingIntoCell.land) enterable = false;
            else if(!goingIntoCell.owner) enterable = this.hive().expanding || this.mode===1;
            else if(goingIntoCell.owner!==this.hive()) enterable = false;
            if(this.mode===2 && goingIntoCell!==this.nest.cell) enterable = false;
            if(enterable){
                this.pos.x = newX;
                this.pos.y = newY;
                if(goingIntoCell!==this.cell){
                    for(let i=this.cell.antsHere.length-1;i>=0;i--){
                        if(this.cell.antsHere[i]===this) this.cell.antsHere.splice(i,1);
                    }
                    this.cell = goingIntoCell;
                    this.cell.antsHere.push(this);
                    if(!this.cell.owner){
                        if(this.isQueen()) this.hive().expanding = true;
                        this.hive().claimCell(this.cell);
                    }
                }
            }else this.dir += PI;
        }else this.dir += PI;
        this.dir = (this.dir%(2*PI)+(2*PI))%(2*PI);
        if(this.isQueen()){
            if(this.cell.nest && this.cell.nest.food>=5 && this.energy<500){
                this.energy += 5;
                this.cell.nest.food -= 5;
            }
            else this.energy-=3;
        }else{
            if(this.cell.nest && this.cell.nest.food>=3 && this.energy<200){
                this.energy += 3;
                this.cell.nest.food -= 3;
            }
            else this.energy--;
        }
        if(this.energy<=0) this.dead = true;
    }

    render(){
        push();
        translate(this.pos.x,this.pos.y);
        rotate(this.dir);
        if(this.isQueen()) fill(0,255,0);
        else fill(255,0,0);
        noStroke();
        rect(-3,-1,6,2);
        pop();
    }

    hive(){
        return this.nest.hive;
    }

    isQueen(){
        return this===this.hive().queen;
    }

    home(){
        return this.nest.cell.location(true);
    }

    makeQueen(){
        this.hive().queen = this;
        // this.mode = 1;
    }

    static updateAndRenderAll(){
        for(let i=ants.length-1;i>=0;i--){
            let a = ants[i];
            a.update();
            if(a.dead){
                ants.splice(i,1);
                for(let q=a.cell.antsHere.length-1;q>=0;q--){
                    if(a.cell.antsHere[q]===a) a.cell.antsHere.splice(q,1);
                }
                for(let q=a.nest.brood.length-1;q>=0;q--){
                    if(a.nest.brood[q]===a) a.nest.brood.splice(q,1);
                }
                if(a.isQueen()) a.hive().dead = true;
                continue;
            }
            a.render();
        }
    }
}