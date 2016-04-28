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
        },
    });

</script>

Okay, let's do the usual thing: ADD A TON OF PARTICLES!!!

<script>
    var sim = createSimulation({
        controls: ["playPauseButton", "resetButton", "soundEnabled"],
        visualizations: ["pressure"],
        particleGenerator: uniformParticleGenerator,
        parameters: {
            particleCount: 5,
            radiusScaling: 0.02,
            bondEnergy: 0,
            collisionEnabled: false,
        },
    });
</script>



## Hard-to-open jar

<script>
    var sim = createSimulation({
        controls: ["resetButton"],
        visualizations: ["pressure"],
        particleGenerator: uniformParticleGenerator,
        parameters: {
            particleCount: 1,
            radiusScaling: 0.1,
            bondEnergy: 0,
        },
    });


    sim.walls.push(
        new Wall(v2(-0.5, -1), v2(-0.5, 0.5)),
        new Wall(v2(-0.5, 0.5), v2(0.5, 0.5)),
        new Wall(v2(0.5, 0.5), v2(0.5, -1))
    );
</script>

