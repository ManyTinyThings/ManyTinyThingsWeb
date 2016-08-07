---
title: Many Tiny Things
---

Every big thing in the world is made up of **many tiny things**.


<div class="threeColumn">
**Air** is _many tiny things_ bouncing around everywhere

<script>
	createSimulationHere({
		pixelWidth: 250,
		pixelHeight: 250,
		initialize: function(simulation)
		{
			var p = simulation.parameters;
			p.boxWidth = 200;
			p.isOnlyHardSpheres = true;
			p.gravityAcceleration = 1;

			updateBounds(simulation);

			var particleCount = 200;
			var initialSpeed = 10;
			for (var i = 0; i < particleCount; i++) {
				var particle = new Particle();
				particle.position = randomPointInRect(simulation.boxBounds);
				v2.set(particle.velocity, randomGaussian(), randomGaussian());
				v2.scale(particle.velocity, particle.velocity, 10);
				addParticle(simulation, particle);
			}
		}
	})
</script>
</div>

<div class="threeColumn">
**Water** is _many tiny things_ sloshing around

<script>
	createSimulationHere({
		pixelWidth: 250,
		pixelHeight: 250,
		initialize: function(simulation)
		{
			var p = simulation.parameters;
			p.boxWidth = 40;
			p.gravityAcceleration = 1;
			p.thermostatSpeed = 0.1;
			p.thermostatTemperature = 1.5;

			updateBounds(simulation);

			var particleCount = 100;
			var particles = [];
			for (var i = 0; i < particleCount; i++) {
				var particle = new Particle();
				particle.position = randomPointInRect(simulation.boxBounds);
				particles.push(particle);
			}
			addParticlesRandomly(simulation, particles);

			var ljInteraction = new LennardJonesInteraction();

			setInteraction(simulation, 0, 0, ljInteraction);
		}
	})
</script>
</div>

<div class="threeColumn">

**Normal-sized things** are _many tiny things_ stuck together

<script>
	createSimulationHere({
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
		}
	})
</script>
	
</div>

But we can't see the tiny things without a microscope. They are too small, _microscopic_. We can only see the _macroscopic_ objects the tiny things make up. (And in the case of air, we can't see it at all!)

This website is a series of explanations on how the tiny, microscopic things are connected to the big, macroscopic things that we can see, hear and feel. We will explore the consequences of everything in this world being made up of tiny things. 


<script>
    createSimulationHere({
        initialize: function(simulation) {
			var p = simulation.parameters;
			p.friction = 0.2;

			addParticle(simulation, new Particle());
        },
    });
</script>

## What do you want to learn more about?

* [Energy](../energy)
* [Friction](../friction)
* [Pressure](../pressure)
* [Entropy](../entropy)
* [Interactions](../states)
