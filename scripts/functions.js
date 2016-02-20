function combineWithDefaults(opts, defaults) {
    for (var key in defaults) {
        if (!opts.hasOwnProperty(key)) {
            opts[key] = defaults[key];
        } else if (typeof opts[key] === 'object') {
            combineWithDefaults(opts[key], defaults[key]);
        }
    }
}

// DOM stuff

function createAndAppend(elementType, parent) {
    var element = document.createElement(elementType);
    parent.appendChild(element);
    return element;
}

function hideElement(element) {
    element.style.display = "none";
}

function showElement(element) {
    element.style.display = "block";
}

function createGraph(canvas) {
    var graph = {};

    graph.renderer = createRenderer(canvas);

    graph.points = [];
    graph.xWindowSize = 100;

    return graph;
}

function arrayLast(array) {
    return array[array.length - 1];
}

// TODO: Graph should have a certain width
// TODO: pause graph when pausing sim

function graphAddPoint(graph, point) {
    // TODO: add more than one at a time?
    graph.points.push(point);

    while ((arrayLast(graph.points) - graph.points[0]) > graph.xWindowSize) {
        graph.points.shift();
    }

    var maxX = arrayLast(graph.points)[0];
    var minX = maxX - graph.xWindowSize;
    var minY = Number.MAX_VALUE;
    var maxY = Number.MIN_VALUE;

    for (var i = 0; i < graph.points.length; i++) {
        var y = graph.points[i][1];
        if (y < minY) {
            minY = y;
        }
        if (y > maxY) {
            maxY = y;
        }
    }

    var paddingY = 0.05 * (maxY - minY);

    // Rescale renderer
    graph.renderer.worldBounds.setLeftTopRightBottom(minX, maxY + paddingY, maxX, minY - paddingY);

    clearRenderer(graph.renderer);
    drawTrajectory(graph.renderer, graph.points, {
        name: "black",
        rgba: [0, 0, 0, 1]
    });
}



// Constants

var tau = 2 * Math.PI;



// Particle object

var Particle = function(position, velocity, color) {
    this.position = position || vec2.create();
    this.velocity = velocity || vec2.create();
    this.acceleration = vec2.create();
    this.color = color || {
        name: "black",
        rgba: [0, 0, 0, 1]
    };
    this.bounds = new Rect();
    this.radius = 1;
}

Particle.prototype.updateBounds = function() {
    this.bounds.setCenterWidthHeight(this.position, radiusScaling * 2, radiusScaling * 2);
    return this.bounds;
}

//
// Initialization
//

function groupedPosition(simulation, particleIndex) {
    var collisionBounds = simulation.collisionBounds;
    var smallCenteredRect = new Rect().setCenterWidthHeight(
        collisionBounds.center, collisionBounds.width / 5, collisionBounds.height / 5
    );
    return randomPointInRect(smallCenteredRect);
}

function uniformPosition(simulation, particleIndex) {
    return randomPointInRect(simulation.collisionBounds);
}

function halvesPosition(simulation, particleIndex) {
    if (particleIndex % 2 == 0) {
        return randomPointInRect(simulation.leftRect);
    } else {
        return randomPointInRect(simulation.rightRect);
    }
}

vec2.setPolar = function(out, radius, angle) {
    var x = radius * Math.cos(angle);
    var y = radius * Math.sin(angle);
    return vec2.set(out, x, y);
}

var triangularLatticePosition = function() {

    var latticeX = vec2.create();
    var latticeY = vec2.create();

    return function(simulation, particleIndex) {
        // NOTE: this is the formula for triangular numbers inverted
        var triangularNumber = Math.floor((Math.sqrt(8 * particleIndex + 1) - 1) / 2);
        var rest = particleIndex - triangularNumber * (triangularNumber + 1) / 2;
        var integerX = rest;
        var integerY = triangularNumber - rest;
        var latticeSpacing = 2 * simulation.parameters.radiusScaling;
        var overallRotation = - tau / 12;
        vec2.setPolar(latticeX, latticeSpacing * integerX, overallRotation);
        vec2.setPolar(latticeY, latticeSpacing * integerY, overallRotation + tau / 6);
        return vec2.add(vec2.create(), latticeX, latticeY);
    }
}();

var hexagonalLatticePosition = function() {

    var latticeX = vec2.create();
    var latticeY = vec2.create();

    return function(simulation, particleIndex) {
        // NOTE: this adds the particles in a spiral by figuring out their coordinates in
        // one of 6 triangular lattices
        if (particleIndex == 0) {
            return vec2.create();
        }
        var k = particleIndex - 1;
        var layer = Math.floor((Math.sqrt(8 * (k / 6) + 1) - 1) / 2) + 1; // NOTE: 1-indexed
        var rest = k - 6 * layer * (layer - 1) / 2;
        var triangleIndex = Math.floor(rest / layer);
        var integerX = layer;
        var integerY = rest % layer;
        var latticeSpacing = 2 * simulation.parameters.radiusScaling;
        var rotationAngle = triangleIndex * tau / 6;
        vec2.setPolar(latticeX, latticeSpacing * integerX, rotationAngle);
        var shape = 2; // 1: spiral, 2: hexagon
        vec2.setPolar(latticeY, latticeSpacing * integerY, rotationAngle + shape * tau / 6);
        return vec2.add(vec2.create(), latticeX, latticeY);
    }
}();

function uniformVelocity(simulation, particleIndex) {
    var speed = randomInInterval(0, simulation.parameters.maxInitialSpeed);
    var angle = randomInInterval(0, tau);
    return vec2.fromValues(speed * Math.cos(angle), speed * Math.sin(angle));
}

function identicalVelocity(simulation, particleIndex) {
    return vec2.fromValues(0, -simulation.parameters.maxInitialSpeed);
}

function oneColor(simulation, particleIndex) {
    return {
        name: "black",
        rgba: [0, 0, 0, 1]
    };
}

function twoColors(simulation, particleIndex) {
    if (particleIndex % 2 == 0) {
        return {
            name: "black",
            rgba: [0, 0, 0, 1]
        };
    } else {
        return {
            name: "red",
            rgba: [1, 0, 0, 1]
        };
    }
}

//
// particle generators
//

function uniformParticleGenerator(simulation, particleIndex) {
    return new Particle(
        uniformPosition(simulation, particleIndex),
        uniformVelocity(simulation, particleIndex),
        oneColor(simulation, particleIndex)
    );
}

function groupedParticleGenerator(simulation, particleIndex) {
    return new Particle(
        groupedPosition(simulation, particleIndex),
        uniformVelocity(simulation, particleIndex),
        oneColor(simulation, particleIndex)
    );
}

function fallingParticleGenerator(simulation, particleIndex) {
    return new Particle(
        groupedPosition(simulation, particleIndex),
        identicalVelocity(simulation, particleIndex),
        oneColor(simulation, particleIndex)
    );
}

function twoColorParticleGenerator(simulation, particleIndex) {
    return new Particle(
        halvesPosition(simulation, particleIndex),
        uniformVelocity(simulation, particleIndex),
        twoColors(simulation, particleIndex)
    );
}

function latticeParticleGenerator(simulation, particleIndex) {
    return new Particle(
        hexagonalLatticePosition(simulation, particleIndex),
        vec2.create(),
        oneColor(simulation, particleIndex)
    );
}

function updateParticleCount(simulation) {
    var newParticleCount = simulation.parameters.particleCount;
    if (newParticleCount == simulation.particleCount) {
        return;
    } else if (newParticleCount < simulation.particleCount) {
        simulation.particles.splice(newParticleCount, Number.MAX_VALUE);
    } else {
        for (var particleIndex = simulation.particleCount; particleIndex < newParticleCount;
            ++particleIndex) {
            simulation.particles.push(simulation.particleGenerator(simulation, particleIndex))
        }
        // TODO: move particles out of each other so that no overlaps occur
    }
    simulation.particleCount = newParticleCount;
}

function addParticle(simulation, position) {
    var particleIndex = simulation.particleCount;
    var particle = simulation.particleGenerator(simulation, particleIndex);
    particle.position = position;
    simulation.particles.push(particle);
    simulation.particleCount += 1;
    simulation.parameters.particleCount += 1;
    drawSimulation(simulation);
}

function removeParticle(simulation, particleIndex) {
    simulation.particles.splice(particleIndex, 1);
    simulation.particleCount -= 1;
    simulation.parameters.particleCount -= 1;
    drawSimulation(simulation);
}

function worldFromPage(renderer, pagePosition) {
    var canvasBounds = renderer.canvas.getBoundingClientRect();
    var canvasX = pagePosition[0] - canvasBounds.left;
    var canvasY = pagePosition[1] - canvasBounds.top;
    return worldFromCanvas(renderer, vec2.fromValues(canvasX, canvasY));
}

function square(x) {
    return x * x;
}

function pickParticle(simulation, pickPosition, extraRadius) {
    if (extraRadius === undefined) {
        extraRadius = 0;
    }

    for (var particleIndex = 0; particleIndex < simulation.particleCount;
        ++particleIndex) {
        var particle = simulation.particles[particleIndex];
        var squaredRadius = square((particle.radius + extraRadius) * simulation.parameters.radiusScaling);
        var inside = vec2.squaredDistance(pickPosition, particle.position) < squaredRadius;
        if (inside) {
            return particleIndex;
        }
    }
    return undefined;
}

function createSimulation(id, opts) {
    combineWithDefaults(opts, {
        width: 500,
        height: 400,
        controls: [],
        graphs: [],
        particleGenerator: latticeParticleGenerator,
        parameters: {
            maxInitialSpeed: 0.001,
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
        }
    });

    var simulation = {};

    document.currentScript.insertAdjacentHTML("afterEnd", '<div id="' + id +'"></div>');

    simulation.id = id;

    simulation.running = true;
    simulation.time = 0;
    simulation.pausedByUser = false;
    simulation.previousTimestamp = 0;

    simulation.particles = [];
    simulation.particleCount = 0;
    simulation.particleGenerator = opts.particleGenerator;

    simulation.quadTree = undefined;

    simulation.boxBounds = new Rect();
    simulation.collisionBounds = new Rect();
    simulation.leftRect = new Rect();
    simulation.rightRect = new Rect();

    simulation.parameters = opts.parameters;

    // TODO: this should probably be in measurements
    simulation.trajectoryEnabled = false;
    simulation.trajectory = [];

    simulation.measurements = {
        runningTime: [],
        runningEnergy: [],
        runningPressure: [],
    };

    // set up HTML elements
    simulation.div = document.getElementById(id);

    simulation.canvas = createAndAppend("canvas", simulation.div);
    simulation.canvas.setAttribute("width", opts.width);
    simulation.canvas.setAttribute("height", opts.height);

    simulation.controlsDiv = createAndAppend("div", simulation.div);
    simulation.buttonDiv = createAndAppend("div", simulation.controlsDiv);
    simulation.sliderDiv = createAndAppend("div", simulation.controlsDiv);
    simulation.checkboxDiv = createAndAppend("div", simulation.controlsDiv);


    // Mouse stuff

    simulation.mouse = {
        worldPosition: vec2.create(),
        leftButton: {
            down: false,
            transitionCount: 0,
        },
        rightButton: {
            down: false,
            transitionCount: 0,
        },
        mode: "",
        activeParticle: undefined,
    }

    function updateMouseButton(button, willBeDown) {
        button.transitionCount += button.down ^ willBeDown;
        button.down = willBeDown;
    }

    function updateMouseFromEvent(event) {
        simulation.mouse.worldPosition = worldFromPage(simulation.renderer, vec2.fromValues(event.clientX, event.clientY));
        updateMouseButton(simulation.mouse.leftButton, (event.buttons & 1) != 0);
        updateMouseButton(simulation.mouse.rightButton, (event.buttons & 2) != 0);
    }

    simulation.canvas.addEventListener("mousedown", updateMouseFromEvent);
    simulation.canvas.addEventListener("mouseup", updateMouseFromEvent);
    simulation.canvas.addEventListener("mousemove", updateMouseFromEvent);
    simulation.canvas.addEventListener("mouseout", function(event) {
        updateMouseButton(simulation.mouse.leftButton, false);
        updateMouseButton(simulation.mouse.rightButton, false);
    })

    // Pause when switching tabs

    document.addEventListener('visibilitychange', function(event) {
        if (document.hidden) {
            pauseSimulation(simulation);
        } else if (!simulation.pausedByUser) {
            resumeSimulation(simulation);
        }
    });

    // TODO: pause when window loses focus?
    // TODO: pause when scrolled out of view

    function createSlider(opts) {
        combineWithDefaults(opts, {
            label: name,
            minLabel: String(opts.min),
            maxLabel: String(opts.max),
            snapBack: false,
            function: function(x) {
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

        slider.addEventListener("input", function() {
            simulation.parameters[opts.name] = opts.function(Number(this.value));
        });

        if (opts.snapBack) {
            slider.addEventListener("change", function() {
                this.value = initialValue;
                simulation.parameters[opts.name] = opts.function(initialValue);
            });
        }

        hideElement(p);

        simulation.controls[opts.name] = p;
        return p;
    }

    function createCheckbox(opts) {
        combineWithDefaults(opts, {
            label: name
        });

        var span = createAndAppend("span", simulation.checkboxDiv)

        var label = createAndAppend("label", span);
        var checkbox = createAndAppend("input", span);
        checkbox.setAttribute("type", "checkbox");
        var checkboxId = simulation.id + "_" + opts.name;
        checkbox.setAttribute("id", checkboxId)
        checkbox.setAttribute("name", opts.name);
        checkbox.checked = simulation.parameters[opts.name];
        label.setAttribute("for", checkboxId);
        label.innerHTML = opts.label;

        checkbox.addEventListener("change", function() {
            simulation.parameters[opts.name] = this.checked;
        });

        hideElement(span);
        simulation.controls[opts.name] = span;
        return span;
    }

    function createButton(opts) {
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

    createSlider({
        name: "deltaTemperature",
        label: "Control temperature:",
        min: 0.97,
        minLabel: "Colder",
        max: 1.03,
        maxLabel: "Warmer",
        snapBack: true,
    });
    createSlider({
        name: "simulationSpeed",
        label: "Control time:",
        min: -1,
        minLabel: "Backward",
        max: 1,
        maxLabel: "Forward",
    });
    createSlider({
        name: "particleCount",
        label: "Number of particles:",
        min: 1,
        minLabel: "1",
        max: 200,
        maxLabel: "200",
        step: 1,
        // TODO: make this exponential?
    });
    createSlider({
        name: "radiusScaling",
        label: "Particle size:",
        min: 0.01,
        minLabel: "Tiny",
        max: 0.1,
        maxLabel: "Huge",
    });
    createSlider({
        name: "gravityAcceleration",
        label: "Gravity:",
        min: 0,
        minLabel: "None",
        max: 2e-4,
        maxLabel: "Strong",
    });
    createSlider({
        name: "boxSize",
        label: "Box Size:",
        min: 20,
        minLabel: "Tiny",
        max: 1000,
        maxLabel: "Huge",
    });
    createSlider({
        name: "friction",
        label: "Friction:",
        min: 0,
        minLabel: "None",
        max: 1,
        maxLabel: "A lot",
    });

    // checkboxes

    createCheckbox({
        name: "quadtreeEnabled",
        label: "Quadtree",
    });
    createCheckbox({
        name: "trajectoryEnabled",
        label: "Draw trajectory",
    });

    // buttons

    createButton({
        name: "resetButton",
        label: "Reset",
        callback: function() {
            resetSimulation(simulation);
        }
    });
    createButton({
        name: "playPauseButton",
        label: "Play/Pause",
        callback: function() {
            if (simulation.requestFrameId) {
                simulation.pausedByUser = true;
                pauseSimulation(simulation);
            } else {
                simulation.pausedByUser = false;
                resumeSimulation(simulation);
            }
        },
    });

    for (var i = 0; i < opts.controls.length; i++) {
        showElement(simulation.controls[opts.controls[i]]);
    }

    // visualisation

    simulation.visualizationDiv = createAndAppend("div", simulation.div);
    simulation.graphs = {
        energy:  createGraph(createAndAppend("canvas", simulation.visualizationDiv)),
        temperature:  createGraph(createAndAppend("canvas", simulation.visualizationDiv)),
    }

    for (var key in simulation.graphs) {
        hideElement(simulation.graphs[key].renderer.canvas);
    }

    for (var i = 0; i < opts.graphs.length; i++) {
        showElement(simulation.graphs[opts.graphs[i]].renderer.canvas);
    }

    // set up simulation

    simulation.renderer = createRenderer(simulation.canvas);

    simulation.updateFunction = function(timestamp) {
        updateSimulation(simulation.updateFunction, simulation, timestamp);
    };

    simulation.requestFrameId = window.requestAnimationFrame(simulation.updateFunction);

    return simulation;
}

function pauseSimulation(simulation) {
    if (simulation.requestFrameId) {
        window.cancelAnimationFrame(simulation.requestFrameId);
        simulation.requestFrameId = undefined;
    }
}

function resumeSimulation(simulation) {
    if (!simulation.requestFrameId) {
        simulation.previousTimestamp = 0;
        simulation.requestFrameId = window.requestAnimationFrame(simulation.updateFunction);
    }
}

function resetSimulation(simulation) {
    var tempParticleCount = simulation.parameters.particleCount;
    simulation.parameters.particleCount = 0;
    updateParticleCount(simulation);
    simulation.parameters.particleCount = tempParticleCount;
    updateParticleCount(simulation);
    drawSimulation(simulation);
}

function updateBounds(simulation) {

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

    simulation.renderer.worldBounds.setCenterWidthHeight(
        origin, 2 * aspectRatio, 2
    );

    var boxBounds = simulation.boxBounds;
    boxBounds.setCenterWidthHeight(
        origin, 2 * aspectRatio, 2
    );

    var radiusScaling = simulation.parameters.radiusScaling;
    simulation.collisionBounds.setCenterWidthHeight(
        origin, 2 * (aspectRatio - radiusScaling), 2 * (1 - radiusScaling)
    );

    simulation.rightRect.setLeftTopRightBottom(
        boxBounds.center[0], boxBounds.top,
        boxBounds.right, boxBounds.bottom);
    simulation.leftRect.setLeftTopRightBottom(
        boxBounds.left, boxBounds.top,
        boxBounds.center[0], boxBounds.bottom);

    simulation.quadTree = new Quadtree(boxBounds);

    resizeRenderer(simulation.renderer);
}

function lennardJonesEnergy(invDistance, bondEnergy, separation) {
    // TODO: truncate and shift, see wikipedia
    var a = separation * invDistance;
    var a6 = Math.pow(a, 6);
    var shape = a6 * a6 - 2 * a6;
    return bondEnergy * shape;
}

function lennardJonesForce(invDistance, bondEnergy, separation) {
    var a = separation * invDistance;
    var a6 = Math.pow(a, 6);
    var shape = 12 * invDistance * (a6 * a6 - a6);
    return bondEnergy * shape;
}

// Simulation


function drawSimulation(simulation) {
    clearRenderer(simulation.renderer);

    drawParticles(simulation.renderer, simulation.particles, simulation.parameters.radiusScaling);

    if (simulation.parameters.trajectoryEnabled) {
        drawTrajectory(simulation.renderer, simulation.trajectory, {
            name: "blue",
            rgba: [0, 0, 1, 1]
        });
    }
}

var updateSimulation = function() {

    var relativePosition = vec2.create();

    var totalMomentum = vec2.create();
    var wallNormal = vec2.create();
    var projection = vec2.create();

    return function(updateFunction, simulation, timestamp) {
        var elapsed = timestamp - simulation.previousTimestamp;
        if ((elapsed > 100) || (elapsed <= 0)) {
            elapsed = simulation.parameters.frameDuration;
        }
        var slowingFactor = 0.01;
        var dt = elapsed * simulation.parameters.simulationSpeed * slowingFactor;
        simulation.time += dt;
        simulation.previousTimestamp = timestamp;

        var totalEnergy = 0;
        var kineticEnergy = 0;
        var totalPressure = 0;
        vec2.set(totalMomentum, 0, 0);
        var colorCounts = {};

        var mass = 1;
        var gravityAcceleration = vec2.fromValues(0, - simulation.parameters.gravityAcceleration);

        // Process mouse input

        if (simulation.mouse.leftButton.transitionCount > 0) {
            simulation.mouse.mode = "";
        }

        if (simulation.mouse.leftButton.down) {
            var hitParticle = pickParticle(simulation, simulation.mouse.worldPosition);
            var isOnParticle = (hitParticle !== undefined);
            var extraRadius = 1;
            var isCloseToParticle = (
                pickParticle(simulation, simulation.mouse.worldPosition, extraRadius) !== undefined);

            if (simulation.mouse.mode === "") {
                if (isOnParticle) {
                    simulation.mouse.mode = "dragParticle";
                    simulation.mouse.activeParticle = hitParticle;
                } else if (!isCloseToParticle) {
                    simulation.mouse.mode = "createParticles";
                }
            }

            if ((simulation.mouse.mode == "createParticles") && (!isCloseToParticle)) {
                addParticle(simulation, simulation.mouse.worldPosition);
            } else if (simulation.mouse.mode == "destroyParticles") {
                var pickedParticle = pickParticle(simulation, simulation.mouse.worldPosition);
                if (pickedParticle !== undefined) {
                    removeParticle(simulation, pickedParticle);
                }
            }
        }

        // Update lots of stuff
        // TODO: put this stuff inline here

        updateParticleCount(simulation);
        updateBounds(simulation);


        // Equations of motion

        var particles = simulation.particles;
        var particleCount = simulation.particleCount;

        for (var particleIndex = 0; particleIndex < particleCount;
            ++particleIndex) {
            var particle = particles[particleIndex];

            // Scale velocities with delta temperature

            vec2.scale(particle.velocity, particle.velocity, simulation.parameters.deltaTemperature);

            // velocity verlet

            vec2.scaleAndAdd(particle.velocity, particle.velocity, particle.acceleration, 0.5 * dt);
            vec2.scaleAndAdd(particle.position, particle.position, particle.velocity, dt);

            // set up acceleration before next loop
            vec2.copy(particle.acceleration, gravityAcceleration);
        }

        // Calculate forces

        for (var i = 0; i < particleCount; ++i) {
            var particle = particles[i];

            for (var j = 0; j < i; ++j) {
                var otherParticle = particles[j];
                // TODO: use quadtree with given cutoff distance

                var bondEnergy = 0.0001;
                var separation = simulation.parameters.radiusScaling * (particle.radius + otherParticle.radius);

                vec2.subtract(relativePosition, otherParticle.position, particle.position);
                var invDistance = 1 / vec2.length(relativePosition);
                var force = lennardJonesForce(invDistance, bondEnergy, separation);
                totalEnergy += lennardJonesEnergy(invDistance, bondEnergy, separation);

                var accelerationDirection = vec2.normalize(relativePosition, relativePosition);
                var accelerationMagnitude = force / mass;
                vec2.scaleAndAdd(particle.acceleration, particle.acceleration, accelerationDirection, -accelerationMagnitude);
                vec2.scaleAndAdd(otherParticle.acceleration, otherParticle.acceleration, accelerationDirection, accelerationMagnitude);
            }

            // Friction

            vec2.scaleAndAdd(particle.acceleration, particle.acceleration,
                particle.velocity, -simulation.parameters.friction / mass);

            if ((simulation.mouse.mode === "dragParticle") && (i === simulation.mouse.activeParticle)) {
                vec2.subtract(relativePosition, simulation.mouse.worldPosition, particle.position);
                vec2.scaleAndAdd(particle.acceleration, particle.acceleration,
                    relativePosition, 0.1 / mass);
            }

        }

        for (var particleIndex = 0; particleIndex < particleCount;
            ++particleIndex) {
            var particle = particles[particleIndex];

            // finish velocity verlet
            vec2.scaleAndAdd(particle.velocity, particle.velocity, particle.acceleration, 0.5 * dt);

            // calculate quantities
            if (simulation.leftRect.containsPoint(particle.position)) {
                colorCounts[particle.color.name] = 1 + (colorCounts[particle.color.name] || 0);
            }

            var particleKineticEnergy = 0.5 * vec2.squaredLength(particle.velocity);
            kineticEnergy += particleKineticEnergy;
            totalEnergy += particleKineticEnergy;
            totalEnergy += -vec2.dot(particle.position, gravityAcceleration);

            vec2.scaleAndAdd(totalMomentum, totalMomentum, particle.velocity, mass);


            // Collision with wall

            var collisionBounds = simulation.collisionBounds;

            if (!collisionBounds.containsPoint(particle.position)) {
                var overlap;

                if (particle.position[0] < collisionBounds.left) {
                    overlap = collisionBounds.left - particle.position[0];
                    vec2.set(wallNormal, 1, 0);
                } else if (particle.position[0] > collisionBounds.right) {
                    overlap = particle.position[0] - collisionBounds.right;
                    vec2.set(wallNormal, -1, 0);
                } else if (particle.position[1] < collisionBounds.top) {
                    overlap = collisionBounds.top - particle.position[1];
                    vec2.set(wallNormal, 0, 1);
                } else if (particle.position[1] > collisionBounds.bottom) {
                    overlap = particle.position[1] - collisionBounds.bottom;
                    vec2.set(wallNormal, 0, -1);
                }

                // Move out of overlap

                vec2.scaleAndAdd(particle.position, particle.position, wallNormal, overlap);

                // Reflect velocity

                vec2.projectOntoNormal(projection, particle.velocity, wallNormal);
                vec2.scaleAndAdd(particle.velocity, particle.velocity, projection, -2);

                totalPressure += vec2.length(projection);
            }
        }


        // Collision with other particles
        if (simulation.parameters.collisionEnabled) {
            if (quadtreeEnabled) {
                quadtree.clear();
                for (var particleIndex = 0; particleIndex < particles.length;
                    ++particleIndex) {
                    var particle = particles[particleIndex];
                    particle.updateBounds();
                    quadtree.add(particle);
                }
                quadtree.collideAll(collide);
            } else {
                for (var i = 0; i < particleCount; ++i) {
                    for (var j = 0; j < i; ++j) {
                        collide(particles[i], particles[j]);
                    }
                }
            }
        }

        // Trajectory

        if (simulation.parameters.trajectoryEnabled && (simulation.particleCount > 0)) {
            simulation.trajectory.push(vec2.clone(simulation.particles[0].position));
        }

        // Drawing

        drawSimulation(simulation);

        // Measurements
        var measurements = simulation.measurements;
        measurements.runningTime.push(simulation.time);
        measurements.runningPressure.push(totalPressure);

        graphAddPoint(simulation.graphs.energy, vec2.fromValues(simulation.time, totalEnergy));
        graphAddPoint(simulation.graphs.temperature, vec2.fromValues(simulation.time, kineticEnergy));

        var initialTime;

        if (measurements.runningPressure.length > simulation.parameters.pressureWindowSize) {
            measurements.runningPressure.shift();
            initialTime = measurements.runningTime.shift();
        } else {
            initialTime = measurements.runningTime[0];
        }

        var averagePressure = sum(measurements.runningPressure) / (simulation.time - initialTime);

        // Measurement text output 

        // document.getElementById("pressure").value = averagePressure.toExponential(2);
        // document.getElementById("energy").value = totalEnergy.toExponential(2);
        // document.getElementById("momentum").value =
        //     ["(", totalMomentum[0].toExponential(2),
        //     ", ", totalMomentum[1].toExponential(2), ")"
        // ].join("");
        // var colorCountStringArray = [];
        // var entropy = 0;
        // for (var color in colorCounts) {
        //     if (colorCounts.hasOwnProperty(color)) {
        //         var colorCount = colorCounts[color];
        //         var p = colorCount / particles.length;
        //         entropy = microstateEntropy(p) + microstateEntropy(1 - p);
        //         colorCountStringArray.push(color, ": ", colorCount, " ");
        //     }
        // }
        // document.getElementById("color").value = colorCountStringArray.join("");
        // document.getElementById("entropy").value = entropy.toExponential(2);

        simulation.mouse.leftButton.transitionCount = 0;
        simulation.mouse.rightButton.transitionCount = 0;

        if (simulation.running) {
            simulation.requestFrameId = window.requestAnimationFrame(updateFunction);
        }
    }
}();

var collide = function() {

    var relativePosition = vec2.create();
    var relativeVelocity = vec2.create();

    return function(particle1, particle2) {
        vec2.subtract(relativePosition, particle1.position, particle2.position);
        var quadrance = vec2.squaredLength(relativePosition);
        if (quadrance < squared(2 * radiusScaling)) {
            var distanceBetweenCenters = Math.sqrt(quadrance);
            var overlap = 2 * radiusScaling - distanceBetweenCenters;
            var normal = vec2.scale(relativePosition, relativePosition, 1 / distanceBetweenCenters);

            // Move out of overlap
            // TODO: improve to perform correct collision
            // TODO: use a continuous force instead of hard spheres

            vec2.scaleAndAdd(particle1.position, particle1.position, normal, overlap / 2);
            vec2.scaleAndAdd(particle2.position, particle2.position, normal, -overlap / 2);

            // Elastic collision

            vec2.subtract(relativeVelocity, particle1.velocity, particle2.velocity);
            var deltaVelocity = vec2.projectOntoNormal(relativeVelocity, relativeVelocity, normal);
            vec2.sub(particle1.velocity, particle1.velocity, deltaVelocity);
            vec2.add(particle2.velocity, particle2.velocity, deltaVelocity);
        }
    }
}();

// Random stuff

function microstateEntropy(p) {
    if (p == 0) {
        return 0;
    } else {
        return -p * Math.log2(p);
    }
}

function squared(x) {
    return x * x
};

function sum(array) {
    return array.reduce(function(x, y) {
        return x + y;
    });
}

// Vector

vec2.projectOntoNormal = function(out, a, normal) {
    var length = vec2.dot(a, normal);
    vec2.scale(out, normal, length);
    return out;
}

// Rectangle

function Rect() {
    this.left = 0;
    this.right = 0;
    this.top = 0;
    this.bottom = 0;
    this.width = 0;
    this.height = 0;
    this.center = vec2.create();
    return this;
}

Rect.prototype.setLeftTopRightBottom = function(left, top, right, bottom) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.width = right - left;
    this.height = top - bottom;
    vec2.set(this.center, (left + right) / 2, (top + bottom) / 2);
    return this;
}

Rect.prototype.setLeftTopWidthHeight = function(left, top, width, height) {
    this.left = left;
    this.top = top;
    this.right = left + width;
    this.bottom = top + height;
    this.width = width;
    this.height = height;
    vec2.set(this.center, left + width / 2, top + height / 2);
    return this;
}

Rect.prototype.setCenterWidthHeight = function(center, width, height) {
    var halfWidth = width / 2;
    var halfHeight = height / 2;
    this.left = center[0] - halfWidth;
    this.top = center[1] - halfHeight;
    this.right = center[0] + halfWidth;
    this.bottom = center[1] + halfHeight;
    this.width = width;
    this.height = height;
    vec2.copy(this.center, center);
    return this;
}

Rect.prototype.containsRect = function(inner) {
    var outer = this;
    var insideX = (outer.left <= inner.left) && (inner.right <= outer.right);
    var insideY = (outer.top <= inner.top) && (inner.bottom <= outer.bottom);
    return insideX && insideY;
}

Rect.prototype.containsPoint = function(point) {
    var insideX = (this.left <= point[0]) && (point[0] <= this.right)
    var insideY = (this.top <= point[1]) && (point[1] <= this.bottom)
    return insideX && insideY;
}

function randomPointInRect(rect) {
    return vec2.fromValues(randomInInterval(rect.left, rect.right),
        randomInInterval(rect.top, rect.bottom));
}

function randomInInterval(a, b) {
    return (a + (b - a) * Math.random())
}

// Quadtree

Quadtree = function(bounds, maxObjects, maxDepth) {
    this.objects = [];
    this.bounds = bounds;
    this.subtrees = undefined;
    this.maxObjects = maxObjects || 4;
    this.maxDepth = maxDepth || 7;
}

Quadtree.prototype.add = function(object) {
    if (this.subtrees) {
        for (var subtreeIndex = 0; subtreeIndex < this.subtrees.length;
            ++subtreeIndex) {
            var subtree = this.subtrees[subtreeIndex];
            if (subtree.bounds.containsRect(object.bounds)) {
                subtree.add(object);
                return;
            }
        }
        this.objects.push(object);
        return;
    } else {
        this.objects.push(object);

        if (this.objects.length > this.maxObjects) {
            // create subtrees
            var topLeft = new Rect().setLeftTopRightBottom(
                this.bounds.left, this.bounds.top,
                this.bounds.center[0], this.bounds.center[1]);
            var topRight = new Rect().setLeftTopRightBottom(
                this.bounds.center[0], this.bounds.top,
                this.bounds.right, this.bounds.center[1]);
            var bottomLeft = new Rect().setLeftTopRightBottom(
                this.bounds.left, this.bounds.center[1],
                this.bounds.center[0], this.bounds.bottom);
            var bottomRight = new Rect().setLeftTopRightBottom(
                this.bounds.center[0], this.bounds.center[1],
                this.bounds.right, this.bounds.bottom);
            this.subtrees = [new Quadtree(topLeft), new Quadtree(topRight),
                new Quadtree(bottomLeft), new Quadtree(bottomRight)
            ];
            for (var objectIndex = 0; objectIndex < this.objects.length;
                ++objectIndex) {
                var object = this.objects[objectIndex];
                for (var subtreeIndex = 0; subtreeIndex < this.subtrees.length;
                    ++subtreeIndex) {
                    var subtree = this.subtrees[subtreeIndex];
                    if (subtree.bounds.containsRect(object.bounds)) {
                        subtree.add(object);
                        break;
                    }
                }
            }
        }
    }

}

Quadtree.prototype.collideAll = function(collisionFunction) {
    for (var objectIndex = 0; objectIndex < this.objects.length;
        ++objectIndex) {
        this.collideWith(this.objects[objectIndex], collisionFunction);
    }
    if (this.subtrees) {
        for (var subtreeIndex = 0; subtreeIndex < this.subtrees.length;
            ++subtreeIndex) {
            var subtree = this.subtrees[subtreeIndex];
            subtree.collideAll(collisionFunction);
        }
    }
}

Quadtree.prototype.collideWith = function(collider, collisionFunction) {
    for (var objectIndex = 0; objectIndex < this.objects.length;
        ++objectIndex) {
        var object = this.objects[objectIndex];
        if (object != collider) {
            collisionFunction(collider, object);
        }
    }
    if (this.subtrees) {
        for (var subtreeIndex = 0; subtreeIndex < this.subtrees.length;
            ++subtreeIndex) {
            var subtree = this.subtrees[subtreeIndex];
            subtree.collideWith(collider, collisionFunction);
        }
    }
}

Quadtree.prototype.clear = function() {
    this.objects = [];
    if (this.subtrees) {
        for (var subtreeIndex = 0; subtreeIndex < this.subtrees.length;
            ++subtreeIndex) {
            var subtree = this.subtrees[subtreeIndex];
            subtree.clear();
        }
    }
}