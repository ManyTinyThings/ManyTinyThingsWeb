---
chapterTitle: Entropy – Things Spread Out
title: Messiness
previous: /
next: /entropy/frictionless_billiards
---

<script>
	var billiardsSpacing = 2;

    var billiardsSim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;

            var particleCount = 7;
            for (var i = 0; i < particleCount; i++) {
            	var particle = new Particle();
            	billiardsPosition(particle.position, i, billiardsSpacing);
            	addParticle(simulation, particle);
            }
        }
    });
</script>


<div id="chapter">

<div class="page">
<div class="stepLog twoColumn">

When playing billiards, it's easy to make a mess.

Take the shot.

<script>
	cue(function()
	{
		// TODO: make sure we actually split the triangle
		return (getTotalEnergy(billiardsSim) > 1);
	});
	endStep();
</script>

The particles bounce all over the place, and end up in a random pattern. This makes for new situations in each game of billiards. If the balls always started spread out in a predictable pattern, it would be quite a different game.

Now try putting the balls back the way they were.

<script>
	function totalSquaredError()
	{
		var testPosition = v2.alloc();
		var particles = billiardsSim.particles;
		var totalSquaredDistance = 0;
		for (var particleIndex = 0; particleIndex < particles.length; particleIndex++) {
			var particle = particles[particleIndex];

			var minSquaredDistance = Infinity;
			for (var billiardsPositionIndex = 0; billiardsPositionIndex < particles.length; billiardsPositionIndex++) {
				billiardsPosition(testPosition, billiardsPositionIndex, billiardsSpacing);
				var squaredDistance = v2.squaredDistance(testPosition, particle.position);
				if (squaredDistance < minSquaredDistance)
				{
					minSquaredDistance = squaredDistance;
				}
			}
			totalSquaredDistance += minSquaredDistance;
		}
		v2.free(testPosition);

		return totalSquaredDistance;
	}

	cue(function()
	{
		return (totalSquaredError() < 20);
	});
	endStep();
</script>

It's a bit tricky, but doable.


</div>
<div class="twoColumn">
<script>
	insertHere(billiardsSim.div);
	// insertHere(createOutput({
	//     label: "error^2: ",
	//     update: totalSquaredError,
	// }));
</script>
</div>
</div>
</div>