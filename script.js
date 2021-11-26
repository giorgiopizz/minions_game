var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var r = canvas.parentElement.getBoundingClientRect();
canvas.width = r.width;
canvas.height = r.height;
// var ballRadius = 10;
// var x = canvas.width / 2;
// var y = canvas.height - 30;

// var dx = 1;
// var dy = -1;
// var paddleHeight = 10;
// var paddleWidth = 75;
// var paddleX = (canvas.width - paddleWidth) / 2;
// var rightPressed = false;
// var leftPressed = false;
// var brickRowCount = 5;
// var brickColumnCount = 3;
// var brickWidth = 75;
// var brickHeight = 20;
// var brickPadding = 10;
// var brickOffsetTop = 30;
// var brickOffsetLeft = 30;
// var score = 0;



var tolerance = (canvas.width+canvas.height)/1000;
// var tolerance = 0;

// class Position {
// 	constructor (x, y) {
// 		this.x = x;
// 		this.y = y;
// 	}
// 	get position() {
// 		return (x,y);
// 	}
// }
var colorsForTeams = {
	0: "#FF0000",
	1: "#00FF00",
	2: "#0000FF"
} 

class Obj {
	constructor(team, x, y, shape, side, velocity, dirx, diry, life, defense, attack) {
		this.team = team;
		this.x = x;
		this.y = y;
		this.shape = shape;
		this.side = side;
		this.velocity = velocity;
		this.dirx = dirx;
		this.diry = diry;
		this.life = life;
		this.defense = defense;
		this.attack = attack;
	}
	move() {
			this.x += this.velocity * this.dirx ;
			this.y += this.velocity * this.diry ;
			// this.draw();
	}
	draw() {
		ctx.beginPath();
		if (this.shape == "rect") {
			ctx.rect(
				this.x - this.side / 2,
				this.y - this.side / 2,
				this.side,
				this.side
			);
		} else {
			ctx.arc(this.x, this.y, this.side, 0, Math.PI * 2);
		}
		ctx.fillStyle = colorsForTeams[this.team];
		ctx.fill();
		ctx.closePath();
	}
}

class Vector {
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
	norm(){
		var n = Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2));
		this.x /= n;
		this.y /= n;
	}
}

class ObjFollower {
	constructor(team, x, y, shape, side, velocity, life, defense, attack) {
		this.team = team;
		this.x = x;
		this.y = y;
		this.shape = shape;
		this.side = side;
		this.velocity = velocity;
		this.life = life;
		this.defense = defense;
		this.attack = attack;
	}
	move(objects){
			var objs = objects.filter((obj) => obj !== this);
			var objsDistances = objs.map((obj) => {
				return {
					obj: obj,
					distance: Math.sqrt(
						Math.pow(obj.x - this.x, 2) +
							Math.pow(obj.y - this.y, 2)
					),
				};
			});
			var nearests = objsDistances.sort((first, second) => {
				if (first.distance > second.distance) {
					return 1;
				} else {
					return -1;
				}
			});
			// if (nearests.length===0  ){
			// 	// this.x += this.velocity * t;
			// 	// this.y += this.velocity * t;
			// 	this.draw();
			// } 
			if (
				nearests.length !== 0
			) {
				var nearest = nearests[0];
				// if (this.shape==='ball' && nearest.obj.shape ==='ball' ||
				// var otherSide =
				// 	nearest.obj.shape === "ball"
				// 		? nearest.obj.side
				// 		: (Math.sqrt(2) * nearest.obj.side) / 2;
				if ( overlap(this, nearest.obj) || collision(this, nearest.obj) ) {
					// this.draw();
					// console.log(nearest.distance)
					// console.log("collision")
					if (nearest.obj.team !== this.team){
						fight(nearest.obj, this);
					}
					else{
						// should circumnavigate my teammate in order to get near the enemy (not easy)
						var newPos = {...this};

						// var dir = new Vector(nearest.obj.x-this.x, nearest.obj.y-this.y);
						var dir = new Vector(Math.random(), Math.random());
						dir.norm();
						newPos.x -= dir.x*this.velocity;
						newPos.y -= dir.y*this.velocity;

						// newPos.x += Math.random()*this.velocity;
						// newPos.y += Math.random()*this.velocity;
						// console.log(objs.filter(obj2=> overlap(newPos, obj2)))
						if (objs.filter(obj2=> overlap(newPos, obj2)).length===0){
							// clearInterval(interval)
								console.log("moved");
								this.x = newPos.x;
								this.y = newPos.y;
						}
						// while (objs.filter(obj2=> overlap(newPos, obj2)).length!==0){
						// 	console.log("New pos");
						// 	var dir = new Vector(Math.random(), Math.random());
						// 	dir.norm();
						// 	newPos.x -= dir.x*this.velocity;
						// 	newPos.y -= dir.y*this.velocity;
						// 	// newPos.x += dir.y*this.velocity;
						// 	// newPos.y += -dir.x*this.velocity;
						// }
						// this.x = newPos.x;
						// this.y = newPos.y;
					}
					return;
				}
	// 			 if (this.shape === "ball" && nearest.obj.shape === "rect")
	// 	// (obj2.shape === "ball" && obj1.shape === "rect")
	// 			{
	// 				// var ball = obj1.shape==='ball' ? obj1 : obj2;
	// 				// var rect = obj1.shape === "rect" ? obj1 : obj2;
	// 				var ball = this;
	// 				var rect = nearest.obj;
	// 				// where could they touch? vertical sides or horizonthal?
	// 				if (Math.abs(rect.x - ball.x) < Math.abs(rect.y - ball.y)){
	// 					//they touch on horizonthal sides
	// 					//fix position in y
	// 					if (rect.y>ball.y){
	// 						//maximum height in y for the ball is rect.y-rect.side
	// 						if(ball.y -tolerance >= rect.y-rect.side){
	// 							// can't move
	// 							this.draw();
	// 							return;
	// 						}
	// 					}
	// 					else{
	// 						//minimum height 
	// 						if( ball.y +tolerance<= rect.y + rect.side){
	// 							this.draw();
	// 							return;
	// 						}
	// 					}

	// 				} else if (Math.abs(rect.x - ball.x) > Math.abs(rect.y - ball.y)){
	// 					//they touch on vertical sides
	// 					if (rect.x>ball.x){
	// 						//maximum in x for the ball
	// 						if(ball.x - tolerance >rect.x-rect.side){
	// 							this.draw();
	// 							return;
	// 						}
	// 					}
	// 					else{
	// 						//minimum in x 
	// 						if(ball.x +tolerance<= rect.x + rect.side){
	// 							this.draw();
	// 							return;
	// 						}
	// 					}
	// 				}

	// }		
				var nearestsToFollow = nearests.filter((element) => element.obj.team !== this.team);
				if (nearestsToFollow.length!==0){
					// console.log(nearestsToFollow)
					var nearest = nearestsToFollow[0];
					var dirx = nearest.obj.x - this.x;
					var diry = nearest.obj.y - this.y;
					// console.log(nearest);
					var norm = Math.sqrt(Math.pow(dirx, 2) + Math.pow(diry, 2));
					dirx /= norm;
					diry /= norm;
					this.x += this.velocity * dirx;
					this.y += this.velocity * diry;
				}
				
			
			}
	}
	draw() {
		ctx.beginPath();
		if (this.shape == "rect") {
			ctx.rect(this.x, this.y, this.side, this.side);
		} else {
			ctx.arc(this.x, this.y, this.side, 0, Math.PI * 2);
		}
		ctx.fillStyle = colorsForTeams[this.team];
		ctx.fill();
		ctx.closePath();
	}
}


function overlap(obj1, obj2){
	var distance = Math.sqrt(
		Math.pow(obj1.x - obj2.x, 2) +
			Math.pow(obj1.y - obj2.y, 2));
	var otherSide =
	obj2.shape === "ball"
			? obj2.side
			: (Math.sqrt(2) * obj2.side) / 2;
	if (distance < obj1.side + otherSide ) {
		return true;
	}
	return false;
}
function collision(obj1, obj2){
	var distance = Math.sqrt(
		Math.pow(obj1.x - obj2.x, 2) +
			Math.pow(obj1.y - obj2.y, 2));
	var otherSide =
	obj2.shape === "ball"
			? obj2.side
			: (Math.sqrt(2) * obj2.side) / 2;
	if (distance+tolerance <= obj1.side + otherSide ) {
		return true;
	}
	return false;
}

function fight(obj1, obj2){
	if (Math.random()>0.5){
		// obj1 attacks obj2
		obj2.life -= obj1.attack/obj2.defense;
	}
	else{
		obj1.life -= obj2.attack/obj1.defense;
	}
}

// function collisionDistance(obj1, obj2){
// 	// WE DON'T WANT OBJECT OVERLAPPING!
// 	// the minimum distance they can have without really touching, given their position 
// 	if (obj1.shape==='ball' && obj2.shape ==='ball'){
// 		return (ob1.side+obj2.side);
// 	}
// 	else if (
// 		(obj1.shape === "ball" && obj2.shape === "rect")
// 		// (obj2.shape === "ball" && obj1.shape === "rect")
// 	){
// 		// var ball = obj1.shape==='ball' ? obj1 : obj2;
// 		// var rect = obj1.shape === "rect" ? obj1 : obj2;
// 		var ball = obj1;
// 		var rect = obj2;
// 		// where could they touch? vertical sides or horizonthal?
// 		if (Math.abs(rect.x - ball.x) < Math.abs(rect.y - ball.y)){
// 			//they touch on horizonthal sides
// 			//fix position in y
// 			if (rect.y>ball.y){
// 				//maximum height in y for the ball is rect.y-rect.side
// 				if(ball.y>== rect.y-rect.side){
// 					//proceed
// 				}
// 			}
// 			else{
// 				//minimum height 
// 				return rect.y + rect.side;
// 			}

// 		} else if (Math.abs(rect.x - ball.x) > Math.abs(rect.y - ball.y)){
// 			//they touch on vertical sides
// 			if (rect.x>ball.x){
// 				//maximum in x for the ball
// 				return rect.x-rect.side;
// 			}
// 			else{
// 				//minimum in x 
// 				return rect.x + rect.side;
// 			}
// 		}

// 	}
// 		// var distance = Math.sqrt(
// 		// 	Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2)
// 		// );

// }

function destroy(objects){
	var toBeRemoved = [];
	objects.forEach(obj=>{
		if (obj.x>canvas.width || obj.x<0 || obj.y>canvas.height || obj.y<0 || obj.life<=0){
			toBeRemoved.push(obj);
		}
	})
	objects = objects.filter(obj=> {
			if ( toBeRemoved.filter(element=> element===obj).length!==0){
				console.log("Removed");
				return false;
			}
			return true;
		});
	// console.log(objects)
	return objects;
}

// http://127.0.0.1:5500/
function main() {
	var offsetX = canvas.width/10;
	var posX = (canvas.width + 2 * offsetX) / 3;
	var posY = canvas.height-200;
	var size = ((canvas.width+canvas.height)/2)/14;
	var objects = [];
	const velocity = 1;
	objects.push(new Obj(0, offsetX, 100, "rect", size, 0, 0, 1, 1000, 10, 5));
	objects.push(new Obj(0, offsetX + posX, 100, "rect", size, 0, 1, 1, 1000, 10, 5));
	objects.push(new Obj(0, offsetX + 2 * posX, 100, "rect", size, 0, 1, 1, 1000, 10, 5));
	objects.push(new Obj(1, offsetX, posY, "rect", size, 0, 0, 1, 1000, 10, 5));
	objects.push(new Obj(1, offsetX + posX, posY, "rect", size, 0, 1, 1, 1000, 10, 5));
	objects.push(new Obj(1, offsetX + 2 * posX, posY, "rect", size, 0, 1, 1, 1000, 10, 5));

	var newPosX = 0;
	var newPosY = 0;
	var team = 0;
	document.addEventListener("mousemove", mouseMoveHandler, false);
	document.addEventListener("click", mouseClickHandler, false);
	function mouseMoveHandler(e) {
		var relativeX = e.clientX - canvas.offsetLeft;
		var relativeY = e.clientY - canvas.offsetTop;
		if (relativeX > 0 && relativeX < canvas.width &&
			relativeY > 0 && relativeY < canvas.height
			) {
			newPosX = relativeX ;
			newPosY = relativeY;
		}
	}
	function mouseClickHandler(e) {
		if (team ===0){
			team = 1;
			objects.push(
				new ObjFollower(0, newPosX, newPosY, "ball", size / 5, velocity, 100, 20, 1)
			);
		}
		else{
			team = 0;
			objects.push(
				new ObjFollower(1, newPosX, newPosY, "ball", size / 5, velocity, 100, 20, 1)
			);
		}
	}

	// objects.push(
	// 	new ObjFollower(0, offsetX + posX, 300, "ball", size / 5, velocity)
	// );
	// objects.push(
	// 	new ObjFollower(
	// 		1,
	// 		offsetX + posX,
	// 		posY - 300,
	// 		"ball",
	// 		size / 5,
	// 		velocity/1.001
	// 	)
	// );
	var t = 0
	function animation() {
		t += 1;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		objects.forEach((element) => {
			if (element instanceof ObjFollower) {
				element.move(objects);
			} else {
				element.move();
			}
			element.draw();
		});
		objects = destroy(objects);
		// if (objects.length===0){

		ctx.font = "16px Arial";
			ctx.fillStyle = "#0095DD";
			ctx.fillText(`Time: ${t}`, 30, 50);
		if (t === 20000 || objects.length===0) {
			clearInterval(interval);
		}
		// console.log(objects)
	}
	var interval = setInterval(animation, 1);
}

main();

// var bricks = [];
// for (var c = 0; c < brickColumnCount; c++) {
// 	bricks[c] = [];
// 	for (var r = 0; r < brickRowCount; r++) {
// 		bricks[c][r] = { x: 0, y: 0, status: 1 };
// 	}
// }

// document.addEventListener("keydown", keyDownHandler, false);
// document.addEventListener("keyup", keyUpHandler, false);

// function keyDownHandler(e) {
// 	if (e.key == "Right" || e.key == "ArrowRight") {
// 		rightPressed = true;
// 	} else if (e.key == "Left" || e.key == "ArrowLeft") {
// 		leftPressed = true;
// 	}
// }

// function keyUpHandler(e) {
// 	if (e.key == "Right" || e.key == "ArrowRight") {
// 		rightPressed = false;
// 	} else if (e.key == "Left" || e.key == "ArrowLeft") {
// 		leftPressed = false;
// 	}
// }


// function collisionDetection() {
// 	for (var c = 0; c < brickColumnCount; c++) {
// 		for (var r = 0; r < brickRowCount; r++) {
// 			var b = bricks[c][r];
// 			if (b.status == 1) {
// 				if (
// 					x > b.x &&
// 					x < b.x + brickWidth &&
// 					y > b.y &&
// 					y < b.y + brickHeight
// 				) {
// 					dy = -dy;
// 					b.status = 0;
// 					score++;
// 					if (score == brickRowCount * brickColumnCount) {
// 						alert("YOU WIN, CONGRATS!");
// 						document.location.reload();
// 						clearInterval(interval); // Needed for Chrome to end game
// 					}
// 				}
// 			}
// 		}
// 	}
// }

// function drawBall() {
// 	ctx.beginPath();
// 	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
// 	ctx.fillStyle = "#0095DD";
// 	ctx.fill();
// 	ctx.closePath();
// }
// function drawPaddle() {
// 	ctx.beginPath();
// 	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
// 	ctx.fillStyle = "#0095DD";
// 	ctx.fill();
// 	ctx.closePath();
// }
// function drawBricks() {
// 	for (var c = 0; c < brickColumnCount; c++) {
// 		for (var r = 0; r < brickRowCount; r++) {
// 			if (bricks[c][r].status == 1) {
// 				var brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
// 				var brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
// 				bricks[c][r].x = brickX;
// 				bricks[c][r].y = brickY;
// 				ctx.beginPath();
// 				ctx.rect(brickX, brickY, brickWidth, brickHeight);
// 				ctx.fillStyle = "#0095DD";
// 				ctx.fill();
// 				ctx.closePath();
// 			}
// 		}
// 	}
// }
// function drawScore() {
// 	ctx.font = "16px Arial";
// 	ctx.fillStyle = "#0095DD";
// 	ctx.fillText("Score: " + score, 8, 20);
// }

// function draw() {
// 	ctx.clearRect(0, 0, canvas.width, canvas.height);
// 	drawBricks();
// 	drawBall();
// 	drawPaddle();
// 	drawScore();
// 	collisionDetection();

// 	if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
// 		dx = -dx;
// 	}
// 	if (y + dy < ballRadius) {
// 		dy = -dy;
// 	} else if (y + dy > canvas.height - ballRadius) {
// 		if (x > paddleX && x < paddleX + paddleWidth) {
// 			dy = -dy;
// 		} else {
// 			alert("GAME OVER");
// 			document.location.reload();
// 			clearInterval(interval); // Needed for Chrome to end game
// 		}
// 	}

// 	if (rightPressed && paddleX < canvas.width - paddleWidth) {
// 		paddleX += 7;
// 	} else if (leftPressed && paddleX > 0) {
// 		paddleX -= 7;
// 	}

// 	x += dx;
// 	y += dy;
// }
// draw();
// // var interval = setInterval(draw, 1);
