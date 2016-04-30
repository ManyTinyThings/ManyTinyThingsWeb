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
            bondEnergy: 0.01,
            friction: 0.1,
        },
    });

    v2.set(interactionSim.particles[0].position, -0.5, -0.5);
    v2.set(interactionSim.particles[1].position, 0.5, 0.5);
</script>

They seem to like each other! As they come closer, they attract and snap together. Can you get them to let go?


<script>

    var interactionSim = createSimulation({
        controls: [],
        graphs: ["energy"],
        parameters: {
            particleCount: 2,
            radiusScaling: 0.1,
            bondEnergy: 0.01,
            friction: 0.1,
        },
    });
</script>

What happens if you collide them at high speed?

<script>

    var interactionSim = createSimulation({
        controls: [],
        graphs: ["energy"],
        parameters: {
            particleCount: 2,
            radiusScaling: 0.1,
            bondEnergy: 0.01,
            friction: 0.1,
        },
    });

    v2.set(interactionSim.particles[0].position, -0.5, -0.5);
    v2.set(interactionSim.particles[1].position, 0.5, 0.5);
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
            bondEnergy: 0.01,
            friction: 0.1,
        },
    });
</script>

They group together and form a larger shape, a _solid_, if you will. Try pulling carefully at it.

<script>

    var interactionSim = createSimulation({
        controls: [],
        graphs: ["energy"],
        parameters: {
            particleCount: 19,
            radiusScaling: 0.1,
            bondEnergy: 0.01,
            friction: 0.1,
        },
    });
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
            bondEnergy: 0.01,
        },
    });
</script>

Now, the particles are constantly jiggling, meaning the system has a certain amount of heat.

Let's try amplifying the speed of each particle, in turn increasing the jiggling.


<script>
    var interactionSim = createSimulation({
        controls: ["deltaTemperature"],
        graphs: ["energy"],
        particleGenerator: perturbedLattice,
        parameters: {
            particleCount: 19,
            radiusScaling: 0.1,
            bondEnergy: 0.01,
        },
    });
</script>

The random jiggling kicks the particles out of their positions, and what was a neat shape becomes something less ordered and more random. We have melted the _solid_ into a _liquid_.

**DOES NOT WORK CURRENTLY** If we increase the temperature (and thus the jiggling) even further, the speed is to great to keep the particles together, and they start bouncing around randomly. The heat of the system is too high for the attraction to matter much, and we've vaporized our _liquid_ into _gas_. 

# TODO

* Potential energy
	* Show potential
	* There are more complicated potentialsc
	* Two different kinds of particles
		* Positive and negative
		* Should form a grid?
* Arranges neatly when still
* The attraction is negligible when moving