---
title: Group Hug
previous: /billiards/interaction/high_speed_love
next: /billiards/interaction/sticky_billiards
---

<script src="shared.js"></script>
<script>
    var interactionSim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.1;

            addOppositeParticles(simulation);

            var ljInteraction = new LennardJonesInteraction();
            ljInteraction.strength = 10;
            setInteraction(simulation, 0, 0, ljInteraction);

            setToolbarAvailableTools(simulation.toolbar, ["create", "move"]);
        }
    });
</script>

<div id="chapter">

<div class="page">

<div class="stepLog twoColumn">

What if there are more than two particles?

Add more particles using the **create** tool.

<script>
    cue(function () {
        return (interactionSim.particles.length > 20);  
    });
    endStep();
</script>

A group hug! How cute!

The attraction between each pair of particles holds them together, and together they now make up a bigger object.

Try moving the object around with the **move** tool.

<script>
    cue(function () {
        return (ensembleSpeed(interactionSim.particles) > 1); 
    });
    endStep();
</script>

The tiny, _microscopic_ particles move together **as one**. 

**One** big, _macroscopic_ thing.

</div>

<div class="twoColumn">
<script>
    insertHere(interactionSim.div);
</script>
</div>
</div>

</div>