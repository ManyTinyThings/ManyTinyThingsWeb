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
    return v2(worldX, worldY);
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
    // TODO: make this relative to pixels, not world coordinates
    var maxArrowheadLength = 0.1;

    var arrowVector = v2.alloc();
    var shaftEnd = v2.alloc();

    v2.subtract(arrowVector, end, start);
    var arrowLength = v2.magnitude(arrowVector);

    var arrowheadLength = atMost(maxArrowheadLength, arrowLength / 2);
    var shaftLength = arrowLength - arrowheadLength;
    v2.normalize(arrowVector, arrowVector);
    v2.scaleAndAdd(shaftEnd, start, arrowVector, shaftLength);

    var c = renderer.context;
    c.beginPath();
    c.moveTo(start[0], start[1]);
    c.lineTo(shaftEnd[0], shaftEnd[1]);
    screenRelativeStroke(c);


    c.save();
    // rotate and move to arrow shaft
    c.translate(end[0], end[1]);
    rotateToVector(c, arrowVector);

    // draw arrowhead
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(-arrowheadLength, -arrowheadLength / 3);
    c.lineTo(-arrowheadLength, arrowheadLength / 3);
    c.closePath();
    c.restore();

    c.fillStyle = cssFromRGBA(colors.black.rgba);
    c.fill();
    c.restore();

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