---
title: Still Not Enough
previous: /billiards/many/many_particles
next: /billiards/many/spreading_out
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;
            setBoxWidth(simulation, 200);

            initBilliards(simulation, simulation.boxBounds);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>


_Now we're talking!_

Well, **no**.

This is over 1000 particles, and the computer can't really handle it. 
Also, the particles become so small on the screen that you can barely see them, let alone interact with them.

And we're still so, so far away.

You would need approximately 10,000,000,000,000,000,000 (or 10<sup>19</sup>) boxes with 1000 particles in each, just to get the amount of air particles in a single breath.
