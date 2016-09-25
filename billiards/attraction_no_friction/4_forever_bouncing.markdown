---
title: Forever on the Move
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0;

            addOppositeParticles(simulation, 1);

            var ljInteraction = new LennardJonesInteraction();
            ljInteraction.strength = 10;
            setInteraction(simulation, 0, 0, ljInteraction);

            setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });

    // TODO: maybe talk about rotation here?
    // TODO: what about a third particle?
</script>

Did you expect them to vibrate forever?

You were right! But they have to start close enough.
