---
title: Friction
---

# Friction

<script>
    function oneMassiveParticleGenerator(simulation, particleIndex)
    {
        var particle = uniformParticleGenerator(simulation, particleIndex);
        if (particleIndex == 0)
        {
            particle.mass = 50;
            particle.radius = Math.sqrt(50);
        }
        return particle;
    }

    createSimulation({
        controls: ["trajectoryEnabled"],
        graphs: ["energy"],
        particleGenerator: oneMassiveParticleGenerator,
        parameters: {
            particleCount: 500,
            radiusScaling: 0.005,
            bondEnergy: 0,
            maxInitialSpeed: 0.05,
        },
    });
</script>