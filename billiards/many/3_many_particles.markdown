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

16 balls might be enough for billiards, but 16 tiny particles is hardly enough to make up any big things.

Here are a lot more particles.

Try following the particle you shoot here

It becomes very hard to 

<script>
	createSliderHere({
		initialValue: boxWidth,
		min: 25, max: 150,
		minLabel: "16", maxLabel: "A lot",
		update: function(value)
		{
			if (boxWidth != value)
			{
				boxWidth = value;
				resetSimulation(sim);
			}
		},
	});
	createShowLatestShotBallButton();
</script>