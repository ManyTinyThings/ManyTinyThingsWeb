---
title: Multiple particle
---

<script src="shared.js"></script>
<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = pageGlobal.friction;

            var particleCount = 7;
            for (var i = 0; i < particleCount; i++) {
            	var particle = new Particle();
                particle.radius = pageGlobal.radius;
            	billiardsPosition(particle.position, i, 2 * particle.radius);
            	addParticle(simulation, particle);
            }
            setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });

</script>


I added some more balls in a conspicuous pattern. You know what to do!

<script>
	cue(function () {
        var energy = getTotalEnergy(sim);
        return (energy > 0.2);
    });
    endStep();
</script>

As the balls collide, they bounce off each other, transferring energy from one to the other.

Below is a graph of the total energy, which is the energy for all particles combined.

<script>
	createTimeSeriesHere({
		timeRange: pageGlobal.timeRange,
        yMax: pageGlobal.energyPlotMax,
		update: function() {
			var energy = getTotalEnergy(sim);
			return {time: sim.time, data: [energy]};
		},
	});
</script>

Note how, even when the particles are bumping into each other, the curve looks the same as it did with just one particle.
