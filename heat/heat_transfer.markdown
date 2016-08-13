---
title: Heat transfer
---

<script>
    function twoBlobs(simulation, particleIndex)
    {
        var particle = new Particle();
        particle.position = hexagonalLatticePosition(simulation, Math.floor(particleIndex / 2));
        var translation = v2(0.5, 0);
        if (particleIndex % 2)
        {
            v2.add(particle.position, particle.position, translation);
        }
        else
        {
            v2.subtract(particle.position, particle.position, translation);
            var standardDeviation = 0.2;
            v2.set(particle.velocity, standardDeviation * randomGaussian(), standardDeviation * randomGaussian());
            particle.particleType = 1;
            particle.color = colors.red;
        }
        return particle;
    }

    var twoBlobSim = createSimulation({
        visualizations: ["energy"],
        controls: ["thermostatTemperature", "thermostatSpeed"],
        particleGenerator: twoBlobs,
        parameters: {
            particleCount: 74,
            radiusScaling: 0.05,
            dt: 0.005,
            lennardJonesStrength: 0.1,
        },
    });

    setInteraction(twoBlobSim, 0, 0, Interaction.lennardJones);
    setInteraction(twoBlobSim, 1, 1, Interaction.lennardJones);
    setInteraction(twoBlobSim, 0, 1, Interaction.repulsive);

    twoBlobSim.pausedByUser = true;
</script>

<script>
    function fullLattice(simulation, particleIndex)
    {
        var particle = new Particle();
        particle.position = rectangularLatticePosition(simulation, particleIndex);
        
        return particle;
    }

    var wallTransferSim = createSimulation({
        visualizations: ["energy"],
        controls: ["thermostatTemperature", "thermostatSpeed"],
        particleGenerator: fullLattice,
        parameters: {
            particleCount: 60,
            radiusScaling: 0.07,
            dt: 0.005,
            lennardJonesStrength: 0.1,
            cutoffFactor: 4,
        },
    });

    setInteraction(wallTransferSim, 0, 0, Interaction.lennardJones);

    wallTransferSim.walls.push(
        new Wall(v2(0, -1), v2(0, 1))
    );

</script>