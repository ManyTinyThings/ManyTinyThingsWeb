---
title: Even More Particles
previous: /billiards/many/few_particles
next: /billiards/many/tons_of_particles
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;
            setBoxWidth(simulation, 90);

            initBilliards(simulation, simulation.boxBounds);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>


Wow, that's a lot of particles!

It's getting hard to count them.

But it's _still not enough_.
