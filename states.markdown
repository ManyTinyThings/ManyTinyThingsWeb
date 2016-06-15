# Interactions / States of matter

## Micro &rarr;

We know that we can think of atoms as tiny billiard balls bouncing around endlessly. But bouncing isn't the only way particles interact. 

Try moving these particles closer to each other.

<script>

    var interactionSim = createSimulation({
        controls: [],
        graphs: ["energy"],
        parameters: {
            particleCount: 2,
            radiusScaling: 0.1,
            friction: 0.1,
            lennardJonesStrength: 0.5,
        },
    });

    v2.set(interactionSim.particles[0].position, -0.5, -0.5);
    v2.set(interactionSim.particles[1].position, 0.5, 0.5);

    setInteraction(interactionSim, 0, 0, Interaction.lennardJones);
</script>

They seem to like each other! As they come closer, they attract and snap together. Can you get them to let go?


<script>

    var interactionSim = createSimulation({
        controls: [],
        graphs: ["energy"],
        parameters: {
            particleCount: 2,
            radiusScaling: 0.1,
            friction: 0.1,
            lennardJonesStrength: 0.5,
        },
    });

    setInteraction(interactionSim, 0, 0, Interaction.lennardJones);
</script>

It takes some effort! What happens if you collide them at high speed?

<script>

    var interactionSim = createSimulation({
        controls: [],
        graphs: ["energy"],
        parameters: {
            particleCount: 2,
            radiusScaling: 0.1,
            lennardJonesStrength: 0.5,
            friction: 0.1,
        },
    });

    v2.set(interactionSim.particles[0].position, -0.5, -0.5);
    v2.set(interactionSim.particles[1].position, 0.5, 0.5);


    setInteraction(interactionSim, 0, 0, Interaction.lennardJones);
</script>

The speed is too great for them to have time to stick together.

## &rarr; Macro

Let's add some more particles! (hold _c_ on the keyboard and use the mouse)

<script>

    var interactionSim = createSimulation({
        controls: [],
        graphs: ["energy"],
        parameters: {
            particleCount: 1,
            radiusScaling: 0.1,
            lennardJonesStrength: 0.1,
            friction: 0.3,
        },
    });

    setInteraction(interactionSim, 0, 0, Interaction.lennardJones);
</script>

They group together and form a larger shape, a _solid_, if you will. Try pulling carefully at it.

<script>

    var interactionSim = createSimulation({
        controls: [],
        graphs: ["energy"],
        parameters: {
            particleCount: 19,
            radiusScaling: 0.1,
            friction: 0.1,
            lennardJonesStrength: 0.1,
        },
    });

    setInteraction(interactionSim, 0, 0, Interaction.lennardJones);
</script>

The particles collectively behave like the macroscopic objects we are used to, moving and rotating as a unit.

## ~~Friction~~

So far, we've have had friction, but there is no friction in the microscopic world.

<script>

	function perturbedLattice(simulation, particleIndex)
	{
		var particle = latticeParticleGenerator(simulation, particleIndex);
		var perturbationStrength = 0.05;
		var perturbation = randomUnitVector();
		v2.scale(perturbation, perturbation, perturbationStrength * simulation.parameters.radiusScaling);
		v2.add(particle.position, particle.position, perturbation);
		return particle;
	}

    var interactionSim = createSimulation({
        controls: [],
        graphs: ["energy"],
        particleGenerator: perturbedLattice,
        parameters: {
            particleCount: 19,
            radiusScaling: 0.1,
            lennardJonesStrength: 0.1,
        },
    });

    setInteraction(interactionSim, 0, 0, Interaction.lennardJones);
</script>

Now, the particles are constantly jiggling, meaning the system has a certain amount of heat.

Let's try amplifying the speed of each particle, in turn increasing the jiggling.


<script>
    var interactionSim = createSimulation({
        controls: ["thermostatTemperature"],
        graphs: ["energy"],
        particleGenerator: perturbedLattice,
        parameters: {
            particleCount: 19,
            radiusScaling: 0.1,
            lennardJonesStrength: 0.1,
            thermostatSpeed: 0.1,
        },
    });

    setInteraction(interactionSim, 0, 0, Interaction.lennardJones);
</script>

The random jiggling kicks the particles out of their positions, and what was a neat shape becomes something less ordered and more random. We have melted the _solid_ into a _liquid_.

If we increase the temperature (and thus the jiggling) even further, the speed is to great to keep the particles together, and they start bouncing around randomly. The heat of the system is too high for the attraction to matter much, and we've vaporized our _liquid_ into _gas_.

## Potentials

We first saw particles that bounce off each other, like in billiards. Here, we explored particles which _attract_ each other when they are close together. Are there other possiblities? Let's look more closely at the interaction.

We can show 


<div id="potential2"></div>

<script>
    

    var createPotentialPlot = function(divId, potential)
    {
        var potentialPlot = {};
        var div = document.getElementById(divId);
        potentialPlot.graph = createGraph(div, "Potential");
        potentialPlot.potential = potential;
        return potentialPlot;
    }

    var updatePotentialPlot = function(potentialPlot, simulation)
    {
        var relativePosition = v2.alloc();
        v2.subtract(relativePosition, simulation.particles[0].position, simulation.particles[1].position);
        var distance = v2.magnitude(relativePosition);
        v2.free(relativePosition);
        var r = distance / (simulation.parameters.separationFactor * simulation.parameters.radiusScaling * 2);

        var xMax = 2.5;
        var xs = [];
        var ys = [];
        var sampleCount = 100;
        for (var i = 0; i < sampleCount; i++) {
            var x = lerp(0.6, i/(sampleCount - 1), xMax);
            xs.push(x);
            ys.push(potentialPlot.potential(x))
        }
        addCurve(potentialPlot.graph, {
            x: xs, y: ys, color: colors.black,
        });
        setGraphLimits(potentialPlot.graph, {
            yMax: 2, xMax: xMax,
        });
        var limits = getLimits(potentialPlot.graph);
        addCurve(potentialPlot.graph, {
            x: [r, r], y: [limits.yMin, limits.yMax], color: colors.black,
        });
        drawGraph(potentialPlot.graph);
    }

    var potentialPlot2 = createPotentialPlot("potential2", function(x) { 
        return (x < 1) ? (lennardJonesEnergy(x) - lennardJonesEnergy(1)) : 0;
    });

    var interactionSim = createSimulation({
        controls: [],
        graphs: ["energy"],
        parameters: {
            particleCount: 2,
            radiusScaling: 0.2,
            friction: 0,
            lennardJonesStrength: 0.1,
            simulationTimePerSecond: 1,
        },
        customUpdate: function(simulation) { updatePotentialPlot(potentialPlot2, simulation); },
    });

    v2.set(interactionSim.particles[0].position, 0, 0);
    interactionSim.particles[0].mass = Infinity;
    v2.set(interactionSim.particles[1].position, 0.5, 0.5);

    setInteraction(interactionSim, 0, 0, Interaction.repulsive);
</script>


<div id="potential"></div>

<script>
    var potentialPlot = createPotentialPlot("potential", lennardJonesEnergy);

    var interactionSim = createSimulation({
        controls: [],
        graphs: ["energy"],
        parameters: {
            particleCount: 2,
            radiusScaling: 0.2,
            friction: 0,
            lennardJonesStrength: 0.1,
            simulationTimePerSecond: 1,
        },
        customUpdate: function(simulation) { updatePotentialPlot(potentialPlot, simulation); },
    });

    v2.set(interactionSim.particles[0].position, 0, 0);
    interactionSim.particles[0].mass = Infinity;
    v2.set(interactionSim.particles[1].position, 0.5, 0.5);

    setInteraction(interactionSim, 0, 0, Interaction.lennardJones);
</script>




# TODO

* Potential energy
	* Two different kinds of particles
		* Positive and negative
		* Should form a grid?
* Arranges neatly when still
* The attraction is negligible when moving