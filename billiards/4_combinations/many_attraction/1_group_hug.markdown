---
sequenceTitle: Many & Attracting
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

            setToolbarAvailableTools(simulation.toolbar, ["move", "create"]);
        }
    });
</script>

Move these two closer.

<script>
    cue(function () {
        // TODO: timer here
        var distance = v2.distance(sim.particles[0].position, sim.particles[1].position);
        return (distance < 3);   
    });
    endStep();
</script>

They still like each other!

What if there were more than two particles?

Add more particles using the **create** tool. 


<script>
    cue(function () {
        return (sim.particles.length >= requiredCount);  
    });
    var requiredCount = 20;
    insertHere(createOutput(function() {
        return `${sim.particles.length} / ${requiredCount} particles`;
    }));
    endStep();
</script>

A _group hug_! How cute!

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
