---
title: Low Speed Bouncin'
---

<script>

    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0;

            addOppositeParticles(simulation);

            var ljInteraction = new LennardJonesInteraction();
            ljInteraction.strength = 10;
            setInteraction(simulation, 0, 0, ljInteraction);

            setToolbarAvailableTools(simulation.toolbar, ["move"]);
        }
    });
</script>


What do you think will happen when there is **no friction**?

Move the particles together.

<script>
    cue(function () {
        var distance = v2.distance(sim.particles[0].position, sim.particles[1].position);
        // TODO: speed along normal instead
        var relativeSpeed = v2.distance(sim.particles[0].velocity, sim.particles[1].velocity);
        // TODO: tune these values
        return (distance < 3) && (relativeSpeed > 1.0);
    });
    endStep();
</script>

They don't want to stay together!

Without friction, the speed they get from the attraction is too high to stay.

