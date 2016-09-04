---
title: Tons of Particles
previous: /billiards/many/tons_of_particles
next: /billiards/differences
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;
            p.boxWidth = 100;

            initBilliards(simulation, 301);

            setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>


<div id="chapter">

<div class="page">
<div class="stepLog twoColumn">
Okay, let's go with an amount that the simulation can handle.

Note how, when you smash the particles together, they keep bumping into each other.
Every kick you give them results in a chain reaction.

And every time you kick them, they spread out more.
At first they're neatly organised in a tidy triangle.
But every time you kick 'em they get less tidy and more messy.



</div>

<div class="twoColumn">
<script>
    insertHere(sim.div);
</script>
</div>
</div>
</div>