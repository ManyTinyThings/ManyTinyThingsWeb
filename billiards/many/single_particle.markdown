---
chapterTitle: Uncountable Billiards
title: One Particle
previous: /billiards/differences
next: /billiards/many/few_particles
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;

            initBilliards(simulation, simulation.boxBounds, 0);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>


A single ball makes for pretty boring billiards.

And the world is made of **many** tiny things, not **one** tiny thing.

(If there was only one tiny thing, would we even call it tiny?)

_We need more particles._
