---
title: Half box
previous: /entropy/frictionless_billiards
next: /entropy/big_half_box
---


<script>
    var halfBoxSim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.boxWidth = 30;

            updateBounds(simulation);
            setWallsAlongBorder(simulation);

            var b = simulation.boxBounds;
            var leftHalfRegion = new Region();
            setLeftTopRightBottom(leftHalfRegion.bounds, b.left, b.top, (b.left + b.right) / 2, b.bottom);
            leftHalfRegion.color = Color.blue;
            simulation.regions.push(leftHalfRegion);
           	
            var particleCount = 20;
            for (var i = 0; i < particleCount; i++) 
            {
            	var particle = new Particle();
            	particle.velocity = randomVelocity(2);
            	do {
            		particle.position = randomPointInRect(simulation.boxBounds);	
            	}
            	while(!addParticle(simulation, particle));
            }
        }
    });
</script>




<div id="chapter">

<div class="page">
<div class="stepLog twoColumn">

Let's try a simpler scenario.

Try putting all the particles in the left half of the box.

<script>
    cue(function()
    {
    	var simulation = halfBoxSim;
    	var leftRect = simulation.regions[0].bounds;
    	var inLeftRectCount = 0;
    	for (var particleIndex = 0; particleIndex < simulation.particles.length; particleIndex++) {
    		var particle = simulation.particles[particleIndex];
    		inLeftRectCount += doesRectContainPoint(leftRect, particle.position);
		}

		var requiredParticleCount = 0.7 * simulation.particles.length;

        return (inLeftRectCount > requiredParticleCount);
    });
    endStep();
</script>

It's pretty hard, isn't it? And they keep wanting to escape!

</div>
<div class="twoColumn">
<script>
	insertHere(halfBoxSim.div);
</script>
</div>
</div>
</div>