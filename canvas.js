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
    var context = renderer.context;
    context.strokeStyle = cssFromRGBA(color.rgba);
    var startPoint = canvasFromWorld(renderer.canvas, trajectory[0]);
    
    context.beginPath();
	context.moveTo(startPoint[0], startPoint[1]);
    for (var i = 1; i < trajectory.length; i++) {
        var point = canvasFromWorld(renderer.canvas, trajectory[i]);
        context.lineTo(point[0], point[1]);
    }
    context.stroke();
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