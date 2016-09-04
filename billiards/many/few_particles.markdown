---
title: A Few Particles
previous: /billiards/many/single_particle
next: /billiards/many/many_particles
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;
            p.boxWidth = 40;

            initBilliards(simulation, 16);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>


<div id="chapter">

<div class="page">
<div class="stepLog twoColumn">
Here's a few particles, enough to play billiards.

Break shot!

<script>
    cue(isBilliardsTriangleSplit(sim));
    endStep();
</script>

Note how they spread out pretty evenly across the box.

</div>

<div class="twoColumn">
<script>
	insertHere(sim.div);
</script>
</div>
</div>
</div>