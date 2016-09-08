---
title: More Particles
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;
            setBoxWidth(simulation, 40);

            initBilliards(simulation, simulation.boxBounds);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>


Here's some more particles!

While they are enough to play billiards with, it isn't really that many.

_More!_

