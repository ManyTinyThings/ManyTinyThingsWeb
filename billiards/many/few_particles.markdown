---
title: More Particles
previous: /billiards/many/single_particle
next: /billiards/many/many_particles
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;
            p.boxWidth = 40;

            initBilliards(simulation, 16);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>


Here's some more particles!

While they are enough to play billiards with, it isn't really that many.

_More!_

