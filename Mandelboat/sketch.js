const STEP = 0.05;
const DIST = 3;
const L = 40;
const R = 5;

function setup() {
	setVersion("Mandelboat v","20181213a");
	
	createCanvas(150,150);
	colorMode(HSB);
	noStroke();
	cam = PI;
	crossSec = -0.3;
}

function draw() {
	background(220);
	for(let i=0;i<width;i++) {
		for(let j=0;j<height;j++){
			let heading = p5.Vector.fromAngles(map(j,0,height,PI/4,3*PI/4),cam+map(i,0,width,PI/4,-PI/4),STEP);
			let p = createVector(-sin(cam),0,-cos(cam)).setMag(DIST);
			let c = 0;
			for(let k=0;k<2*DIST;k+=STEP){
				p.add(heading);
				let m = true;
				let zr = p.x;
				let zi = crossSec;
				let cr = p.y;
				let ci = p.z;
				for(let n=0;n<L;n++){
					let nr = sq(zr)-sq(zi);
					zi = 2*zr*zi;
					zr = nr;
					zr += cr;
					zi += ci;
					if(sqrt(sq(zr)+sq(zi))>R){
						m = false;
						break;
					}
				}
				if(m){
					c = color(mod(p.x+p.y+p.z,1)*360,90,90);
					break;
				}
			}
			fill(c);
			rect(i, j, 1, 1);
		}
	}
	cam += 0.1;
	cam %= 2*PI;
}

function mod(a,b){
	return (a%b+b)%b;
}