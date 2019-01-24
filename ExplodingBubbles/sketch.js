const VERSION = "20190124a";

const HIVE_SIZE = 30;
const BEE_MASS = 3;

function setup() {
    setVersion("Exploding Bubbles v",VERSION);

    createCanvas(document.body.clientWidth, document.body.clientHeight);
    circles = [];
    flares = [];
    hives = [];
    bees = [];
    raining = false;
    fooVec = createVector();
}

function draw() {
    background(220);
    for(let c of circles){
        c.update();
        let p = c.pos;
        let cl = c.color;
        if(c.ill){
            strokeWeight(3);
            stroke(0,150,0);
        }else stroke(cl);
        fill(red(cl),green(cl),blue(cl),50);
        ellipse(p.x,p.y,2*c.r);
        strokeWeight(1);
    }
    for(let f of flares){
        f.update();
        let p = f.pos;
        let v = f.vel;
        let cl = f.color;
        noStroke();
        fill(red(cl),green(cl),blue(cl),50);
        fooVec.set(v).setMag(2);
        fooVec.rotate(-PI/2);
        fooVec.add(p);
        let p1x = fooVec.x;
        let p1y = fooVec.y;
        fooVec.set(v).setMag(2);
        fooVec.rotate(PI/2);
        fooVec.add(p);
        let p2x = fooVec.x;
        let p2y = fooVec.y;
        fooVec.set(v).setMag(10);
        fooVec.rotate(PI);
        fooVec.add(p);
        let p3x = fooVec.x;
        let p3y = fooVec.y;
        triangle(p1x,p1y,p2x,p2y,p3x,p3y);
        fill(cl);
        if(f.killer) fill(255,0,0);
        ellipse(p.x,p.y,4);
    }
    for(let h of hives){
        h.update();
        let p = h.pos;
        let cl = h.color;
        if(h.ill){
            strokeWeight(3);
            stroke(0,150,0);
        }else stroke(cl);
        fill(red(cl),green(cl),blue(cl),map(h.m,5,150,30,240,true));
        rect(p.x,p.y,HIVE_SIZE,HIVE_SIZE);
        strokeWeight(1);
    }
    for(let b of bees){
        b.update();
        push();
        let p = b.pos;
        let cl = b.color;
        translate(p.x,p.y);
        rotate(b.angle);
        if(b.ill){
            strokeWeight(3);
            stroke(0,150,0);
        }else stroke(cl);
        fill(red(cl),green(cl),blue(cl),50);
        triangle(-15,-4,-15,4,0,0);
        pop();
    }
    for(let i=circles.length-1;i>=0;i--){
        if(circles[i].dead) circles.splice(i,1);
    }
    for(let i=flares.length-1;i>=0;i--){
        if(flares[i].dead) flares.splice(i,1);
    }
    for(let i=hives.length-1;i>=0;i--){
        if(hives[i].dead) hives.splice(i,1);
    }
    for(let i=bees.length-1;i>=0;i--){
        if(bees[i].dead) bees.splice(i,1);
    }
    if(circles.length<40 && random()<0.005) circles.push(new Circle());
    if(raining){
        if(random()<0.2) flares.push(new Flare(random(width),0,random(1,5),color(random(255),random(255),random(255)),PI/2,false,true));
        if(random()<0.00045) raining = false;
    }else if(random()<0.0002) raining = true;
    //if(random()<0.0002) flares.push(new Flare(random(width),random(height),5,color(random(255),random(255),random(255)),undefined,true));
}

class Circle{
    constructor(x,y){
        let r = this.r = random(8,40);
        if(x===undefined) x = random(r,width-r);
        if(y===undefined) y = random(r,height-r);
        this.pos = createVector(x,y);
        this.vel = p5.Vector.random2D().mult(random(1,4));
        this.color = color(random(255),random(255),random(255));
        this.ill = false;
        this.killer = false;
        this.dead = false;
    }
    
    update(){
        let p = this.pos;
        let v = this.vel;
        p.add(v);
        let r = this.r;
        let b = 0.3;
        if(p.x-r<0) v.x += b;
        if(p.x+r>width) v.x -= b;
        if(p.y-r<0) v.y += b;
        if(p.y+r>height) v.y -= b;
        for(let i=0;i<circles.length;i++){
            let that = circles[i];
            if(that===this) continue;
            let d = p.dist(that.pos)-r-that.r;
            let f = pow(0.5,abs(d))*0.3;
            v.x = lerp(v.x,that.vel.x,f);
            v.y = lerp(v.y,that.vel.y,f);
            fooVec.set(p);
            fooVec.sub(that.pos);
            if(d>0){
                fooVec.setMag(pow(0.97,d)*0.02);
                v.sub(fooVec);
            }else if(d<0){
                fooVec.setMag(0.005);
                v.add(fooVec);
                if(that.r>=r && random()<0.0001){
                    that.r += r;
                    if(this.ill) that.ill = true;
                    this.dead = true;
                    return;
                }
            }
        }
        let s = r/sqrt(width*height);
        if(random()<pow(s,3.5) || this.killer){
            if(!this.killer && r>=10 && random()<0.2){
                hives.push(new Hive(p.x,p.y,r/2,this.color,this.ill));
                this.r /= 2;
                return;
            }
            let n = 0;
            while(n<r){
                let l = r-n;
                let m = random(1,5);
                m = min(l,m);
                flares.push(new Flare(p.x,p.y,m,this.color,undefined,this.ill||this.killer));
                n += m;
            }
            this.dead = true;
            return;
        }
        for(let i=0;i<flares.length;i++){
            let f = flares[i];
            if(!f.dead){
                let d = p.dist(f.pos)-r;
                let d1 = d<0 ? 0 : d;
                let g = pow(0.6,d1)*0.05;
                v.x = lerp(v.x,f.vel.x,g);
                v.y = lerp(v.y,f.vel.y,g);
                if(d<0 && (random()<0.03 || f.killer)){
                    this.r += f.m;
                    if(f.killer) this.killer = true;
                    f.dead = true;
                }
            }
        }
    }
}

class Flare{
    constructor(x,y,m,c,a,k,r){
        this.pos = createVector(x,y);
        if(a!==undefined){
            this.vel = createVector(3);
            this.vel.rotate(a);
        }else this.vel = p5.Vector.random2D().mult(3);
        this.m = m;
        this.color = c;
        this.killer = k;
        this.rain = r;
        this.dead = false;
    }
    
    update(){
        let p = this.pos;
        let v = this.vel;
        p.add(v);
        if(p.x<0 || p.x>=width || p.y<0 || p.y>=height){
            if(random()<0.5) this.dead = true;
            else{
                if(p.x<0){
                    p.x = 0;
                    v.x *= -1;
                }else if(p.x>=width){
                    p.x = width-1;
                    v.x *= -1;
                }else if(p.y<0){
                    p.y = 0;
                    v.y *= -1;
                }else if(p.y>=height){
                    p.y = height-1;
                    v.y *= -1;
                }
            }
        }
    }
}

class Hive{
    constructor(x,y,m,c,i){
        this.pos = createVector(x,y);
        this.vel = createVector(random(0.5,5)).rotate(random(-PI,0));
        this.m = m;
        this.color = c;
        this.ill = i;
        this.killer = false;
        this.dead = false;
    }

    update(){
        if(this.pos.y+HIVE_SIZE<height){
            this.vel.y += 0.2;
        }else{
            this.vel.y = 0;
            if(abs(this.vel.x)<0.001) this.vel.x = 0;
            else this.vel.x *= 0.95;
            if(this.pos.y+HIVE_SIZE>height) this.pos.y = lerp(this.pos.y,height-HIVE_SIZE,0.2);
        }
        if(this.pos.x<0 && this.vel.x<0 || this.pos.x+HIVE_SIZE>=width && this.vel.x>0){
            this.vel.x *= -0.9;
        }
        this.pos.add(this.vel);
        if(this.killer){
            let n = 0;
            while(n<this.m){
                let l = this.m-n;
                let m1 = random(1,5);
                m1 = min(l,m1);
                flares.push(new Flare(this.pos.x+HIVE_SIZE/2,this.pos.y+HIVE_SIZE/2,m1,this.color,undefined,true));
                n += m1;
            }
            this.dead = true;
            return;
        }
        for(let i=0;i<flares.length;i++){
            let f = flares[i];
            if(!f.dead){
                if(f.pos.x>this.pos.x && f.pos.x<this.pos.x+HIVE_SIZE && f.pos.y>this.pos.y && f.pos.y<this.pos.y+HIVE_SIZE){
                    this.m += f.m;
                    if(f.rain && random()<0.3) this.ill = true;
                    if(f.killer) this.killer = true;
                    f.dead = true;
                }
            }
        }
        if(this.m>=10 && random()<(this.m<50 ? 0.005 : this.m<150 ? 0.0017 : 0.0005)){
            this.m -= BEE_MASS;
            bees.push(new Bee(this.pos.x+HIVE_SIZE/2,this.pos.y+HIVE_SIZE/2,this.color,this,this.ill));
        }
        if(this.m>175 && random()<0.01){
            if(this.ill){
                this.killer = true;
                return;
            }
            hives.push(new Hive(this.pos.x,this.pos.y-1,this.m/2,this.color));
            this.m /= 2;
        }
        if(random()<0.15) this.m -= random(0.2,1);
        if(this.m<5) this.dead = true;
    }
}

class Bee{
    constructor(x,y,c,h,i){
        this.pos = createVector(x,y);
        this.color = c;
        this.hive = h;
        this.target = undefined;
        this.ill = i;
        this.angle = 3*PI/2;
        this.dead = false;
    }

    update(){
        if(!this.target){
            let candidate;
            let score = 0;
            for(let i=0;i<circles.length;i++){
                let c = circles[i];
                let r = c.r;
                let d = c.pos.dist(this.pos)-r;
                let s = r*pow(0.85,d/100);
                if(s>score){
                    candidate = c;
                    score = s;
                }
            }
            if(candidate){
                this.target = candidate;
            }else{
                flares.push(new Flare(this.pos.x,this.pos.y,BEE_MASS,this.color,this.angle));
                this.dead = true;
                return;
            }
        }
        if(this.hive.dead){
            flares.push(new Flare(this.pos.x,this.pos.y,BEE_MASS,this.color,this.angle));
            this.dead = true;
            return;
        }
        if(this.target.dead){
            this.target = undefined;
            if(random()<0.2){
                fooVec.set(this.hive.pos);
                fooVec.add(HIVE_SIZE/2,HIVE_SIZE/2);
                fooVec.sub(this.pos);
                flares.push(new Flare(this.pos.x,this.pos.y,BEE_MASS,this.color,fooVec.heading()));
                this.dead = true;
            }
            return;
        }
        fooVec.set(this.target.pos);
        fooVec.sub(this.pos);
        let a = fooVec.heading();
        this.angle = lerp(this.angle+(a-this.angle>PI ? TAU : a-this.angle<-PI ? -TAU : 0),a,0.1);
        fooVec.set(this.target.pos);
        let d = fooVec.dist(this.pos)-this.target.r;
        if(abs(d)<15){
            if(this.ill) this.target.ill = true;
            if(random()<0.2){
                let amount = random(1,4);
                this.target.r -= amount;
                fooVec.set(this.hive.pos);
                fooVec.add(HIVE_SIZE/2,HIVE_SIZE/2);
                fooVec.sub(this.pos);
                let ang = fooVec.heading();
                flares.push(new Flare(this.pos.x,this.pos.y,amount,this.target.color,ang));
                if(this.target.r<1) this.target.dead = true;
            }
        }
        fooVec.set(this.target.pos);
        fooVec.add(this.target.vel);
        let t = (fooVec.dist(this.pos)-this.target.r)/8;
        if(d>=15) t = min(3,t);
        this.pos.add(cos(this.angle)*t,sin(this.angle)*t);
        if(this.ill && random()<0.005) this.dead = true;
    }
}

function mouseClicked(){
    circles.push(new Circle(mouseX,mouseY));
}

function keyPressed(){
    if(key===' '){
        raining = !raining;
    }
}