---
title: ""
next: /intro/interaction
---

Every big thing in the world is made up of **many tiny things**.


<div class="flex">

<div class="threeColumn">
**Air** is _many tiny things_ bouncing around everywhere

<script>
	var airSim = createSimulationHere({
		pixelWidth: 250,
		pixelHeight: 250,
		initialize: function(simulation)
		{
			var p = simulation.parameters;
			p.boxWidth = 200;
			p.isOnlyHardSpheres = true;
			p.gravityAcceleration = 1;
			p.attractStrength = 1;
			p.thermostatSpeed = 0.1;
			p.thermostatTemperature = 100;

			updateBounds(simulation);

			var particleCount = 200;
			var initialSpeed = 10;
			for (var i = 0; i < particleCount; i++) {
				var particle = new Particle();
				particle.position = randomDiscInRect(simulation.boxBounds, particle.radius);
				v2.set(particle.velocity, randomGaussian(), randomGaussian());
				v2.scale(particle.velocity, particle.velocity, 10);
				addParticle(simulation, particle);
			}

			setToolbarAvailableTools(simulation.toolbar, ["attract"]);
		}
	});
</script>
</div>

<div class="threeColumn">
**Water** is _many tiny things_ sloshing around

<script>
	var waterSim = createSimulationHere({
		pixelWidth: 250,
		pixelHeight: 250,
		initialize: function(simulation)
		{
			var p = simulation.parameters;
			p.boxWidth = 60;
			p.gravityAcceleration = 1;
			p.thermostatSpeed = 0.1;
			p.thermostatTemperature = 1;
			p.repelStrength = 0.2;
			//p.isOnlyHardSpheres = true;

			updateBounds(simulation);
			setWallsAlongBorder(simulation);

			var particleCount = 200;
			var particles = [];
			for (var i = 0; i < particleCount; i++) {
				var particle = new Particle();
				particle.position = randomPointInRect(simulation.boxBounds);
				particles.push(particle);
			}
			addParticlesRandomly(simulation, particles);

			var ljInteraction = new LennardJonesInteraction();
			ljInteraction.separation *= 0.8;
			setInteraction(simulation, 0, 0, ljInteraction);

			setToolbarAvailableTools(simulation.toolbar, ["repel"]);
		}
	});

</script>
</div>

<div class="threeColumn">

**Normal-sized things** are _many tiny things_ stuck together

<script>
	var solidSim = createSimulationHere({
		pixelWidth: 250,
		pixelHeight: 250,
		initialize: function(simulation)
		{
			var p = simulation.parameters;
			p.boxWidth = 40;
			p.gravityAcceleration = 1;
			p.dragStrength = 10;
			p.friction = 0.1;

			updateBounds(simulation);

			var particleCount = 2 * 37;
			var latticeSpacing = 2;
			var redBallMiddle = v2(0, 10);
			var blackBallMiddle = v2(-5, -10);
			for (var i = 0; i < particleCount; i++) {
				var halfIndex = Math.floor(i / 2);
				var particle = new Particle();
				particle.type = i % 2;
				if (particle.type == 0)
				{
					hexagonalLatticePosition(particle.position, halfIndex, latticeSpacing);
					v2.add(particle.position, particle.position, blackBallMiddle);
				}
				else
				{
					particle.color = Color.red;
					hexagonalLatticePosition(particle.position, halfIndex, latticeSpacing);
					v2.add(particle.position, particle.position, redBallMiddle);
				}
				
				addParticle(simulation, particle);
			}

			var ljInteraction = new LennardJonesInteraction();
			ljInteraction.strength = 200;
			setInteraction(simulation, 0, 0, ljInteraction);
			setInteraction(simulation, 1, 1, ljInteraction);

			setToolbarAvailableTools(simulation.toolbar, ["move"]);
		}
	});
</script>
	
</div>

</div>

But we can't see the tiny things without a microscope. They are too small, _microscopic_. We can only see the _macroscopic_ objects the tiny things make up. (And in the case of air, we can't see it at all!)

This website is a _series of explanations_ on how the tiny, microscopic things are connected to the big, macroscopic things that we _can_ see, hear and feel. We will ask the question: What are the _macroscopic_ consequences of being made up of many _microscopic_ things?

The explanations will include simulations of many tiny things, as you can see above. Not only are these simulations running in real time, they are also _interactive_. Try clicking and dragging in the simulations above and see what happens.

If you are ready, [let's start]({{ site.baseurl }}/intro/tutorial)!


{% include what_next.html %}
