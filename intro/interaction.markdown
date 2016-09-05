---
chapterTitle: Introduction
title: Interacting
previous: /
next: /intro/tools
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
			var p = simulation.parameters;
			p.friction = 0.1;
			p.gravityAcceleration = 1;
			p.dragStrength = 2;
            p.isOnlyHardSpheres = true;
            p.coefficientOfRestitution = 0.95;

			var particle = new Particle();
			v2.set(particle.position, 0, particle.radius - simulation.boxBounds.height / 2);
			addParticle(simulation, particle);

			setToolbarAvailableTools(simulation.toolbar, ["move"]);
        },
    });
</script>

To the right is a ball.

Pick up the ball and throw it!

<script>
	cue(function() {
		var energy = getTotalEnergy(sim);
		return (energy > 1);
	});
	endStep();
</script>

Well done!

I will usually ask you to perform some simple task (like throwing the ball), just to get you started interacting with the simulations. 

You are of course free to keep playing with them for as long as you'd like!

When you are ready to move on, click at the bottom of the page &darr; or in the right margin &rarr;.
