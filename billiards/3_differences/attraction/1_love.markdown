---
sequenceTitle: Attraction
title: Particles in Love
---

<script>

    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.1;

            addOppositeParticles(simulation);

            var ljInteraction = new LennardJonesInteraction();
            ljInteraction.strength = 10;
            setInteraction(simulation, 0, 0, ljInteraction);


            setToolbarAvailableTools(simulation.toolbar, ["move"]);
        }
    });

</script>

Move these particles closer to each other.

<script>
    cue(function () {
        // TODO: timer here
        var distance = v2.distance(sim.particles[0].position, sim.particles[1].position);
        return (distance < 3);   
    });
    endStep();
</script>

They seem to like each other! As they come closer, they attract and snap together.

Can you get them to let go?

<script>
    cue(function () {
        var distance = v2.distance(sim.particles[0].position, sim.particles[1].position);
        return (distance > 6);
    });
    endStep();
</script>

It takes some effort!

There's a _force_ binding the particles together.

