let canvas;
let ctx;

let player = { x:500, y:0, w:64, h:64, speed_x:0, speed_y:0, landed:false, has_worm: false};
let ctrls = { up:false, down:false, left:false, right:false };
let nest = {x:940, y:500, w:64, h:128 };
let trees = [
	{x:32, y:32, w:64, h:128},
	{x:32, y:320, w:64, h:128},
	{x:320, y:320, w:64, h:128}
];

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
}

function run() {
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

	if (ctrls.up) { player.speed_x = 0; player.speed_y = -1; }
	if (ctrls.down) { player.speed_x = 0; player.speed_y = 1; }
	if (ctrls.left) { player.speed_x = -1; player.speed_y = 0; }
	if (ctrls.right) { player.speed_x = 1; player.speed_y = 0; }

	// move objects
	player.x += player.speed_x;
	player.y += player.speed_y;

	// check and handle collisions
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

	if (player.x < nest.x+nest.w && player.x+player.w > nest.x && player.y < nest.y+nest.h && player.y+player.h > nest.y) {
		if (!player.landed) {
			player.x = nest.x; player.y=nest.y;
			player.speed_x = 0; player.speed_y = 0;
			player.landed = true;
		}
	}

}

function render() {
	// draw background
	canvas.style.width = window.innerWidth;
	canvas.style.height = window.innerHeight;

	ctx.fillStyle = "green";
	ctx.fillRect(0,0,1280,720);

	// draw objects
	ctx.fillStyle = "dodgerblue";
	trees.forEach( t => ctx.fillRect(t.x, t.y, t.w, t.h) );
	ctx.fillStyle = "blue";
	ctx.fillRect(nest.x, nest.y, nest.w, nest.h);

	// draw sprites
	ctx.fillStyle = "brown";
	ctx.fillRect(player.x,player.y,player.w,player.h);

	if (player.landed) {
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,16,16);
	}

}

init();
run();