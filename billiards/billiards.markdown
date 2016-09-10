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

			setToolbarAvailableTools(simulation.toolbar, ["move"]);
			setElementIsVisible(simulation.resetButton, false);
			setElementIsVisible(simulation.toolbar.div, false);
		}
	});

	makeParentElementSequenceLink("/billiards/intro");
</script>
</div>

Click the sequence above and explore it.

<script>
	cue(waitCue(0));
	endStep();
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

Click on each difference to explore it.

<script>
	cue(waitCue(0));
	endStep();
</script>

What have we learned?

Everything is made up of **tiny particles** that behave kind of like billiards balls, except:

* The particles **never stop moving**, because they have **no friction**.
* There are **incredible many** tiny particles, which means they tend to **spread out everywhere**.
* The particles can **attract each other**, so they can make up **bigger things**.

We have looked at these three properties separately.

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

			setToolbarAvailableTools(simulation.toolbar, ["move"]);
			setElementIsVisible(simulation.resetButton, false);
			setElementIsVisible(simulation.toolbar.div, false);
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
			setBoxWidth(simulation, 100)

			var particleCount = 100;
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

			var particleCount = 100;
			var initialSpeed = 1;
			for (var i = 0; i < particleCount; i++) {
				var particle = new Particle();
				particle.position = randomDiscInRect(simulation.boxBounds, particle.radius);
				v2.set(particle.velocity, randomGaussian(), randomGaussian());
				v2.scale(particle.velocity, particle.velocity, initialSpeed);
				addParticle(simulation, particle);
			}

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

Explore these too!

</div>
</div>
</div>