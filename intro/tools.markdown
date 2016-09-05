---
title: Tools
previous: /intro/interaction
next: /intro/graphs
---

<div id="chapter">
<div class="page flex">

<script>
    var introSim = createSimulation({
        initialize: function(simulation) {
			var p = simulation.parameters;
			p.friction = 0.1;
			p.gravityAcceleration = 1;
			p.dragStrength = 2;
            //p.isOnlyHardSpheres = true;
            //p.coefficientOfRestitution = 0.95;

			var particle = new Particle();
			v2.set(particle.position, 0, particle.radius - simulation.boxBounds.height / 2);
			addParticle(simulation, particle);

			setToolbarAvailableTools(simulation.toolbar, ["move", "create", "attract"]);
        },
    });
</script>

<div class="stepLog twoColumn">

In the **bottom right corner** of the simulation you can **change tools**.

Having only one ball is a little dull, so let's add more!

Use the **create** tool to create more particles.

<script>
	cue(function()
	{
		return (introSim.particles.length > 5);
	});
	endStep();
</script>

Use the **attract** tool to lift all the balls off the ground.

<script>
	cue(function()
	{
		var sim = introSim;
		var isAttractTool = (sim.mouse.mode == MouseMode.attract);
		var minHeight = arrayMin(sim.particles, function(particle)
		{ 
			return particle.position[1];
		});
		var requiredHeight = (-sim.boxBounds.height / 3);
		return (isAttractTool && (minHeight > requiredHeight));
	});
	endStep();
</script>

The tools will change from page to page, to suit the purpose of that page.
</div>

<div class="twoColumn">
<script>
	insertHere(introSim.div);
</script>
</div>
</div>
</div>