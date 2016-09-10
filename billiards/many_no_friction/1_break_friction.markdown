---
title: Breaking with friction
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;
            setBoxWidth(simulation, 90);

            initBilliards(simulation, simulation.boxBounds);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>

With friction, we need a lot of force to break a triangle this big, maybe even multiple shots.

Break the triangle.

<script>
    cue(isBilliardsTriangleSplit(sim));
    endStep();
</script>

And we need even more shots to spread out the particles evenly.
