---
title: Many Particles
previous: /billiards/many/few_particles
next: /billiards/many/tons_of_particles
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;
            p.boxWidth = 90;

            initBilliards(simulation, 232);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>


_Wow, that's a lot of particles!_

Yeah, makes for a _preeeetty_ long billiards game...

But it's still not enough.
