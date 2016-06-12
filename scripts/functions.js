// ! Pool

function Pool(constructor)
{
    this.constructor = constructor;

    this.freeList = [];
}

function poolAlloc(pool)
{
    var object;
    if (pool.freeList.length == 0)
    {
        object = new pool.constructor();
    }
    else
    {
        object = pool.freeList.pop();
    }
    return object;
}

function poolFree(pool, object)
{
    pool.freeList.push(object);
}

// ! Vectors


var v2 = function(x, y)
{
    var out = new Float32Array(2);
    out[0] = x;
    out[1] = y;
    return out;
};

v2.pool = new Pool(function()
{
    return new Float32Array(2);
});

v2.alloc = function()
{
    return poolAlloc(v2.pool);
};

v2.free = function(a)
{
    poolFree(v2.pool, a);
};


v2.clone = function(a)
{
    var out = new Float32Array(2);
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

v2.set = function(out, x, y)
{
    out[0] = x;
    out[1] = y;
    return out;
};

v2.copy = function(out, a)
{
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

v2.add = function(out, a, b)
{
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
};

v2.subtract = function(out, a, b)
{
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
};

v2.negate = function(out, a)
{
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
};

v2.scale = function(out, a, t)
{
    out[0] = t * a[0];
    out[1] = t * a[1];
    return out;
};

v2.scaleAndAdd = function(out, a, b, t)
{
    out[0] = a[0] + b[0] * t;
    out[1] = a[1] + b[1] * t;
    return out;
};

v2.inner = function(a, b)
{
    return a[0] * b[0] + a[1] * b[1];
};

v2.setPolar = function(out, radius, angle)
{
    var x = radius * Math.cos(angle);
    var y = radius * Math.sin(angle);
    return v2.set(out, x, y);
};

v2.square = function(a)
{
    return a[0] * a[0] + a[1] * a[1];
};

v2.magnitude = function(a)
{
    return Math.sqrt(v2.square(a));
};

v2.isZero = function(a)
{
    return (a[0] == 0) && (a[1] == 0);
}

v2.isAlmostZero = function(a)
{
    var tolerance = 0.000001;
    return (v2.square(a) < tolerance);
}

v2.normalize = function(out, a)
{
    var length = v2.magnitude(a);
    v2.scale(out, a, 1 / length);
    return out;
};

v2.projectOntoNormal = function(out, a, normal)
{
    var length = v2.inner(a, normal);
    v2.scale(out, normal, length);
    return out;
};

v2.perpCCW = function(out, a)
{
    var x = a[0];
    var y = a[1];
    out[0] = -y;
    out[1] = x;
    return out;
};

v2.perpCW = function(out, a)
{
    var x = a[0];
    var y = a[1];
    out[0] = y;
    out[1] = -x;
    return out;
};

v2.outer = function(a, b)
{
    return a[0] * b[1] - a[1] * b[0];
};

// TODO: make sure inside rect (right now only cares about width and height)
v2.periodicize = function(out, a, bounds)
{
    out[0] = a[0] - bounds.width * Math.floor(a[0] / bounds.width + 0.5);
    out[1] = a[1] - bounds.height * Math.floor(a[1] / bounds.height + 0.5);
    return out;
};

// ! Generally useful

function combineWithDefaults(opts, defaults)
{
    for (var key in defaults)
    {
        if (!opts.hasOwnProperty(key))
        {
            opts[key] = defaults[key];
        }
        else if (typeof opts[key] === 'object')
        {
            combineWithDefaults(opts[key], defaults[key]);
        }
    }
}

function arrayLast(array)
{
    return array[array.length - 1];
}

function arrayMinIndex(array, f)
{
    var minimum = Number.MAX_VALUE;
    var minimumIndex = -1;
    for (var i = 0; i < array.length; i++)
    {
        var value = f(array[i]);
        if (value < minimum)
        {
            minimum = value;
            minimumIndex = i;
        }
    }
    return minimumIndex;
}

function numericCompare(a, b)
{
    return (a - b);
}

function arraySort(array)
{
    array.sort(numericCompare);
}

// ! DOM stuff

function createAndAppend(elementType, parent)
{
    var element = document.createElement(elementType);
    parent.appendChild(element);
    return element;
}

function hideElement(element)
{
    element.style.display = "none";
}

function showElement(element)
{
    element.style.display = "block";
}

// ! Graphs/Plots

function createGraph(div, label)
{
    var graph = {};

    var span = createAndAppend("div", div);
    span.innerHTML = label;
    var canvas = createAndAppend("canvas", div);
    canvas.width = 400;
    canvas.height = 200;

    graph.div = div;
    graph.renderer = createRenderer(canvas);

    graph.curves = [];
    graph.bars = [];
    graph.limits = {
        xMin: "auto",
        xMax: "auto",
        yMin: "auto",
        yMax: "auto",
    };
    graph.isVisible = true;

    return graph;
}

function addCurve(graph, opts)
{
    combineWithDefaults(opts,
    {
        color: colors.black,
    });

    var curve = {
        pointCount: Math.min(opts.x.length, opts.y.length),
        xs: opts.x,
        ys: opts.y,
        color: opts.color,
    };

    graph.curves.push(curve);
}

function addBars(graph, opts)
{
    combineWithDefaults(opts,
    {
        bars: []
    });

    graph.bars = graph.bars.concat(opts.bars);
}

function addHistogram(graph, opts)
{
    var values = opts.values.slice();
    arraySort(values);
    var barWidth = (opts.max - opts.min) / opts.barCount;
    var bars = [];
    for (var i = 0; i < opts.barCount; i++)
    {
        var bar = {
            start: opts.min + i * barWidth,
            end: opts.min + (i + 1) * barWidth,
            value: 0,
            color: colors.red,
        };
        bars.push(bar);
    }
    var barIndex = 0;
    for (var i = 0;
        (i < values.length) && (barIndex < opts.barCount); i++)
    {
        var value = values[i];
        var bar = bars[barIndex];
        if (value < opts.min)
        {
            continue;
        }
        if (value < bar.end)
        {
            bar.value += 1;
        }
        else
        {
            barIndex++;
        }
    }

    addBars(histogram,
    {
        bars: bars
    });
}

function setGraphLimits(graph, limits)
{
    for (var key in limits)
    {
        graph.limits[key] = limits[key];
    }
}

function setGraphVisible(graph, isVisible)
{
    graph.isVisible = isVisible;
    if (isVisible)
    {
        showElement(graph.div);
    }
    else
    {
        hideElement(graph.div);
    }
}

function maximumBy(array, f)
{
    var max = -Number.MAX_VALUE;
    for (var i = 0; i < array.length; i++)
    {
        var x = f(array[i]);

        if (x > max)
        {
            max = x;
        }
    }
    return max;
}

function updateAutoLimits(autoLimits, x, y)
{
    if (x < autoLimits.xMin)
    {
        autoLimits.xMin = x;
    }
    if (x > autoLimits.xMax)
    {
        autoLimits.xMax = x;
    }

    if (y < autoLimits.yMin)
    {
        autoLimits.yMin = y;
    }
    if (y > autoLimits.yMax)
    {
        autoLimits.yMax = y;
    }
}

function getLimits(graph)
{
    // Figure out limits

    var autoLimits = {
        xMin: Number.MAX_VALUE,
        xMax: -Number.MAX_VALUE,
        yMin: Number.MAX_VALUE,
        yMax: -Number.MAX_VALUE,
    }
    for (var curveIndex = 0; curveIndex < graph.curves.length; curveIndex++)
    {
        var curve = graph.curves[curveIndex];
        for (var i = 0; i < curve.pointCount; i++)
        {
            var x = curve.xs[i];
            var y = curve.ys[i];
            updateAutoLimits(autoLimits, x, y);
        }
    }

    for (var barIndex = 0; barIndex < graph.bars.length; barIndex++)
    {
        var bar = graph.bars[barIndex];
        updateAutoLimits(autoLimits, bar.start, 0);
        updateAutoLimits(autoLimits, bar.end, bar.value);
    }



    var limits = {};

    for (var key in graph.limits)
    {
        if (graph.limits[key] == "auto")
        {
            limits[key] = autoLimits[key];
        }
        else
        {
            limits[key] = graph.limits[key];
        }
    }

    var paddingFactor = 0.05;
    // TODO: maybe minimum padding?
    var xPadding = paddingFactor * (limits.xMax - limits.xMin);
    var yPadding = paddingFactor * (limits.yMax - limits.yMin);

    var paddings = {
        xMin: -xPadding,
        xMax: xPadding,
        yMin: -yPadding,
        yMax: yPadding,
    };

    for (var key in graph.limits)
    {
        if (graph.limits[key] == "auto")
        {
            limits[key] += paddings[key];
        }
    }

    return limits;
}

function drawGraph(graph)
{
    if (graph.isVisible)
    {
        var limits = getLimits(graph)

        setLeftTopRightBottom(graph.renderer.bounds,
            limits.xMin, limits.yMax,
            limits.xMax, limits.yMin
        );
        updateRendererBounds(graph.renderer);

        // Clear and draw

        clearRenderer(graph.renderer);

        for (var curveIndex = 0; curveIndex < graph.curves.length; curveIndex++)
        {
            var curve = graph.curves[curveIndex];
            drawTrajectoryUnzipped(graph.renderer, curve.xs, curve.ys, curve.color);
        }
        if (graph.bars.length > 0)
        {
            var barWidth = (limits.xMax - limits.xMin) / graph.bars.length;
            for (var barIndex = 0; barIndex < graph.bars.length; barIndex++)
            {
                var bar = graph.bars[barIndex];
                var barRect = setLeftTopRightBottom(new Rectangle(), bar.start, 0, bar.end, bar.value);
                drawRectangle(graph.renderer, barRect, bar.color);
            }
        }
    }

    // Reset state

    graph.curves = [];
    graph.bars = [];
}

// ! Measurement regions

function createMeasurementRegion()
{
    var region = {};
    region.bounds = new Rectangle();
    region.color = colors.black;
    region.overlayColor = colors.transparent;
    region.measurements = {
        time: [],
        energy: [],
        temperature: [],
        count: [],
        virialPressure: [],
        pressure: [],
        smoothedPressure: [],
    }
    return region;
}

function setColdHotRegions(simulation)
{
    var leftRegion = createMeasurementRegion();
    copyRectangle(leftRegion.bounds, simulation.leftRect);
    leftRegion.color = colors.blue;
    leftRegion.overlayColor = withAlpha(colors.blue, 0.2);

    var rightRegion = createMeasurementRegion();
    copyRectangle(rightRegion.bounds, simulation.rightRect);
    rightRegion.color = colors.red;
    rightRegion.overlayColor = withAlpha(colors.red, 0.2);

    simulation.measurementRegions = [leftRegion, rightRegion];
}

// ! Constants

var tau = 2 * Math.PI;

var bonkSound = new Audio("../assets/bonk.wav");

// ! Shapes

var ShapeType = Object.freeze(
{
    circle: 0,
    polygon: 1,
});

var Circle = function()
{
    this.type = ShapeType.circle;
    this.centerPosition = v2(0, 0);
    this.radius = 1;
}

var Polygon = function()
{
    this.type = ShapeType.polygon;
    this.vertices = [];
}

var PhysicalObject = function(shape)
{
    this.shape = shape;
    this.mass = Infinity;
    this.velocity = v2(0, 0);
}

// ! Walls

function Wall(start, end)
{
    this.shapeType = ShapeType.polygon;
    this.vertices = [start, end];

    this.mass = Infinity;
    this.velocity = v2(0, 0);
}

// ! Particle object

var Particle = function()
{
    this.position = v2(0, 0);
    this.velocity = v2(0, 0);
    this.acceleration = v2(0, 0);
    this.deltaPosition = v2(0, 0);

    this.kineticEnergy = 0;
    this.potentialEnergy = 0;
    this.pressure = 0;
    this.virial = 0;

    this.color = colors.black;
    this.bounds = new Rectangle();
    this.radius = 1;
    this.mass = 1;

    this.particleType = 0;

    this.gridCellIndex = -1;
}

// ! Initialization

function groupedPosition(simulation, particleIndex)
{
    var boxBounds = simulation.boxBounds;
    var smallCenteredRect = new Rectangle().setCenterWidthHeight(
        boxBounds.center, boxBounds.width / 5, boxBounds.height / 5
    );
    return randomPointInRect(smallCenteredRect);
}

function uniformPosition(simulation, particleIndex)
{
    // TODO: use poisson disk sampling to avoid collisions?
    return randomPointInRect(simulation.boxBounds);
}

function halvesPosition(simulation, particleIndex)
{
    if (particleIndex % 2 == 0)
    {
        return randomPointInRect(simulation.leftRect);
    }
    else
    {
        return randomPointInRect(simulation.rightRect);
    }
}

var triangularLatticePosition = function()
{

    var latticeX = v2(0, 0);
    var latticeY = v2(0, 0);

    return function(simulation, particleIndex)
    {
        // NOTE: this is the formula for triangular numbers inverted
        var triangularNumber = Math.floor((Math.sqrt(8 * particleIndex + 1) - 1) / 2);
        var rest = particleIndex - triangularNumber * (triangularNumber + 1) / 2;
        var integerX = rest;
        var integerY = triangularNumber - rest;
        var latticeSpacing = 2 * simulation.parameters.radiusScaling * simulation.parameters.separationFactor;
        var overallRotation = -tau / 12;
        v2.setPolar(latticeX, latticeSpacing * integerX, overallRotation);
        v2.setPolar(latticeY, latticeSpacing * integerY, overallRotation + tau / 6);
        return v2.add(v2(0, 0), latticeX, latticeY);
    }
}();

var rectangularLatticePosition = function()
{
    var latticeX = v2(0, 0);
    var latticeY = v2(0, 0);

    return function(simulation, particleIndex)
    {
        if (particleIndex == 0)
        {
            return v2(0, 0);
        }
        var layer = Math.floor((Math.sqrt(particleIndex) + 1) / 2);
        var rest = particleIndex - squared(2 * layer - 1);
        var quadrant = Math.floor(rest / (2 * layer));
        var integerX = layer;
        var integerY = (rest % (2 * layer)) - layer + 1;
        var latticeSpacing = 2 * simulation.parameters.radiusScaling * simulation.parameters.separationFactor;
        var rotationAngle = quadrant * tau / 4;
        v2.setPolar(latticeX, latticeSpacing * integerX, rotationAngle);
        v2.setPolar(latticeY, latticeSpacing * integerY, rotationAngle + tau / 4);
        return v2.add(v2(0, 0), latticeX, latticeY);
    }
}();

var hexagonalLatticePosition = function()
{

    var latticeX = v2(0, 0);
    var latticeY = v2(0, 0);

    return function(simulation, particleIndex)
    {
        // NOTE: this adds the particles in a spiral by figuring out their coordinates in
        // one of 6 triangular lattices
        if (particleIndex == 0)
        {
            return v2(0, 0);
        }
        var k = particleIndex - 1;
        var layer = Math.floor((Math.sqrt(8 * (k / 6) + 1) - 1) / 2) + 1; // NOTE: 1-indexed
        var rest = k - 6 * layer * (layer - 1) / 2;
        var triangleIndex = Math.floor(rest / layer);
        var integerX = layer;
        var integerY = rest % layer;
        var latticeSpacing = 2 * simulation.parameters.radiusScaling * simulation.parameters.separationFactor;
        var rotationAngle = triangleIndex * tau / 6;
        v2.setPolar(latticeX, latticeSpacing * integerX, rotationAngle);
        var shape = 2; // 1: spiral, 2: hexagon
        v2.setPolar(latticeY, latticeSpacing * integerY, rotationAngle + shape * tau / 6);
        return v2.add(v2(0, 0), latticeX, latticeY);
    }
}();

function randomVelocity(maxSpeed)
{
    var speed = randomInInterval(0, maxSpeed);
    var direction = randomUnitVector();
    return v2.scale(direction, direction, speed);
}

function randomUnitVector()
{
    var angle = randomInInterval(0, tau);
    return v2(Math.cos(angle), Math.sin(angle));
}

function uniformVelocity(simulation, particleIndex)
{
    return randomVelocity(simulation.parameters.maxInitialSpeed);
}



function identicalVelocity(simulation, particleIndex)
{
    return v2(0, -simulation.parameters.maxInitialSpeed);
}

function twoColors(simulation, particleIndex)
{
    if (particleIndex % 2 == 0)
    {
        return colors.black;
    }
    else
    {
        return colors.red;
    }
}

// ! particle generators

function uniformParticleGenerator(simulation, particleIndex)
{
    var particle = new Particle();

    particle.position = uniformPosition(simulation, particleIndex);
    // moveOutOfCollision(simulation, particle);

    particle.velocity = uniformVelocity(simulation, particleIndex);
    return particle;
}

function groupedParticleGenerator(simulation, particleIndex)
{
    var particle = new Particle();
    particle.position = groupedPosition(simulation, particleIndex);
    particle.velocity = uniformVelocity(simulation, particleIndex);
    return particle;
}

function fallingParticleGenerator(simulation, particleIndex)
{
    var particle = new Particle();
    particle.position = groupedPosition(simulation, particleIndex);
    particle.velocity = identicalVelocity(simulation, particleIndex);
    return particle;
}

function twoColorParticleGenerator(simulation, particleIndex)
{
    var particle = new Particle();
    particle.position = halvesPosition(simulation, particleIndex);
    particle.velocity = uniformVelocity(simulation, particleIndex);
    particle.color = twoColors(simulation, particleIndex);
    return particle;
}

function latticeParticleGenerator(simulation, particleIndex)
{
    var particle = new Particle();
    particle.position = hexagonalLatticePosition(simulation, particleIndex);
    return particle;
}


function billiardsParticleGenerator(simulation, particleIndex)
{
    var particle = new Particle();
    if (particleIndex == 0)
    {
        particle.position = v2(-0.5, 0);
    }
    else
    {
        particle.position = triangularLatticePosition(simulation, particleIndex - 1);
        v2.add(particle.position, particle.position, v2(0.3, 0))
    }
    return particle;
}

// ! Particle types

var Interaction = Object.freeze(
{
    none: 0,
    repulsive: 1,
    lennardJones: 2,
    coulombSame: 3,
    coulombDifferent: 4,
});

function symmetricIndex(a, b)
{
    x = Math.min(a, b);
    y = Math.max(a, b);
    index = x + (y * (y + 1) / 2);
    return index;
}

function setInteraction(simulation, a, b, interaction)
{
    var index = symmetricIndex(a, b);
    simulation.interactions[index] = interaction;
}

function getInteraction(simulation, a, b)
{
    var index = symmetricIndex(a, b);
    var interaction = simulation.interactions[index];
    if (interaction == undefined)
    {
        interaction = Interaction.repulsive;
    }
    return interaction;
}

// ! Particle updating

function updateParticleCount(simulation)
{
    var newParticleCount = simulation.parameters.particleCount;
    if (newParticleCount == simulation.particles.length)
    {
        return;
    }
    else if (newParticleCount < simulation.particles.length)
    {
        simulation.particles.splice(newParticleCount, Number.MAX_VALUE);
    }
    else
    {
        for (var particleIndex = simulation.particles.length; particleIndex < newParticleCount;
            ++particleIndex)
        {
            var newParticle = simulation.particleGenerator(simulation, particleIndex);
            simulation.particles.push(newParticle);
            newParticle.radius *= simulation.radiusScaling;

        }
        // TODO: move particles out of each other so that no overlaps occur
    }

}

function addParticle(simulation, position)
{
    var inside = doesRectContainPoint(simulation.boxBounds, position);
    if (inside)
    {
        var particleIndex = simulation.particles.length;
        var particle = simulation.particleGenerator(simulation, particleIndex);
        particle.position = position;
        particle.radius *= simulation.parameters.radiusScaling;
        simulation.particles.push(particle);
        simulation.parameters.particleCount += 1;
    }
}

function moveOutOfCollision(simulation, particle)
{
    var relativePosition = v2.alloc();
    var wallVector = v2.alloc();

    var hasCollisions = true;
    while (hasCollisions)
    {
        hasCollisions = false;
        for (var wallIndex = 0; wallIndex < simulation.walls.length; wallIndex++)
        {
            var wall = simulation.walls[wallIndex];

            v2.subtract(wallVector, wall.vertices[1], wall.vertices[0]);
            v2.subtract(relativePosition, wall.vertices[0], particle.position);
            var t = v2.inner(relativePosition, wallVector) / v2.square(wallVector);

            if ((0 <= t) && (t <= 1))
            {
                // intersects line segment
                v2.scaleAndAdd(relativePosition,
                    relativePosition, wallVector, t);
            }
            else if (t > 1)
            {
                // intersects wallEnd
                v2.subtract(relativePosition, wall.vertices[1], particle.position);
            }
            // else wallStart, but relativePosition already points there

            var quadrance = v2.square(relativePosition);
            if (quadrance < square(particle.radius))
            {
                var distance = Math.sqrt(quadrance);
                var overlapRatio = (particle.radius - distance) / distance;
                v2.scaleAndAdd(particle.position,
                    particle.position, relativePosition, -overlapRatio);
                hasCollisions = true;
                break;
            }
        }
        if (hasCollisions)
        {
            continue;
        }

        for (var otherParticleIndex = 0; otherParticleIndex < simulation.particles.length; otherParticleIndex++)
        {
            if (otherParticle === particle)
            {
                continue;
            }
            var otherParticle = simulation.particles[otherParticleIndex];

            var distanceLimit = particle.radius + otherParticle.radius;
            v2.subtract(relativePosition, otherParticle.position, particle.position);
            var quadrance = v2.square(relativePosition);

            if (quadrance < square(distanceLimit))
            {
                var distance = Math.sqrt(quadrance);
                var overlapRatio = (distanceLimit - distance) / distance;

                // NOTE: move particles according to their relative size, 
                // otherwise very big particles might have problems
                // v2.scaleAndAdd(particle.position,
                //     particle.position, relativePosition, -overlapRatio * otherParticle.radius / distanceLimit);
                // v2.scaleAndAdd(otherParticle.position,
                //     otherParticle.position, relativePosition, overlapRatio * particle.radius / distanceLimit);

                v2.scaleAndAdd(particle.position,
                    particle.position, relativePosition, -overlapRatio);

                hasCollisions = true;
                break;
            }
        }
    }

    v2.free(relativePosition);
    v2.free(wallVector);
}

function isColliding(simulation, particle)
{
    var hitParticle = pickParticle(simulation, particle.position, particle.radius);
    if (hitParticle >= 0)
    {
        return true;
    }
    for (var wallIndex = 0; wallIndex < simulation.walls.length; wallIndex++)
    {
        var wall = simulation.walls[wallIndex];
        var result = searchForContact(wall, particle, v2(1, 0));
        if (result.isOverlapping)
        {
            return true;
        }
    }
    return false;
}

function removeParticle(simulation, particleIndex)
{
    simulation.particles.splice(particleIndex, 1);
    simulation.parameters.particleCount -= 1;
}

function worldFromPage(renderer, pagePosition)
{
    var canvasBounds = renderer.canvas.getBoundingClientRect();
    var canvasX = pagePosition[0] - canvasBounds.left;
    var canvasY = pagePosition[1] - canvasBounds.top;
    return worldFromCanvas(renderer, v2(canvasX, canvasY));
}

function square(x)
{
    return x * x;
}

function pickParticle(simulation, pickPosition, extraRadius)
{
    extraRadius = extraRadius || 0;

    for (var particleIndex = 0; particleIndex < simulation.particles.length;
        ++particleIndex)
    {
        var particle = simulation.particles[particleIndex];
        var squaredRadius = square(particle.radius + extraRadius);
        var between = v2.alloc();
        v2.subtract(between, pickPosition, particle.position);
        var inside = v2.square(between) < squaredRadius;
        v2.free(between);
        if (inside)
        {
            return particleIndex;
        }
    }
    return -1;
}

var simulationCount = 0;

function createSimulation(opts)
{
    var simulation = {};

    combineWithDefaults(opts,
    {
        width: 400,
        height: 400,
        controls: ["resetButton"],
        visualizations: [],
        measurementRegions: [],
        walls: [],
        particleGenerator: latticeParticleGenerator,
        parameters:
        {
            maxInitialSpeed: 0.1,
            separationFactor: 1.2,
            particleCount: 91,
            radiusScaling: 0.08,
            soundEnabled: false,
            isPeriodic: false,

            // collision-related
            collisionEnabled: true,
            quadtreeEnabled: true,
            isParticleParticleCollisionEnabled: false,
            coefficientOfRestitution: 1,

            // time-related
            pressureWindowSize: 1000,
            simulationTimePerSecond: 5,
            dt: 0.005,
            simulationSpeed: 1,

            // measurements
            measurementWindowLength: 100,
            measurementEnabled: true,

            // forces
            velocityAmplification: 1,
            gravityAcceleration: 0,
            friction: 0,
            coulombStrength: 0.001,
            lennardJonesStrength: 1.0,
            ljSoftness: 0,
            ljn: 6,
            ljm: 1,
            cutoffFactor: 2.5,

            // thermostat
            thermostatSpeed: 0,
            thermostatTemperature: 0.01,
        },
        customUpdate: function(simulation) {},
    });

    simulation.time = 0;
    simulation.times = [];
    simulation.pausedByUser = false;
    simulation.previousTimestamp = 0;
    simulation.timeLeftToSimulate = 0;
    simulation.isFirstFrameAfterPause = true;

    simulation.particles = [];
    simulation.particleGenerator = opts.particleGenerator;
    simulation.interactions = [];



    simulation.radiusScaling = 1;

    simulation.quadTree = undefined;

    simulation.boxBounds = new Rectangle();
    simulation.leftRect = new Rectangle();
    simulation.rightRect = new Rectangle();

    simulation.parameters = opts.parameters;
    simulation.initialParameters = {};
    combineWithDefaults(simulation.initialParameters, opts.parameters);
    if (simulation.parameters.bondEnergy == 0)
    {
        simulation.parameters.dt = simulation.parameters.simulationTimePerSecond / 60;
        simulation.parameters.isParticleParticleCollisionEnabled = true;
    }


    simulation.customUpdate = opts.customUpdate;

    // TODO: more than one trajectory
    simulation.trajectoryEnabled = false;
    simulation.trajectory = [];

    // ! set up HTML elements
    simulation.id = "simulation" + simulationCount;
    simulationCount += 1;

    document.currentScript.insertAdjacentHTML("afterEnd", '<div id="' + simulation.id + '"></div>');
    simulation.div = document.getElementById(simulation.id);
    simulation.div.setAttribute("class", "simulation");

    simulation.leftDiv = createAndAppend("div", simulation.div);
    simulation.rightDiv = createAndAppend("div", simulation.div);

    simulation.canvas = createAndAppend("canvas", simulation.leftDiv);
    simulation.canvas.setAttribute("width", opts.width);
    simulation.canvas.setAttribute("height", opts.height);
    simulation.canvas.setAttribute("class", "simulation_canvas");

    simulation.controlsDiv = createAndAppend("div", simulation.leftDiv);
    simulation.buttonDiv = createAndAppend("div", simulation.controlsDiv);
    simulation.sliderDiv = createAndAppend("div", simulation.controlsDiv);
    simulation.checkboxDiv = createAndAppend("div", simulation.controlsDiv);

    // ! Keyboard stuff

    simulation.downKeys = [];

    document.addEventListener("keydown", function(event)
    {
        var downKey = String.fromCharCode(event.keyCode).toLowerCase();
        simulation.downKeys.push(downKey);
    })

    document.addEventListener("keyup", function(event)
    {
        var releasedKey = String.fromCharCode(event.keyCode).toLowerCase();
        simulation.downKeys = simulation.downKeys.filter(function(key)
        {
            return key != releasedKey;
        });
    })

    // ! Mouse stuff

    simulation.mouse = {
        active: false,
        worldPosition: v2(0, 0),
        leftButton:
        {
            down: false,
            transitionCount: 0,
        },
        rightButton:
        {
            down: false,
            transitionCount: 0,
        },
        mode: "",
        activeParticleIndex: -1,
        billiardCue:
        {
            visible: false,
            start: v2(0, 0),
            end: v2(0, 0),
            strength: 1,
            length: 0.8,
        }
    }

    function updateMouseButton(button, willBeDown)
    {
        button.transitionCount += button.down ^ willBeDown;
        button.down = willBeDown;
    }

    function updateMouseFromEvent(event)
    {
        if (simulation.mouse.active)
        {
            simulation.mouse.worldPosition = worldFromPage(simulation.renderer, v2(event.clientX, event.clientY));
            updateMouseButton(simulation.mouse.leftButton, (event.buttons & 1) != 0);
            updateMouseButton(simulation.mouse.rightButton, (event.buttons & 2) != 0);
            event.preventDefault();
        }
    }

    // NOTE: only listen to mouse events that start on this canvas
    simulation.canvas.addEventListener("mousedown", function(event)
    {
        simulation.mouse.active = true;
        updateMouseFromEvent(event);
    });
    document.addEventListener("mouseup", function(event)
    {
        updateMouseFromEvent(event);
        simulation.mouse.active = false;
    });
    document.addEventListener("mousemove", updateMouseFromEvent);

    // ! Pause when simulation is not visible

    function pauseIfHidden(event)
    {
        var divBounds = simulation.div.getBoundingClientRect();

        var isAboveViewport = divBounds.bottom < 0;
        var isBelowViewport = divBounds.top > window.innerHeight;

        var isAutoPaused = document.hidden || isAboveViewport || isBelowViewport;

        if (isAutoPaused)
        {
            if (simulation.requestFrameId)
            {
                window.cancelAnimationFrame(simulation.requestFrameId);
                simulation.requestFrameId = undefined;
            }
        }
        else
        {
            if (!simulation.requestFrameId)
            {
                simulation.isFirstFrameAfterPause = true;
                simulation.requestFrameId = window.requestAnimationFrame(simulation.updateFunction);
            }
        }
    }

    document.addEventListener('visibilitychange', pauseIfHidden);
    document.addEventListener("scroll", pauseIfHidden);
    document.addEventListener("resize", pauseIfHidden);
    window.addEventListener("load", pauseIfHidden);

    // TODO: pause when window loses focus? (blur, focus events)

    function createSlider(opts)
    {
        combineWithDefaults(opts,
        {
            label: name,
            minLabel: String(opts.min),
            maxLabel: String(opts.max),
            snapBack: false,
            function: function(x)
            {
                return x;
            },
        });

        var initialValue = simulation.parameters[opts.name];

        // set up slider element

        var slider = document.createElement("input");
        slider.setAttribute("id", simulation.id + "_" + opts.name)
        slider.setAttribute("type", "range");
        slider.setAttribute("value", initialValue);
        slider.setAttribute("min", opts.min);
        slider.setAttribute("max", opts.max);
        var step = opts.step || (opts.max - opts.min) / 1000;
        slider.setAttribute("step", step);

        // set up presentation elements

        var p = createAndAppend("p", simulation.sliderDiv);
        p.appendChild(document.createTextNode(opts.label));
        p.appendChild(document.createElement("br"));
        p.appendChild(document.createTextNode(opts.minLabel));
        p.appendChild(slider);
        p.appendChild(document.createTextNode(opts.maxLabel));

        // set up callbacks

        slider.addEventListener("input", function()
        {
            simulation.parameters[opts.name] = opts.function(Number(this.value));
        });

        if (opts.snapBack)
        {
            slider.addEventListener("change", function()
            {
                this.value = initialValue;
                simulation.parameters[opts.name] = opts.function(initialValue);
            });
        }

        hideElement(p);

        simulation.controls[opts.name] = p;
        return p;
    }

    function createCheckbox(opts)
    {
        combineWithDefaults(opts,
        {
            label: name
        });

        var span = createAndAppend("span", simulation.checkboxDiv)

        var label = createAndAppend("label", span);
        var checkbox = createAndAppend("input", span);
        checkbox.setAttribute("type", "checkbox");
        var checkboxId = simulation.id + "_" + opts.name;
        checkbox.setAttribute("id", checkboxId);
        checkbox.setAttribute("name", opts.name);
        checkbox.checked = simulation.parameters[opts.name];
        label.setAttribute("for", checkboxId);
        label.innerHTML = opts.label;

        checkbox.addEventListener("change", function()
        {
            simulation.parameters[opts.name] = this.checked;
        });

        hideElement(span);
        simulation.controls[opts.name] = span;
        return span;
    }

    function createButton(opts)
    {
        var button = createAndAppend("input", simulation.buttonDiv);
        button.setAttribute("type", "button");
        button.setAttribute("value", opts.label);
        button.addEventListener("click", opts.callback);
        hideElement(button);
        simulation.controls[opts.name] = button;
        return button;
    }

    // ! setup UI

    simulation.controls = {};

    // sliders

    createSlider(
    {
        name: "velocityAmplification",
        label: "Control temperature:",
        min: 0.5,
        minLabel: "Colder",
        max: 1.5,
        maxLabel: "Warmer",
        snapBack: true,
    });
    createSlider(
    {
        name: "thermostatTemperature",
        label: "Temperature:",
        min: 0,
        minLabel: "Cold",
        max: 0.1,
        maxLabel: "Hot",
    });
    createSlider(
    {
        name: "thermostatSpeed",
        label: "Thermostat Speed:",
        min: 0,
        minLabel: "Off",
        max: 0.5,
        maxLabel: "Fast",
    });
    createSlider(
    {
        name: "simulationSpeed",
        label: "Control time:",
        min: -1,
        minLabel: "Backward",
        max: 1,
        maxLabel: "Forward",
    });
    createSlider(
    {
        name: "particleCount",
        label: "Number of particles:",
        min: 0,
        minLabel: "0",
        max: 225,
        maxLabel: "225",
        step: 1
            // TODO: make this exponential?
    });
    createSlider(
    {
        name: "radiusScaling",
        label: "Particle size:",
        min: 0.01,
        minLabel: "Tiny",
        max: 0.1,
        maxLabel: "Huge",
    });
    createSlider(
    {
        name: "gravityAcceleration",
        label: "Gravity:",
        min: 0,
        minLabel: "None",
        max: 2e-4,
        maxLabel: "Strong",
    });
    createSlider(
    {
        name: "boxSize",
        label: "Box Size:",
        min: 20,
        minLabel: "Tiny",
        max: 1000,
        maxLabel: "Huge",
    });
    createSlider(
    {
        name: "friction",
        label: "Friction:",
        min: 0,
        minLabel: "None",
        max: 1,
        maxLabel: "A lot",
    });

    // checkboxes

    createCheckbox(
    {
        name: "quadtreeEnabled",
        label: "Quadtree",
    });
    createCheckbox(
    {
        name: "trajectoryEnabled",
        label: "Draw trajectory",
    });
    createCheckbox(
    {
        name: "soundEnabled",
        label: "Sound",
    });

    // buttons

    createButton(
    {
        name: "resetButton",
        label: "Reset",
        callback: function()
        {
            resetSimulation(simulation);
        }
    });
    createButton(
    {
        name: "playPauseButton",
        label: "Play/Pause",
        callback: function()
        {
            simulation.pausedByUser = !simulation.pausedByUser;
        },
    });
    createButton(
    {
        name: "addRandomParticleButton",
        label: "Add random particle",
        callback: function()
        {
            simulation.parameters.particleCount += 1;
        }
    });
    createButton(
    {
        name: "reverseTime",
        label: "Reverse time",
        callback: function()
        {
            simulation.parameters.simulationSpeed *= -1;
        }
    });

    for (var i = 0; i < opts.controls.length; i++)
    {
        showElement(simulation.controls[opts.controls[i]]);
    }

    // ! visualization

    simulation.visualizationDiv = createAndAppend("div", simulation.rightDiv);
    simulation.visualizations = {};
    simulation.timeSeries = [];
    simulation.histograms = [];

    var timeSeriesNames = ["energy", "temperature", "counts", "pressure", "virialPressure", "entropy", "probability"];
    var histogramNames = ["countsHistogram"];

    for (var i = 0; i < timeSeriesNames.length; i++)
    {
        var name = timeSeriesNames[i];
        var graph = createGraph(createAndAppend("div", simulation.visualizationDiv), name);
        setGraphVisible(graph, false);
        simulation.visualizations[name] = graph;
        simulation.timeSeries.push(graph);
    }

    for (var i = 0; i < histogramNames.length; i++)
    {
        var name = histogramNames[i];
        var graph = createGraph(createAndAppend("div", simulation.visualizationDiv), name);
        setGraphVisible(graph, false);
        simulation.visualizations[name] = graph;
        simulation.histograms.push(graph);
    }

    for (var i = 0; i < opts.visualizations.length; i++)
    {
        setGraphVisible(simulation.visualizations[opts.visualizations[i]], true);
    }


    simulation.renderer = createRenderer(simulation.canvas);

    // ! boxes

    var aspectRatio = simulation.canvas.width / simulation.canvas.height;
    var origin = v2(0, 0);

    setCenterWidthHeight(
        simulation.renderer.bounds,
        origin, 2 * aspectRatio, 2
    );

    updateRendererBounds(simulation.renderer);

    var boxBounds = simulation.boxBounds;
    setCenterWidthHeight(boxBounds,
        origin, 2 * aspectRatio, 2
    );

    setLeftTopRightBottom(simulation.rightRect,
        boxBounds.center[0], boxBounds.top,
        boxBounds.right, boxBounds.bottom);
    setLeftTopRightBottom(simulation.leftRect,
        boxBounds.left, boxBounds.top,
        boxBounds.center[0], boxBounds.bottom);

    simulation.quadTree = new Quadtree(boxBounds);

    var b = simulation.boxBounds;
    var corners = [
        v2(b.left, b.bottom),
        v2(b.right, b.bottom),
        v2(b.right, b.top),
        v2(b.left, b.top),
    ];

    // ! Grid


    var minGridSideLength = simulation.parameters.radiusScaling * simulation.parameters.cutoffFactor;
    var colCount = Math.floor(simulation.boxBounds.width / minGridSideLength);
    var rowCount = Math.floor(simulation.boxBounds.height / minGridSideLength);

    simulation.particleGrid = {
        cells: [],
        colCount: colCount,
        rowCount: rowCount,
        dx: simulation.boxBounds.width / colCount,
        dy: simulation.boxBounds.height / rowCount,
    };

    for (var cellIndex = 0; cellIndex < (colCount * rowCount); cellIndex++)
    {
        simulation.particleGrid.cells[cellIndex] = [];
    }

    // Walls

    simulation.walls = opts.walls;

    for (var i = 0; i < corners.length; i++)
    {
        var wall = new Wall(corners[i], corners[(i + 1) % corners.length]);
        simulation.walls.push(wall);
    }

    // ! Measurements


    if (opts.measurementRegions.length > 0)
    {
        simulation.measurementRegions = opts.measurementRegions;
    }
    else
    {
        var totalRegion = createMeasurementRegion();
        copyRectangle(totalRegion.bounds, simulation.boxBounds);
        simulation.measurementRegions = [totalRegion];
    }
    simulation.entropy = [];
    simulation.probability = [];

    // ! Start simulation

    updateParticleCount(simulation);

    simulation.updateFunction = function(timestamp)
    {
        updateSimulation(simulation.updateFunction, simulation, timestamp);
    };

    simulation.requestFrameId = window.requestAnimationFrame(simulation.updateFunction);

    return simulation;
}

function resetSimulation(simulation)
{
    simulation.parameters.particleCount = 0;
    updateParticleCount(simulation);

    simulation.parameters = {};
    combineWithDefaults(simulation.parameters, simulation.initialParameters);

    updateParticleCount(simulation);
}

// TODO: calculate both energy and force at the same time
function lennardJonesEnergy(invR)
{
    // TODO: truncate and shift, see wikipedia
    var a6 = Math.pow(invR, 6);
    return (a6 - 2) * a6;
}

function lennardJonesForce(invR)
{
    var a6 = Math.pow(invR, 6);
    return (12 * invR * (a6 * a6 - a6));
}

function lennardJonesVirial(invR2)
{
    var a6 = invR2 * invR2 * invR2;
    return (12 * (a6 * a6 - a6));
}

// TODO: maybe have all these be of the same form

function softLennardJonesEnergy(r, softness, n, m)
{
    var factor = 1 / (softness + Math.pow(r, n));
    var term = Math.pow(factor, m);
    return (term * term - 2 * term);
}

function softLennardJonesForce(r, softness, n, m)
{
    var factor = 1 / (softness + Math.pow(r, n));
    var term = Math.pow(factor, m);
    var preFactor = m * n * Math.pow(r, n - 1) * factor;
    return preFactor * 2 * (term * term - term);
}

function applyLangevinNoise(particles, viscosity, temperature)
{
    if (viscosity > 0)
    {
        var viscosityFactor = Math.exp(-viscosity * dt * 0.5);
        var gaussianFactor = Math.sqrt((1 - square(viscosityFactor)));

        for (var particleIndex = 0; particleIndex < particles.length;
            ++particleIndex)
        {
            var particle = particles[particleIndex];

            var thermalVelocity = Math.sqrt(temperature / particle.mass);

            var gaussianVector = v2.alloc();
            // TODO: maybe divide by sqrt2? probably not
            v2.scale(particle.velocity, particle.velocity, viscosityFactor);
            v2.set(gaussianVector, randomGaussian(), randomGaussian());
            v2.scaleAndAdd(particle.velocity, particle.velocity,
                gaussianVector, gaussianFactor * thermalVelocity)
            v2.free(gaussianVector)
        }
    }
}

// ! Colors

colors = {};

function addColor(color)
{
    colors[color.name] = color;
}

addColor(
{
    name: "blue",
    rgba: [0, 0, 1, 1],
});

addColor(
{
    name: "red",
    rgba: [1, 0, 0, 1],
});

addColor(
{
    name: "green",
    rgba: [0, 1, 0, 1],
});

addColor(
{
    name: "yellow",
    rgba: [1, 0.8, 0, 1],
});

addColor(
{
    name: "black",
    rgba: [0, 0, 0, 1],
})

addColor(
{
    name: "white",
    rgba: [0, 0, 0, 1],
})

addColor(
{
    name: "gray",
    rgba: [0.5, 0.5, 0.5, 1],
})

addColor(
{
    name: "transparent",
    rgba: [0, 0, 0, 0],
})

function withAlpha(color, alpha)
{
    return {
        name: color.name,
        rgba: [color.rgba[0], color.rgba[1], color.rgba[2], alpha],
    }
}

// ! Simulation


function drawSimulation(simulation)
{
    clearRenderer(simulation.renderer);

    for (var regionIndex = 0; regionIndex < simulation.measurementRegions.length; regionIndex++)
    {
        var region = simulation.measurementRegions[regionIndex];
        drawRectangle(simulation.renderer, region.bounds, region.overlayColor);
    }

    for (var i = 0; i < simulation.walls.length; i++)
    {
        var wall = simulation.walls[i];
        // TODO: one drawWalls call, to reduce number of draw calls
        drawTrajectory(simulation.renderer, wall.vertices, colors.black);
    }

    drawParticles(simulation.renderer, simulation.particles, simulation.parameters.isPeriodic);

    if (simulation.parameters.trajectoryEnabled)
    {
        drawTrajectory(simulation.renderer, simulation.trajectory, colors.blue);
    }

    var billiardCue = simulation.mouse.billiardCue;
    if (billiardCue.visible)
    {
        var billiardCueTrajectory = [billiardCue.start, billiardCue.end];
        drawTrajectory(simulation.renderer, billiardCueTrajectory, colors.black);
    }

    if (simulation.mouse.mode == "dragParticle")
    {
        var particle = simulation.particles[simulation.mouse.activeParticleIndex];
        drawArrow(simulation.renderer, particle.position, simulation.mouse.worldPosition);
    }
}

var updateSimulation = function()
{

    var relativePosition = v2(0, 0);
    var relativeVelocity = v2(0, 0);
    var deltaVelocity = v2(0, 0);
    var deltaAcceleration = v2(0, 0);

    var wallNormal = v2(0, 0);
    var projection = v2(0, 0);
    var gravityAcceleration = v2(0, 0);

    return function(updateFunction, simulation, timestamp)
    {

        // ! Process input

        // TODO: handle periodic boundary conditions

        if (simulation.mouse.leftButton.transitionCount > 0)
        {
            var billiardCue = simulation.mouse.billiardCue;
            if ((simulation.mouse.mode === "billiardCue") && billiardCue.visible)
            {
                // Let go of billiardCue
                var activeParticle = simulation.particles[simulation.mouse.activeParticleIndex]
                v2.subtract(relativePosition, activeParticle.position, simulation.mouse.worldPosition);
                v2.scaleAndAdd(activeParticle.velocity, activeParticle.velocity,
                    relativePosition, billiardCue.strength);
                billiardCue.visible = false;
            }

            simulation.mouse.mode = "";
        }

        if (simulation.mouse.leftButton.down)
        {
            // TODO: make this check for the actual radius of particle added
            var extraRadius = simulation.parameters.radiusScaling;
            var pickedParticle = pickParticle(simulation, simulation.mouse.worldPosition, extraRadius);
            var isCloseToParticle = (pickedParticle >= 0);

            var hitParticle = pickParticle(simulation, simulation.mouse.worldPosition);
            var isOnParticle = (hitParticle >= 0);

            if (simulation.mouse.mode === "")
            {
                var latestDownKey = arrayLast(simulation.downKeys);
                if (latestDownKey == "c")
                {
                    simulation.mouse.mode = "createParticles";
                }
                else if (latestDownKey == "d")
                {
                    simulation.mouse.mode = "destroyParticles";
                }
                else if (latestDownKey == "b")
                {
                    if (isOnParticle)
                    {
                        simulation.mouse.mode = "billiardCue";
                        simulation.mouse.activeParticleIndex = hitParticle;
                    }
                }
                else if (isOnParticle)
                {
                    simulation.mouse.mode = "dragParticle";
                    simulation.mouse.activeParticleIndex = hitParticle;
                }
            }

            if ((simulation.mouse.mode == "createParticles") && (!isCloseToParticle))
            {
                addParticle(simulation, simulation.mouse.worldPosition);
            }
            else if (simulation.mouse.mode == "destroyParticles")
            {
                if (hitParticle >= 0)
                {
                    removeParticle(simulation, hitParticle);
                }
            }
            else if (simulation.mouse.mode == "billiardCue")
            {
                var billiardCue = simulation.mouse.billiardCue;
                var activeParticle = simulation.particles[simulation.mouse.activeParticleIndex]
                v2.subtract(relativePosition, simulation.mouse.worldPosition, activeParticle.position);
                billiardCue.visible = v2.square(relativePosition) > squared(activeParticle.radius);
                v2.normalize(relativePosition, relativePosition);
                v2.copy(billiardCue.start, simulation.mouse.worldPosition);
                v2.scaleAndAdd(billiardCue.end, billiardCue.start, relativePosition, billiardCue.length);
            }
        }

        // ! Rescale radii

        for (var particleIndex = 0; particleIndex < simulation.particles.length; particleIndex++)
        {
            var particle = simulation.particles[particleIndex];
            particle.radius *= simulation.parameters.radiusScaling / simulation.radiusScaling;
        }
        simulation.radiusScaling = simulation.parameters.radiusScaling;

        updateParticleCount(simulation);


        if (!simulation.pausedByUser)
        {


            var params = simulation.parameters;

            // ! Keep track of time

            dt = params.dt;

            var elapsedSeconds = (timestamp - simulation.previousTimestamp) / 1000;

            // NOTE: attempt to avoid stalls by limiting max frame time
            elapsedSeconds = atMost(1 / 30, elapsedSeconds);

            simulation.previousTimestamp = timestamp;

            if (simulation.isFirstFrameAfterPause)
            {
                simulation.isFirstFrameAfterPause = false;
                elapsedSeconds = dt / params.simulationTimePerSecond;
            }

            simulation.timeLeftToSimulate += elapsedSeconds * params.simulationTimePerSecond;

            // ! Simulation loop with fixed timestep

            while (simulation.timeLeftToSimulate >= dt)
            {
                simulation.timeLeftToSimulate -= dt;

                // TODO: interpolate drawing? Shouldn't be needed with such a small timestep
                simulation.time += dt;

                v2.set(gravityAcceleration, 0, -params.gravityAcceleration);

                // ! Equations of motion
                var particles = simulation.particles;
                var particleCount = simulation.particles.length;

                // langevin setup

                applyLangevinNoise(particles, params.thermostatSpeed, params.thermostatTemperature);

                for (var particleIndex = 0; particleIndex < particleCount;
                    ++particleIndex)
                {
                    var particle = particles[particleIndex];

                    // Scale velocities with delta temperature

                    v2.scale(particle.velocity, particle.velocity,
                        Math.pow(params.velocityAmplification, dt));



                    // velocity verlet
                    v2.scaleAndAdd(particle.velocity, particle.velocity, particle.acceleration, 0.5 * dt);


                    // reset stuff before next loop
                    v2.copy(particle.acceleration, gravityAcceleration);
                    particle.potentialEnergy = -v2.inner(particle.position, gravityAcceleration);
                    particle.pressure = 0;
                    particle.virial = 0;
                }

                // ! Collision

                // TODO: ensure this works with time backwards (dt < 0),
                // perhaps by using deltaPosition, and a remainingTime that's always positive
                // or by flipping velocities when time gets < 0 and having dt > 0

                var remainingTime = dt;

                if (params.collisionEnabled)
                {
                    var collisionPool = new Pool(createCollision);
                    var collisions = [];
                    var firstCollisions = [];

                    for (var particleIndex = 0; particleIndex < particleCount; ++particleIndex)
                    {
                        var particle = particles[particleIndex];

                        if (params.isParticleParticleCollisionEnabled)
                        {
                            for (var otherParticleIndex = 0; otherParticleIndex < particleIndex; ++otherParticleIndex)
                            {
                                var otherParticle = particles[otherParticleIndex];
                                recordParticleParticleCollision(
                                    collisionPool, collisions,
                                    particle, otherParticle,
                                    remainingTime, simulation.boxBounds, params.isPeriodic);
                            }
                        }

                        for (var wallIndex = 0; wallIndex < simulation.walls.length; wallIndex++)
                        {
                            var wall = simulation.walls[wallIndex];
                            recordWallParticleCollision(
                                collisionPool, collisions,
                                wall, particle,
                                remainingTime);
                        }
                    }

                    var maxCollisionPassCount = 100;
                    var collisionPassCount = 0;
                    while (collisions.length != 0)
                    {
                        // make sure we don't hang here
                        collisionPassCount += 1;
                        if (collisionPassCount > maxCollisionPassCount)
                        {
                            break;
                        }

                        // take first collision
                        var firstIndex = arrayMinIndex(collisions, function(c)
                        {
                            return c.time;
                        });

                        var firstCollisionTime = collisions[firstIndex].time;
                        remainingTime -= firstCollisionTime;

                        firstCollisions.length = 0;
                        for (var collisionIndex = 0; collisionIndex < collisions.length; collisionIndex++)
                        {
                            // TODO: should probably be epsilon here
                            var collision = collisions[collisionIndex];
                            if (collision.time === firstCollisionTime)
                            {
                                firstCollisions.push(collision);
                            }
                        }

                        // advance time for everyone
                        for (var particleIndex = 0; particleIndex < particles.length; particleIndex++)
                        {
                            var particle = particles[particleIndex];
                            v2.scaleAndAdd(particle.position, particle.position, particle.velocity, firstCollisionTime);
                        }

                        for (var firstCollisionIndex = 0; firstCollisionIndex < firstCollisions.length; firstCollisionIndex++)
                        {
                            // ! Collision
                            // TODO: energy corrections (to conserve energy)

                            var firstCollision = firstCollisions[firstCollisionIndex];

                            var normal = v2.alloc();
                            var massSum = firstCollision.first.mass + firstCollision.second.mass;

                            v2.subtract(relativeVelocity, firstCollision.first.velocity, firstCollision.second.velocity);
                            v2.projectOntoNormal(deltaVelocity, relativeVelocity, firstCollision.normal);

                            var velocityScalingFirst = (firstCollision.second.mass == Infinity) ?
                                1 : (firstCollision.second.mass / massSum);
                            var velocityScalingSecond = (firstCollision.first.mass == Infinity) ?
                                1 : (firstCollision.first.mass / massSum);

                            var restitutionFactor = 1 + params.coefficientOfRestitution;

                            v2.scaleAndAdd(firstCollision.first.velocity, firstCollision.first.velocity,
                                deltaVelocity, -restitutionFactor * velocityScalingFirst);
                            v2.scaleAndAdd(firstCollision.second.velocity, firstCollision.second.velocity,
                                deltaVelocity, restitutionFactor * velocityScalingSecond);

                            // remove collisions for involved particles

                            for (var collisionIndex = 0; collisionIndex < collisions.length; collisionIndex++)
                            {
                                var c = collisions[collisionIndex];

                                if ((c.first === firstCollision.first) || (c.first === firstCollision.second) || (c.second === firstCollision.first) || (c.second === firstCollision.second))
                                {
                                    collisions.splice(collisionIndex--, 1);
                                    continue;
                                }
                            }

                            // calculate any new collisions for involved particles

                            var isParticleParticleCollision = (firstCollision.type == CollisionType.particleParticle);

                            if (params.isParticleParticleCollisionEnabled)
                            {

                                for (var particleIndex = 0; particleIndex < particles.length; particleIndex++)
                                {
                                    // TODO: make firstCollision.first and second be indices
                                    var particle = particles[particleIndex];

                                    if ((particle !== firstCollision.first) && (particle !== firstCollision.second))
                                    {
                                        if (isParticleParticleCollision)
                                        {
                                            recordParticleParticleCollision(
                                                collisionPool, collisions,
                                                particle, firstCollision.first,
                                                remainingTime, simulation.boxBounds, params.isPeriodic);
                                        }
                                        recordParticleParticleCollision(
                                            collisionPool, collisions,
                                            particle, firstCollision.second,
                                            remainingTime, simulation.boxBounds, params.isPeriodic);
                                    }
                                }
                            }

                            for (var wallIndex = 0; wallIndex < simulation.walls.length; wallIndex++)
                            {
                                var wall = simulation.walls[wallIndex];

                                if (isParticleParticleCollision)
                                {
                                    recordWallParticleCollision(
                                        collisionPool, collisions,
                                        wall, firstCollision.first,
                                        remainingTime);
                                }
                                recordWallParticleCollision(
                                    collisionPool, collisions,
                                    wall, firstCollision.second,
                                    remainingTime);
                            }

                            poolFree(collisionPool, firstCollision);
                        }
                    }

                }

                // move last bit

                for (var particleIndex = 0; particleIndex < particles.length; particleIndex++)
                {
                    var particle = particles[particleIndex];
                    v2.scaleAndAdd(particle.position, particle.position, particle.velocity, remainingTime);
                }

                // ! put particles in grid

                for (var i = 0; i < simulation.particleGrid.cells.length; i++)
                {
                    simulation.particleGrid.cells[i].length = 0;
                }

                for (var particleIndex = 0; particleIndex < simulation.particles.length; particleIndex++)
                {
                    var particle = simulation.particles[particleIndex];
                    var col = Math.floor((particle.position[0] - simulation.boxBounds.left) / simulation.particleGrid.dx);
                    var row = Math.floor((particle.position[1] - simulation.boxBounds.bottom) / simulation.particleGrid.dy);
                    col = mod(col, simulation.particleGrid.colCount);
                    row = mod(row, simulation.particleGrid.rowCount);
                    var cellIndex = row * simulation.particleGrid.colCount + col;
                    simulation.particleGrid.cells[cellIndex].push(particle);
                    particle.gridCellIndex = cellIndex;
                }


                // TODO: handle overlap, because it sometimes happens
                // might be because walls do not use prior collision code


                // ! Calculate force and energy

                var squareCutoffFactor = square(params.cutoffFactor);


                for (var particleIndex = 0; particleIndex < particleCount; particleIndex++)
                {
                    var particle = particles[particleIndex];

                    var gridRadius = 1;
                    for (var dx = -gridRadius; dx <= gridRadius; dx++)
                    {
                        for (var dy = -gridRadius; dy <= gridRadius; dy++)
                        {
                            var cellIndex = particle.gridCellIndex + simulation.particleGrid.colCount * dy + dx;
                            // TODO: handle periodic boundary
                            if ((cellIndex < 0) || (simulation.particleGrid.cells.length <= cellIndex))
                            {
                                continue;
                            }
                            var cell = simulation.particleGrid.cells[cellIndex];
                            for (var otherParticleIndex = 0; otherParticleIndex < cell.length; otherParticleIndex++)
                            {
                                var otherParticle = cell[otherParticleIndex];
                                if (particle === otherParticle)
                                {
                                    continue;
                                }

                                var interaction = getInteraction(simulation, particle.particleType, otherParticle.particleType);
                                if (interaction == Interaction.none)
                                {
                                    continue;
                                }
                                var isCoulombInteraction = (interaction == Interaction.coulombSame) || (interaction == Interaction.coulombDifferent);

                                var separationFactor = params.separationFactor;
                                var distanceLimit = (particle.radius + otherParticle.radius);
                                var separation = separationFactor * distanceLimit;

                                v2.subtract(relativePosition, otherParticle.position, particle.position);
                                if (params.isPeriodic)
                                {
                                    v2.periodicize(relativePosition, relativePosition, simulation.boxBounds);
                                }
                                var quadrance = v2.square(relativePosition);
                                var invQuadrance = 1 / quadrance;
                                var squareSeparation = square(separation);

                                var potentialEnergy = 0;
                                var virial = 0;

                                if (interaction == Interaction.repulsive)
                                {
                                    if (quadrance > squareSeparation)
                                    {
                                        continue;
                                    }
                                    potentialEnergy += params.lennardJonesStrength;
                                }

                                // TODO: shift the potential to account for truncation
                                if (quadrance > (squareCutoffFactor * squareSeparation))
                                {
                                    continue;
                                }

                                // ! Lennard-jones
                                var a2 = squareSeparation * invQuadrance;
                                var a6 = a2 * a2 * a2;
                                potentialEnergy += params.lennardJonesStrength * (a6 - 2) * a6;
                                virial += params.lennardJonesStrength * 12 * (a6 - 1) * a6;

                                if (isCoulombInteraction)
                                {
                                    // TODO: energy is positive in ground state, is that correct?
                                    var chargeProduct = (interaction == Interaction.coulombSame) ? 1 : -1;

                                    // NOTE: fake coulomb
                                    var coulombFactor = params.coulombStrength * chargeProduct;
                                    var coulombEnergy = coulombFactor * invQuadrance;
                                    virial += 2 * coulombEnergy;
                                    potentialEnergy += coulombEnergy;

                                }

                                // TODO: one loop for each interaction intead of one loop with a lot of ifs

                                var forceFactor = -virial * invQuadrance;

                                v2.scaleAndAdd(particle.acceleration, particle.acceleration,
                                    relativePosition, forceFactor / particle.mass);
                                v2.scaleAndAdd(otherParticle.acceleration, otherParticle.acceleration,
                                    relativePosition, -forceFactor / otherParticle.mass);

                                // Measurements

                                particle.potentialEnergy += potentialEnergy / 2;
                                otherParticle.potentialEnergy += potentialEnergy / 2;

                                var halfVirial = virial / 2;
                                particle.virial += halfVirial;
                                otherParticle.virial += halfVirial;
                            }
                        }
                    }

                    // Friction
                    v2.scaleAndAdd(particle.acceleration, particle.acceleration,
                        particle.velocity, -params.friction / particle.mass);
                }



                // ! User interaction

                if (simulation.mouse.activeParticleIndex >= 0)
                {
                    var particle = particles[simulation.mouse.activeParticleIndex];
                    if (simulation.mouse.mode === "dragParticle")
                    {
                        // TODO: friction while dragging?
                        var dragStrength = 1;
                        v2.subtract(relativePosition, simulation.mouse.worldPosition, particle.position);
                        v2.scaleAndAdd(particle.acceleration, particle.acceleration,
                            relativePosition, dragStrength);
                        v2.scaleAndAdd(particle.acceleration, particle.acceleration,
                            particle.velocity, -1 / particle.mass);
                    }
                }

                for (var particleIndex = 0; particleIndex < particleCount;
                    ++particleIndex)
                {
                    var particle = particles[particleIndex];

                    // finish velocity verlet
                    v2.scaleAndAdd(particle.velocity, particle.velocity, particle.acceleration, 0.5 * dt);

                    // calculate quantities

                    particle.kineticEnergy = 0.5 * particle.mass * v2.square(particle.velocity);

                    // ! Periodic boundary conditions
                    if (params.isPeriodic)
                    {
                        v2.periodicize(particle.position, particle.position, simulation.boxBounds);
                    }
                }

                applyLangevinNoise(particles, params.thermostatSpeed, params.thermostatTemperature);

            }

            // ! Things done once per frame, not once per simulation step

            // ! Input cleanup

            simulation.mouse.leftButton.transitionCount = 0;
            simulation.mouse.rightButton.transitionCount = 0;

            // ! Trajectory

            if (params.trajectoryEnabled && (simulation.particles.length > 0))
            {
                simulation.trajectory.push(v2.clone(simulation.particles[0].position));
            }

            // ! Measurements

            if (params.measurementEnabled)
            {
                // TODO: record measurements for each simulation step, but only draw once?
                // maybe not, once per frame should be enough for showing

                var totalEntropy = 0;
                var probabilities = [];
                var counts = [];
                var totalArea = rectangleArea(simulation.boxBounds);

                var barWidth = 1 / simulation.measurementRegions.length;
                for (var regionIndex = 0; regionIndex < simulation.measurementRegions.length; regionIndex++)
                {
                    var region = simulation.measurementRegions[regionIndex];
                    var m = region.measurements;

                    // Add new value, remove old, crufty ones
                    m.time.push(simulation.time);
                    var tooOldCount = -1;
                    // NOTE: save more data than shown, to avoid weird autoscaling in plots
                    while ((simulation.time - m.time[++tooOldCount]) > 2 * params.measurementWindowLength)
                    {};

                    for (var key in m)
                    {
                        m[key].splice(0, tooOldCount);
                    }

                    var regionEnergy = 0;
                    var regionTemperature = 0;
                    var regionCount = 0;
                    var regionPressure = 0;
                    var regionVirialSum = 0;
                    var regionArea = rectangleArea(region.bounds);

                    for (var particleIndex = 0; particleIndex < simulation.particles.length; particleIndex++)
                    {
                        var particle = simulation.particles[particleIndex];

                        if (doesRectContainPoint(region.bounds, particle.position))
                        {
                            regionPressure += particle.pressure;
                            regionEnergy += (particle.potentialEnergy + particle.kineticEnergy);
                            regionTemperature += particle.kineticEnergy;
                            regionCount += 1;
                            regionVirialPressure = particle.virial;
                        }
                    }

                    regionTemperature /= regionCount;
                    var dimension = 2;
                    var regionVirialPressure = (regionVirialSum / dimension + regionTemperature * regionCount) / regionArea;


                    m.energy.push(regionEnergy);
                    m.temperature.push(regionTemperature);
                    m.count.push(regionCount);
                    m.pressure.push(regionPressure);
                    m.virialPressure.push(regionVirialPressure);


                    var smoothingWindowSize = atMost(2, m.pressure.length);
                    var smoothingFactor = 0;
                    // TODO: optimize this when adding just one sample, by only computing delta from previous smoothed value
                    var cosFactor = tau / (smoothingWindowSize - 1);
                    var windowSum = 0;
                    for (var i = 0; i < smoothingWindowSize; i++)
                    {
                        var w = lerp(1, smoothingFactor, Math.cos(i * cosFactor));
                        windowSum += w * m.pressure[m.pressure.length - 1 - i];
                    }
                    var windowAverage = windowSum / smoothingWindowSize;
                    m.smoothedPressure.push(windowAverage);


                    // TODO: only draw the viz that are visible

                    addCurve(simulation.visualizations.energy,
                    {
                        x: m.time,
                        y: m.energy,
                        color: region.color
                    });
                    addCurve(simulation.visualizations.temperature,
                    {
                        x: m.time,
                        y: m.temperature,
                        color: region.color
                    });
                    addCurve(simulation.visualizations.counts,
                    {
                        x: m.time,
                        y: m.count,
                        color: region.color,
                    });
                    addCurve(simulation.visualizations.pressure,
                    {
                        x: m.time,
                        y: m.smoothedPressure,
                        color: region.color,
                    });
                    addCurve(simulation.visualizations.virialPressure,
                    {
                        x: m.time,
                        y: m.virialPressure,
                        color: region.color,
                    });
                    addBars(simulation.visualizations.countsHistogram,
                    {
                        bars: [
                        {
                            start: barWidth * regionIndex,
                            end: barWidth * (regionIndex + 1),
                            value: regionCount,
                            color: region.color,
                        }]
                    });

                    totalEntropy += microstateEntropy(regionCount / simulation.particles.length);
                    probabilities.push(regionArea / totalArea);
                    counts.push(regionCount);
                }

                // TODO: make a list with global visualizations too

                simulation.times.push(simulation.time);
                simulation.entropy.push(totalEntropy);
                simulation.probability.push(multinomial(probabilities, counts));

                var tooOldCount = -1;
                // NOTE: save more data than shown, to avoid weird autoscaling in plots
                while ((simulation.time - simulation.times[++tooOldCount]) > 2 * params.measurementWindowLength)
                {};

                simulation.entropy.splice(0, tooOldCount);
                simulation.times.splice(0, tooOldCount);
                simulation.probability.splice(0, tooOldCount);

                addCurve(simulation.visualizations.entropy,
                {
                    x: m.time,
                    y: simulation.entropy,
                });

                addCurve(simulation.visualizations.probability,
                {
                    x: m.time,
                    y: simulation.probability,
                });

                // ! Plot things

                setGraphLimits(simulation.visualizations.counts,
                {
                    yMax: simulation.particles.length
                });
                setGraphLimits(simulation.visualizations.entropy,
                {
                    yMax: 1
                });
                setGraphLimits(simulation.visualizations.probability,
                {
                    yMax: 1
                });

                simulation.customUpdate(simulation);

                // ! Drawing

                for (var i = 0; i < simulation.timeSeries.length; ++i)
                {
                    var graph = simulation.timeSeries[i];
                    var xMin = simulation.time - params.measurementWindowLength;
                    var xMax = simulation.time;

                    addCurve(graph,
                    {
                        x: [xMin, xMax],
                        y: [0, 0],
                    });

                    // TODO: make the limits change smoothly, so it's less noticable
                    setGraphLimits(graph,
                    {
                        xMin: xMin,
                        xMax: xMax,
                    });
                    var limits = getLimits(graph);
                    addCurve(graph,
                    {
                        x: [xMin, xMin],
                        y: [limits.yMin, limits.yMax],
                    });

                    drawGraph(graph);
                }

                setGraphLimits(simulation.visualizations.countsHistogram,
                {
                    xMin: 0,
                    xMax: 1,
                    yMin: 0,
                    yMax: simulation.particles.length
                });
                drawGraph(simulation.visualizations.countsHistogram);
            }

        }

        drawSimulation(simulation);

        simulation.requestFrameId = window.requestAnimationFrame(updateFunction);
    }
}();

// ! Math stuff

function atLeast(a, b)
{
    return Math.max(a, b);
}

function atMost(a, b)
{
    return Math.min(a, b);
}

function lerp(a, t, b)
{
    return (a + (b - a) * t);
}

function mod(a, b)
{
    var result = a % b;
    if (result < 0)
    {
        result += b;
    }
    return result;
}

function microstateEntropy(p)
{
    if (p == 0)
    {
        return 0;
    }
    else
    {
        return -p * Math.log2(p);
    }
}

function squared(x)
{
    return x * x
};

function sum(array)
{
    return array.reduce(function(x, y)
    {
        return x + y;
    });
}

function binomial(n, k)
{
    var product = 1;
    for (var i = 0; i < k; i++)
    {
        product *= (n - 1 - i) / i;
    }
    return product;
}

var factorial = function()
{
    var cache = [1];

    return function(n)
    {
        if (n < 0)
        {
            return;
        }
        n = Math.floor(n);
        if (n >= cache.length)
        {
            for (var i = cache.length; i <= n; i++)
            {
                cache.push(cache[i - 1] * i);
            }
        }
        return cache[n];
    }
}();


function multinomial(probabilities, counts)
{
    var product = factorial(sum(counts));
    for (var i = 0; i < counts.length; i++)
    {
        product *= Math.pow(probabilities[i], counts[i]);
        product /= factorial(counts[i]);
    }
    return product;
}


// ! Rectangle



function Rectangle()
{
    this.left = 0;
    this.right = 0;
    this.top = 0;
    this.bottom = 0;
    this.width = 0;
    this.height = 0;
    this.center = v2(0, 0);
    return this;
}

function setLeftTopRightBottom(rectangle, left, top, right, bottom)
{
    rectangle.left = left;
    rectangle.right = right;
    rectangle.top = top;
    rectangle.bottom = bottom;
    rectangle.width = right - left;
    rectangle.height = top - bottom;
    v2.set(rectangle.center, (left + right) / 2, (top + bottom) / 2);
    return rectangle;
}

function setLeftTopWidthHeight(rectangle, left, top, width, height)
{
    rectangle.left = left;
    rectangle.top = top;
    rectangle.right = left + width;
    rectangle.bottom = top - height;
    rectangle.width = width;
    rectangle.height = height;
    v2.set(rectangle.center, left + width / 2, top + height / 2);
    return rectangle;
}

function setCenterWidthHeight(rectangle, center, width, height)
{
    var halfWidth = width / 2;
    var halfHeight = height / 2;
    rectangle.left = center[0] - halfWidth;
    rectangle.top = center[1] + halfHeight;
    rectangle.right = center[0] + halfWidth;
    rectangle.bottom = center[1] - halfHeight;
    rectangle.width = width;
    rectangle.height = height;
    v2.copy(rectangle.center, center);
    return rectangle;
}

function copyRectangle(newRect, rect)
{
    newRect.left = rect.left;
    newRect.right = rect.right;
    newRect.top = rect.top;
    newRect.bottom = rect.bottom;
    newRect.width = rect.width;
    newRect.height = rect.height;
    newRect.center = v2.clone(rect.center);
    return newRect;
}

function doesRectContainRect(outer, inner)
{
    var insideX = (outer.left <= inner.left) && (inner.right <= outer.right);
    var insideY = (outer.bottom <= inner.bottom) && (inner.top <= outer.top);
    return insideX && insideY;
}

function doesRectContainPoint(rectangle, point)
{
    var insideX = (rectangle.left <= point[0]) && (point[0] <= rectangle.right)
    var insideY = (rectangle.bottom <= point[1]) && (point[1] <= rectangle.top)
    return insideX && insideY;
}

function randomPointInRect(rect)
{
    return v2(randomInInterval(rect.left, rect.right),
        randomInInterval(rect.top, rect.bottom));
}

function randomInInterval(a, b)
{
    return lerp(a, Math.random(), b);
}

// NOTE: generates 2 at a time, saves the one not immediately returned
var randomGaussian = function()
{
    var returnX = true;
    var outX, outY;

    return function()
    {
        returnX = !returnX;

        if (returnX)
        {
            return outX;
        }

        var x, y;
        do {
            x = 2 * Math.random() - 1;
            y = 2 * Math.random() - 1;
            w = x * x + y * y;
        } while (w >= 1.0)

        w = Math.sqrt((-2 * Math.log(w)) / w);
        outX = x * w;
        outY = y * w;

        return outY;
    }
}();

function rectangleArea(rectangle)
{
    return (rectangle.width * rectangle.height);
}

// ! Intersection

function intersectionOriginCircleLine(
    circleRadius,
    lineStart, lineVector
)
{
    var dotAB = v2.inner(lineStart, lineVector);
    var bSq = v2.square(lineVector);
    var rootInput = square(dotAB) + bSq * (squared(circleRadius) - v2.square(lineStart));
    if ((bSq > 0) && (rootInput > 0))
    {
        var root = Math.sqrt(rootInput);
        var bSqInv = 1 / bSq;
        var t1 = (-dotAB - root) * bSqInv;
        var t2 = (-dotAB + root) * bSqInv;

        return {
            isIntersecting: true,
            t1: t1,
            t2: t2,
        }
    }
    else
    {
        return {
            isIntersecting: false
        };
    }
}

function intersectionOriginLineLine(originVector, start, vector)
{
    var invOuter = 1 / v2.outer(originVector, vector);
    var tOriginLine = v2.outer(start, vector) * invOuter;
    var tLine = v2.outer(start, originVector) * invOuter;
    return {
        tOriginLine: tOriginLine,
        tLine: tLine,
    };
}


// ! Collision

var CollisionType = Object.freeze(
{
    particleParticle: 0,
    wallParticle: 1,
});

function createCollision()
{
    return {
        time: 0,
        normal: v2(),
        type: CollisionType.particleParticle,
        first: undefined,
        second: undefined,
    };
}

var collisionEpsilon = 0.01;

function recordParticleParticleCollision(collisionPool, collisions, particle, otherParticle, remainingTime, boxBounds, isPeriodic)
{
    var relativePosition = v2.alloc();
    var relativeVelocity = v2.alloc();

    v2.subtract(relativePosition, particle.position, otherParticle.position);
    if (isPeriodic)
    {
        v2.periodicize(relativePosition, relativePosition, boxBounds);
    }
    v2.subtract(relativeVelocity, particle.velocity, otherParticle.velocity);

    var radiusSum = particle.radius + otherParticle.radius;
    var intersection = intersectionOriginCircleLine(radiusSum,
        relativePosition, relativeVelocity);
    if (intersection.isIntersecting && ((-collisionEpsilon) <= intersection.t1) && (intersection.t1 < remainingTime))
    {
        var collision = poolAlloc(collisionPool);
        collision.type = CollisionType.particleParticle;
        collision.first = particle;
        collision.second = otherParticle;
        collision.time = atLeast(0, intersection.t1);
        v2.scaleAndAdd(collision.normal, relativePosition, relativeVelocity, collision.time);
        v2.normalize(collision.normal, collision.normal);
        collisions.push(collision);
    }

    v2.free(relativePosition);
    v2.free(relativeVelocity);
}

function recordWallParticleCollision(collisionPool, collisions, wall, particle, remainingTime)
{
    // TODO: periodicize so that collisions work across periodic boundary

    var wallVector = v2.alloc();
    var wallNormal = v2.alloc();
    var relativeWallStart = v2.alloc();
    var particleRelativeEndpoint = v2.alloc();

    var wallStart = wall.vertices[0];
    var wallEnd = wall.vertices[1];

    // Test the walls

    v2.subtract(wallVector, wallEnd, wallStart);
    v2.normalize(wallNormal, wallVector);
    v2.perpCCW(wallNormal, wallNormal);

    // NOTE: Only check the wall facing the velocity
    v2.scale(wallNormal, wallNormal, -Math.sign(v2.inner(wallNormal, particle.velocity)));

    v2.subtract(relativeWallStart, wallStart, particle.position);
    v2.scaleAndAdd(relativeWallStart, relativeWallStart, wallNormal, particle.radius);

    var intersection = intersectionOriginLineLine(particle.velocity, relativeWallStart, wallVector);
    var isIntersectingSide = (0 <= intersection.tLine) && (intersection.tLine <= 1);
    var isIntersectingNow = ((-collisionEpsilon) <= intersection.tOriginLine) && (intersection.tOriginLine < remainingTime);
    if (isIntersectingSide && isIntersectingNow)
    {
        var collision = poolAlloc(collisionPool);
        collision.type = CollisionType.wallParticle;
        collision.first = wall;
        collision.second = particle;
        collision.time = atLeast(0, intersection.tOriginLine);
        v2.copy(collision.normal, wallNormal);
        collisions.push(collision);
    }
    else
    {
        // Test the endpoints

        for (var i = 0; i < 2; i++)
        {
            v2.subtract(particleRelativeEndpoint, particle.position, wall.vertices[i]);

            var intersection = intersectionOriginCircleLine(particle.radius, particleRelativeEndpoint, particle.velocity);
            if (intersection.isIntersecting && ((-collisionEpsilon) <= intersection.t1) && (intersection.t1 < remainingTime))
            {
                var collision = poolAlloc(collisionPool);
                collision.type = CollisionType.wallParticle;
                collision.first = wall;
                collision.second = particle;
                collision.time = atLeast(0, intersection.t1);
                v2.scaleAndAdd(collision.normal, particleRelativeEndpoint, particle.velocity, collision.time);
                v2.normalize(collision.normal, collision.normal);
                collisions.push(collision);
                break;
            }
        }
    }

    v2.free(wallVector);
    v2.free(wallNormal);
    v2.free(relativeWallStart);
    v2.free(particleRelativeEndpoint);
}

// ! General collision

function closestToOriginBetween(out, a, b)
{
    v2.subtract(out, b, a);
    var t = -v2.inner(a, out) / v2.square(out);
    if (t <= 0)
    {
        return v2.copy(out, a);
    }
    if (t >= 1)
    {
        return v2.copy(out, b);
    }
    v2.scaleAndAdd(out, a, out, t);
    return out;
}

function isSameDirection(a, b)
{
    return v2.inner(a, b) > 0;
}

function support(supportVector, direction, shape)
{
    if (shape.shapeType == ShapeType.circle)
    {
        v2.scaleAndAdd(supportVector, shape.position, direction, shape.radius / v2.magnitude(direction));
        return supportVector;
    }

    if (shape.shapeType == ShapeType.polygon)
    {
        var maximumDistance = -Number.MAX_VALUE;
        var maximumVertex;
        for (var vertexIndex = 0; vertexIndex < shape.vertices.length; vertexIndex++)
        {
            var vertex = shape.vertices[vertexIndex];
            var distance = v2.inner(vertex, direction);
            if (distance > maximumDistance)
            {
                maximumDistance = distance;
                maximumVertex = vertex;
            }
        }
        return v2.copy(supportVector, maximumVertex);
    }
}

function doubleSupport(supportVector, direction, shape, otherShape)
{
    // TODO: do this more efficiently if we know the pair of shapes
    support(supportVector, direction, shape);
    var s = v2.alloc();
    var oppositeDirection = v2.scale(s, direction, -1);
    support(s, oppositeDirection, otherShape);
    v2.subtract(supportVector, supportVector, s);
    v2.free(s);
    return supportVector;
}

// TODO: Distance and intersection algorithms could probably be the same
function isIntersecting(shape, otherShape)
{
    var isIntersected;
    var direction = v2.alloc();
    var simplex0 = v2.alloc();
    var simplex1 = v2.alloc();
    var simplex2 = v2.alloc();
    var ab = v2.alloc();
    var ao = v2.alloc();
    var ac = v2.alloc();
    var abNormal = v2.alloc();
    var acNormal = v2.alloc();

    v2.set(direction, 1, 0);
    var a = simplex0;
    doubleSupport(a, direction, shape, otherShape);
    var simplex = [a, simplex1, simplex2];
    var simplexCount = 1;
    v2.scale(direction, a, -1);

    while (true)
    {
        var a = simplex[simplexCount++];
        doubleSupport(a, direction, shape, otherShape);
        if (v2.inner(a, direction) < 0)
        {
            isIntersected = false;
            break;
        }

        // do simplex

        if (simplexCount <= 1)
        {
            // assert
        }

        if (simplexCount == 2)
        {
            var a = simplex[1];
            var b = simplex[0];
            v2.subtract(ab, b, a);
            v2.scale(ao, a, -1);
            if (isSameDirection(ab, ao))
            {
                simplex[0] = a;
                simplex[1] = b;
                simplexCount = 2;
                v2.perpCCW(direction, ab);
                v2.scale(direction, direction, v2.outer(ab, ao));
            }
            else
            {
                simplex[0] = a;
                simplexCount = 1;
                v2.copy(direction, ao);
            }
        }

        if (simplexCount == 3)
        {
            var a = simplex[2];
            var b = simplex[1];
            var c = simplex[0];
            v2.subtract(ab, b, a);
            v2.subtract(ac, c, a);

            // "cross product" stuff
            var orientation = v2.outer(ab, ac);
            v2.perpCW(abNormal, ab);
            v2.scale(abNormal, abNormal, orientation);
            v2.perpCCW(acNormal, ac);
            v2.scale(acNormal, acNormal, orientation);
            v2.scale(ao, a, -1);

            var inStarRegion = false;
            if (isSameDirection(acNormal, ao))
            {
                if (isSameDirection(ac, ao))
                {
                    simplex[0] = a;
                    simplex[1] = c;
                    simplexCount = 2;
                    v2.copy(direction, acNormal);
                }
                else
                {
                    inStarRegion = true;
                }
            }
            else if (isSameDirection(abNormal, ao))
            {
                inStarRegion = true;
            }
            else
            {
                // origin is inside simplex
                isIntersected = true;
                break;
            }


            if (inStarRegion)
            {
                if (isSameDirection(ab, ao))
                {
                    simplex[0] = a;
                    simplex[1] = b;
                    simplexCount = 2;
                    v2.copy(direction, abNormal);
                }
                else
                {
                    simplex[0] = a;
                    simplexCount = 1;
                    v2.copy(direction, ao);
                }
            }
        }
    }
    v2.free(ab);
    v2.free(ac);
    v2.free(ao);
    v2.free(abNormal);
    v2.free(acNormal);
    v2.free(simplex0);
    v2.free(simplex1);
    v2.free(simplex2);
    v2.free(direction);
    return isIntersected;
}

function closestDistanceGJK(shape, otherShape)
{
    // TODO: test this!
    var distance;
    var direction = v2.alloc();
    var a = v2.alloc();
    var b = v2.alloc();
    var c = v2.alloc();
    var aCandidate = v2.alloc();
    var bCandidate = v2.alloc();

    v2.set(direction, 1, 0);
    doubleSupport(a, direction, shape, otherShape);
    doubleSupport(b, v2.scale(direction, direction, -1), shape, otherShape);
    closestToOriginBetween(direction, a, b);
    v2.scale(direction, direction, -1);

    while (true)
    {
        if (v2.isAlmostZero(direction))
        {
            // NOTE: touching
            distance = 0;
            break;
        }

        doubleSupport(c, direction, shape, otherShape);

        var cd = v2.inner(c, direction);
        var ad = v2.inner(a, direction);

        var tolerance = 0.00001;
        if ((cd - ad) < tolerance)
        {
            // too small of a step
            distance = v2.magnitude(direction);
            break;
        }

        closestToOriginBetween(aCandidate, a, c);
        closestToOriginBetween(bCandidate, b, c);

        if (v2.square(aCandidate) < v2.square(bCandidate))
        {
            v2.copy(b, c);
            v2.scale(direction, aCandidate, -1);
        }
        else
        {
            v2.copy(a, c);
            v2.scale(direction, bCandidate, -1);
        }

    }

    v2.free(a);
    v2.free(b);
    v2.free(c);
    v2.free(aCandidate);
    v2.free(bCandidate);
    v2.free(direction);
    // TODO: return normal too
    return distance;
}

function towardOriginFromLine(direction, lineStart, lineVector, factor)
{
    v2.perpCCW(direction, lineVector);
    var outer = v2.outer(lineStart, lineVector) * factor;
    var tolerance = 0.00001;
    if (Math.abs(outer) > tolerance)
    {
        v2.scale(direction, direction, outer);
    }
}


function searchForContact(stillShape, movingShape, velocity)
{
    var result = {
        isOverlapping: false,
        time: Infinity,
        normal: undefined,
    };

    if (v2.isZero(velocity))
    {
        // TODO: we haven't checked for overlap here
        return result;
    }

    var direction = v2.alloc();
    var a = v2.alloc();
    var b = v2.alloc();
    var c = v2.alloc();
    var ab = v2.alloc();
    var ac = v2.alloc();
    var bc = v2.alloc();

    // TODO: could probably do this algorithm without divides (intersections)
    // instead only use dot products
    v2.perpCCW(direction, velocity);
    doubleSupport(a, direction, stillShape, movingShape);
    doubleSupport(b, v2.scale(direction, direction, -1), stillShape, movingShape);
    v2.subtract(ab, b, a);

    var intersection = intersectionOriginLineLine(velocity, a, ab);
    var t = intersection.tLine;
    var isIntersecting = (0 < t) && (t < 1);
    var isBehind = (intersection.tOriginLine < 0);
    if (isIntersecting)
    {
        towardOriginFromLine(direction, a, ab, 1);

        while (true)
        {
            // TODO: maximum number of iterations to avoid locking up

            doubleSupport(c, direction, stillShape, movingShape);

            // TODO: compare the distance to intersection instead?
            var cd = v2.inner(c, direction);
            var ad = v2.inner(a, direction);
            var progressTowardOrigin = (cd - ad);

            var tolerance = 1e-5;
            if (progressTowardOrigin < tolerance)
            {
                v2.subtract(ab, b, a);
                var abIntersection = intersectionOriginLineLine(velocity, a, ab);
                result.normal = v2.alloc();
                towardOriginFromLine(result.normal, a, ab, -1);
                v2.normalize(result.normal, result.normal);
                result.time = (abIntersection.tOriginLine > 0) ? abIntersection.tOriginLine : Infinity;
                break;
            }

            // TODO: put the following in a function?

            v2.subtract(ac, c, a);
            var acIntersection = intersectionOriginLineLine(velocity, a, ac);
            var t = acIntersection.tLine;
            var acIsIntersecting = (0 <= t) && (t <= 1);

            if (acIsIntersecting)
            {
                var isInFront = (0 < acIntersection.tOriginLine);

                if (isBehind == isInFront)
                {
                    result.isOverlapping = true;
                    break;
                }

                v2.copy(b, c);
                towardOriginFromLine(direction, a, ac, 1);
                continue;
            }

            // NOTE: it has to intersect bc

            v2.subtract(bc, c, b);
            var bcIntersection = intersectionOriginLineLine(velocity, b, bc);

            var isInFront = (0 < bcIntersection.tOriginLine);

            if (isBehind == isInFront)
            {
                result.isOverlapping = true;
                break;
            }

            v2.copy(a, c);
            towardOriginFromLine(direction, b, bc, 1);
        }
    }

    v2.free(a);
    v2.free(b);
    v2.free(c);
    v2.free(ab);
    v2.free(bc);
    v2.free(ac);
    v2.free(direction);
    return result;
}

function isEqual(a, b)
{
    return (a == b);
}

function isApproximatelyEqual(a, b)
{
    var errorMargin = 0.001 * Math.max(Math.abs(a), Math.abs(b));
    return (Math.abs(a - b) <= errorMargin);
}


function test(testFunction, tests)
{
    var successCount = 0;
    var testCount = tests.length / 2;
    for (var i = 0; i < testCount; ++i)
    {
        var output = tests[2 * i];
        var expectedOutput = tests[2 * i + 1];
        var message;
        if (testFunction(output, expectedOutput))
        {
            successCount += 1;
        }
        else
        {
            console.log("Test " + i + " failed.");
            console.log("Expected [" + expectedOutput + "] but got [" + output + "].");
        }
    }
    console.log(successCount + "/" + testCount + " tests were successful.");
}

function testSearchForContact()
{
    var a = {
        type: "circle",
        center: v2(2, 0),
        radius: 1,
    };
    var b = {
        type: "circle",
        center: v2(-2, 0),
        radius: 1,
    };
    var c = {
        type: "circle",
        center: v2(0, 0),
        radius: 2,
    };
    var v = {
        type: "polygon",
        vertices: [v2(0, -1), v2(0, 1)]
    };
    var t = {
        type: "polygon",
        vertices: [v2(-2, 2), v2(2, 3)]
    };
    var movement = v2(1, 0);
    // Tested these with geogebra, seems okay
    var tests = [
        searchForContact(a, b, movement).time, 2,
        searchForContact(a, b, movement).normal[0], 1,
        searchForContact(v, b, movement).time, 1,
        searchForContact(a, c, movement).isOverlapping, true,
        searchForContact(v, c, movement).isOverlapping, true,
        searchForContact(v, t, movement).isOverlapping, false,
        searchForContact(c, t, movement).isOverlapping, false,
        searchForContact(t, c, v2(0, 1)).time, 0.4384,
    ];
    test(isApproximatelyEqual, tests);
    // TODO: Make this test reasonable
    console.log(searchForContact(b, a, movement));


}


function testGJK()
{
    var h = {
        type: "polygon",
        vertices: [v2(-1, 0), v2(1, 0)]
    };
    var v = {
        type: "polygon",
        vertices: [v2(0, -1), v2(0, 1)]
    };
    var t = {
        type: "polygon",
        vertices: [v2(-2, 0), v2(2, 1)]
    };
    var c = {
        type: "circle",
        center: v2(0, 0),
        radius: 0.01
    };

    var tests = [];
    var testBothWays = function(shape, otherShape, expected)
    {
        tests.push(isIntersecting(shape, otherShape), expected);
        tests.push(isIntersecting(shape, otherShape), expected);
    }

    testBothWays(h, v, true);
    testBothWays(h, t, false);
    testBothWays(v, t, true);
    testBothWays(c, t, false);
    testBothWays(c, h, true);
    testBothWays(c, v, true);

    test(isEqual, tests);
}

// ! Quadtree

Quadtree = function(bounds, maxObjects, maxDepth)
{
    this.objects = [];
    this.bounds = bounds;
    this.subtrees = undefined;
    this.maxObjects = maxObjects || 4;
    this.maxDepth = maxDepth || 7;
}

Quadtree.prototype.add = function(object)
{
    if (this.subtrees)
    {
        for (var subtreeIndex = 0; subtreeIndex < this.subtrees.length;
            ++subtreeIndex)
        {
            var subtree = this.subtrees[subtreeIndex];
            if (doesRectContainRect(subtree.bounds, object.bounds))
            {
                subtree.add(object);
                return;
            }
        }
        this.objects.push(object);
        return;
    }
    else
    {
        this.objects.push(object);

        if (this.objects.length > this.maxObjects)
        {
            // create subtrees
            var topLeft = setLeftTopRightBottom(new Rectangle(),
                this.bounds.left, this.bounds.top,
                this.bounds.center[0], this.bounds.center[1]);
            var topRight = setLeftTopRightBottom(new Rectangle(),
                this.bounds.center[0], this.bounds.top,
                this.bounds.right, this.bounds.center[1]);
            var bottomLeft = setLeftTopRightBottom(new Rectangle(),
                this.bounds.left, this.bounds.center[1],
                this.bounds.center[0], this.bounds.bottom);
            var bottomRight = setLeftTopRightBottom(new Rectangle(),
                this.bounds.center[0], this.bounds.center[1],
                this.bounds.right, this.bounds.bottom);
            this.subtrees = [new Quadtree(topLeft), new Quadtree(topRight),
                new Quadtree(bottomLeft), new Quadtree(bottomRight)
            ];
            for (var objectIndex = 0; objectIndex < this.objects.length;
                ++objectIndex)
            {
                var object = this.objects[objectIndex];
                for (var subtreeIndex = 0; subtreeIndex < this.subtrees.length;
                    ++subtreeIndex)
                {
                    var subtree = this.subtrees[subtreeIndex];
                    if (doesRectContainRect(subtree.bounds, object.bounds))
                    {
                        subtree.add(object);
                        break;
                    }
                }
            }
        }
    }

}

Quadtree.prototype.collideAll = function(collisionFunction)
{
    for (var objectIndex = 0; objectIndex < this.objects.length;
        ++objectIndex)
    {
        this.collideWith(this.objects[objectIndex], collisionFunction);
    }
    if (this.subtrees)
    {
        for (var subtreeIndex = 0; subtreeIndex < this.subtrees.length;
            ++subtreeIndex)
        {
            var subtree = this.subtrees[subtreeIndex];
            subtree.collideAll(collisionFunction);
        }
    }
}

Quadtree.prototype.collideWith = function(collider, collisionFunction)
{
    for (var objectIndex = 0; objectIndex < this.objects.length;
        ++objectIndex)
    {
        var object = this.objects[objectIndex];
        if (object != collider)
        {
            collisionFunction(collider, object);
        }
    }
    if (this.subtrees)
    {
        for (var subtreeIndex = 0; subtreeIndex < this.subtrees.length;
            ++subtreeIndex)
        {
            var subtree = this.subtrees[subtreeIndex];
            subtree.collideWith(collider, collisionFunction);
        }
    }
}

Quadtree.prototype.clear = function()
{
    this.objects = [];
    if (this.subtrees)
    {
        for (var subtreeIndex = 0; subtreeIndex < this.subtrees.length;
            ++subtreeIndex)
        {
            var subtree = this.subtrees[subtreeIndex];
            subtree.clear();
        }
    }
}