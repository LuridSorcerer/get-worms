let canvas;
let ctx;

let frame;
let time;
let player = { x:500, y:0, w:64, h:64, speed_x:0, speed_y:0, landed:false, has_worm: false, score:0, speed:2 };
let ctrls = { up:false, down:false, left:false, right:false };
let nest = {x:1280-512, y:720-128, w:512, h:128 };
let trees = [
	{x:32, y:32, w:64, h:128},
	{x:32, y:320, w:64, h:128},
	{x:320, y:320, w:64, h:128}
];
let worms = [];

function read_controls(e) {
	// 87 = W
	// 83 = S
	// 65 = A
	// 68 = D
	if (e.type == "keydown") {
		switch(e.keyCode) {
			case 87:
				ctrls.up = true;
				break;
			case 83:
				ctrls.down = true;
				break;
			case 65: 
				ctrls.left = true;
				break;
			case 68:
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
		if (ctrls.left) { player.x -= player.w; player.landed = false;  }
		if (ctrls.right) { player.x += player.w; player.landed = false;  }

	}

	if (ctrls.up) { player.speed_x = 0; player.speed_y = -player.speed; }
	if (ctrls.down) { player.speed_x = 0; player.speed_y = player.speed; }
	if (ctrls.left) { player.speed_x = -player.speed; player.speed_y = 0; }
	if (ctrls.right) { player.speed_x = player.speed; player.speed_y = 0; }

	// move objects
	player.x += player.speed_x;
	player.y += player.speed_y;

	// check if a worm should be generated
	if (worms.length < 10 && frame % 300 == 0) {
		worms.push( {x:Math.random()*1280,y:Math.random()*720,w:8,h:24,eaten:false} );
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

	worms = worms.filter( w => !w.eaten );

	// check for collision on the nest
	if (player.x < nest.x+nest.w && player.x+player.w > nest.x && player.y < nest.y+nest.h && player.y+player.h > nest.y) {
		if (player.has_worm) { player.score++; player.has_worm=false;}
		player.x = nest.x;
		player.y = nest.y-player.h;
		player.speed_x = 0;
		player.speed_y = -player.speed;
	}

}

function render() {
	// draw background
	canvas.style.width = window.innerWidth;
	canvas.style.height = window.innerHeight;

	ctx.fillStyle = "green";
	ctx.fillRect(0,0,1280,720);

	// draw trees
	ctx.fillStyle = "dodgerblue";
	trees.forEach( t => ctx.fillRect(t.x, t.y, t.w, t.h) );
	
	//draw nest
	ctx.fillStyle = "blue";
	ctx.fillRect(nest.x, nest.y, nest.w, nest.h);

	// draw worms
	ctx.fillStyle = "purple";
	worms.forEach( w => ctx.fillRect(w.x, w.y, w.w, w.h) );

	// draw player
	if (player.has_worm)
		ctx.fillStyle = "darkbrown";
	else 
		ctx.fillStyle = "brown";
	ctx.fillRect(player.x,player.y,player.w,player.h);

	// draw hud
	ctx.font = "32px Consolas";
	ctx.fillStyle = "white";
	ctx.fillText("SCORE:"+player.score+" FRAMES:"+Math.floor(((frame/30)%3)), 32, 700);
}

init();
run();