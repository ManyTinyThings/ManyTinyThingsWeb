---
title: Vibration & Friction
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

How does the vibration change with friction?

Snap them together with different amounts of friction.

<script>
    createIceMudSliderHere();
</script>
