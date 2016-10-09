---
sequenceTitle: Many particles
title: Follow
---

<script src="shared.js"></script>
<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;

            initBilliards(simulation, simulation.boxBounds);
            simulation.particles[0].color = Color.black;

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>

Make a break shot!

<script>
	cue(isBilliardsTriangleSplit(sim));
	endStep();
</script>

If you shoot hard enough, the balls will split and end up spread out across the billiards table.

This makes for new situations every game.

Now, shoot a ball and try to predict where it will end up.

<script>
    cue(releaseCue(sim));
    endStep();
</script>

Was your prediction correct?

<script>
    createShowLatestShotParticleButton();
</script>

Being able to predict where particles end up is what makes billiards a fun and challenging game.
