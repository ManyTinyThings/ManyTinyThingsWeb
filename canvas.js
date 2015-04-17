var context;

function initGraphics(canvas) {
    context = canvas.getContext("2d");
}

function draw_ball(ball) 
{
    context.beginPath();
    context.fillStyle = ball.color;
    context.arc(ball.position.x, ball.position.y, ball_radius, 0, tau);
    context.fill();
}

function clear_canvas()
{
    context.clearRect(0, 0, canvas.width, canvas.height);
}
