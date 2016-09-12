---
sequenceTitle: Billiards
title: Billiards
layout: panel
---

<div id="chapter">
<div class="page">
<div class="stepLog">

Let's play some billiards!

<div class="threeColumn">
<script>
	var billiardsSim = createSimulationHere({
		pixelWidth: 250,
		pixelHeight: 250,
		initialize: function(simulation)
		{
			var p = simulation.parameters;
			p.isOnlyHardSpheres = true;

			initBilliards(simulation, simulation.boxBounds);

			thumbnailSim(simulation);
		}
	});

	makeParentElementSequenceLink("/billiards/intro");
</script>
</div>

Click the sequence above and explore it.

<script>
	// cue(waitCue(0));
	// endStep();
</script>

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
			var initialSpeed = 5;
			for (var i = 0; i < particleCount; i++) {
				var particle = new Particle();
				randomDiscInRect(particle.position, particle.radius, simulation.boxBounds);
				v2.set(particle.velocity, randomGaussian(), randomGaussian());
				v2.scale(particle.velocity, particle.velocity, initialSpeed);
				addParticle(simulation, particle);
			}

			thumbnailSim(simulation);
		}
	});

	makeParentElementSequenceLink("/billiards/friction");
</script>

</div>

<div class="threeColumn">

... can **attract** each other.

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

			thumbnailSim(simulation);
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

			thumbnailSim(simulation);
		}
	});

	makeParentElementSequenceLink("/billiards/many");
</script>

</div>

</div>

Click on each difference to explore it.

<script>
	// cue(waitCue(0));
	// endStep();
</script>

We have looked at each difference separately.

Let's now put them together and see what happens!

<div class="flex">

<div class="threeColumn">

They **attract** each other and **never stop**.

<script>
	var attractNeverStopSim = createSimulationHere({
		pixelWidth: 250,
		pixelHeight: 250,
		initialize: function(simulation)
		{
			var p = simulation.parameters;
			p.friction = 0;

			addOppositeParticles(simulation, 1);

			var ljInteraction = new LennardJonesInteraction();
			ljInteraction.strength = 10;
			setInteraction(simulation, 0, 0, ljInteraction);

			thumbnailSim(simulation);
		}
	});

	makeParentElementSequenceLink("/billiards/attraction_no_friction");
</script>

</div>

<div class="threeColumn">

They **never stop** and are **very many**.

<script>
	var neverStopManySim = createSimulationHere({
		pixelWidth: 250,
		pixelHeight: 250,
		initialize: function(simulation)
		{
			var p = simulation.parameters;
			p.isOnlyHardSpheres = true;
			setBoxWidth(simulation, 150)

			var particleCount = 200;
			var initialSpeed = 5;
			for (var i = 0; i < particleCount; i++) {
				var particle = new Particle();
				randomDiscInRect(particle.position, particle.radius, simulation.boxBounds);
				v2.set(particle.velocity, randomGaussian(), randomGaussian());
				v2.scale(particle.velocity, particle.velocity, initialSpeed);
				addParticle(simulation, particle);
			}

			thumbnailSim(simulation);
		}
	});
	
	makeParentElementSequenceLink("/billiards/many_no_friction");
</script>

</div>

<div class="threeColumn">

They are **very many** and **attract** each other.

<script>
	var likeSim = createSimulationHere({
		pixelWidth: 250,
		pixelHeight: 250,
		initialize: function(simulation)
		{
			var p = simulation.parameters;
			p.friction = 0.2;
			setBoxWidth(simulation, 40);

			var particleCount = 100;
			var initialSpeed = 1;
			for (var i = 0; i < particleCount; i++) {
				var particle = new Particle();
				randomDiscInRect(particle.position, particle.radius, simulation.boxBounds);
				v2.set(particle.velocity, randomGaussian(), randomGaussian());
				v2.scale(particle.velocity, particle.velocity, initialSpeed);
				addParticle(simulation, particle);
			}

			var ljInteraction = new LennardJonesInteraction();
			ljInteraction.strength = 10;
			setInteraction(simulation, 0, 0, ljInteraction);

			thumbnailSim(simulation);
		}
	});

	makeParentElementSequenceLink("/billiards/many_attraction");
</script>

</div>

</div>

Finally, we put it all together.

**Very many** particles that **attract** each other and **never stop** moving.

<div class="threeColumn">
<script>
	var billiardsSim = createSimulationHere({
		pixelWidth: 250,
		pixelHeight: 250,
		initialize: function(simulation)
		{
			var p = simulation.parameters;
			p.friction = 0;
			setBoxWidth(simulation, 100);

			var particleCount = 200;
			for (var i = 0; i < particleCount; i++) {
				var particle = new Particle();
				randomDiscInRect(particle.position, particle.radius, simulation.boxBounds);
				v2.set(particle.velocity, randomGaussian(), randomGaussian());
				addParticle(simulation, particle);
			}

			var ljInteraction = new LennardJonesInteraction();
			ljInteraction.strength = 10;
			setInteraction(simulation, 0, 0, ljInteraction);

			thumbnailSim(simulation);
		}
	});

	makeParentElementSequenceLink("/billiards/attraction_many_no_friction");
</script>
</div>

In this chapter we started with the game of billiards, and modified it to be **very many**, **attractive**, **frictionless** particles.

What we have done is create a **model** of how the tiny particles in the real world work.
The model is not _exactly_ like the real world, it's simpler.
But by being simpler, it makes it easier for us to explore and understand things about the real world.

* In the real world there are **incredibly many** particles, and we have only a few hundred.
	* The particles in the real world are too many and small to see. It's easier to think about a few hundred.
* There are many different kinds of particle, and the attraction between them is more complicated in the real world.
	* Most things we will explore here work just as well with one or two kinds of particle.
* Our particles move only in two dimensions, but the real world is three-dimensional.
	* In 2D, we can see all the particles. In 3D, particles can hide behind other particles, which makes it harder to see what they're doing.

Now that we've created this model, let's put it to use!
In the coming chapters we will use our **model** to help us understand things about the **real world**.

</div>
</div>
</div>