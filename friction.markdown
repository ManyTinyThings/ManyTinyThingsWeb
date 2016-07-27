---
title: Friction
---

<div class="page">
<script>
    var dropBallSim = createSimulation({
        initialize: function (simulation) {
            var p = simulation.parameters;
            p.gravityAcceleration = 0.5;
            p.coefficientOfRestitution = 0.7;
            p.friction = 0.1;
            p.boxHeight = 10;
            p.wallStrength = 1;

            var particle = new Particle();
            v2.set(particle.position, 0, -p.boxHeight / 2 + particle.radius);
            addParticle(simulation, particle);
        },
    });
</script>


<div class="stepLog twoColumn">
Friction is what makes things stop. For example, if you drop a ball, you expect it to bounce a bit and then stop.

Drag and drop the ball from a reasonable height.

<script>
    var wasDown = false;
    cue(function() {
        var sim = dropBallSim;
        var isAtReasonableHeight = sim.particles[0].position[1] > 0;
        var isDown = sim.mouse.leftButton.down;
        var justUp = wasDown && (!isDown);
        wasDown = isDown;
        return (justUp && isAtReasonableHeight);
    });
    endStep();
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
            p.gravityAcceleration = 0.1;
            // p.onlyHardSpheres = true;
            p.lennardJonesStrength = 0.1;
            p.dt = 0.01;
            p.boxWidth = 50;


            var bigRadius = 5;
            var tinyRadius = 1;

            var particle = new Particle();
            particle.type = 0;
            v2.set(particle.position, 0, -1 + particle.radius + 0.01);
            particle.radius = bigRadius;
            particle.mass = 25;
            addParticle(simulation, particle);

            var newParticles = [];
            for (var particleIndex = 0; particleIndex < 200; particleIndex++) {
                var tinyParticle = new Particle();
                tinyParticle.radius = tinyRadius;
                tinyParticle.velocity = randomVelocity(10);
                tinyParticle.type = 1;
                tinyParticle.mass = 1;
                newParticles.push(tinyParticle);
            }
            addParticlesRandomly(simulation, newParticles);

            setInteraction(simulation, 1, 1, null);
            setInteraction(simulation, 0, 0, null);
            var repulsiveInteraction = new RepulsiveInteraction();
            repulsiveInteraction.separation = tinyRadius + bigRadius;
            setInteraction(simulation, 0, 1, repulsiveInteraction);
        },
        

    });
</script>


<div class="stepLog twoColumn">
Friction is what makes things stop. For example, if you drop a ball, you expect it to bounce a bit and then stop.

Drag and drop the ball from a reasonable height.

<script>
    var wasDown = false;
    cue(function() {
        var sim = dropBallSim;
        var isAtReasonableHeight = sim.particles[0].position[1] > 0;
        var isDown = sim.mouse.leftButton.down;
        var justUp =  wasDown && (!isDown);
        wasDown = isDown;
        return (justUp && isAtReasonableHeight);
    });
    endStep();
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