---
title: Group Hug
---

<script>
    var sim = createSimulation({
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


What if there are more than two particles?

Add more particles using the **create** tool. 

(If you hold down the mouse button, you "paint" particles when moving the mouse.)

<script>
    var requiredCount = 20;
    insertHere(createOutput(function() {
        return `${sim.particles.length} / ${requiredCount} particles`;
    }));
    cue(function () {
        return (sim.particles.length >= requiredCount);  
    });
    endStep();
</script>

A group hug! How cute!

The attraction between each pair of particles holds them together, and together they now make up a bigger object.

Try moving the object around with the **move** tool.

<script>
    cue(function () {
        return (ensembleSpeed(sim.particles) > 1); 
    });
    endStep();
</script>

The tiny, **microscopic** particles move together _as one_. 

_One_ big, **macroscopic** thing.
