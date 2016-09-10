---
sequenceTitle: Many particles
title: Follow
---

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

Billiards is usually played using 16 balls.

It's enough balls to make the game interesting, while not too many to keep track of.

Make a pretty hard shot and try to follow the ball you shot with your eyes.

<script>
	cue(isBilliardsTriangleSplit(sim));
	endStep();
</script>

It's not too hard, even though I've removed any numbers or markings from the balls.

<script>
	insertHere(createButton({
		label: "Show latest shot ball",
		mouseDown: function()
		{
			sim.mouse.activeParticle.color = Color.red;
		},
		mouseUp: function()
		{
			sim.mouse.activeParticle.color = Color.black;
		},
	}));
</script>