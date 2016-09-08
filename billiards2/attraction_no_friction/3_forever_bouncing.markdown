---
title: Forever on the Move
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0;

            var particle = new Particle();
            addParticle(simulation, particle);

            var ljInteraction = new LennardJonesInteraction();
            ljInteraction.strength = 10;
            setInteraction(simulation, 0, 0, ljInteraction);

            setToolbarAvailableTools(simulation.toolbar, ["move"]);
        }
    });
</script>

A single particle with no friction never stops.

Give the particle some speed.

<script>
    // TODO: check for speed?
    cue(releaseCue(sim));
    endStep();
</script>

It keeps going at the same speed forever.