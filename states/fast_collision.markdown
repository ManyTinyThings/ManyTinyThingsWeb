---
title: Two Things that Like Each Other
previous: /states/interactions
next: /states/repulsive_potential
---

<script src="states.js"></script>
<script>

    var interactionSim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.1;

            addOppositeParticles(simulation);

            var ljInteraction = new LennardJonesInteraction();
            ljInteraction.strength = 10;
            setInteraction(simulation, 0, 0, ljInteraction);

            setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>

<div id="chapter">

<div class="page">
<div class="stepLog twoColumn">
Let's try something else.

What happens if you collide the two particles at high speed?

<script>
    cue(function () {
        var distance = v2.distance(interactionSim.particles[0].position, interactionSim.particles[1].position);
        // TODO: speed along normal instead
        var relativeSpeed = v2.distance(interactionSim.particles[0].velocity, interactionSim.particles[1].velocity);
        return (distance < 3) && (relativeSpeed > 1.0);
    });
    endStep();
</script>

They just bounce off each other!

The _force_ between the particles wants to keep them together, but the speed is too high for the attraction to take hold.

Let's explore this in more detail.

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
