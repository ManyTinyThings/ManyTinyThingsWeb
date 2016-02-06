function createRenderer(canvas) {
    var renderer = {
        canvas: canvas,
        context: canvas.getContext("2d"),
    };
    
    return renderer;
}

function initGraphics(canvas) {
    context = canvas.getContext("2d");
}

function drawParticles(renderer, particles, radiusScaling) 
{
    var context = renderer.context;
    for (var i = 0; i < particles.length; ++i) {
        var particle = particles[i];
        
        var x = (particle.position[0] + 1) * renderer.canvas.height / 2;
        var y = (- particle.position[1] + 1) * renderer.canvas.height / 2;
        
        context.beginPath();
        context.fillStyle = cssFromRGBA(particle.color.rgba);
        context.arc(x, y, particle.radius * radiusScaling * renderer.canvas.height / 2, 0, tau);
        context.fill();
    }
}

function drawTrajectory(renderer, trajectory, color)
{
    // TODO
}

function resizeRenderer(renderer)
{
    // TODO
}

function clearRenderer(renderer)
{
    renderer.context.clearRect(0, 0, renderer.canvas.width, renderer.canvas.height);
}

function cssFromRGBA(rgba)
{
    return ["rgba(", 
            Math.round(rgba[0] * 255), ",", 
            Math.round(rgba[1] * 255), ",", 
            Math.round(rgba[2] * 255), ",",
            rgba[3], ")"].join("");
}