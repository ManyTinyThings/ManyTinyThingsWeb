---
chapterTitle: Tiny Billiards
title: Tiny Billiards
previous: /intro/graphs
next: /intro/billiards_few
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;

            initBilliards(simulation, 1);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>


<div id="chapter">

<div class="page">
<div class="stepLog twoColumn">
Let's begin by playing some billiards.

The **impulse** tool works sort of like a billiards cue.
Hold down the mouse button and drag to aim, and when you release the button, you _shoot_!

Try it out!

<script>
	cue(function() {
		return (getTotalEnergy(sim) > 0.1);
	});
	endStep();
</script>

Nice!

It's not really billiards with just one ball, though...

</div>

<div class="twoColumn">
<script>
	insertHere(sim.div);
</script>
</div>
</div>
</div>