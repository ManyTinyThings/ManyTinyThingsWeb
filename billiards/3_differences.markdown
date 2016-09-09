---
title: Differences
layout: panel
---

Remember the **many tiny things** I was talking about earlier?

We call them **particles** and they are sort of like _tiny billiard balls_.
They _move_ like billiard balls, and _bounce_ like billiard balls.

There are three big differences, though. The tiny particles ...

<div class="flex">

<div class="threeColumn">

... **never stop** moving.

<script>
	var neverStopSim = createSimulationHere({
		pixelWidth: 250,
		pixelHeight: 250,
		initialize: function(simulation)
		{
			var p = simulation.parameters;
			p.isOnlyHardSpheres = true;

			var particleCount = 10;
			var initialSpeed = 1;
			for (var i = 0; i < particleCount; i++) {
				var particle = new Particle();
				particle.position = randomDiscInRect(simulation.boxBounds, particle.radius);
				v2.set(particle.velocity, randomGaussian(), randomGaussian());
				v2.scale(particle.velocity, particle.velocity, initialSpeed);
				addParticle(simulation, particle);
			}

			setToolbarAvailableTools(simulation.toolbar, ["move"]);
			setElementIsVisible(simulation.resetButton, false);
			setElementIsVisible(simulation.toolbar.div, false);
		}
	});

	makeParentElementSequenceLink("/billiards/friction");
</script>

</div>

<div class="threeColumn">

... can **like** each other.

<script>
	var likeSim = createSimulationHere({
		pixelWidth: 250,
		pixelHeight: 250,
		initialize: function(simulation)
		{
			var p = simulation.parameters;
			p.friction = 0.2;

			addOppositeParticles(simulation, 1);

			var ljInteraction = new LennardJonesInteraction();
			ljInteraction.strength = 10;
			setInteraction(simulation, 0, 0, ljInteraction);

			setToolbarAvailableTools(simulation.toolbar, ["move"]);
			setElementIsVisible(simulation.resetButton, false);
			setElementIsVisible(simulation.toolbar.div, false);
		}

	});
	
	makeParentElementSequenceLink("/billiards/attraction");
</script>

</div>

<div class="threeColumn">

... are **very many**.

<script>
	var likeSim = createSimulationHere({
		pixelWidth: 250,
		pixelHeight: 250,
		initialize: function(simulation)
		{
			var p = simulation.parameters;
			p.friction = 0.2;
			setBoxWidth(simulation, 80);

			initBilliards(simulation, simulation.boxBounds);

			var ljInteraction = new LennardJonesInteraction();
			ljInteraction.strength = 10;
			setInteraction(simulation, 0, 0, ljInteraction);

			setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
			setElementIsVisible(simulation.resetButton, false);
			setElementIsVisible(simulation.toolbar.div, false);
		}
	});

	makeParentElementSequenceLink("/billiards/many");
</script>

</div>

</div>

Click on each of these to learn more.