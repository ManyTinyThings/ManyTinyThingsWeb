---
layout: default
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
			p.isOnlyHardSpheres = true;
			p.gravityAcceleration = 1;
			p.attractStrength = 1;
			p.thermostatRandomStrength = 0.1;
			p.thermostatTemperature = 100;

			setBoxWidth(simulation, 200)

			var particleCount = 200;
			var initialSpeed = 1;
			for (var i = 0; i < particleCount; i++) {
				var particle = new Particle();
				randomDiscInRect(particle.position, particle.radius, simulation.boxBounds);
				v2.set(particle.velocity, randomGaussian(), randomGaussian());
				v2.scale(particle.velocity, particle.velocity, 10);
				addParticle(simulation, particle);
			}

			setToolbarAvailableTools(simulation.toolbar, ["attract"]);
			thumbnailSim(simulation);
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
			p.gravityAcceleration = 1;
			p.thermostatDeterministicStrength = 0.1
			p.thermostatTemperature = 1;
			p.repelStrength = 0.2;
			//p.isOnlyHardSpheres = true;
			setBoxWidth(simulation, 60);

			setWallsAlongBorder(simulation);
			var wallY = -10;
			simulation.walls.push(new Wall(v2(simulation.boxBounds.left, wallY), v2(simulation.boxBounds.right, wallY)));

			var particleCount = 200;
			var particles = [];
			for (var i = 0; i < particleCount; i++) {
				var particle = new Particle();
				particles.push(particle);
			}
			addParticlesRandomlyAround(simulation, particles, v2(0, simulation.boxBounds.bottom + 2));

			arrayRemoveElementAt(simulation.walls, -1);

			var ljInteraction = new LennardJonesInteraction();
			ljInteraction.separation *= 0.8;
			setInteraction(simulation, 0, 0, ljInteraction);

			setToolbarAvailableTools(simulation.toolbar, ["repel"]);
			thumbnailSim(simulation);
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
			p.gravityAcceleration = 1;
			p.dragStrength = 10;
			p.friction = 0.1;

			setBoxWidth(simulation, 40);

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
			thumbnailSim(simulation);
		}
	});
</script>
	
</div>

</div>

But we can't see the tiny things without a microscope. They are too small, _microscopic_. We can only see the _macroscopic_ objects the tiny things make up. (And in the case of air, we can't see it at all!)

This website is a _series of explanations_ on how the tiny, microscopic things are connected to the big, macroscopic things that we _can_ see, hear and feel. We will ask the question:

What are the _macroscopic_ consequences of being made up of many _microscopic_ things?

The explanations will include simulations of many tiny things, as you can see above. Not only are these simulations running in real time, they are also _interactive_. Try clicking, holding and dragging in the simulations above and see what happens.

If you are ready, [let's start](/billiards/billiards)!


<!-- {% include sequences.html %} -->
