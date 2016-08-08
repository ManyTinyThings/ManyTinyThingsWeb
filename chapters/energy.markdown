---
title: Kinetic energy
---

<script>
    // Global constants
    var pageGlobal = {
        timeRange: 35,
        friction: 0.2,
        radius: 1,
        energyPlotMax: 100,
    }
</script>

In this chapter, we learn about the important concept of _energy_, starting with _kinetic energy_ (a fancy term for _movement energy_).

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

    enableOnlyTools(singleEnergySim.toolbar, ["select"]);
    selectTool(singleEnergySim.toolbar, "select");
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

			return (state.throwCount >= 3);
	});
    endStep();
</script>

When you release the ball it starts to lose energy because of the friction in the table and air, which looks like a little hill in the plot. 
</div>
<div class="twoColumn">
<script>
	insertHere(singleEnergySim.div);
</script>
</div>
</div>




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

Below is a graph of the total energy, which is the energy for all particles combined. Note how, even when the particles are bumping into each other, the curve looks the same as it did with just one particle.

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

Throw the particles into each other some more and compare the energy curve with the one of the single particle above.

<script>
	cue(function () {
			var energy = getTotalEnergy(totalEnergySim);
			return (energy > 0.2);
	});
    endStep();
</script>

Don't they look awfully similar?

</div>
<div class="twoColumn">
<script>
	insertHere(totalEnergySim.div);
</script>
</div>
</div>

<div class="page">
<script>
    var energyAdditionSim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = pageGlobal.friction;
            p.dt = 0.005;

            var particleCount = 7;
            for (var i = 0; i < particleCount; i++) {
            	var particle = new Particle();
                particle.radius = pageGlobal.radius;
            	billiardsPosition(particle.position, i, 2*particle.radius);
            	var swatch = Color.niceSwatch;
            	particle.color = swatch[i % swatch.length];
            	addParticle(simulation, particle);
            }
        }
    });

    enableOnlyTools(energyAdditionSim.toolbar, ["select"]);
    selectTool(energyAdditionSim.toolbar, "select");
</script>
<div class="stepLog twoColumn">

To understand what happens to the energy as the particles collide, I have colored each particle in a unique color.

Play with the particles and look at how their energy changes over time in the graph below.

<script>
    var energyAdditionState = {throwCount: 0, hadHighSpeed: false};
    cue(function (dt) {
            var energy = getTotalEnergy(energyAdditionSim);
            var hasHighSpeedNow = energy > 0.2;
            if (energyAdditionState.hadHighSpeed && (!hasHighSpeedNow))
            {
                energyAdditionState.throwCount += 1;
            }
            energyAdditionState.hadHighSpeed = hasHighSpeedNow;

            return (energyAdditionState.throwCount >= 3);
    });

	// TODO: one color for each particle
	var timeLog = createTimeLog({range: pageGlobal.timeRange});
	createGraphHere({
		update: function(graph) {
			var stackedEnergy = [0];
			var currentEnergy = 0;
			var sim = energyAdditionSim;
			for (var particleIndex = 0; particleIndex < sim.particles.length; particleIndex++) {
				var particle = sim.particles[particleIndex];
				currentEnergy += (particle.kineticEnergy + particle.potentialEnergy);
				stackedEnergy.push(currentEnergy);
			}
			addToLog(timeLog, sim.time, stackedEnergy);
			for (var particleIndex = 0; particleIndex < sim.particles.length; particleIndex++) {
				addArea(graph, {
                    x: timeLog.time,
                    yMin: timeLog.data[particleIndex],
                    yMax: timeLog.data[particleIndex + 1],
                    color: sim.particles[particleIndex].color,
                });
			}
            var totalEnergies = timeLog.data[sim.particles.length];
            var limits = getLimits(graph);
            var epsilon = 0.01;
            var maxIndex = arrayMinIndex(totalEnergies, function(x) { return -x; });

            setGraphLimits(graph, 
            {
                yMax: pageGlobal.energyPlotMax,
            });
            addAxes(graph, {x: arrayLast(timeLog.time) - timeLog.range, y: 0});

		},
	});

    endStep();
</script>

We can now see how the total energy is made up of the individual energy of each particle. And while the total energy always has the same shape, the energy of the individual particles vary wildly.

Balls knocking each other around is actually a pretty good model of how the world works at the atomic level.
One big difference: _there is no friction_.

Lower the friction using the slider below.

<script>
    cue(function() {
            return (energyAdditionSim.parameters.friction == 0);
    });
	insertHere(createSlider({
		object: energyAdditionSim.parameters,
		name: "friction",
		min: 0, max: 0.3,
		minLabel: "No friction", maxLabel: "Some",
	}));
</script>

Then give the particles a little bit of energy.

<script>
    cue(function() {
        var isFrictionless = energyAdditionSim.parameters.friction == 0;
        var hasEnoughEnergy = getTotalEnergy(energyAdditionSim) > 0.1;
        return (isFrictionless && hasEnoughEnergy);
    });
    endStep();
</script>

Without friction, the particles never stop bouncing! The total energy stays the same, even though each individual particle changes its speed often. Because the energy keeps steady, the particles will on the whole neither speed up nor slow down.

</div>
<div class="twoColumn">
<script>
	insertHere(energyAdditionSim.div);
</script>
</div>

This is how the world really works microscopically. **The energy always stays the same. It's just divided up differently.**

It seems kind of weird that the balls would keep bouncing around forever. We don't expect normal-sized billiard balls to keep bouncing around forever. There are differences between tiny atoms and big billiard balls. Big things are made up of many tiny things, and by understanding how the many tiny things work, we can understand how the big things work.

* [Heat](/heat)
* [Friction](/friction)
* [Pressure](/pressure)


</div>


<script>
	initChapter();
</script>