---
title: Introduction
previous: /
next: /intro/phenomena
---

<div id="chapter">

This page is an introduction to get you used to how these explanations are going to work.

<div class="page flex">

<script>
    var introSim = createSimulation({
        initialize: function(simulation) {
			var p = simulation.parameters;
			p.friction = 0.1;
			p.gravityAcceleration = 1;
			p.dragStrength = 2;
            p.isOnlyHardSpheres = true;
            p.coefficientOfRestitution = 0.95;

			var particle = new Particle();
			v2.set(particle.position, 0, particle.radius - simulation.boxBounds.height / 2);
			addParticle(simulation, particle);
        },
    });
</script>

<div class="stepLog twoColumn">
To the right is a ball.

Pick up the ball and throw it!

<script>
	cue(function() {
		var energy = getTotalEnergy(introSim);
		return (energy > 1);
	});
	endStep();
</script>

Well done!

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


Try figuring out what this graph shows by throwing around the ball a bit. Does it show

* the speed of the ball over time?
* the shape of the ball at different heights?
* the height of the ball over time?

When you have figured it out, continue to the next page by clicking in the right margin (that way &rarr;).
</div>

<div class="twoColumn">
<script>
	insertHere(introSim.div);
</script>
</div>
</div>
</div>