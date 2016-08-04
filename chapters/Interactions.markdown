# Interactions / States of matter

<script>

    var interactionSim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.1;

            for (var i = 0; i < 2; i++) {
                addParticle(simulation, simulation.particleGenerator());
            }

            var d = 5;
            v2.set(simulation.particles[0].position, -d, -d);
            v2.set(simulation.particles[1].position, d, d);

            var ljInteraction = new LennardJonesInteraction();
            ljInteraction.strength = 10;
            setInteraction(simulation, 0, 0, ljInteraction);
        }
    });

    function ensembleSpeed(particles)
    {
        var totalVelocity = v2.alloc();
        v2.set(totalVelocity, 0, 0);
        for (var particleIndex = 0; particleIndex < particles.length; particleIndex++) {
            var particle = particles[particleIndex];
            v2.add(totalVelocity, totalVelocity, particle.velocity);
        }
        var ensembleSpeed = v2.magnitude(totalVelocity) / particles.length;
        v2.free(totalVelocity);
        return ensembleSpeed;
    }
</script>

<div class="page">
<div class="stepLog twoColumn">
Try moving these particles closer to each other.

<script>
    cue(function () {
        var distance = v2.distance(interactionSim.particles[0].position, interactionSim.particles[1].position);
        return (distance < 3);   
    });
    endStep();
</script>

They seem to like each other! As they come closer, they attract and snap together.

Can you get them to let go?

<script>
    cue(function () {
        var distance = v2.distance(interactionSim.particles[0].position, interactionSim.particles[1].position);
        return (distance > 6);
    });
    endStep();
</script>

It takes some effort!

What happens if you collide them at high speed?

<script>
    cue(function () {
        var distance = v2.distance(interactionSim.particles[0].position, interactionSim.particles[1].position);
        // TODO: speed along normal instead
        var relativeSpeed = v2.distance(interactionSim.particles[0].velocity, interactionSim.particles[1].velocity);
        return (distance < 3) && (relativeSpeed > 1.0);
    });
    endStep();
</script>

The speed is too great for them to have time to stick together.

</div>

<div class="twoColumn">
<script>
    insertHere(interactionSim.div);
    /*
    insertHere(createOutput({
        label: "distance: ",
        update: function () {
            var distance = v2.distance(interactionSim.particles[0].position, interactionSim.particles[1].position);
            return distance.toFixed(2);
        }
    }));
    insertHere(createOutput({
        label: "average speed: ",
        update: function () {
            var speed = ensembleSpeed(interactionSim.particles);
            return speed.toFixed(2);
        }
    }));
    */
</script>
</div>
</div>


<script>
    var createPotentialPlotHere = function(potential, simulation)
    {
        return createGraphHere({
            update: function(graph) {
                var relativePosition = v2.alloc();
                v2.subtract(relativePosition, simulation.particles[0].position, simulation.particles[1].position);
                var distance = v2.magnitude(relativePosition);
                v2.free(relativePosition);
                var r = distance / simulation.interactions[0].separation;

                var xMax = 4;
                var xs = [];
                var ys = [];
                var sampleCount = 100;
                for (var i = 0; i < sampleCount; i++) {
                    var x = lerp(0.6, i/(sampleCount - 1), xMax);
                    xs.push(x);
                    ys.push(potential(x))
                }
                addCurve(graph, {
                    x: xs, y: ys, color: Color.black,
                });
                setGraphLimits(graph, {
                    xMin: -0.5, xMax: simulation.boxBounds.width/2 - 0.5,
                });

                drawGraph(graph);
               
                var markerRadius = 7;
                drawDiscMarker(graph.renderer, v2(r, potential(r)), markerRadius, Color.black);
            }
        });
    }
</script>

<div class="page">
## Potentials

<div class="stepLog twoColumn">
<script>
    var repulsivePotentialSim = createSimulation({
        pixelWidth: 400,
        pixelHeight: 80,
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.1;
            p.simulationTimePerSecond = 1;
            p.boxHeight = 2;

            updateBounds(simulation);

            for (var i = 0; i < 2; i++) {
                addParticle(simulation, simulation.particleGenerator());
            }

            var d = simulation.boxBounds.width/2 - 1;
            v2.set(simulation.particles[0].position, -d, 0);
            simulation.particles[0].mass = Infinity;
            v2.set(simulation.particles[1].position, d, 0);

            var interaction = new RepulsiveInteraction();
            interaction.strength = 1;
            setInteraction(simulation, 0, 0, interaction);
        }
    });
</script>
It would be easier to understand the interaction if only one particle moved. So let's make one of the particles immovable.

Try dragging the particle in the middle.

<script>
    cue(function () {
        var isDragging = (repulsivePotentialSim.mouse.draggedParticleIndex == 0);
        return isDragging;
    });
    endStep();
</script>

Yeah, it won't budge.

* maybe limit particles to moving along a line?

Now we can think of the first particle as moving in the second particles landscape

The interaction will depend on the distance between two particles, and we can visualize it as a "landscape", where the stationary particle is at the left and the moving particle is a ball rolling in the landscape. 

Let's first look at the simple bouncing-off interaction. This is represented by a steep hill in the potential landscape. When the particles come close to each other, the moving particle rolls up the imaginary hill and loses speed, until it turns and rolls back down.
</div>

<div class="twoColumn">
<script>
    insertHere(repulsivePotentialSim.div);

    var repulsivePotential = function(x) { 
        return (x < 1) ? (lennardJonesEnergy(x) - lennardJonesEnergy(1)) : 0;
    }
    var repulsiveGraph = createPotentialPlotHere(repulsivePotential, repulsivePotentialSim);
    setGraphLimits(repulsiveGraph, { yMax: 50});
</script>
</div>
</div>




<div class="page">
<div class="stepLog twoColumn">
<script>
    var lennardJonesPotentialSim = createSimulation({
        pixelWidth: 400,
        pixelHeight: 80,
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.1;
            p.simulationTimePerSecond = 1;
            p.boxHeight = 2;

            updateBounds(simulation);

            for (var i = 0; i < 2; i++) {
                addParticle(simulation, simulation.particleGenerator());
            }

            var d = simulation.boxBounds.width/2 - 1;
            v2.set(simulation.particles[0].position, -d, 0);
            simulation.particles[0].mass = Infinity;
            v2.set(simulation.particles[1].position, d, 0);

            var interaction = new LennardJonesInteraction();
            interaction.strength = 2;
            setInteraction(simulation, 0, 0, interaction);
        }
    });
</script>


The potential for the attractive interaction is more interesting. There is still a steep hill, but before that we have a valley, and it's rolling down this valley that makes the particles "like" each other.



Note that the ball will roll back and forth in the valley before settling at the bottom. This is why the particles vibrate a bit when they snap together. Without friction, they will keep vibrating forever.

<script>
    createSliderHere({
        object: lennardJonesPotentialSim.parameters,
        name: "friction",
        min: 0, max: 0.1,
        minLabel: "No friction", maxLabel: "Some",
    });
</script>
</div>


<div class="twoColumn">
<script>
    insertHere(lennardJonesPotentialSim.div);
    var lennardJonesGraph = createPotentialPlotHere(lennardJonesEnergy, lennardJonesPotentialSim);
    setGraphLimits(lennardJonesGraph, { yMax: 2 });
</script>
</div>
</div>









<div class="page">
<div class="stepLog twoColumn">


Let's add some more particles! (select the _create_ tool and use the mouse)

<script>
    cue(function () {
        return (interactionSim.particles.length > 20);  
    });
    endStep();
</script>

They group together and form a larger shape, a _solid_, if you will.

Try moving the solid around.

<script>
    cue(function () {
        return (ensembleSpeed(interactionSim.particles) > 0.15); 
    });
    endStep();
</script>

The particles collectively behave like the macroscopic objects we are used to, moving and rotating as a unit.

So far, we've have had friction, but there is no friction in the microscopic world.

Turn off the friction.

<script>
    cue(function () {
        return (interactionSim.parameters.friction == 0);
    });
    createSliderHere({
        object: interactionSim.parameters,
        name: "friction",
        min: 0, max: 0.1,
        minLabel: "No friction", maxLabel: "Some",
    });
</script>

Give the particles some energy.

<script>
    cue(function() {
        return (getTotalEnergy(interactionSim) > 0.3);
    });
    endStep();
</script>



Let's try amplifying the speed of each particle, in turn increasing the jiggling.

The random jiggling kicks the particles out of their positions, and what was a neat shape becomes something less ordered and more random. We have melted the _solid_ into a _liquid_.

If we increase the temperature (and thus the jiggling) even further, the speed is to great to keep the particles together, and they start bouncing around randomly. The heat of the system is too high for the attraction to matter much, and we've vaporized our _liquid_ into _gas_.
</div>
</div>

<script>
    initChapter();
</script>


