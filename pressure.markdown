---
title: Pressure
---

# Pressure

I've installed a force measurement device in the right wall here. It detects whenever a particle bounces off the wall, and how hard.

<script>
    var sim = createSimulation({
        controls: ["playPauseButton", "resetButton"],
        visualizations: ["pressure", "virialPressure"],
        particleGenerator: uniformParticleGenerator,
        parameters: {
            particleCount: 1000,
            radiusScaling: 0.01,
            bondEnergy: 0,
            collisionEnabled: false,
        },
    });
</script>