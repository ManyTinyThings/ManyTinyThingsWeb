---
title: Kinetic energy
---

<script src="shared.js"></script>

<div id="chapter">

<div class="page">
<script>
    var totalEnergySim = createSimulation({
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
        }
    });

    enableOnlyTools(totalEnergySim.toolbar, ["select"]);
    selectTool(totalEnergySim.toolbar, "select");
</script>
<div class="stepLog twoColumn">
I added some more balls in a conspicuous pattern. You know what to do!

<script>
	cue(function () {
        var energy = getTotalEnergy(totalEnergySim);
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
			var energy = getTotalEnergy(totalEnergySim);
			return {time: singleEnergySim.time, data: [energy]};
		},
	});
</script>

Note how, even when the particles are bumping into each other, the curve looks the same as it did with just one particle.

</div>
<div class="twoColumn">
<script>
	insertHere(totalEnergySim.div);
</script>
</div>
</div>

</div>


