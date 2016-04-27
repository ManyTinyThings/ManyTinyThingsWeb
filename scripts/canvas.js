function createRenderer(canvas)
{
    var renderer = {
        canvas: canvas,
        cssWidth: canvas.width,
        cssHeight: canvas.height,
        context: canvas.getContext("2d"),
        bounds: new Rectangle(),
    };

    // Retina stuff
    canvas.style.width = renderer.cssWidth + "px";
    canvas.style.height = renderer.cssHeight + "px";

    var devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = renderer.cssWidth * devicePixelRatio;
    canvas.height = renderer.cssHeight * devicePixelRatio;

    return renderer;
}

function worldFromCanvas(renderer, canvasPosition)
{
    var p = canvasPosition;
    var b = renderer.bounds;
    var c = renderer.canvas;
    var worldX = b.width / renderer.cssWidth * p[0] + b.left;
    var worldY = -b.height / renderer.cssHeight * p[1] + b.top;
    return v2.create(worldX, worldY);
}

function updateRendererBounds(renderer)
{
    var context = renderer.context;
    var bounds = renderer.bounds;
    context.setTransform(1, 0, 0, 1, 0, 0);
    var w = renderer.canvas.width;
    var h = renderer.canvas.height;
    context.scale(w / bounds.width, -h / bounds.height);
    context.translate(-bounds.left, -bounds.top);
}

function drawParticles(renderer, particles)
{
    var context = renderer.context;
    for (var i = 0; i < particles.length; ++i)
    {
        var particle = particles[i];
        var position = particle.position;

        context.fillStyle = cssFromRGBA(particle.color.rgba);
        for (var dx = 0; dx < 3; dx++)
        {
            for (var dy = 0; dy < 3; dy++)
            {
                context.beginPath();
                var x = position[0] + renderer.bounds.width * (dx - 1);
                var y = position[1] + renderer.bounds.height * (dy - 1);
                context.arc(x, y, particle.radius, 0, tau);
                context.fill();
            }
        }

    }
}

function drawTrajectoryUnzipped(renderer, xs, ys, color)
{
    var context = renderer.context;
    context.strokeStyle = cssFromRGBA(color.rgba);

    context.beginPath();
    context.moveTo(xs[0], ys[0]);
    for (var i = 1; i < xs.length; i++)
    {
        context.lineTo(xs[i], ys[i]);
    }
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.stroke();
    context.restore();
}

function drawTrajectory(renderer, trajectory, color)
{
    var context = renderer.context;
    context.strokeStyle = cssFromRGBA(color.rgba);
    var startPoint = trajectory[0];

    context.beginPath();
    context.moveTo(startPoint[0], startPoint[1]);
    for (var i = 1; i < trajectory.length; i++)
    {
        var point = trajectory[i];
        context.lineTo(point[0], point[1]);
    }
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.stroke();
    context.restore();
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