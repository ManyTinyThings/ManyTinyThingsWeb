---
title: Spreading Out
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;
            p.isOnlyHardSpheres = true;
            setBoxWidth(simulation, 120);

            // var particleCount = 200;
            // for (var i = 0; i < particleCount; i++) {
            //     var particle = new Particle();
            //     particle.position = randomDiscInRect(simulation.boxBounds, particle.radius);
            //     addParticle(simulation, particle);
            // }

            setWallsAlongBorder(simulation);
            var particleCount = 400;
            var particles = [];
            for (var i = 0; i < particleCount; i++) {
                var particle = new Particle();
                particle.position = randomPointInRect(simulation.boxBounds);
                particles.push(particle);
            }
            addParticlesRandomlyAround(simulation, particles, v2(0, 0));

            setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>


This isn't _that_ many particles, but it's already quite hard to predict where any single particle will end up when you shoot.

Use your pool cue a few times.

<script>
    var shotCount = 0;
    var requiredShotCount = 3;
    insertHere(createOutput(function() {
        return `${shotCount} / ${requiredShotCount} shots`; 
    }));
    var impendingShot = false;
    cue(function(){
        if (sim.mouse.mode === MouseMode.impulse)
        {
            impendingShot = true;
        }

        var didJustShoot = impendingShot && (sim.mouse.mode === MouseMode.none);
        if (didJustShoot)
        {
            impendingShot = false;
            shotCount += 1;
        }
        return (shotCount >= requiredShotCount);
    });
    endStep();
</script>

Do you see the waves?

When you shoot, you start a _chain reaction_ of particles bumping into each other. A _wave_ of motion spreading.

This is a phenomenon that only appears when there are enough particles.