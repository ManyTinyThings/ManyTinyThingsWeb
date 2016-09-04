---
title: No Friction
previous: /intro/billiards_friction
next: /intro/billiards_no_friction_multiple
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0;

            initBilliards(simulation, 1);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>


<div id="chapter">

<div class="page">
<div class="stepLog twoColumn">
So, we have now tried playing billiards **on ice** and **in mud**. _Weird_.

But the tiny billiard balls that make up everything are _even weirder_ than that.

_They have **no friction**._

What does that mean?

Give the ball a kick. 

<script>
    cue(function() {
        return (getTotalEnergy(sim) > 0.1);
    });
    endStep();
</script>

Wait for it to stop.

<script>
    var timer = 10;
    cue(function(dt) {
        timer -= dt;
        return (timer < 0);
    });
    endStep();
</script>

It never stops!

Without friction slowing things down, _they never stop_.

_They keep going **forever**._

</div>

<div class="twoColumn">
<script>
	insertHere(sim.div);
</script>
</div>
</div>
</div>