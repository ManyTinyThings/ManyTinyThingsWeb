---
title: Graph
---

<script>
    var sim = createSimulation({
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

To help us understand some of the more tricky concepts, we will use _visualisations_, mostly _graphs_.

Here's an example of a graph:

<script>
	createTimeSeriesHere({
		timeRange: 50,
		yMax: sim.boxBounds.height,
		update: function(graph) {
            var particle = sim.particles[0];
			var height = particle.position[1] + sim.boxBounds.height / 2 - particle.radius;
			return {time: sim.time, data: [height]};
		},
	})
</script>

Try figuring out what this graph is showing by throwing around the ball a bit.

Does it show

* the speed of the ball over time?
* the shape of the ball at different heights?
* the height of the ball over time?

Figure it out yourself, I won't give you the right answer!