function createRenderer(canvas)
{
    var renderer = {
        canvas: canvas,
        context: canvas.getContext("2d"),
        canvasBounds: new Rectangle(),
        bounds: new Rectangle(),
    };


    // Retina stuff
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";

    var devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.width * devicePixelRatio;
    canvas.height = canvas.height * devicePixelRatio;

    setLeftTopWidthHeight(renderer.canvasBounds, 0, 0, canvas.width, -canvas.height);

    return renderer;
}

function worldFromCanvas(renderer, canvasPosition)
{
    var p = canvasPosition;
    var b = renderer.bounds;
    var c = renderer.canvas;
    var worldX = b.width / renderer.canvasBounds.width * p[0] + b.left;
    var worldY = b.height / renderer.canvasBounds.height * p[1] + b.top;
    return v2(worldX, worldY);
}

function updateRendererBounds(renderer)
{
    var context = renderer.context;
    var bounds = renderer.bounds;
    setLeftTopWidthHeight(renderer.canvasBounds, 0, 0, renderer.canvas.width, -renderer.canvas.height);
    var w = renderer.canvasBounds.width;
    var h = renderer.canvasBounds.height;

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(w / bounds.width, h / bounds.height);
    context.translate(-bounds.left, -bounds.top);
}

function drawParticles(renderer, particles, isPeriodic)
{
    var context = renderer.context;
    for (var i = 0; i < particles.length; ++i)
    {
        var particle = particles[i];
        var position = particle.position;

        context.fillStyle = cssFromRGBA(particle.color.rgba);
        var screenRadius = isPeriodic;
        for (var dx = -screenRadius; dx <= screenRadius; dx++)
        {
            for (var dy = -screenRadius; dy <= screenRadius; dy++)
            {
                context.beginPath();
                var x = position[0] + renderer.bounds.width * dx;
                var y = position[1] + renderer.bounds.height * dy;
                context.arc(x, y, particle.radius, 0, tau);
                context.fill();
            }
        }

    }
}

function screenRelativeStroke(context)
{
    var c = context;
    c.save();
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.stroke();
    c.restore();
}

function rotateToVector(context, v)
{
    context.transform(v[0], v[1], -v[1], v[0], 0, 0);
}

function drawArrow(renderer, start, end)
{
    var maxArrowheadLength = 20; // pixels

    var arrowStart = v2.alloc();
    var arrowEnd = v2.alloc();

    var arrowVector = v2.alloc();
    var shaftEnd = v2.alloc();

    transformToRectFromRect(arrowStart, renderer.canvasBounds, start, renderer.bounds);
    transformToRectFromRect(arrowEnd, renderer.canvasBounds, end, renderer.bounds);


    v2.subtract(arrowVector, arrowEnd, arrowStart);
    var arrowLength = v2.magnitude(arrowVector);

    var arrowheadLength = atMost(maxArrowheadLength, arrowLength / 2);
    var shaftLength = arrowLength - arrowheadLength;
    v2.normalize(arrowVector, arrowVector);
    v2.scaleAndAdd(shaftEnd, arrowStart, arrowVector, shaftLength);

    var c = renderer.context;
    c.save();
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.beginPath();
    c.moveTo(arrowStart[0], arrowStart[1]);
    c.lineTo(shaftEnd[0], shaftEnd[1]);
    c.stroke();

    // rotate and move to arrow shaft
    c.translate(arrowEnd[0], arrowEnd[1]);
    rotateToVector(c, arrowVector);

    // draw arrowhead
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(-arrowheadLength, -arrowheadLength / 3);
    c.lineTo(-arrowheadLength, arrowheadLength / 3);
    c.closePath();
    c.fillStyle = cssFromRGBA(colors.black.rgba);
    c.fill();
    c.restore();

    v2.free(arrowStart);
    v2.free(arrowEnd);
    v2.free(shaftEnd);
    v2.free(arrowVector);
}

function drawTrajectoryUnzipped(renderer, xs, ys, color)
{
    var c = renderer.context;
    c.strokeStyle = cssFromRGBA(color.rgba);

    c.beginPath();
    c.moveTo(xs[0], ys[0]);
    for (var i = 1; i < xs.length; i++)
    {
        c.lineTo(xs[i], ys[i]);
    }
    screenRelativeStroke(c);
}

function drawTrajectory(renderer, trajectory, color)
{
    var c = renderer.context;
    c.strokeStyle = cssFromRGBA(color.rgba);
    var startPoint = trajectory[0];

    c.beginPath();
    c.moveTo(startPoint[0], startPoint[1]);
    for (var i = 1; i < trajectory.length; i++)
    {
        var point = trajectory[i];
        c.lineTo(point[0], point[1]);
    }
    screenRelativeStroke(c);
}

function drawRectangle(renderer, rectangle, color)
{
    var c = renderer.context;
    c.fillStyle = cssFromRGBA(color.rgba);
    var topLeft = v2(rectangle.left, rectangle.top);
    var bottomRight = v2(rectangle.right, rectangle.bottom);
    var width = bottomRight[0] - topLeft[0];
    var height = bottomRight[1] - topLeft[1];
    c.fillRect(topLeft[0], topLeft[1], width, height);
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