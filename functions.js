// Creating UI

function combineWithDefaults(opts, defaults)
{
    for (var key in defaults) {
        if (! opts.hasOwnProperty(key))
        {
            opts[key] = defaults[key];
        }
        else if (typeof opts[key] === 'object')
        {
            combineWithDefaults(opts[key], defaults[key]);
        }
    }
}

function createSlider(simulation, opts)
{
    combineWithDefaults(opts, {
        label: name,
        minLabel: String(opts.min),
        maxLabel: String(opts.max),
        snapBack: false,
        function: function(x){ return x; },
    });
    
    // set up slider element
    
    var slider = document.createElement("input");
    slider.setAttribute("id", simulation.id + "_" + opts.name)
    slider.setAttribute("type", "range");
    slider.setAttribute("value", opts.initial);
    slider.setAttribute("min", opts.min);
    slider.setAttribute("max", opts.max);
    var step = opts.step || (opts.max - opts.min) / 1000;
    slider.setAttribute("step", step);
    
    // set up presentation elements
    
    var p = document.createElement("p");
    simulation.sliderDiv.appendChild(p);
    p.appendChild(document.createTextNode(opts.label));
    p.appendChild(document.createElement("br"));
    p.appendChild(document.createTextNode(opts.minLabel));
    p.appendChild(slider);
    p.appendChild(document.createTextNode(opts.maxLabel));
    
    // set up callbacks
    
    simulation.parameters[opts.name] = opts.function(opts.initial);
    
    slider.addEventListener("input", function() {
        simulation.parameters[opts.name] = opts.function(Number(this.value));
    });
    
    if (opts.snapBack)
    {
        slider.addEventListener("change", function() {
            this.value = opts.initial;
            simulation.parameters[opts.name] = opts.function(opts.initial);
        });
    }
}

function createCheckbox(simulation, opts)
{
    combineWithDefaults(opts, {
        label: name,
        initial: false
    });
    
    var checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    var checkboxId = simulation.id + "_" + opts.name;
    checkbox.setAttribute("id", checkboxId)
    checkbox.setAttribute("name", opts.name);
    checkbox.checked = opts.initial;
    var label = document.createElement("label");
    label.setAttribute("for", checkboxId);
    label.innerHTML = opts.label;
    
    simulation.checkboxDiv.appendChild(label);
    simulation.checkboxDiv.appendChild(checkbox);
    
    checkbox.addEventListener("change", function(){
        simulation.parameters[opts.name] = this.checked;
    });
}

function createButton(simulation, label, callback)
{
    var button = document.createElement("input");
    button.setAttribute("type", "button");
    button.setAttribute("value", label);
    button.addEventListener("click", callback);
    simulation.buttonDiv.appendChild(button);
}


// Constants

var tau = 2*Math.PI;



// Particle object

var Particle = function(position, velocity, color)
{
    this.position = position || vec2.create();
    this.velocity = velocity || vec2.create();
    this.acceleration = vec2.create();
    this.color    = color    || {name: "black", rgba: [0, 0, 0, 1]};
    this.bounds   = new Rect();
    this.radius   = 1;
}

Particle.prototype.updateBounds = function()
{
    this.bounds.setCenterWidthHeight(this.position, radiusScaling*2, radiusScaling*2);
    return this.bounds;
}

//
// Initialization
//

function groupedPosition(simulation, particleIndex)
{
    var collisionBounds = simulation.collisionBounds;
    var smallCenteredRect = new Rect().setCenterWidthHeight(
        collisionBounds.center, collisionBounds.width / 5, collisionBounds.height / 5
    );
    return randomPointInRect(smallCenteredRect);
}

function uniformPosition(simulation, particleIndex)
{
    return randomPointInRect(simulation.collisionBounds);
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

var triangularLatticePosition = function(){
    
    var latticeX = vec2.create();
    var latticeY = vec2.create();
    
    return function (simulation, particleIndex)
    {
        // NOTE: this is the formula for triangular numbers inverted
        var triangularNumber = Math.floor((Math.sqrt(8*particleIndex + 1) - 1) / 2);
        var rest = particleIndex - triangularNumber * (triangularNumber + 1) / 2;
        var integerX = rest;
        var integerY = triangularNumber - rest;
        var latticeSpacing = 2 * simulation.parameters.radiusScaling;
        vec2.setPolar(latticeX, latticeSpacing * integerX, 0);
        vec2.setPolar(latticeY, latticeSpacing * integerY, tau / 6);
        return vec2.add(vec2.create(), latticeX, latticeY);
    }
}

var hexagonalLatticePosition = function(){
    
    var latticeX = vec2.create();
    var latticeY = vec2.create();
    
    return function (simulation, particleIndex)
    {
        // NOTE: this adds the particles in a spiral by figuring out their coordinates in 
        // one of 6 triangular lattices
        if (particleIndex == 0) {
            return vec2.create();
        }
        var k = particleIndex - 1;
        var layer = Math.floor((Math.sqrt(8*(k / 6) + 1) - 1) / 2) + 1; // NOTE: 1-indexed
        var rest = k - 6 * layer * (layer - 1) / 2;
        var triangleIndex = Math.floor(rest / layer);
        var integerX = layer;
        var integerY = rest % layer;
        var latticeSpacing = 2 * simulation.parameters.radiusScaling;
        var rotationAngle = triangleIndex * tau/6;
        vec2.setPolar(latticeX, latticeSpacing * integerX, rotationAngle);
        var shape = 2; // 1: spiral, 2: hexagon
        vec2.setPolar(latticeY, latticeSpacing * integerY, rotationAngle + shape * tau/6);
        return vec2.add(vec2.create(), latticeX, latticeY);
    }
}();

function noVelocity(simulation, particleIndex)
{
    return vec2.create();
}

function uniformVelocity(simulation, particleIndex)
{
    var speed = randomInInterval(0, simulation.parameters.maxInitialSpeed);
    var angle = randomInInterval(0, tau);
    return vec2.fromValues(speed * Math.cos(angle), speed * Math.sin(angle));
}

function identicalVelocity(simulation, particleIndex)
{
    return vec2.fromValues(0, - simulation.parameters.maxInitialSpeed);
}

function oneColor(simulation, particleIndex)
{
    return {name: "black", rgba: [0, 0, 0, 1]};
}

function twoColors(simulation, particleIndex)
{
    if (particleIndex % 2 == 0)
    {
        return {name: "black", rgba: [0, 0, 0, 1]};
    }
    else
    {
        return {name: "red", rgba: [1, 0, 0, 1]};
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
        oneColor(simulation, particleIndex)
    );
}

function groupedParticleGenerator(simulation, particleIndex)
{
    return new Particle(
        groupedPosition(simulation, particleIndex),
        uniformVelocity(simulation, particleIndex),
        oneColor(simulation, particleIndex)
    );
}

function fallingParticleGenerator(simulation, particleIndex)
{
    return new Particle(
        groupedPosition(simulation, particleIndex),
        identicalVelocity(simulation, particleIndex),
        oneColor(simulation, particleIndex)
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
        noVelocity(simulation, particleIndex),
        oneColor(simulation, particleIndex)
    );
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
        for (var particleIndex = simulation.particleCount;
             particleIndex < newParticleCount;
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
    var particleIndex = simulation.particleCount;
    var particle = simulation.particleGenerator(simulation, particleIndex);
    particle.position = position;
    simulation.particles.push(particle);
    simulation.particleCount += 1;
    simulation.parameters.particleCount += 1;
    drawSimulation(simulation);
}

function removeParticle(simulation, particleIndex)
{
    simulation.particles.splice(particleIndex, 1);
    simulation.particleCount -= 1;
    simulation.parameters.particleCount -= 1;
    drawSimulation(simulation);
}

function updateTrajectory(simulation)
{
    if (simulation.parameters.trajectoryEnabled)
    {
        simulation.particles[0].color = {name: "blue", rgba: [0, 0, 1, 1]};
    }
    else
    {
        simulation.particles[0].color = simulation.particleGenerator(simulation, 0).color;
    }

}

function worldFromCanvas(simulation, position)
{
    var canvas = simulation.canvas;
    var canvasBounds = canvas.getBoundingClientRect();
    var canvasX = position[0] - canvasBounds.left;
    var canvasY = position[1] - canvasBounds.top;
    var x = ((canvasX / canvas.width) * 2 - 1) * canvas.width / canvas.height;
    var y = - ((canvasY / canvas.height) * 2 - 1);
    return vec2.fromValues(x, y);
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
    
    for (var particleIndex = 0;
        particleIndex < simulation.particleCount;
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
    combineWithDefaults(opts, {
        width: 500,
        height: 500,
        controls: [],
        graphs: [],
        parameters: {
            maxInitialSpeed: 0.001,
            collisionEnabled: false,
            pressureWindowSize: 1000,
            quadtreeEnabled: true,
            frameDuration: 33,
            deltaTemperature: 1,
            gravityAcceleration: vec2.create(),
            simulationSpeed: 1,
            particleCount: 91,
            radiusScaling: 0.08,
            boxSize: 500,
        }
    });
    
    var simulation = {};
    
    simulation.id = id;
    
    simulation.running = true;
    simulation.pausedByUser = false;
    simulation.previousTime = 0;
    
    simulation.particles = [];
    simulation.particleCount = 0;
    simulation.particleGenerator = latticeParticleGenerator;

    simulation.quadTree = undefined;
    
    simulation.trajectoryEnabled = false;
    simulation.trajectory = [];
    
    simulation.runningPressure = [];
    simulation.runningTime = [];
    
    simulation.boxBounds = new Rect();
    simulation.collisionBounds = new Rect();
    simulation.leftRect = new Rect();
    simulation.rightRect = new Rect();
    
    simulation.parameters = opts.parameters;
    

    // set up HTML elements
    simulation.div = document.getElementById(id);
    
    simulation.canvas = document.createElement("canvas");
    simulation.canvas.setAttribute("width", opts.width);
    simulation.canvas.setAttribute("height", opts.height);
    simulation.div.appendChild(simulation.canvas);
    
    simulation.controlsDiv = document.createElement("div");
    simulation.buttonDiv = document.createElement("div");
    simulation.sliderDiv = document.createElement("div");
    simulation.checkboxDiv = document.createElement("div");
    
    simulation.div.appendChild(simulation.controlsDiv);
    simulation.controlsDiv.appendChild(simulation.buttonDiv);
    simulation.controlsDiv.appendChild(simulation.sliderDiv);
    simulation.controlsDiv.appendChild(simulation.checkboxDiv);
    
    simulation.canvas.addEventListener("click", function(event){
        var position = worldFromCanvas(simulation, vec2.fromValues(event.clientX, event.clientY));
        var extraRadius = 1;
        if (pickParticle(simulation, position, extraRadius) === undefined) 
        {
            addParticle(simulation, position);
        }
        else
        {
            var pickedParticle = pickParticle(simulation, position);
            if (pickedParticle !== undefined)
            {
                removeParticle(simulation, pickedParticle);
            }
        }
        
    });
    
    // Pause when switching tabs
    
    document.addEventListener('visibilitychange', function(event) {
        if (document.hidden)
        {
            pauseSimulation(simulation);
        }
        else if (! simulation.pausedByUser)
        {
            resumeSimulation(simulation);
        }
    });
    
    // TODO: pause when window loses focus?
    // TODO: pause when scrolled out of view
    
    // setup controls and meters
    
    var controls = {
        deltaTemperature: function() {
            createSlider(simulation, {
                name: "deltaTemperature",
                label: "Control temperature:",
                initial: 1,
                min: 0.97, minLabel: "Colder",
                max: 1.03, maxLabel: "Warmer", 
                snapBack: true,
            });
        },
        simulationSpeed: function() {
            createSlider(simulation, {
                name: "simulationSpeed",
                label: "Control time:",
                initial: 1,
                min: -1, minLabel: "Backward",
                max: 1, maxLabel: "Forward",
            });
        },
        particleCount: function() {
            createSlider(simulation, {
                name: "particleCount",
                label: "Number of particles:",
                initial: 91,
                min: 1, minLabel: "1",
                max: 200, maxLabel: "200",
                step: 1,
                // TODO: make this exponential?
            });
        },
        radiusScaling: function() {
            createSlider(simulation, {
                name: "radiusScaling",
                label: "Particle size:",
                initial: 0.08,
                min: 0.01, minLabel: "Tiny",
                max: 0.1, maxLabel: "Huge",
            });
        },
        gravityAcceleration: function() {
            createSlider(simulation, {
                name: "gravityAcceleration",
                label: "Gravity:",
                initial: 0,
                min: 0, minLabel: "None",
                max: 2e-4, maxLabel: "Strong",
                function: function(g) {
                    return vec2.fromValues(0, -g);
                },
            });
        },
        boxSize: function() {
            createSlider(simulation, {
                name: "boxSize",
                label: "Box Size:",
                initial: 500,
                min: 20, minLabel: "Tiny",
                max: 1000, maxLabel: "Huge",
            });
        },
        quadtreeEnabled: function() {
            createCheckbox(simulation, {
                name: "quadtreeEnabled",
                label: "Quadtree",
                initial: false,
            });
        },
        trajectoryEnabled: function() {
            createCheckbox(simulation, {
                name: "trajectoryEnabled",
                label: "Draw trajectory",
                initial: false,
            });
        },
        resetButton: function() {
            createButton(simulation, "Reset", function(){
                resetSimulation(simulation);
            });
        },
        playPauseButton: function() {
            createButton(simulation, "Play/Pause", function(){
                if (simulation.requestFrameId)
                {
                    simulation.pausedByUser = true;
                    pauseSimulation(simulation);
                }
                else
                {
                    simulation.pausedByUser = false;
                    resumeSimulation(simulation);
                }
            });
        }
    }
    
    for (var i = 0; i < opts.controls.length; i++) {
        controls[opts.controls[i]]();
    }
    
    // set up simulation
    
    simulation.renderer = createRenderer(simulation.canvas);
    
    simulation.updateFunction = function(time) {
        updateSimulation(simulation.updateFunction, simulation, time);
    };
    
    simulation.requestFrameId = window.requestAnimationFrame(simulation.updateFunction);
    
    return simulation;
}

function pauseSimulation(simulation)
{
    if (simulation.requestFrameId)
    {
        window.cancelAnimationFrame(simulation.requestFrameId);
        simulation.requestFrameId = undefined;
    }
}

function resumeSimulation(simulation)
{
    if (! simulation.requestFrameId)
    {
        simulation.previousTime = 0;
        simulation.requestFrameId = window.requestAnimationFrame(simulation.updateFunction);
    }
}

function resetSimulation(simulation)
{
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
    
    var boxBounds = simulation.boxBounds;
    boxBounds.setCenterWidthHeight(
        origin, 2*aspectRatio, 2
    );
    
    var radiusScaling = simulation.parameters.radiusScaling;
    simulation.collisionBounds.setCenterWidthHeight(
        origin, 2*(aspectRatio - radiusScaling), 2*(1 - radiusScaling)
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

function lennardJonesEnergy(invDistance, bondEnergy, separation)
{
    // TODO: truncate and shift, see wikipedia
    var a = separation * invDistance;
    var a6 = Math.pow(a, 6);
    var shape = a6*a6 - 2*a6;
    return bondEnergy * shape;
}

function lennardJonesForce(invDistance, bondEnergy, separation)
{
    var a = separation * invDistance;
    var a6 = Math.pow(a, 6);
    var shape = 12 * invDistance * (a6*a6 - a6);
    return bondEnergy * shape;
}

// Simulation


function drawSimulation(simulation)
{
    clearRenderer(simulation.renderer);

    // update trajectory
    if (simulation.parameters.trajectoryEnabled)
    {
        simulation.trajectory.push(simulation.particles[0].position[0], simulation.particles[0].position[1]);
        drawTrajectory(simulation.renderer, simulation.trajectory, simulation.particles[0].color);
    }

    drawParticles(simulation.renderer, simulation.particles, simulation.parameters.radiusScaling);
}

var updateSimulation = function(){

  var relativePosition = vec2.create(); 
  
  var totalMomentum = vec2.create();
  var wallNormal = vec2.create();
  var projection = vec2.create();

  return function(updateFunction, simulation, time)
  {
      var elapsed = time - simulation.previousTime;
      if ((elapsed > 100) || (elapsed <= 0))
      {
          elapsed = simulation.parameters.frameDuration;
      }
      var slowingFactor = 0.01;
      var dt = elapsed * simulation.parameters.simulationSpeed * slowingFactor;
      simulation.previousTime = time;

      var totalEnergy = 0;
      var totalPressure = 0;
      vec2.set(totalMomentum, 0, 0);
      var colorCounts = {};
      
      var mass = 1;
      

      updateParticleCount(simulation);
      updateBounds(simulation);
      updateTrajectory(simulation);
      
      var particles = simulation.particles;
      var particleCount = simulation.particleCount;

      for (var particleIndex = 0;
          particleIndex < particleCount;
          ++particleIndex)
      {
          var particle = particles[particleIndex];
          
          // Scale velocities with delta temperature
          
          vec2.scale(particle.velocity, particle.velocity, simulation.parameters.deltaTemperature);
          
          // velocity verlet
          
          vec2.scaleAndAdd(particle.velocity, particle.velocity, particle.acceleration, 0.5 * dt);
          vec2.scaleAndAdd(particle.position, particle.position, particle.velocity, dt);
          
          // set up acceleration before next loop
          vec2.copy(particle.acceleration, simulation.parameters.gravityAcceleration);
      }

      // Calculate forces
      
      for (var i = 0; i < particleCount; ++i)
      {
          var particle = particles[i];
          
          for (var j = 0; j < i; ++j)
          {
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
              vec2.scaleAndAdd(particle.acceleration, particle.acceleration, accelerationDirection, - accelerationMagnitude);
              vec2.scaleAndAdd(otherParticle.acceleration, otherParticle.acceleration, accelerationDirection, accelerationMagnitude);
          }
      }
      
      for (var particleIndex = 0;
          particleIndex < particleCount;
          ++particleIndex)
      {
          var particle = particles[particleIndex];
          
          // finish velocity verlet
          vec2.scaleAndAdd(particle.velocity, particle.velocity, particle.acceleration, 0.5 * dt);
          
          // calculate quantities
          if(simulation.leftRect.containsPoint(particle.position))
          {
              colorCounts[particle.color.name] = 1 + (colorCounts[particle.color.name] || 0);
          }
          totalEnergy += 0.5*vec2.squaredLength(particle.velocity);
          totalEnergy += - vec2.dot(particle.position, simulation.parameters.gravityAcceleration);
          
          vec2.scaleAndAdd(totalMomentum, totalMomentum, particle.velocity, mass);
          
          
          // Collision with wall
          
          var collisionBounds = simulation.collisionBounds;

          if (! collisionBounds.containsPoint(particle.position))
          {
              var overlap;

              if (particle.position[0] < collisionBounds.left)
              {
                  overlap = collisionBounds.left - particle.position[0];
                  vec2.set(wallNormal, 1, 0);
              }
              else if (particle.position[0] > collisionBounds.right)
              {
                  overlap = particle.position[0] - collisionBounds.right;
                  vec2.set(wallNormal, -1, 0);
              }
              else if (particle.position[1] < collisionBounds.top)
              {
                  overlap = collisionBounds.top - particle.position[1];
                  vec2.set(wallNormal, 0, 1);
              }
              else if (particle.position[1] > collisionBounds.bottom)
              {
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
      if (simulation.parameters.collisionEnabled)
      {
          if (quadtreeEnabled)
          {
              quadtree.clear();
              for (var particleIndex = 0;
                  particleIndex < particles.length;
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

      // Drawing

      drawSimulation(simulation);

      // Measurements

      simulation.runningPressure.push(totalPressure);
      simulation.runningTime.push(time)
      var initialTime;
      if (simulation.runningPressure.length > simulation.parameters.pressureWindowSize)
      {
          simulation.runningPressure.shift();
          initialTime = simulation.runningTime.shift();
      }
      else
      {
          initialTime = simulation.runningTime[0];
      }

      var averagePressure = sum(simulation.runningPressure) / (time - initialTime);
      
      document.getElementById("pressure").value = averagePressure.toExponential(2);
      document.getElementById("energy").value = totalEnergy.toExponential(2);
      document.getElementById("momentum").value =
          ["(", totalMomentum[0].toExponential(2),
           ", ", totalMomentum[1].toExponential(2), ")"].join("");
      var colorCountStringArray = [];
      var entropy = 0;
      for (var color in colorCounts)
      {
          if (colorCounts.hasOwnProperty(color))
          {
              var colorCount = colorCounts[color];
              var p = colorCount/particles.length;
              entropy = microstateEntropy(p) + microstateEntropy(1 - p);
              colorCountStringArray.push(color, ": ", colorCount, " ");
          }
      }
      document.getElementById("color").value = colorCountStringArray.join("");
      document.getElementById("entropy").value = entropy.toExponential(2);

      if (simulation.running)
      {
          simulation.requestFrameId = window.requestAnimationFrame(updateFunction);
      }
  }
}();

var collide = function(){

  var relativePosition = vec2.create();
  var relativeVelocity = vec2.create();

  return function(particle1, particle2)
  {
      vec2.subtract(relativePosition, particle1.position, particle2.position);
      var quadrance = vec2.squaredLength(relativePosition);
      if (quadrance < squared(2*radiusScaling))
      {
          var distanceBetweenCenters = Math.sqrt(quadrance);
          var overlap = 2*radiusScaling - distanceBetweenCenters;
          var normal = vec2.scale(relativePosition, relativePosition, 1 / distanceBetweenCenters);

          // Move out of overlap
          // TODO: improve to perform correct collision
          // TODO: use a continuous force instead of hard spheres

          vec2.scaleAndAdd(particle1.position, particle1.position, normal, overlap / 2);
          vec2.scaleAndAdd(particle2.position, particle2.position, normal, - overlap / 2);

          // Elastic collision

          vec2.subtract(relativeVelocity, particle1.velocity, particle2.velocity);
          var deltaVelocity = vec2.projectOntoNormal(relativeVelocity, relativeVelocity, normal);
          vec2.sub(particle1.velocity, particle1.velocity, deltaVelocity);
          vec2.add(particle2.velocity, particle2.velocity, deltaVelocity);
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
        return - p * Math.log2(p);
    }
}

function squared(x) 
{ 
    return x * x
};

function sum(array)
{
    return array.reduce(function(x, y) {
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

// Rectangle
// stored as an array of left, top, right, bottom

function Rect()
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

Rect.prototype.setLeftTopRightBottom = function(left, top, right, bottom)
{
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.width = right - left;
    this.height = top - bottom;
    vec2.set(this.center, (left + right) / 2, (top + bottom) / 2);
    return this;
}

Rect.prototype.setLeftTopWidthHeight = function(left, top, width, height)
{
    this.left = left;
    this.top = top;
    this.right = left + width;
    this.bottom = top + height;
    this.width = width;
    this.height = height;
    vec2.set(this.center, left + width/2, top + height/2);
    return this;
}

Rect.prototype.setCenterWidthHeight = function(center, width, height)
{
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

Rect.prototype.containsRect = function(inner)
{
    var outer = this;
    var insideX = (outer.left <= inner.left) && (inner.right <= outer.right);
    var insideY = (outer.top  <= inner.top ) && (inner.bottom <= outer.bottom);
    return insideX && insideY;
}

Rect.prototype.containsPoint = function(point)
{
    var insideX = (this.left <= point[0]) && (point[0] <= this.right)
    var insideY = (this.top <= point[1])  && (point[1] <= this.bottom)
    return insideX && insideY;
}

function randomPointInRect(rect)
{
    return vec2.fromValues(randomInInterval(rect.left, rect.right),
                           randomInInterval(rect.top, rect.bottom));
}

function randomInInterval(a, b)
{
    return (a + (b - a)*Math.random())
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
        for (var subtreeIndex = 0; 
            subtreeIndex < this.subtrees.length; 
            ++subtreeIndex)
        {
            var subtree = this.subtrees[subtreeIndex];
            if (subtree.bounds.containsRect(object.bounds))
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
                             new Quadtree(bottomLeft), new Quadtree(bottomRight)];
             for (var objectIndex = 0; 
                 objectIndex < this.objects.length; 
                 ++objectIndex)
             {
                var object = this.objects[objectIndex];
                for (var subtreeIndex = 0; 
                    subtreeIndex < this.subtrees.length; 
                    ++subtreeIndex)
                {
                    var subtree = this.subtrees[subtreeIndex];
                    if (subtree.bounds.containsRect(object.bounds))
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
    for (var objectIndex = 0; 
        objectIndex < this.objects.length; 
        ++objectIndex)
    {
        this.collideWith(this.objects[objectIndex], collisionFunction);
    }
    if (this.subtrees)
    {
        for (var subtreeIndex = 0; 
            subtreeIndex < this.subtrees.length; 
            ++subtreeIndex)
        {
            var subtree = this.subtrees[subtreeIndex];
            subtree.collideAll(collisionFunction);
        }
    }
}

Quadtree.prototype.collideWith = function(collider, collisionFunction) 
{
    for (var objectIndex = 0; 
        objectIndex < this.objects.length; 
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
        for (var subtreeIndex = 0; 
            subtreeIndex < this.subtrees.length; 
            ++subtreeIndex)
        {
            var subtree = this.subtrees[subtreeIndex];
            subtree.collideWith(collider, collisionFunction);
        }
    }
}

Quadtree.prototype.clear = function() {
    this.objects = [];
    if (this.subtrees)
    {
        for (var subtreeIndex = 0; 
            subtreeIndex < this.subtrees.length; 
            ++subtreeIndex)
        {
            var subtree = this.subtrees[subtreeIndex];
            subtree.clear();
        }
    }
}