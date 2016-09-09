---
title: Frictionless Billiards
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0;

            initBilliards(simulation, simulation.boxBounds);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>


How would it be to play billiards without friction?

You tell me.

<script>
    cue(isBilliardsTriangleSplit(sim));
    endStep();
</script>

_Madness!_

This is how the tiny, microscopic particles work. They keep bouncing all over and never stop.
