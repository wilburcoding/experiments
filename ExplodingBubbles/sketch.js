const VERSION = "20181129a";

function setup() {
    setVersion("Exploding Bubbles v",VERSION);

    createCanvas(document.body.clientWidth, document.body.clientHeight);
    circles = [];
    flares = [];
    raining = false;
    fooVec = createVector();
}

function draw() {
    background(220);
    for(let c of circles){
        c.update();
        let p = c.pos;
        let cl = c.color;
        stroke(cl);
        fill(red(cl),green(cl),blue(cl),50);
        ellipse(p.x,p.y,2*c.r);
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
        ellipse(p.x,p.y,4);
    }
    for(let i=circles.length-1;i>=0;i--){
        if(circles[i].dead) circles.splice(i,1);
    }
    for(let i=flares.length-1;i>=0;i--){
        if(flares[i].dead) flares.splice(i,1);
    }
    if(circles.length<40 && random()<0.005) circles.push(new Circle());
    if(raining){
        if(random()<0.2) flares.push(new Flare(random(width),0,random(1,5),color(random(255),random(255),random(255)),PI/2));
        if(random()<0.00045) raining = false;
    }else if(random()<0.0001) raining = true;
}

class Circle{
    constructor(x,y){
        let r = this.r = random(8,40);
        if(x===undefined) x = random(r,width-r);
        if(y===undefined) y = random(r,height-r);
        this.pos = createVector(x,y);
        this.vel = p5.Vector.random2D().mult(random(1,4));
        this.color = color(random(255),random(255),random(255));
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
                    this.dead = true;
                    return;
                }
            }
        }
        let s = r/sqrt(width*height);
        if(random()<pow(s,3.5)){
            let n = 0;
            while(n<r){
                let l = r-n;
                let m = random(1,5);
                m = min(l,m);
                flares.push(new Flare(p.x,p.y,m,this.color));
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
                if(d<0 && random()<0.03){
                    this.r += f.m;
                    f.dead = true;
                }
            }
        }
    }
}

class Flare{
    constructor(x,y,m,c,a){
        this.pos = createVector(x,y);
        if(a!==undefined){
            this.vel = createVector(3);
            this.vel.rotate(a);
        }else this.vel = p5.Vector.random2D().mult(3);
        this.m = m;
        this.color = c;
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

function mouseClicked(){
    circles.push(new Circle(mouseX,mouseY));
}