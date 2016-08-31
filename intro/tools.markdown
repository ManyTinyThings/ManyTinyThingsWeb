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
In the bottom right corner of the simulation you can change tools.

Use the _create_ tool to create more particles.

<script>
	cue(function()
	{
		return (introSim.particles.length > 10);
	});
</script>

Use the _attract_ tool to lift up all the particles.

<script>
	cue(function()
	{
		var sim = introSim;
		var isAttractTool = (sim.mouse.mode == MouseMode.attract);
		var minHeight = arrayMin(sim.particles, function(particle)
		{ 
			return particle.position[1];
		});
		var isHighEnough = (minHeight > (-sim.parameters.boxHeight/4));
		return (isAttractTool && isHighEnough);
	});
	endStep();
</script>

The available tools will change from page to page, to suit the purpose of that page.
</div>

<div class="twoColumn">
<script>
	insertHere(introSim.div);
</script>
</div>
</div>
</div>