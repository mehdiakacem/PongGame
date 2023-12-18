const   canvas = document.getElementById("pong");
const   context = canvas.getContext("2d");

// create the user paddle
const user = {
    x : 0,
    y : canvas.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "#D74646",
    score : 0,
}

// create the com paddle
const com = {
    x : canvas.width - 10,
    y : canvas.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "#D74646",
    score : 0,
}

// create the ball
const ball = {
    x : canvas.width / 2,
    y : canvas.height/2,
    radius : 10,
    speed : 5,
    velocityX : 5,
    velocityY : 5,
    color : "white",
}

// create the net
const net = {
    x : canvas.width/2 - 2/2,
    y : 0,
    width : 2,
    height : 10,
    color : "#D74646",
}

// draw the net 
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// draw rect function
function drawRect(x, y, w, h, color){
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

// draw circle function
function drawCircle(x, y, r, color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2, false);
    context.closePath();
    context.fill();
}

// draw text function
function drawText(text, x, y,  color){
    context.fillStyle = color;
    context.font = "75px Bayon";
    context.fillText(text, x, y);
}

let paddleColor = "#D74646";
let boardColor = "#2F2F2F"

let rectX = 0;

// collision detection
function collision(b, p){
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

// control the user paddle
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt){
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height /2;

}

// reset ball
function resetBall(){
    ball.speed = 5;
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
}

// update : pos, mov, score
function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // AI to control the com paddle
    let computerLevel = 0.1;
    com.y += (ball.y - (com.y + com.height/2)) * computerLevel;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY;
    }
    let player = (ball.x < canvas.width/2) ? user : com;
    if (collision(ball, player)){
        // where the ball hit the player
        let collidePoint = ball.y - (player.y + player.height/2);

        // normalization
        collidePoint = collidePoint / (player.height/2);

        // calculate angle in Radian
        let angleRad = (Math.PI/4) * collidePoint;

        // X direction of the ball
        let direction = (ball.x < canvas.width/2) ? 1 : -1;

        // change vel X and Y
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY =             ball.speed * Math.sin(angleRad);

        // encrese speed
        ball.speed += 0.5;
    }

    // update the score
    if (ball.x - ball.radius < 0){
        resetBall();
        com.score++;
    }else if (ball.x + ball.radius > canvas.width){
        user.score++;
        resetBall();
    }
}

// render the game
function render(){
    drawRect(0, 0, canvas.width, canvas.height, boardColor);
    drawText(user.score, canvas.width/4, canvas.height/5, "white");
    drawText(com.score, 3*canvas.width/4, canvas.height/5, "white");
    drawNet();
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

}

// game init
function game(){
    update();
    render();
}

// loop
const framePerSecond = 50;
setInterval(game, 1000/framePerSecond);

