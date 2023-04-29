// canvas drawing data
let canvas;
let ctx;

// engine data
let frame;
let time;

// game data
let player = { x:500, y:0, w:128, h:128, speed_x:0, speed_y:0, landed:false, has_worm: false, score:0, speed:2 };
let ctrls = { up:false, down:false, left:false, right:false };
let nest = {x:1280-512, y:720-128, w:512, h:128 };
let trees = [
	{x:32, y:32, w:128, h:256},
	{x:32, y:320, w:128, h:256},
	{x:320, y:320, w:128, h:256}
];
let worms = [];

// images
let tex_grass = new Image();
let tex_tree_green = new Image();
let tex_bird = new Image();
let tex_bird_up = new Image();
let tex_bird_down = new Image();
let tex_bird_left = new Image();
let tex_bird_right = new Image();
let tex_birdw_up = new Image();
let tex_birdw_down = new Image();
let tex_birdw_left = new Image();
let tex_birdw_right = new Image();
let tex_worm = new Image();
let tex_nest = new Image();
let tex_chicks = new Image();

function update_bird_sprite() {
	if (!player.landed) {
		if (player.has_worm) {
			if (player.speed_y < 0) {
				tex_bird = tex_birdw_up;
			} else if (player.speed_y > 0) {
				tex_bird = tex_birdw_down;
			} else if (player.speed_x < 0) {
				tex_bird = tex_birdw_left;
			} else if (player.speed_x > 0) {
				tex_bird = tex_birdw_right;
			}
		} else {
			if (player.speed_y < 0) {
				tex_bird = tex_bird_up;
			} else if (player.speed_y > 0) {
				tex_bird = tex_bird_down;
			} else if (player.speed_x < 0) {
				tex_bird = tex_bird_left;
			} else if (player.speed_x > 0) {
				tex_bird = tex_bird_right;
			}
		}
	}
}

function read_controls(e) {
	if (e.type == "keydown") {
		switch(e.keyCode) {
			case 87: 	// 87 = W
				ctrls.up = true;
				break;
			case 83: 	// 83 = S
				ctrls.down = true;
				break;
			case 65: 	// 65 = A
				ctrls.left = true;
				break;
			case 68: 	// 68 = D
				ctrls.right = true;
				break;
		}
	} else if (e.type == "keyup") {
		switch(e.keyCode) {
			case 87:
				ctrls.up = false;
				break;
			case 83:
				ctrls.down = false;
				break;
			case 65: 
				ctrls.left = false;
				break;
			case 68:
				ctrls.right = false;
				break;
		}
	}
}

function init() {
	// set up screen
	canvas = document.getElementsByTagName("canvas")[0];
	ctx = canvas.getContext("2d");

	canvas.width = 1280;
	canvas.height = 720;

	// set up controls
	window.onkeydown = function(e) { read_controls(e) };
	window.onkeyup = function(e) { read_controls(e) };

	// set frame counter
	frame=0;

	// load images
	tex_grass.src = "img/grass.png";
	tex_tree_green.src = "img/tree_green.png";
	tex_bird_up.src = "img/bird_up.png";
	tex_bird_down.src = "img/bird_down.png";
	tex_bird_left.src = "img/bird_left.png";
	tex_bird_right.src = "img/bird_right.png";
	tex_birdw_up.src = "img/birdw_up.png";
	tex_birdw_down.src = "img/birdw_down.png";
	tex_birdw_left.src = "img/birdw_left.png";
	tex_birdw_right.src = "img/birdw_right.png";	
	tex_bird = tex_bird_up;
	tex_worm.src = "img/worm.png";
	tex_nest.src = "img/nest.png";
	tex_chicks.src = "img/chicks.png";
}

function run() {
	frame++;
	update();
	render();
	window.requestAnimationFrame(run);
}

function update() {
	// read controls
	if (player.landed) {
		if (ctrls.up) { player.y -= player.h; player.landed = false; }
		if (ctrls.down) { player.y += player.h*2; player.landed = false; }
		if (ctrls.left) { player.x -= player.w; player.landed = false; }
		if (ctrls.right) { player.x += player.w; player.landed = false; }
	}

	if (ctrls.up) { player.speed_x = 0; player.speed_y = -player.speed; }
	if (ctrls.down) { player.speed_x = 0; player.speed_y = player.speed;}
	if (ctrls.left) { player.speed_x = -player.speed; player.speed_y = 0;}
	if (ctrls.right) { player.speed_x = player.speed; player.speed_y = 0;}

	// move objects
	player.x += player.speed_x;
	player.y += player.speed_y;
	update_bird_sprite();

	// check if a worm should be generated
	if (worms.length < 10 && frame % 300 == 0) {
		worms.push( {x:Math.random()*1280,y:Math.random()*720,w:32,h:64,eaten:false} );
	}

	// check and handle collisions with trees
	trees.forEach(t => {
		// lol box collision
		if (player.x < t.x+t.w && player.x+player.w > t.x && player.y < t.y+t.h && player.y+player.h > t.y) {
			if (!player.landed) {
				player.x = t.x; player.y=t.y;
				player.speed_x = 0; player.speed_y = 0;
				player.landed = true;
			}
		}
	})

	// check for collision with worms
	if (!player.has_worm) {
		worms.forEach( w => {
			if (player.x < w.x+w.w && player.x+player.w > w.x && player.y < w.y+w.h && player.y+player.h > w.y) {
				w.eaten = true;
				player.has_worm = true;
			}
		});
	}

	// remove the worm that got picked up, if any
	worms = worms.filter( w => !w.eaten );

	// check for collision on the nest
	if (player.x < nest.x+nest.w && player.x+player.w > nest.x && player.y < nest.y+nest.h && player.y+player.h > nest.y) {
		if (player.has_worm) { player.score++; player.has_worm=false;}
		tex_bird = tex_bird_up;
		player.x = nest.x + 250;
		player.y = nest.y-player.h;
		player.speed_x = 0;
		player.speed_y = -player.speed;
	}
}

function render() {
	// draw background
	canvas.style.width = window.innerWidth;
	canvas.style.height = window.innerHeight;

	// draw grass
	for (let j=0; j<5; j++) {
		for(let i=0; i<10; i++) {
			ctx.drawImage(tex_grass,128*i,166*j,128,166);
		};
	}

	// draw trees
	trees.forEach( t => ctx.drawImage(tex_tree_green,t.x,t.y,t.w,t.h) );
		
	// draw worms
	worms.forEach( w => ctx.drawImage(tex_worm, w.x, w.y, w.w, w.h) );

	// draw player
	ctx.drawImage(tex_bird, player.x, player.y, player.w, player.h);

	//draw nest
	ctx.drawImage(tex_chicks, nest.x+250, nest.y-90);
	ctx.drawImage(tex_nest, nest.x, nest.y, nest.w, nest.h);

	// draw hud
	ctx.font = "32px Consolas";
	ctx.fillStyle = "white";
	ctx.fillText("SCORE:"+player.score /*+" FRAMES:"+Math.floor(((frame/30)%3))*/, 32, 700);
}

init();
run();