---
title: High Speed Lovin'
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

            setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>


Let's try something else.

What happens if the particles collide at high speed?

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

They just bounce off each other!

The _force_ between the particles wants to keep them together, but the speed is too high for the attraction to take hold.
