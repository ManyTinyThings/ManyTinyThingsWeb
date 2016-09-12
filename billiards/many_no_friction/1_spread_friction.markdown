---
sequenceTitle: Many that never stop
title: Breaking with friction
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

With each shot you make, the particles spread out more and more.

Get the particles to spread out evenly across the entire box.

<script>
    var entropy = 0;
    // insertHere(createOutput(function()
    // {
    //     return `entropy: ${entropy.toFixed(2)}`;
    // }));
    cue(function()
    {
        var colCount = 3;
        var rowCount = 3;
        var regionCount = colCount * rowCount;
        var regionParticleCounts = [];
        for (var i = 0; i < regionCount; i++) {
            regionParticleCounts[i] = 0;
        }
        for (var particleIndex = 0; particleIndex < sim.particles.length; particleIndex++) {
            var particle = sim.particles[particleIndex];
            var col = Math.floor((particle.position[0] - sim.boxBounds.left) / sim.boxBounds.width * colCount);
            var row = Math.floor((particle.position[1] - sim.boxBounds.bottom) / sim.boxBounds.height * rowCount);
            var index = col * rowCount + row;
            regionParticleCounts[index] += 1;
        }
        entropy = 0;
        for (var i = 0; i < regionCount; i++) {
            entropy += microstateEntropy(regionParticleCounts[i] / sim.particles.length);
        }
        return (entropy > 3);
    });
    endStep();
</script>

After a few shots, the particles are all spread out.
