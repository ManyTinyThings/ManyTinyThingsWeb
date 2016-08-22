---
chapterTitle: Movement Energy
title: Single particle
next: /kinetic_energy/multiple_particles
previous: /
---


<script src="shared.js"></script>

<div id="chapter">

<div class="page">
<script>
    var singleEnergySim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = pageGlobal.friction;

            var particle = new Particle();
            particle.radius = pageGlobal.radius;
            addParticle(simulation, particle);
        }
    });

    enableOnlyTools(singleEnergySim.toolbar, ["impulse"]);
    //selectTool(singleEnergySim.toolbar, "impulse");
</script>

<div class="stepLog twoColumn">
Here is a billiard ball. Try throwing it!

<script>
	cue(function () {
        var energy = getTotalEnergy(singleEnergySim);
        return (energy > 2);
    });
    endStep();
</script>

As you pick up and throw the ball, you give it speed, and in turn, energy. This kind of energy is called
_kinetic energy_, or _movement energy_. This plot shows how the energy changes over time:

<script>
	createTimeSeriesHere({
		timeRange: pageGlobal.timeRange,
        yMax: pageGlobal.energyPlotMax,
		update: function() {
			var energy = getTotalEnergy(singleEnergySim);
			return {time: singleEnergySim.time, data: [energy]};
		},
	});
</script>

Throw the ball around some more and see what happens in the plot.

<script>
	var state = {throwCount: 0, hadHighSpeed: false};
	cue(function (dt) {
			var speed = v2.magnitude(singleEnergySim.particles[0].velocity);
			var hasHighSpeedNow = speed > 0.5;
			if (state.hadHighSpeed && (!hasHighSpeedNow))
			{
				state.throwCount += 1;
			}
			state.hadHighSpeed = hasHighSpeedNow;

			return (state.throwCount >= 1);
	});
    endStep();
</script>

When you release the ball it starts to lose energy because of the friction in the table and air, which looks like a slope in the plot. 
</div>
<div class="twoColumn">
<script>
	insertHere(singleEnergySim.div);
</script>
</div>
</div>

</div>


