var GravityBubbles = (function(){
	const VERSION = "20201218a";
	setVersion("Gravity Bubbles v",VERSION);

	let canvas = document.createElement('canvas');
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	canvas.style.position = 'absolute';
	canvas.style.top = '0px';
	canvas.style.left = '0px';
	document.body.appendChild(canvas);

	let ctx = canvas.getContext('2d');

	const RAND_VEL_RANGE = 3;
	const RAND_SIZE_MIN = 10;
	const RAND_SIZE_MAX = 20;
	const ATTRACTION_COEFFICIENT = 0.05;
	const REPULSION_COEFFICIENT = 0.03;
	const CENTER_REPULSION_COEFFICIENT = 0.05;

	let bubbles = [];

	function rand_int(min, max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function rand_float(min, max){
		return Math.random() * (max - min) + min;
	}

	function rand_color(){
		let str = '#';
		for(let i = 0; i < 6; i++){
			str += rand_int(0,15).toString(16);
		}
		return str;
	}

	class Vector{
		constructor(x,y){
			this.x = x;
			this.y = y;
		}

		dist(x_or_vec,y){
			if(x_or_vec instanceof Vector)
				return Math.hypot(this.x - x_or_vec.x, this.y - x_or_vec.y);
			else if(x_or_vec !== undefined && y !== undefined)
				return Math.hypot(this.x - x_or_vec, this.y - y);
		}

		angle(){
			return Math.atan2(this.y, this.x);
		}

		magnitude(){
			return Math.hypot(this.x, this.y);
		}

		mult(scaler){
			this.x *= scaler;
			this.y *= scaler;
		}

		set_magnitude(value){
			this.mult(value / this.magnitude());
		}

		set_angle(theta){
			const m = this.magnitude();
			this.x = Math.cos(theta) * m;
			this.y = Math.sin(theta) * m;
		}

		rotate(alpha){
			this.set_angle(this.angle() + alpha);
		}
	}

	class Bubble{
		constructor(x,y,r,fc,sc,vx,vy){
			this.pos = new Vector(x, y);
			this.size = r;
			this.fill_color = fc;
			this.stroke_color = sc;
			this.vel = new Vector(vx, vy);
		}
	}

	canvas.onclick = function(e){
		let canvas_rect = canvas.getBoundingClientRect();
		let mouse_x = e.clientX - canvas_rect.left;
		let mouse_y = e.clientY - canvas_rect.top;

		bubbles.push(new Bubble(mouse_x, mouse_y, rand_int(RAND_SIZE_MIN, RAND_SIZE_MAX), rand_color(), rand_color(), rand_float(-RAND_VEL_RANGE, RAND_VEL_RANGE), rand_float(-RAND_VEL_RANGE, RAND_VEL_RANGE)));
	};

	function render(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for(let i=0; i < bubbles.length; i++){
			let b = bubbles[i];
			ctx.fillStyle = b.fill_color;
			ctx.strokeStyle = b.stroke_color;
			ctx.beginPath();
			ctx.arc(b.pos.x, b.pos.y, b.size, 0, 2*Math.PI);
			ctx.fill();
			ctx.stroke();
		}
	}

	function step(){
		for(let i = 0; i < bubbles.length; i++){
			let b = bubbles[i];
			if(b.pos.x - b.size < 0)
				b.vel.x += Math.pow(1.1, -(b.pos.x - b.size));
			if(b.pos.x + b.size > canvas.width)
				b.vel.x -= Math.pow(1.1, b.pos.x + b.size - canvas.width);
			if(b.pos.y - b.size < 0)
				b.vel.y += Math.pow(1.1, -(b.pos.y - b.size));
			if(b.pos.y + b.size > canvas.height)
				b.vel.y -= Math.pow(1.1, b.pos.y + b.size - canvas.height);
			for(let j = i+1; j < bubbles.length; j++){
				let b1 = bubbles[j];
				let dist = b.pos.dist(b1.pos);
				let attraction = new Vector(b.pos.x - b1.pos.x, b.pos.y - b1.pos.y);
				attraction.set_magnitude(-ATTRACTION_COEFFICIENT * Math.pow(0.99, dist));
				let repulsion = new Vector(attraction.x, attraction.y);
				if(dist < b.size + b1.size)
					repulsion.set_magnitude(-REPULSION_COEFFICIENT * Math.pow(1.2, b.size + b1.size - dist));
				else
					repulsion.mult(0);
				b.vel.x += (attraction.x + repulsion.x);
				b.vel.y += (attraction.y + repulsion.y);
				b1.vel.x -= (attraction.x + repulsion.x);
				b1.vel.y -= (attraction.y + repulsion.y);
				if(dist < (b.size + b1.size + 5)){
					b.vel.x += (b1.vel.x - b.vel.x) * 0.005;
					b.vel.y += (b1.vel.y - b.vel.y) * 0.005;
					b1.vel.x += (b.vel.x - b1.vel.x) * 0.005;
					b1.vel.y += (b.vel.y - b1.vel.y) * 0.005;
				}
			}
			let center_dist = b.pos.dist(canvas.width / 2, canvas.height / 2);
			let center_repulsion = new Vector(b.pos.x - canvas.width / 2, b.pos.y - canvas.height / 2);
			center_repulsion.set_magnitude(CENTER_REPULSION_COEFFICIENT * Math.pow(0.99, center_dist));
			b.vel.x += center_repulsion.x;
			b.vel.y += center_repulsion.y;
		}
		for(let i = bubbles.length - 1; i >= 0; i--){
			let b = bubbles[i];
			if(Math.abs(b.vel.x) > 40)
				b.vel.x *= 0.75;
			if(Math.abs(b.vel.y) > 40)
				b.vel.y *= 0.75;
			b.pos.x += b.vel.x;
			b.pos.y += b.vel.y;
			if(isNaN(b.pos.x) || isNaN(b.pos.y))
				bubbles.splice(i,1);
		}
		render();
	}

	function get_canvas(){
		return canvas;
	}

	function reset(){
		bubbles = [];
	}

	let frame_loop;
	
	function run(){
		frame_loop = setInterval(step, 30);
	}

	function stop(){
		clearInterval(frame_loop);
	}

	run();

	return {step, run, stop, get_canvas, reset};
})();