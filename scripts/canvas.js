function createRenderer(canvas) {
    var renderer = {
        canvas: canvas,
        context: canvas.getContext("2d"),
        worldBounds: new Rect(),
    };
    
    return renderer;
}

function canvasFromWorld(renderer, worldPosition)
{
    function transform(worldZ, minZ, maxZ, canvasLength)
    {
        var worldLength = maxZ - minZ;
        var relative = (worldZ - minZ) / worldLength;
        return relative * canvasLength;
    }
    var bounds = renderer.worldBounds;
    var canvasX = transform(worldPosition[0], bounds.left, bounds.right, renderer.canvas.width);
    var canvasY = renderer.canvas.height - transform(worldPosition[1], bounds.bottom, bounds.top, renderer.canvas.height);
    
    return vec2.fromValues(canvasX, canvasY);
}

function worldFromCanvas(renderer, canvasPosition)
{
    function transform(canvasZ, minZ, maxZ, canvasLength)
    {
        var relative = canvasZ / canvasLength;
        var worldLength = maxZ - minZ;
        return relative * worldLength + minZ;
    }
    var bounds = renderer.worldBounds;
    var worldX = transform(canvasPosition[0], bounds.left, bounds.right, renderer.canvas.width);
    var worldY = transform(renderer.canvas.height - canvasPosition[1], bounds.bottom, bounds.top, renderer.canvas.height);

    return vec2.fromValues(worldX, worldY);
}

function drawParticles(renderer, particles, radiusScaling) 
{
    var context = renderer.context;
    for (var i = 0; i < particles.length; ++i) {
        var particle = particles[i];
        
        var position = canvasFromWorld(renderer, particle.position);
        
        context.beginPath();
        context.fillStyle = cssFromRGBA(particle.color.rgba);
        context.arc(position[0], position[1], particle.radius * radiusScaling * renderer.canvas.height / 2, 0, tau);
        context.fill();
    }
}

function drawTrajectory(renderer, trajectory, color)
{
    var context = renderer.context;
    context.strokeStyle = cssFromRGBA(color.rgba);
    var startPoint = canvasFromWorld(renderer, trajectory[0]);
    
    context.beginPath();
	context.moveTo(startPoint[0], startPoint[1]);
    for (var i = 1; i < trajectory.length; i++) {
        var point = canvasFromWorld(renderer, trajectory[i]);
        context.lineTo(point[0], point[1]);
    }
    context.stroke();
}

function drawRectangle(renderer, rectangle, color)
{
    var context = renderer.context;

    context.fillStyle = cssFromRGBA(color.rgba);
    var topLeftCorner = canvasFromWorld(renderer, vec2.fromValues(rectangle.left, rectangle.top));
    var width = rectangle.width * renderer.canvas.width;
    var height = rectangle.height * renderer.canvas.height;
    context.fillRect(topLeftCorner[0], topLeftCorner[1], width, height);
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