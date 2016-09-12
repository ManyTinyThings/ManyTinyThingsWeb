---
sequenceTitle: Attraction & No Friction
title: Snap vibration
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


            setToolbarAvailableTools(simulation.toolbar, ["move", "create"]);
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

As they come together, they vibrate a bit.
