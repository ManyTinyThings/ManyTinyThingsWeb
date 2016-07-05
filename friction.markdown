---
title: Friction
---

<div class="page">
<script>
    var dropBallSim = createSimulation({
        initialize: function (simulation) {
            var p = simulation.parameters;
            p.gravityAcceleration = 0.1;
            p.coefficientOfRestitution = 0.7;
            p.friction = 0.1;

            var particle = new Particle();
            particle.radius = 0.2;
            v2.set(particle.position, 0, -1 + particle.radius);
            addParticle(simulation, particle);
        },
    });
</script>


<div class="stepLog twoColumn">
Friction is what makes things stop. For example, if you drop a ball, you expect it to bounce a bit and then stop.

Drag and drop the ball from a reasonable height.

<script>
    var wasDown = false;
    cue({
        condition: function() 
        {
            var sim = dropBallSim;
            var isAtReasonableHeight = sim.particles[0].position[1] > 0;
            var isDown = sim.mouse.leftButton.down;
            var justUp = wasDown && (!isDown);
            wasDown = isDown;
            return (justUp && isAtReasonableHeight);
        }
    })
</script>

There are two things at play here: **air drag** and **inelastic collisions**. Let me show you!
</div>
<div class="twoColumn">
<script>
    insertHere(dropBallSim.div);
</script>
</div>
</div>


<div class="page">
## Air drag
<script>
    var airDragSim = createSimulation({
        initialize: function (simulation) {
            var p = simulation.parameters;
            p.gravityAcceleration = 0.001;
            p.onlyHardSpheres = true;

            var particle = new Particle();
            particle.radius = 0.2;
            particle.type = 0;
            v2.set(particle.position, 0, -1 + particle.radius + 0.001);
            addParticle(simulation, particle);

            var newParticles = [];
            for (var particleIndex = 0; particleIndex < 200; particleIndex++) {
                var tinyParticle = new Particle();
                tinyParticle.radius = 0.03;
                tinyParticle.velocity = randomVelocity(0.2);
                do {
                    tinyParticle.position = randomPointInRect(simulation.boxBounds);
                } while(isColliding(simulation, tinyParticle))
                tinyParticle.type = 1;
                tinyParticle.mass = 0.001;
                newParticles.push(tinyParticle);
            }
            addParticlesRandomly(simulation, newParticles);

            setInteraction(simulation, 1, 1, Interaction.none);
            setInteraction(simulation, 0, 0, Interaction.none);
            setInteraction(simulation, 0, 1, Interaction.none);
        },
        

    });
</script>


<div class="stepLog twoColumn">
Friction is what makes things stop. For example, if you drop a ball, you expect it to bounce a bit and then stop.

Drag and drop the ball from a reasonable height.

<script>
    var wasDown = false;
    cue({
        condition: function() 
        {
            var sim = dropBallSim;
            var isAtReasonableHeight = sim.particles[0].position[1] > 0;
            var isDown = sim.mouse.leftButton.down;
            var justUp =  wasDown && (!isDown);
            wasDown = isDown;
            return (justUp && isAtReasonableHeight);
        }
    })
</script>

There are two things at play here: **air drag** and **inelastic collisions**. Let me show you!
</div>
<div class="twoColumn">
<script>
    insertHere(airDragSim.div);
</script>
</div>
</div>

<script>
    initChapter();
</script>



<script>
    // function oneMassiveParticleGenerator(simulation, particleIndex)
    // {
    //     var particle = uniformParticleGenerator(simulation, particleIndex);
    //     if (particleIndex == 0)
    //     {
    //         particle.mass = 50;
    //         particle.radius = Math.sqrt(50);
    //     }
    //     return particle;
    // }

    // createSimulation({
    //     controls: ["trajectoryEnabled"],
    //     graphs: ["energy"],
    //     particleGenerator: oneMassiveParticleGenerator,
    //     parameters: {
    //         particleCount: 500,
    //         radiusScaling: 0.005,
    //         bondEnergy: 0,
    //         maxInitialSpeed: 0.05,
    //     },
    // });
</script>