---
title: Even More Particles
---

<script src="shared.js"></script>
<script>
	var boxWidth = 25
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;
            setBoxWidth(simulation, boxWidth);

            initBilliards(simulation, simulation.boxBounds);
            simulation.particles[0].color = Color.black;

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>

16 balls might be enough for billiards, but in the real world there are **incredibly many** more than 16 tiny particles.

<script>
	createSliderHere({
		initialValue: boxWidth,
		min: 25, max: 150,
		minLabel: "16 particles", maxLabel: "Many",
		update: function(value)
		{
			if (boxWidth != value)
			{
				boxWidth = value;
				resetSimulation(sim);
			}
		},
	});
</script>

The more particles, the harder it becomes to track a single particle.

<script>
	createShowLatestShotParticleButton();
</script>