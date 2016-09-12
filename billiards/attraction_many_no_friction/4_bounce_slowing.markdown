---
title: Slowing Down
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0;

            var particleCount = 19;

            for (var particleIndex = 0; particleIndex < particleCount; particleIndex++) {
                var particle = new Particle();
                hexagonalLatticePosition(particle.position, particleIndex, 2);
                addParticle(simulation, particle);
            }

            var ljInteraction = new LennardJonesInteraction();
            ljInteraction.strength = 30;
            setInteraction(simulation, 0, 0, ljInteraction);

            setToolbarAvailableTools(simulation.toolbar, ["move"]);
        }
    });
</script>

Here's a ball made from smaller particles. 

Give the ball some speed.

<script>
    // TODO: check for speed?
    cue(releaseCue(sim));
    endStep();
</script>

It does not keep the same speed, it loses some speed at each collision.

But if we look at the small particles, they stay energetic, only they are moving in circles or vibrating.