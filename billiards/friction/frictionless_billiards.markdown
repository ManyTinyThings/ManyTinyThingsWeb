---
title: Frictionless Billiards
previous: /billiards/friction/no_friction
next: /billiards/differences
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0;
            p.boxWidth = 30;

            initBilliards(simulation, 16);

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
