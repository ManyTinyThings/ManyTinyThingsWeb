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

            setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>


With no friction, can the particles ever find a partner?

Carefully shoot the particles toward each other.

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

They bounce off each other, even with very little speed.

Without friction, the speed they get from the attraction is too high to stay.

