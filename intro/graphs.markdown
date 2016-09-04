---
title: Graphs
previous: /intro/tools
next: /billiards/impulse
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

			setToolbarAvailableTools(simulation.toolbar, ["move"]);
        },
    });
</script>

<div class="stepLog twoColumn">
We will explore a number of rather abstract concepts, and to help understand them there will be visualisations accompanying the models.

Here's an example:

<script>
	createTimeSeriesHere({
		timeRange: 50,
		yMax: introSim.boxBounds.height,
		update: function(graph) {
            var particle = introSim.particles[0];
			var height = particle.position[1] + introSim.boxBounds.height / 2 - particle.radius;
			return {time: introSim.time, data: [height]};
		},
	})
</script>

Try figuring out what this graph shows by throwing around the ball a bit.

Does it show

* the speed of the ball over time?
* the shape of the ball at different heights?
* the height of the ball over time?

Figure it out yourself, I won't give you the right answer!
</div>

<div class="twoColumn">
<script>
	insertHere(introSim.div);
</script>
</div>
</div>
</div>