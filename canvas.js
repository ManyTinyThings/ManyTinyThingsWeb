var context;

function initGraphics(canvas) {
    context = canvas.getContext("2d");
}

function drawParticles(particles) 
{
    for (var i = 0; i < particles.length; ++i) {
        var particle = particles[i];
        context.beginPath();
        context.fillStyle = rgba_to_css(particle.color.rgba);
        var x = (particle.position[0] + 1) * canvas.height / 2;
        var y = (particle.position[1] + 1) * canvas.height / 2;
        context.arc(x, y, particle.radius * 10, 0, tau);
        context.fill();
    }
}

function drawTrajectory(trajectory)
{
    // Todo
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