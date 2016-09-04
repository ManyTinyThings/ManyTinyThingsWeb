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

            initBilliards(simulation, 7);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>


<div id="chapter">

<div class="page">
<div class="stepLog twoColumn">
I added some more balls!

You know what to do.

<script>
	cue(isBilliardsTriangleSplit(sim));
	endStep();
</script>

Nice break shot!

_Wait, why are we playing billiards?_

</div>

<div class="twoColumn">
<script>
	insertHere(sim.div);
</script>
</div>
</div>
</div>