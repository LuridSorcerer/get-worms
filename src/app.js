// canvas drawing data
let canvas;
let ctx;

// engine data
let frame;
let time;
let state;

// game data
let player = { x:5000, y:0, w:128, h:128, speed_x:0, speed_y:0, landed:false, has_worm: false, score:0, speed:2 };
let ctrls = { up:false, down:false, left:false, right:false };
let nest = {x:1280-512, y:720-128, w:512, h:128 };
let trees = [
    { "x": 250, "y": -32, "w": 128, "h": 256 },
    { "x": 0, "y": 240, "w": 128, "h": 256 },
    { "x": 200, "y": 500, "w": 128, "h": 256 },
    { "x": 1000, "y": 0, "w": 128, "h": 256 },
    { "x": 1182, "y": 276, "w": 128, "h": 256 }
];
let worms = [];

// images
let tex_grass = new Image();
let tex_tree_green = new Image();
let tex_tree_pink = new Image();
let tex_bird = new Image();
let tex_bird_up = new Image();
let tex_bird_down = new Image();
let tex_bird_left = new Image();
let tex_bird_right = new Image();
let tex_birdw_up = new Image();
let tex_birdw_down = new Image();
let tex_birdw_left = new Image();
let tex_birdw_right = new Image();
let tex_bird_landed = new Image();
let tex_bird_landed_end = new Image();
let tex_birdw_landed = new Image();
let tex_worm = new Image();
let tex_nest = new Image();
let tex_chicks = new Image();
let tex_chicks_1 = new Image();
let tex_chicks_2 = new Image();
let tex_chicks_3 = new Image();
let tex_title = new Image();

// audio
let music = new Audio("ogg/music.ogg");

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
	} else {
		if (player.has_worm) {
			tex_bird = tex_birdw_landed;
		} else {
			tex_bird = tex_bird_landed;
		}
	}
}

function read_controls(e) {
	if (e.type == "keydown") {
		switch(e.keyCode) {
			case 87: 	// 87 = W
			case 38: 	// 38 = up arrow
				ctrls.up = true;
				break;
			case 83: 	// 83 = S
			case 40:	// 40 = down arrow
				ctrls.down = true;
				break;
			case 65: 	// 65 = A
			case 37:	// 37 = left arrow
				ctrls.left = true;
				break;
			case 68: 	// 68 = D
			case 39: 	// 39 = right arrow
				ctrls.right = true;
				break;
		}
	} else if (e.type == "keyup") {
		switch(e.keyCode) {
			case 87:
			case 38: 	// 38 = up arrow
				ctrls.up = false;
				break;
			case 83:
			case 40:	// 40 = down arrow				
				ctrls.down = false;
				break;
			case 65: 
			case 37:	// 37 = left arrow			
				ctrls.left = false;
				break;
			case 68:
			case 39: 	// 39 = right arrow				
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

	// start timing frames
	last_frame_time = 0;

	// load images
	tex_grass.src = "img/grass.png";
	tex_tree_green.src = "img/tree_green.png";
	tex_tree_pink.src = "img/tree_pink.png";
	tex_bird_up.src = "img/bird_up.png";
	tex_bird_down.src = "img/bird_down.png";
	tex_bird_left.src = "img/bird_left.png";
	tex_bird_right.src = "img/bird_right.png";
	tex_birdw_up.src = "img/birdw_up.png";
	tex_birdw_down.src = "img/birdw_down.png";
	tex_birdw_left.src = "img/birdw_left.png";
	tex_birdw_right.src = "img/birdw_right.png";	
	tex_bird_landed.src = "img/bird_landed.png";	
	tex_bird_landed_end.src = "img/bird_landed_end.png";	
	tex_birdw_landed.src = "img/birdw_landed.png";	
	tex_bird = tex_bird_up;
	tex_worm.src = "img/worm.png";
	tex_nest.src = "img/nest.png";
	tex_chicks.src = "img/chicks.png";
	tex_chicks_1.src = "img/chicks_1.png";
	tex_chicks_2.src = "img/chicks_2.png";
	tex_chicks_3.src = "img/chicks_3.png";
	tex_title.src = "img/title.png";

	// start in title screen mode
	state = 0;
}

function run() {
	frame++;
	update();
	render();
	window.requestAnimationFrame(run);
}

function update() {

	// title screen
	if (state==0) {

		// check if any button is pressed
		if ( ctrls.up == true || ctrls.down == true || ctrls.left == true || ctrls.right == true ) {
				// reset controls
				ctrls.up == false;
				ctrls.down == false;
				ctrls.left == false;
				ctrls.right == false;

				// start music
				music.loop = true;
				music.play();

				// move player onscreen
				player.x = 1000;
				player.y = 650;

				// advance to game state
				state = 1;	
			 }
	}

	// main game state
	if (state==1) {

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
		if (worms.length < 5 && frame % 300 == 0) {
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

		// check if the game is over
		if (player.score == 3) {
			// kick the player off the screen and keep them from moving
			player.x = 65535;
			player.speed = 0; 

			// set game state
			state = 2;
		}
	}

	// end of game or unrecognized state
	else {

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

	// draw title screen if we are in that state
	if (state == 0) {
		ctx.drawImage(tex_title,0,0);
	} else {
		// draw trees
		trees.forEach( (t,i) => {
			if (i%2==1)
				ctx.drawImage(tex_tree_green,t.x,t.y,t.w,t.h) 
			else 
				ctx.drawImage(tex_tree_pink,t.x,t.y,t.w,t.h) 
		});
			
		// draw worms
		worms.forEach( w => ctx.drawImage(tex_worm, w.x, w.y, w.w, w.h) );

		// draw player
		ctx.drawImage(tex_bird, player.x, player.y, player.w, player.h);

		//draw nest
		switch(player.score) {
			case 0:
				ctx.drawImage(tex_chicks, nest.x+250, nest.y-90);
				break;
			case 1:
				ctx.drawImage(tex_chicks_1, nest.x+250, nest.y-90);
				break;
			case 2:
				ctx.drawImage(tex_chicks_2, nest.x+250, nest.y-90);
				break;
			default:
				ctx.drawImage(tex_chicks_3, nest.x+250, nest.y-90);
				break;
		}
		ctx.drawImage(tex_nest, nest.x, nest.y, nest.w, nest.h);

	}

	// if game complete, draw player on the branch 
	if (state == 2) {
		ctx.drawImage(tex_bird_landed_end, nest.x, nest.y-125);
	}

}

init();
run();