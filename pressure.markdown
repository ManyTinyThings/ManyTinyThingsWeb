---
title: Pressure
---

# Pressure

I've installed force measurement devices in the walls here. They detect whenever a particle bounces off the wall, and how hard. Try throwing the particle at the wall at different speeds.

<script>
    var sim = createSimulation({
        controls: ["playPauseButton", "resetButton"],
        visualizations: ["pressure"],
        parameters: {
            particleCount: 1,
            radiusScaling: 0.10,
            bondEnergy: 0,
            collisionEnabled: false,
        },
    });
</script>

