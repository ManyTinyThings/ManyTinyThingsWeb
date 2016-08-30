---
title: Frictionless Messiness
previous: /entropy/billiards
next: /entropy/half_box
---

<script src="billiards.js"></script>
<script>
    var billiardsSim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;

            var particleCount = 7;
            for (var i = 0; i < particleCount; i++) {
            	var particle = new Particle();
            	billiardsPosition(particle.position, i, 2 * particle.radius);
            	addParticle(simulation, particle);
            }
        }
    });
    enableOnlyTools(billiardsSim.toolbar, ["impulse"]);
</script>


<div id="chapter">

<div class="page">
<div class="stepLog twoColumn">

Without friction, billiards gets _a lot messier_.

Turn off the friction.

<script>
    cue(function()
    {
        return (billiardsSim.parameters.friction == 0);
    })
    createSliderHere({
        object: billiardsSim.parameters,
        name: "friction",
        min: 0, max: 2 * billiardsSim.parameters.friction,
        minLabel: "No friction", maxLabel: "Some",
    });
    endStep();
</script>

Take the shot.

<script>
	cue(isTriangleSplit(billiardsSim));
	endStep();
</script>

Try to put the balls back in a triangle now. It's practically impossible! They keep bouncing around, and just making them slow down is a lot of work.


</div>
<div class="twoColumn">
<script>
	insertHere(billiardsSim.div);
</script>
</div>
</div>
</div>