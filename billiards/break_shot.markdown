---
title: Break Shot
previous: /billiards/impulse
next: /billiards/differences
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;
            p.boxWidth = 30;

            initBilliards(simulation, 16);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>


I added some more balls!

You know what to do.

<script>
	cue(isBilliardsTriangleSplit(sim));
	endStep();
</script>

Nice break shot!

_Wait, why are we playing billiards?_
