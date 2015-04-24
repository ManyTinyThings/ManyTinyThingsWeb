var context;

function initGraphics(canvas) {
    context = canvas.getContext("2d");
}

function draw_ball(ball) 
{
    context.beginPath();
    
    context.fillStyle = rgba_to_css(ball.color.rgba);
    context.arc(ball.position[0], ball.position[1], ball_radius, 0, tau);
    context.fill();
}

function clear_canvas()
{
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function rgba_to_css(rgba)
{
    return ["rgba(", 
            Math.round(rgba[0] * 255), ",", 
            Math.round(rgba[1] * 255), ",", 
            Math.round(rgba[2] * 255), ",",
            rgba[3], ")"].join("");
}

function resize_canvas()
{
    clear_canvas();
}