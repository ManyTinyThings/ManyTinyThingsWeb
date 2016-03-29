function createRenderer(canvas)
{
    var renderer = {
        canvas: canvas,
        context: canvas.getContext("2d"),
        bounds: new Rectangle(),
        lineWidth: 0.01,
    };

    return renderer;
}

function worldFromCanvas(renderer, canvasPosition)
{
    var p = canvasPosition;
    var b = renderer.bounds;
    var c = renderer.canvas;
    var worldX = b.width / c.width * p[0] + b.left;
    var worldY = -b.height / c.height * p[1] + b.top;
    return v2.create(worldX, worldY);
}

function updateRendererBounds(renderer)
{
    var context = renderer.context;
    var bounds = renderer.bounds;
    context.resetTransform();
    var w = renderer.canvas.width;
    var h = renderer.canvas.height;
    context.scale(w / bounds.width, -h / bounds.height);
    context.translate(-bounds.left, -bounds.top);
}

function drawParticles(renderer, particles, radiusScaling)
{
    var context = renderer.context;
    for (var i = 0; i < particles.length; ++i)
    {
        var particle = particles[i];
        var position = particle.position;

        context.beginPath();
        context.fillStyle = cssFromRGBA(particle.color.rgba);
        context.arc(position[0], position[1], particle.radius * radiusScaling, 0, tau);
        context.fill();
    }
}

function drawTrajectoryUnzipped(renderer, xs, ys, color)
{
    var context = renderer.context;
    context.lineWidth = renderer.lineWidth * renderer.bounds.height;
    context.strokeStyle = cssFromRGBA(color.rgba);

    context.beginPath();
    context.moveTo(xs[0], ys[0]);
    for (var i = 1; i < xs.length; i++)
    {
        context.lineTo(xs[i], ys[i]);
    }
    context.stroke();   
}

function drawTrajectory(renderer, trajectory, color)
{
    var context = renderer.context;
    context.lineWidth = renderer.lineWidth * renderer.bounds.height;
    context.strokeStyle = cssFromRGBA(color.rgba);
    var startPoint = trajectory[0];

    context.beginPath();
    context.moveTo(startPoint[0], startPoint[1]);
    for (var i = 1; i < trajectory.length; i++)
    {
        var point = trajectory[i];
        context.lineTo(point[0], point[1]);
    }
    context.stroke();
}

function drawRectangle(renderer, rectangle, color)
{
    var context = renderer.context;
    context.fillStyle = cssFromRGBA(color.rgba);
    var topLeft = v2.create(rectangle.left, rectangle.top);
    var bottomRight = v2.create(rectangle.right, rectangle.bottom);
    var width = bottomRight[0] - topLeft[0];
    var height = bottomRight[1] - topLeft[1];
    context.fillRect(topLeft[0], topLeft[1], width, height);
}

function clearRenderer(renderer)
{
    var b = renderer.bounds;
    renderer.context.clearRect(b.left, b.bottom, b.width, b.height);
}

function cssFromRGBA(rgba)
{
    return ["rgba(",
        Math.round(rgba[0] * 255), ",",
        Math.round(rgba[1] * 255), ",",
        Math.round(rgba[2] * 255), ",",
        rgba[3], ")"
    ].join("");
}