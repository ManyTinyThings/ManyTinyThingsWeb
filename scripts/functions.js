// Generally useful

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


// DOM stuff

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

// Graphs/Plots

function createGraph(div, label)
{
    var graph = {};

    var span = createAndAppend("div", div);
    span.innerHTML = label;
    var canvas = createAndAppend("canvas", div);
    canvas.width = 500;
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

    return graph;
}

function addCurve(graph, opts)
{
    combineWithDefaults(opts,
    {
        color: colors.black,
    });

    var curve = {
        points: [],
        color: opts.color,
    };

    var x = opts.x;
    var y = opts.y;

    if (!x)
    {
        for (var i = 0; i < y.length; i++)
        {
            curve.points.push(vec2.fromValues(i, y[i]));
        }
    }
    else if (!y)
    {
        for (var i = 0; i < x.length; i++)
        {
            curve.points.push(vec2.fromValues(x[i], i));
        }
    }
    else
    {
        for (var i = 0; i < x.length; i++)
        {
            curve.points.push(vec2.fromValues(x[i], y[i]));
        }
    }

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

function setGraphLimits(graph, limits)
{
    for (var key in limits)
    {
        graph.limits[key] = limits[key];
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

function drawGraph(graph)
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
        var points = graph.curves[curveIndex].points;
        for (var i = 0; i < points.length; i++)
        {
            var x = points[i][0];
            var y = points[i][1];
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
    var minimumPadding = 0.00001;
    var paddingX = Math.max(paddingFactor * (limits.xMax - limits.xMin), minimumPadding);
    var paddingY = Math.max(paddingFactor * (limits.yMax - limits.yMin), minimumPadding);

    // TODO: always pad?

    if (graph.limits.xMin == "auto")
    {
        limits.xMin += -paddingX;
    }
    if (graph.limits.xMax == "auto")
    {
        limits.xMax += paddingX;
    }
    if (graph.limits.yMin == "auto")
    {
        limits.yMin += -paddingY;
    }
    if (graph.limits.yMax == "auto")
    {
        limits.yMax += paddingY;
    }

    setLeftTopRightBottom(graph.renderer.worldBounds, limits.xMin, limits.yMax, limits.xMax, limits.yMin);

    // Clear and draw

    clearRenderer(graph.renderer);

    for (var curveIndex = 0; curveIndex < graph.curves.length; curveIndex++)
    {
        var curve = graph.curves[curveIndex];
        drawTrajectory(graph.renderer, curve.points, curve.color);
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

    // Reset state

    graph.curves = [];
    graph.bars = [];
}

// Measurement regions

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
    }
    return region;
}

function setLeftRightRegions(simulation)
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

// Constants

var tau = 2 * Math.PI;



// Particle object

var Particle = function(position, velocity, color)
{
    this.position = position || vec2.create();
    this.velocity = velocity || vec2.create();
    this.acceleration = vec2.create();
    this.color = color || colors.black;
    this.bounds = new Rectangle();
    this.radius = 1;
    this.mass = 1;
}

Particle.prototype.updateBounds = function()
{
    this.bounds.setCenterWidthHeight(this.position, radiusScaling * 2, radiusScaling * 2);
    return this.bounds;
}

//
// Initialization
//

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

vec2.setPolar = function(out, radius, angle)
{
    var x = radius * Math.cos(angle);
    var y = radius * Math.sin(angle);
    return vec2.set(out, x, y);
}

var triangularLatticePosition = function()
{

    var latticeX = vec2.create();
    var latticeY = vec2.create();

    return function(simulation, particleIndex)
    {
        // NOTE: this is the formula for triangular numbers inverted
        var triangularNumber = Math.floor((Math.sqrt(8 * particleIndex + 1) - 1) / 2);
        var rest = particleIndex - triangularNumber * (triangularNumber + 1) / 2;
        var integerX = rest;
        var integerY = triangularNumber - rest;
        var latticeSpacing = 2 * simulation.parameters.radiusScaling;
        var overallRotation = -tau / 12;
        vec2.setPolar(latticeX, latticeSpacing * integerX, overallRotation);
        vec2.setPolar(latticeY, latticeSpacing * integerY, overallRotation + tau / 6);
        return vec2.add(vec2.create(), latticeX, latticeY);
    }
}();

var hexagonalLatticePosition = function()
{

    var latticeX = vec2.create();
    var latticeY = vec2.create();

    return function(simulation, particleIndex)
    {
        // NOTE: this adds the particles in a spiral by figuring out their coordinates in
        // one of 6 triangular lattices
        if (particleIndex == 0)
        {
            return vec2.create();
        }
        var k = particleIndex - 1;
        var layer = Math.floor((Math.sqrt(8 * (k / 6) + 1) - 1) / 2) + 1; // NOTE: 1-indexed
        var rest = k - 6 * layer * (layer - 1) / 2;
        var triangleIndex = Math.floor(rest / layer);
        var integerX = layer;
        var integerY = rest % layer;
        var latticeSpacing = 2 * simulation.parameters.radiusScaling * simulation.parameters.separationFactor;
        var rotationAngle = triangleIndex * tau / 6;
        vec2.setPolar(latticeX, latticeSpacing * integerX, rotationAngle);
        var shape = 2; // 1: spiral, 2: hexagon
        vec2.setPolar(latticeY, latticeSpacing * integerY, rotationAngle + shape * tau / 6);
        return vec2.add(vec2.create(), latticeX, latticeY);
    }
}();

function randomVelocity(maxSpeed)
{
    var speed = randomInInterval(0, maxSpeed);
    var direction = randomUnitVector();
    return vec2.scale(direction, direction, speed);
}

function randomUnitVector()
{
    var angle = randomInInterval(0, tau);
    return vec2.fromValues(Math.cos(angle), Math.sin(angle));
}

function uniformVelocity(simulation, particleIndex)
{
    return randomVelocity(simulation.parameters.maxInitialSpeed);
}



function identicalVelocity(simulation, particleIndex)
{
    return vec2.fromValues(0, -simulation.parameters.maxInitialSpeed);
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

//
// particle generators
//

function uniformParticleGenerator(simulation, particleIndex)
{
    return new Particle(
        uniformPosition(simulation, particleIndex),
        uniformVelocity(simulation, particleIndex),
        colors.black
    );
}

function groupedParticleGenerator(simulation, particleIndex)
{
    return new Particle(
        groupedPosition(simulation, particleIndex),
        uniformVelocity(simulation, particleIndex),
        colors.black
    );
}

function fallingParticleGenerator(simulation, particleIndex)
{
    return new Particle(
        groupedPosition(simulation, particleIndex),
        identicalVelocity(simulation, particleIndex),
        colors.black
    );
}

function twoColorParticleGenerator(simulation, particleIndex)
{
    return new Particle(
        halvesPosition(simulation, particleIndex),
        uniformVelocity(simulation, particleIndex),
        twoColors(simulation, particleIndex)
    );
}

function latticeParticleGenerator(simulation, particleIndex)
{
    return new Particle(
        hexagonalLatticePosition(simulation, particleIndex),
        vec2.create(),
        colors.black
    );
}


function billiardsParticleGenerator(simulation, particleIndex)
{
    var position;
    if (particleIndex == 0)
    {
        position = vec2.fromValues(-0.5, 0);
    }
    else
    {
        position = triangularLatticePosition(simulation, particleIndex - 1);
        vec2.add(position, position, vec2.fromValues(0.3, 0))
    }
    var velocity = vec2.fromValues(0, 0);
    var particle = new Particle(position, velocity, colors.black);
    return particle;
}

function updateParticleCount(simulation)
{
    var newParticleCount = simulation.parameters.particleCount;
    if (newParticleCount == simulation.particleCount)
    {
        return;
    }
    else if (newParticleCount < simulation.particleCount)
    {
        simulation.particles.splice(newParticleCount, Number.MAX_VALUE);
    }
    else
    {
        for (var particleIndex = simulation.particleCount; particleIndex < newParticleCount;
            ++particleIndex)
        {
            simulation.particles.push(simulation.particleGenerator(simulation, particleIndex))
        }
        // TODO: move particles out of each other so that no overlaps occur
    }
    simulation.particleCount = newParticleCount;
}

function addParticle(simulation, position)
{
    var inside = doesRectContainPoint(simulation.boxBounds, position);
    var particleIndex = simulation.particleCount;
    var particle = simulation.particleGenerator(simulation, particleIndex);
    particle.position = position;
    simulation.particles.push(particle);
    simulation.particleCount += 1;
    simulation.parameters.particleCount += 1;
}

function removeParticle(simulation, particleIndex)
{
    simulation.particles.splice(particleIndex, 1);
    simulation.particleCount -= 1;
    simulation.parameters.particleCount -= 1;
}

function worldFromPage(renderer, pagePosition)
{
    var canvasBounds = renderer.canvas.getBoundingClientRect();
    var canvasX = pagePosition[0] - canvasBounds.left;
    var canvasY = pagePosition[1] - canvasBounds.top;
    return worldFromCanvas(renderer, vec2.fromValues(canvasX, canvasY));
}

function square(x)
{
    return x * x;
}

function pickParticle(simulation, pickPosition, extraRadius)
{
    if (extraRadius === undefined)
    {
        extraRadius = 0;
    }

    for (var particleIndex = 0; particleIndex < simulation.particleCount;
        ++particleIndex)
    {
        var particle = simulation.particles[particleIndex];
        var squaredRadius = square((particle.radius + extraRadius) * simulation.parameters.radiusScaling);
        var inside = vec2.squaredDistance(pickPosition, particle.position) < squaredRadius;
        if (inside)
        {
            return particleIndex;
        }
    }
    return undefined;
}

function createSimulation(id, opts)
{
    var simulation = {};

    combineWithDefaults(opts,
    {
        width: 500,
        height: 400,
        controls: ["resetButton"],
        visualizations: [],
        measurementRegions: [],
        walls: [],
        particleGenerator: latticeParticleGenerator,
        parameters:
        {
            maxInitialSpeed: 0.1,
            collisionEnabled: false,
            pressureWindowSize: 1000,
            quadtreeEnabled: true,
            frameDuration: 33,
            deltaTemperature: 1,
            gravityAcceleration: 0,
            simulationSpeed: 1,
            particleCount: 91,
            radiusScaling: 0.08,
            boxSize: 500,
            friction: 0,
            bondEnergy: 0.0001,
            measurementWindowLength: 100,
            separationFactor: 1.2,
        }
    });

    document.currentScript.insertAdjacentHTML("afterEnd", '<div id="' + id + '"></div>');

    // TODO: maybe don't have an id? only necessary to distinguish ids of input elements, and doesn't bring much else

    simulation.id = id;

    simulation.running = true;
    simulation.time = 0;
    simulation.times = [];
    simulation.pausedByUser = false;
    simulation.previousTimestamp = 0;

    simulation.particles = [];
    simulation.particleCount = 0;
    simulation.particleGenerator = opts.particleGenerator;

    simulation.quadTree = undefined;

    simulation.boxBounds = new Rectangle();
    simulation.leftRect = new Rectangle();
    simulation.rightRect = new Rectangle();

    simulation.parameters = opts.parameters;
    simulation.initialParameters = {};
    combineWithDefaults(simulation.initialParameters, opts.parameters);

    // TODO: more than one trajectory
    simulation.trajectoryEnabled = false;
    simulation.trajectory = [];

    // set up HTML elements
    simulation.div = document.getElementById(id);

    simulation.canvas = createAndAppend("canvas", simulation.div);
    simulation.canvas.setAttribute("width", opts.width);
    simulation.canvas.setAttribute("height", opts.height);

    simulation.controlsDiv = createAndAppend("div", simulation.div);
    simulation.buttonDiv = createAndAppend("div", simulation.controlsDiv);
    simulation.sliderDiv = createAndAppend("div", simulation.controlsDiv);
    simulation.checkboxDiv = createAndAppend("div", simulation.controlsDiv);

    simulation.walls = opts.walls;

    // Keyboard stuff

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

    // Mouse stuff

    simulation.mouse = {
        active: false,
        worldPosition: vec2.create(),
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
        activeParticleIndex: undefined,
        billiardCue:
        {
            visible: false,
            start: vec2.create(),
            end: vec2.create(),
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
            simulation.mouse.worldPosition = worldFromPage(simulation.renderer, vec2.fromValues(event.clientX, event.clientY));
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

    // Pause when simulation is not visible

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
                simulation.previousTimestamp = 0;
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

    // setup UI

    simulation.controls = {};

    // sliders

    createSlider(
    {
        name: "deltaTemperature",
        label: "Control temperature:",
        min: 0.97,
        minLabel: "Colder",
        max: 1.03,
        maxLabel: "Warmer",
        snapBack: true,
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
        min: 1,
        minLabel: "1",
        max: 200,
        maxLabel: "200",
        step: 1,
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
        min: -0.2,
        minLabel: "Negative?",
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
            simulation.pausedByUser = ! simulation.pausedByUser;
        },
    });

    for (var i = 0; i < opts.controls.length; i++)
    {
        showElement(simulation.controls[opts.controls[i]]);
    }

    // visualization

    simulation.visualizationDiv = createAndAppend("div", simulation.div);
    simulation.visualizations = {
        energy: createGraph(createAndAppend("div", simulation.visualizationDiv), "Energy"),
        temperature: createGraph(createAndAppend("div", simulation.visualizationDiv), "Temperature"),
        counts: createGraph(createAndAppend("div", simulation.visualizationDiv), "Counts"),
        countsHistogram: createGraph(createAndAppend("div", simulation.visualizationDiv), "Counts"),
        entropy: createGraph(createAndAppend("div", simulation.visualizationDiv), "Entropy"),
    }
    simulation.timeSeries = [
        simulation.visualizations.energy,
        simulation.visualizations.temperature,
        simulation.visualizations.counts,
        simulation.visualizations.entropy,
    ];
    simulation.histograms = [simulation.visualizations.countHistogram];

    for (var key in simulation.visualizations)
    {
        hideElement(simulation.visualizations[key].div);
    }

    for (var i = 0; i < opts.visualizations.length; i++)
    {
        showElement(simulation.visualizations[opts.visualizations[i]].div);
    }


    simulation.renderer = createRenderer(simulation.canvas);

    updateBounds(simulation);

    // Measurements


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

    // Start simulation

    simulation.updateFunction = function(timestamp)
    {
        updateSimulation(simulation.updateFunction, simulation, timestamp);
    };

    simulation.requestFrameId = window.requestAnimationFrame(simulation.updateFunction);

    return simulation;
}

function resetSimulation(simulation)
{
    simulation.parameters = {};
    combineWithDefaults(simulation.parameters, simulation.initialParameters)
}

function updateBounds(simulation)
{

    simulation.canvas.width = simulation.parameters.boxSize;

    // retina stuff
    var canvasWidth = simulation.canvas.width;
    var canvasHeight = simulation.canvas.height;

    simulation.canvas.style.width = canvasWidth + "px";
    simulation.canvas.style.height = canvasHeight + "px";

    var devicePixelRatio = window.devicePixelRatio || 1;
    simulation.canvas.width = canvasWidth * devicePixelRatio;
    simulation.canvas.height = canvasHeight * devicePixelRatio;

    // boxes

    var aspectRatio = simulation.canvas.width / simulation.canvas.height;
    var origin = vec2.fromValues(0, 0);

    setCenterWidthHeight(
        simulation.renderer.worldBounds,
        origin, 2 * aspectRatio, 2
    );

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

    resizeRenderer(simulation.renderer);
}

function lennardJonesEnergy(invDistance, bondEnergy, separation)
{
    // TODO: truncate and shift, see wikipedia
    var a = separation * invDistance;
    var a6 = Math.pow(a, 6);
    var shape = a6 * a6 - 2 * a6;
    return bondEnergy * shape;
}

function lennardJonesForce(invDistance, bondEnergy, separation)
{
    var a = separation * invDistance;
    var a6 = Math.pow(a, 6);
    var shape = 12 * invDistance * (a6 * a6 - a6);
    return bondEnergy * shape;
}

// Colors

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

// Simulation


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
        drawTrajectory(simulation.renderer, [wall.start, wall.end], colors.black);
    }

    drawParticles(simulation.renderer, simulation.particles, simulation.parameters.radiusScaling);

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
}

var updateSimulation = function()
{

    var relativePosition = vec2.create();
    var relativeVelocity = vec2.create();
    var deltaVelocity = vec2.create();
    var deltaAcceleration = vec2.create();

    var totalMomentum = vec2.create();
    var wallNormal = vec2.create();
    var projection = vec2.create();

    return function(updateFunction, simulation, timestamp)
    {


        vec2.set(totalMomentum, 0, 0);
        var colorCounts = {};

        var gravityAcceleration = vec2.fromValues(0, -simulation.parameters.gravityAcceleration);

        // Process input

        if (simulation.mouse.leftButton.transitionCount > 0)
        {
            var billiardCue = simulation.mouse.billiardCue;
            if ((simulation.mouse.mode === "billiardCue") && billiardCue.visible)
            {
                // Let go of billiardCue
                var activeParticle = simulation.particles[simulation.mouse.activeParticleIndex]
                vec2.subtract(relativePosition, activeParticle.position, simulation.mouse.worldPosition);
                vec2.scaleAndAdd(activeParticle.velocity, activeParticle.velocity,
                    relativePosition, billiardCue.strength);
                billiardCue.visible = false;
            }

            simulation.mouse.mode = "";
        }

        if (simulation.mouse.leftButton.down)
        {
            var extraRadius = 1;
            var pickedParticle = pickParticle(simulation, simulation.mouse.worldPosition, extraRadius);
            var isCloseToParticle = (pickedParticle !== undefined);

            var hitParticle = pickParticle(simulation, simulation.mouse.worldPosition);
            var isOnParticle = (hitParticle !== undefined);

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
                else
                {
                    if (isOnParticle)
                    {
                        simulation.mouse.mode = "dragParticle";
                        simulation.mouse.activeParticleIndex = hitParticle;
                    }
                }
            }

            if ((simulation.mouse.mode == "createParticles") && (!isCloseToParticle))
            {
                addParticle(simulation, simulation.mouse.worldPosition);
            }
            else if (simulation.mouse.mode == "destroyParticles")
            {
                if (hitParticle !== undefined)
                {
                    removeParticle(simulation, hitParticle);
                }
            }
            else if (simulation.mouse.mode == "billiardCue")
            {
                var billiardCue = simulation.mouse.billiardCue;
                var activeParticle = simulation.particles[simulation.mouse.activeParticleIndex]
                vec2.subtract(relativePosition, simulation.mouse.worldPosition, activeParticle.position);
                var effectiveRadius = activeParticle.radius * simulation.parameters.radiusScaling;
                billiardCue.visible = vec2.squaredLength(relativePosition) > squared(effectiveRadius);
                vec2.normalize(relativePosition, relativePosition);
                vec2.copy(billiardCue.start, simulation.mouse.worldPosition);
                vec2.scaleAndAdd(billiardCue.end, billiardCue.start, relativePosition, billiardCue.length);
            }
        }

        // Update lots of stuff
        // TODO: put this stuff inline here

        updateBounds(simulation);
        updateParticleCount(simulation);

        if (!simulation.pausedByUser)
        {
            // Keep track of time

            var elapsed = timestamp - simulation.previousTimestamp;
            if ((elapsed > 100) || (elapsed <= 0))
            {
                elapsed = simulation.parameters.frameDuration;
            }
            var slowingFactor = 0.01;
            var dt = elapsed * simulation.parameters.simulationSpeed * slowingFactor;
            simulation.time += dt;
            simulation.previousTimestamp = timestamp;

            // Equations of motion

            var particles = simulation.particles;
            var particleCount = simulation.particleCount;

            for (var particleIndex = 0; particleIndex < particleCount;
                ++particleIndex)
            {
                var particle = particles[particleIndex];

                // Scale velocities with delta temperature

                vec2.scale(particle.velocity, particle.velocity, simulation.parameters.deltaTemperature);

                // velocity verlet

                vec2.scaleAndAdd(particle.velocity, particle.velocity, particle.acceleration, 0.5 * dt);
                vec2.scaleAndAdd(particle.position, particle.position, particle.velocity, dt);

                // reset stuff before next loop
                vec2.copy(particle.acceleration, gravityAcceleration);
                particle.potentialEnergy = -vec2.dot(particle.position, gravityAcceleration);
            }

            // Calculate forces

            for (var i = 0; i < particleCount; ++i)
            {
                var particle = particles[i];

                // Particle interactions

                for (var j = 0; j < i; ++j)
                {
                    var otherParticle = particles[j];
                    // TODO: use quadtree with given cutoff distance

                    var separationFactor = simulation.parameters.separationFactor;

                    var distanceLimit = simulation.parameters.radiusScaling * (particle.radius + otherParticle.radius);
                    var separation = separationFactor * distanceLimit;

                    vec2.subtract(relativePosition, otherParticle.position, particle.position);
                    var distanceBetweenCenters = vec2.length(relativePosition);

                    var invDistance = 1 / distanceBetweenCenters;
                    var potentialEnergy = lennardJonesEnergy(invDistance, simulation.parameters.bondEnergy, separation);

                    var normal = vec2.scale(relativePosition, relativePosition, 1 / distanceBetweenCenters);
                    var isHardCollision = distanceBetweenCenters < distanceLimit;

                    if (isHardCollision)
                    {


                        var overlap = distanceLimit - distanceBetweenCenters;
                        var massSum = particle.mass + otherParticle.mass;

                        // Move out of overlap

                        // TODO: calculate time to collision instead of moving out of overlap
                        // TODO: the moving makes the outcome depend on the indices of the particles 
                        // (as they are processed in order)

                        vec2.scaleAndAdd(particle.position, particle.position,
                            normal, -overlap * otherParticle.mass / massSum);
                        vec2.scaleAndAdd(otherParticle.position, otherParticle.position,
                            normal, overlap * particle.mass / massSum);

                        // Elastic collision

                        vec2.subtract(relativeVelocity, particle.velocity, otherParticle.velocity);
                        vec2.projectOntoNormal(deltaVelocity, relativeVelocity, normal);
                        vec2.scale(deltaAcceleration, deltaVelocity, 1 / dt);

                        // NOTE: I change the velocity instead of the acceleration, because otherwise
                        // there are transient dips in energy at collision (because of how velocity verlet works)

                        vec2.scaleAndAdd(particle.velocity, particle.velocity,
                            deltaVelocity, -2 * otherParticle.mass / massSum);
                        vec2.scaleAndAdd(otherParticle.velocity, otherParticle.velocity,
                            deltaVelocity, 2 * particle.mass / massSum);

                        // NOTE: change potential energy to compensate for moving particles

                        var newPotentialEnergy = lennardJonesEnergy(1 / distanceLimit, simulation.parameters.bondEnergy, separation);
                        var potentialEnergyDifference = potentialEnergy - newPotentialEnergy;

                        // NOTE: using half of potential energy for each particle
                        // TODO: special case for zero/small velocity?
                        var squaredVelocity = vec2.squaredLength(particle.velocity);
                        if (squaredVelocity !== 0)
                        {
                            var velocityFactor = Math.sqrt(1 + potentialEnergyDifference / (particle.mass * vec2.squaredLength(particle.velocity)));
                            vec2.scale(particle.velocity, particle.velocity, velocityFactor);
                        }

                        var squaredVelocity = vec2.squaredLength(otherParticle.velocity);
                        if (squaredVelocity !== 0)
                        {
                            var velocityFactor = Math.sqrt(1 + potentialEnergyDifference / (otherParticle.mass * vec2.squaredLength(otherParticle.velocity)));
                            vec2.scale(otherParticle.velocity, otherParticle.velocity, velocityFactor);
                        }
                    }
                    else if (simulation.parameters.bondEnergy !== 0)
                    {
                        // Potential force
                        var force = lennardJonesForce(invDistance, simulation.parameters.bondEnergy, separation);
                        var potentialEnergy = lennardJonesEnergy(invDistance, simulation.parameters.bondEnergy, separation);
                        // TODO: this is a little weird
                        particle.potentialEnergy += potentialEnergy / 2;
                        otherParticle.potentialEnergy += potentialEnergy / 2;

                        var accelerationDirection = normal;
                        vec2.scaleAndAdd(particle.acceleration, particle.acceleration,
                            accelerationDirection, -force / particle.mass);
                        vec2.scaleAndAdd(otherParticle.acceleration, otherParticle.acceleration,
                            accelerationDirection, force / otherParticle.mass);
                    }
                }

                // Friction

                vec2.scaleAndAdd(particle.acceleration, particle.acceleration,
                    particle.velocity, -simulation.parameters.friction / particle.mass);
            }


            // User interaction

            if (simulation.mouse.activeParticleIndex !== undefined)
            {
                var particle = particles[simulation.mouse.activeParticleIndex];
                if (simulation.mouse.mode === "dragParticle")
                {
                    vec2.subtract(relativePosition, simulation.mouse.worldPosition, particle.position);
                    vec2.scaleAndAdd(particle.acceleration, particle.acceleration,
                        relativePosition, 0.1 / particle.mass);
                }
            }

            for (var particleIndex = 0; particleIndex < particleCount;
                ++particleIndex)
            {
                var particle = particles[particleIndex];

                // finish velocity verlet
                vec2.scaleAndAdd(particle.velocity, particle.velocity, particle.acceleration, 0.5 * dt);

                // calculate quantities
                if (doesRectContainPoint(simulation.leftRect, particle.position))
                {
                    colorCounts[particle.color.name] = 1 + (colorCounts[particle.color.name] || 0);
                }

                particle.kineticEnergy = 0.5 * vec2.squaredLength(particle.velocity);

                vec2.scaleAndAdd(totalMomentum, totalMomentum, particle.velocity, particle.mass);


                // Collision with walls

                for (var i = 0; i < simulation.walls.length; i++)
                {
                    var wall = simulation.walls[i];
                    var wallVector = vec2.subtract(vec2.create(), wall.end, wall.start);
                    var radius = particle.radius * simulation.parameters.radiusScaling;
                    var fromStart = vec2.subtract(vec2.create(), particle.position, wall.start);
                    var fromEnd = vec2.subtract(vec2.create(), particle.position, wall.end);
                    var normal = vec2.rotateCCW(vec2.create(), wallVector);
                    vec2.normalize(normal, normal);
                    var rejection = vec2.projectOntoNormal(vec2.create(), fromStart, normal);
                    var rejectionLengthSquared = vec2.squaredLength(rejection);
                    var isAfterStart = isSameDirection(fromStart, wallVector);
                    var isBeforeEnd = !isSameDirection(fromEnd, wallVector);

                    var overlap = 0;

                    var isIntersectingWall = (rejectionLengthSquared < squared(radius)) && isAfterStart && isBeforeEnd;
                    if (isIntersectingWall)
                    {
                        overlap = radius - Math.sqrt(rejectionLengthSquared);
                        vec2.normalize(normal, rejection);
                    }
                    else
                    {
                        var distanceFromStart = vec2.length(fromStart);
                        if (distanceFromStart < radius)
                        {
                            overlap = radius - distanceFromStart;
                            vec2.normalize(normal, fromStart);
                        }

                        var distanceFromEnd = vec2.length(fromEnd);
                        if (distanceFromEnd < radius)
                        {
                            overlap = radius - distanceFromEnd;
                            vec2.normalize(normal, fromEnd);
                        }
                    }

                    if (overlap > 0)
                    {
                        vec2.scaleAndAdd(particle.position, particle.position, normal, overlap);

                        vec2.projectOntoNormal(projection, particle.velocity, normal);
                        vec2.scaleAndAdd(particle.velocity, particle.velocity, projection, -2);
                    }



                }

                // Collision with box

                var boxBounds = simulation.boxBounds;

                var overlap = 0;
                var radius = particle.radius * simulation.parameters.radiusScaling;

                if (particle.position[0] - radius < boxBounds.left)
                {
                    overlap = boxBounds.left - particle.position[0] + radius;
                    vec2.set(wallNormal, 1, 0);
                }
                else if (particle.position[0] + radius > boxBounds.right)
                {
                    overlap = particle.position[0] + radius - boxBounds.right;
                    vec2.set(wallNormal, -1, 0);
                }
                else if (particle.position[1] - radius < boxBounds.bottom)
                {
                    overlap = boxBounds.bottom - particle.position[1] + radius;
                    vec2.set(wallNormal, 0, 1);
                }
                else if (particle.position[1] + radius > boxBounds.top)
                {
                    overlap = particle.position[1] + radius - boxBounds.top;
                    vec2.set(wallNormal, 0, -1);
                }

                if (overlap > 0)
                {
                    // Move out of overlap

                    vec2.scaleAndAdd(particle.position, particle.position, wallNormal, overlap);

                    // Reflect velocity

                    vec2.projectOntoNormal(projection, particle.velocity, wallNormal);
                    vec2.scaleAndAdd(particle.velocity, particle.velocity, projection, -2);

                    // totalPressure += vec2.length(projection);
                }
            }

            // Collision with other particles
            if (simulation.parameters.collisionEnabled)
            {
                if (quadtreeEnabled)
                {
                    quadtree.clear();
                    for (var particleIndex = 0; particleIndex < particles.length;
                        ++particleIndex)
                    {
                        var particle = particles[particleIndex];
                        particle.updateBounds();
                        quadtree.add(particle);
                    }
                    quadtree.collideAll(collide);
                }
                else
                {
                    for (var i = 0; i < particleCount; ++i)
                    {
                        for (var j = 0; j < i; ++j)
                        {
                            collide(particles[i], particles[j]);
                        }
                    }
                }
            }

            // Trajectory

            if (simulation.parameters.trajectoryEnabled && (simulation.particleCount > 0))
            {
                simulation.trajectory.push(vec2.clone(simulation.particles[0].position));
            }

            // Measurements



            var totalEntropy = 0;

            var barWidth = 1 / simulation.measurementRegions.length;
            for (var regionIndex = 0; regionIndex < simulation.measurementRegions.length; regionIndex++)
            {
                var region = simulation.measurementRegions[regionIndex];
                var m = region.measurements;

                // Add new value, remove old, crufty ones
                m.time.push(simulation.time);
                var tooOldCount = -1;
                // NOTE: save more data than shown, to avoid weird autoscaling in plots
                while ((simulation.time - m.time[++tooOldCount]) > 2 * simulation.parameters.measurementWindowLength)
                {};

                for (var key in m)
                {
                    m[key].splice(0, tooOldCount);
                }

                var regionEnergy = 0;
                var regionTemperature = 0;
                var regionCount = 0;

                for (var particleIndex = 0; particleIndex < simulation.particles.length; particleIndex++)
                {
                    var particle = simulation.particles[particleIndex];

                    if (doesRectContainPoint(region.bounds, particle.position))
                    {
                        regionEnergy += (particle.potentialEnergy + particle.kineticEnergy);
                        regionTemperature += particle.kineticEnergy;
                        regionCount += 1;
                    }
                }

                regionTemperature /= simulation.particles.length;

                m.energy.push(regionEnergy);
                m.temperature.push(regionTemperature);
                m.count.push(regionCount);

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
            }

            simulation.times.push(simulation.time);
            simulation.entropy.push(totalEntropy);
            var tooOldCount = -1;
            // NOTE: save more data than shown, to avoid weird autoscaling in plots
            while ((simulation.time - simulation.times[++tooOldCount]) > 2 * simulation.parameters.measurementWindowLength)
            {};

            simulation.entropy.splice(0, tooOldCount);
            simulation.times.splice(0, tooOldCount);

            addCurve(simulation.visualizations.entropy,
            {
                x: m.time,
                y: simulation.entropy,
            });

            // Plot things

            setGraphLimits(simulation.visualizations.counts,
            {
                yMax: simulation.particles.length
            });
            setGraphLimits(simulation.visualizations.entropy,
            {
                yMax: 1
            });

            for (var i = 0; i < simulation.timeSeries.length; ++i)
            {
                var graph = simulation.timeSeries[i];
                // TODO: make the limits change smoothly, so it's less noticable
                setGraphLimits(graph,
                {
                    xMin: simulation.time - simulation.parameters.measurementWindowLength,
                    xMax: simulation.time,
                    yMin: 0,
                })
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


        // Drawing

        drawSimulation(simulation);

        // Input cleanup

        simulation.mouse.leftButton.transitionCount = 0;
        simulation.mouse.rightButton.transitionCount = 0;

        if (simulation.running)
        {
            simulation.requestFrameId = window.requestAnimationFrame(updateFunction);
        }
    }
}();

// Random stuff

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

// Vector

vec2.projectOntoNormal = function(out, a, normal)
{
    var length = vec2.dot(a, normal);
    vec2.scale(out, normal, length);
    return out;
}

vec2.rotateCCW = function(out, a)
{
    return vec2.set(out, -a[1], a[0]);
}

vec2.rotateCW = function(out, a)
{
    return vec2.set(out, a[1], -a[0]);
}

vec2.outer = function(a, b)
{
    return a[0] * b[1] - a[1] * b[0];
}

// Rectangle



function Rectangle()
{
    this.left = 0;
    this.right = 0;
    this.top = 0;
    this.bottom = 0;
    this.width = 0;
    this.height = 0;
    this.center = vec2.create();
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
    vec2.set(rectangle.center, (left + right) / 2, (top + bottom) / 2);
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
    vec2.set(rectangle.center, left + width / 2, top + height / 2);
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
    vec2.copy(rectangle.center, center);
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
    newRect.center = vec2.clone(rect.center);
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
    return vec2.fromValues(randomInInterval(rect.left, rect.right),
        randomInInterval(rect.top, rect.bottom));
}

function randomInInterval(a, b)
{
    return (a + (b - a) * Math.random());
}

function intersectionCircleLine(circle, line)
{
    var c = vec2.create();
    vec2.subtract(c, circle.center, line.start);
    var dotBC = vec2.dot(line.vector, c);
    var bSq = vec2.squaredLength(line.vector);
    var rootInput = square(dotBC) + bSq * (squared(circle.radius) - vec2.squaredLength(c));
    if (rootInput > 0)
    {
        var root = Math.sqrt(rootInput);
        var bSqInv = 1 / bSq;
        var t1 = (dotBC - root) * bSqInv;
        var t2 = (dotBC + root) * bSqInv;


        return {
            isIntersected: true,
            t1: t1,
            t2: t2,
        }
    }
    else
    {
        return {
            isIntersected: false
        };
    }
}


// Collision

function isIntersecting(shape, otherShape)
{
    var direction = vec2.fromValues(1, 0);
    var s = support(direction, shape);
    var s2 = support(vec2.scale(vec2.create(), direction, -1), otherShape);
    var minkowskiPoint = vec2.subtract(vec2.create(), s, s2);
    var simplex = [minkowskiPoint];
    var direction = vec2.scale(direction, minkowskiPoint, -1);
    while (true)
    {
        // TODO: do this more efficiently if we know the pair of shapes
        var s = support(direction, shape);
        var s2 = support(vec2.scale(vec2.create(), direction, -1), otherShape);
        var a = vec2.subtract(vec2.create(), s, s2);
        if (vec2.dot(a, direction) < 0)
        {
            return false;
        }
        simplex.push(a);
        // do simplex

        if (simplex.length <= 1)
        {
            // assert
        }

        if (simplex.length == 2)
        {
            var a = simplex[1];
            var b = simplex[0];
            var ab = vec2.subtract(vec2.create(), b, a);
            var ao = vec2.scale(vec2.create(), a, -1);
            if (isSameDirection(ab, ao))
            {
                simplex = [a, b];
                vec2.rotateCCW(direction, ab);
                vec2.scale(direction, direction, vec2.outer(ab, ao));
            }
            else
            {
                simplex = [a];
                vec2.copy(direction, ao);
            }
        }

        if (simplex.length == 3)
        {
            var a = simplex[2];
            var b = simplex[1];
            var c = simplex[0];
            var ab = vec2.subtract(vec2.create(), b, a);
            var ac = vec2.subtract(vec2.create(), c, a);

            var orientation = vec2.outer(ab, ac);
            var abNormal = vec2.rotateCW(vec2.create(), ab);
            vec2.scale(abNormal, abNormal, orientation);
            var acNormal = vec2.rotateCCW(vec2.create(), ac);
            vec2.scale(acNormal, acNormal, orientation);
            var ao = vec2.scale(vec2.create(), a, -1);

            var inStarRegion = false;
            if (isSameDirection(acNormal, ao))
            {
                if (isSameDirection(ac, ao))
                {
                    simplex = [a, c];
                    vec2.copy(direction, acNormal);
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
                return true;
            }


            if (inStarRegion)
            {
                if (isSameDirection(ab, ao))
                {
                    simplex = [a, b];
                    vec2.copy(direction, abNormal);
                }
                else
                {
                    simplex = [a];
                    vec2.copy(direction, ao);
                }
            }
        }
    }
}

function isSameDirection(a, b)
{
    return vec2.dot(a, b) > 0;
}

function support(direction, shape)
{
    if (shape.type == "circle")
    {
        // NOTE: Assumes direction is a unit vector
        return vec2.scale(vec2.create(), direction, shape.radius);
    }

    if (shape.type == "polygon")
    {
        var maximumDistance = -Number.MAX_VALUE;
        var maximumVertex;
        for (var vertexIndex = 0; vertexIndex < shape.vertices.length; vertexIndex++)
        {
            var vertex = shape.vertices[vertexIndex];
            var distance = vec2.dot(vertex, direction);
            if (distance > maximumDistance)
            {
                maximumDistance = distance;
                maximumVertex = vertex;
            }
        }
        return vec2.clone(maximumVertex);
    }
}

function testGJK()
{
    var h = {
        type: "polygon",
        vertices: [vec2.fromValues(-1, 0), vec2.fromValues(1, 0)]
    };
    var v = {
        type: "polygon",
        vertices: [vec2.fromValues(0, -1), vec2.fromValues(0, 1)]
    };
    var t = {
        type: "polygon",
        vertices: [vec2.fromValues(-2, 0), vec2.fromValues(2, 1)]
    };
    var c = {
        type: "circle",
        center: vec2.fromValues(0, 0),
        radius: 0.01
    };

    var testBothWays = function(shape, otherShape, expected)
    {
        var a = isIntersecting(shape, otherShape);
        var b = isIntersecting(otherShape, shape);
        return (a == b) && (a == expected);
    }

    var tests = [testBothWays(h, v, true), testBothWays(h, t, false), testBothWays(v, t, true), testBothWays(c, t, false), testBothWays(c, h, true), testBothWays(c, v, true)];
    for (var i = 0; i < tests.length; i++)
    {
        if (!tests[i])
        {
            console.log("Test " + i + " failed.");
        }
    }
}


// Quadtree

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