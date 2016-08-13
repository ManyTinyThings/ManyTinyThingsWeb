---
title: Kinetic energy
---

<script src="shared.js"></script>

<div id="chapter">

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

</div>

</div>


