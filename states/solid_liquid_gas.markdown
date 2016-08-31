---
title: Many interacting particles
previous: /states/attractive_potential
next: /states/evaporation
---

<script src="potential.js"></script>
<script>

    var interactionSim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.1;

            addOppositeParticles(simulation);

            var ljInteraction = new LennardJonesInteraction();
            ljInteraction.strength = 10;
            setInteraction(simulation, 0, 0, ljInteraction);

            setToolbarAvailableTools(simulation.toolbar, ["create", "move"]);
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

<div id="chapter">

We now have some more understanding of how two particles interact. Now let's see what happens when there are more than two!

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
        return (ensembleSpeed(interactionSim.particles) > 1); 
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
        return (getTotalEnergy(interactionSim) > 0.1);
    });
    endStep();
</script>



Let's try amplifying the speed of each particle, in turn increasing the jiggling.

The random jiggling kicks the particles out of their positions, and what was a neat shape becomes something less ordered and more random. We have melted the _solid_ into a _liquid_.

If we increase the temperature (and thus the jiggling) even further, the speed is to great to keep the particles together, and they start bouncing around randomly. The heat of the system is too high for the attraction to matter much, and we've vaporized our _liquid_ into _gas_.
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

</div>