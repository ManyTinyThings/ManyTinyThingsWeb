---
title: No Friction
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.isOnlyHardSpheres = true;
            p.friction = 0;

            var particle = new Particle();
            particle.color = Color.red;
            addParticle(simulation, particle);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>


So, we have now tried playing billiards **on ice** and **in mud**. Kinda weird.

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
    cue(waitCue(10));
    endStep();
</script>

It never stops!

Without friction slowing things down, _they never stop_.

_They keep going **forever**._
