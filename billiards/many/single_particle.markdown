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

            initBilliards(simulation, 1);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>


A single ball makes for pretty boring billiards.

And the world is hardly made up from _one_ tiny thing, it's made up of _lots and lots_ of them.

If we want to explore things being made up of many tiny things, then we definitely need more than one of them!
