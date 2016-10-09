---
title: High Speed Lovin'
---

<script>

    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;

            for (var i = 0; i < 3; i++) {
                var particle = new Particle();
                v2.setPolar(particle.position, 5, i * tau / 3);
                addParticle(simulation, particle);
            }

            var ljInteraction = new LennardJonesInteraction();
            ljInteraction.strength = 10;
            setInteraction(simulation, 0, 0, ljInteraction);

            setToolbarAvailableTools(simulation.toolbar, ["move"]);
        }
    });
</script>


_Uh-oh!_

There's a third particle here!

Will there be a fight?

<script>
    cue(function () {
        var distance = 0;
        for (var i = 0; i < 3; i++) {
            distance += v2.distance(sim.particles[i].position, sim.particles[(i + 1) % 3].position);    
        }
        return (distance < 8);
    });
    endStep();
</script>

No, they all like each other equally!

Move them around a bit and you'll notice that they don't just move towards the mouse. They also move or rotate around each other!