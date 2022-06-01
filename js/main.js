var canvas;
var canvasCtx;

let ballX = 0;
let ballY = 0;
let ballXSpeed = 10;
let ballYSpeed = 10;
let leftPaddleY = 0;
let rightPaddleY = 0;
let rightPaddleSpeed = 10;
let accuracyVal = 10;
let playerScore = 0;
let computerScore = 0;
let showingWinScreen = false;
const PADDLE_HEIGHT = 100;
const WINNING_SCORE = 3;

window.onload = function(){
    canvas = document.querySelector('#gameCanvas');
    canvasCtx = canvas.getContext('2d');
    drawEverything();
    drawEverything();
    drawEverything();

    let fps = 30;
    setInterval(()=>{
        moveEverything();
        drawEverything();
    }, 1000/fps);

    document.addEventListener('mousemove', function(e){
        var rect = canvas.getBoundingClientRect();
        var root = document.documentElement;
        var mouseX = e.clientX - rect.left - root.scrollLeft;
        var mouseY = e.clientY - rect.top - root.scrollTop;
        leftPaddleY = mouseY-(PADDLE_HEIGHT/2);
    });

    document.addEventListener('mouseup', function(e){
        playerScore = 0;
        computerScore = 0;
        showingWinScreen = false;
    });
}

function resetBall(){
    if(playerScore >= WINNING_SCORE || computerScore >= WINNING_SCORE){
        showingWinScreen = true;
    }
    ballXSpeed = -ballXSpeed;
    ballY = Math.random() * canvas.height;
    ballX = canvas.width/2;
}

function computerMovement(){
    let rightPaddleYCenter = rightPaddleY + (PADDLE_HEIGHT/2);
    if(rightPaddleYCenter <= ballY-20){
        rightPaddleY += rightPaddleSpeed;
    }else if(rightPaddleYCenter >= ballY+20){
        rightPaddleY -= rightPaddleSpeed;
    }
}

function moveEverything(){
    computerMovement();

    ballX += ballXSpeed;
    ballY += ballYSpeed;

    if(ballX >= canvas.width){
        if(ballY >= rightPaddleY-accuracyVal && ballY <= rightPaddleY+PADDLE_HEIGHT+accuracyVal){
            //computer hit the ball
            ballXSpeed = -ballXSpeed;
            let deltaY = ballY-(rightPaddleY+PADDLE_HEIGHT/2);
            ballYSpeed = deltaY * 0.35;
        }else{
            playerScore += 1;
            resetBall();
        }
    }else if(ballX <= 0){
        if(ballY >= leftPaddleY-accuracyVal && ballY <= leftPaddleY+PADDLE_HEIGHT+accuracyVal){
            //player hit the ball
            ballXSpeed = -ballXSpeed;
            let deltaY = ballY-(leftPaddleY+PADDLE_HEIGHT/2);
            ballYSpeed = deltaY * 0.35;
        }else{
            computerScore += 1;
            resetBall();
        }
    }

    if(ballY >= canvas.height){
        ballYSpeed = -ballYSpeed;
    }else if(ballY <= 0){
        ballYSpeed = -ballYSpeed;
    }
}

function drawNet(){
    for(let i=0;i<canvas.width;i+=35){
        canvasCtx.fillStyle = "white";
        canvasCtx.fillRect(canvas.width/2, i+8, 2, 20);
    }
}

function drawEverything(){
    //fillStyle for the color of the shape and fillRect for the shape of the canvas
    canvasCtx.fillStyle = "black";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    if(showingWinScreen){
        canvasCtx.font = "20px Arial";
        canvasCtx.fillStyle = "white";
        if(playerScore>computerScore){
            canvasCtx.fillText("You won!", canvas.width/2-100, 100);
        }else{
            canvasCtx.fillText("Computer won!", canvas.width/2-100, 100);
        }
        canvasCtx.fillText("click to continue", canvas.width/2-100, 200);
        return;
    }

    drawNet();

    //the left player paddle
    canvasCtx.fillStyle = "white";
    canvasCtx.fillRect(0, leftPaddleY, 10, PADDLE_HEIGHT);

    //the right player paddle
    canvasCtx.fillRect(canvas.width-10, rightPaddleY, 10, PADDLE_HEIGHT);

    //the ball
    canvasCtx.beginPath();
    canvasCtx.arc(ballX, ballY, 17, 0, Math.PI*2, true);
    canvasCtx.fill();

    //scores
    canvasCtx.font = "20px Arial";
    canvasCtx.fillText(playerScore, 100, 100);
    canvasCtx.fillText(computerScore, canvas.width-100, 100);
}