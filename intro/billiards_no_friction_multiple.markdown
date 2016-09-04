---
title: No Friction
previous: /intro/billiards_no_friction
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0;

            initBilliards(simulation, 7);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>


<div id="chapter">

<div class="page">
<div class="stepLog twoColumn">
How would it be to play billiards without friction?

You tell me.

<script>
    cue(isBilliardsTriangleSplit(sim));
    endStep();
</script>

_Madness!_

Some particles move faster than others, but again, _they never stop_.

</div>

<div class="twoColumn">
<script>
	insertHere(sim.div);
</script>
</div>
</div>
</div>