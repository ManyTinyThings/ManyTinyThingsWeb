---
chapterTitle: Interactions – Things Liking Other Things
title: Two Things that Like Each Other
previous: /
next: /states/repulsive_potential
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

            enableOnlyTools(simulation.toolbar, ["move", "impulse"]);
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

</div>
