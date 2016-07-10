---
title: Inelastic collisions
---

<div class="page">
## Inelastic collisions
<script>
    
</script>


<div class="stepLog twoColumn">
<div class="rightColumn">
<script>
    var inelasticSim = createSimulation({
        height: 800,
        initialize: function (simulation) {
            var p = simulation.parameters;
            p.gravityAcceleration = 0.01;
            p.lennardJonesStrength = 0.2;
            p.dt = 0.005;
            p.separationFactor = 1.1;
            p.maxParticleCount = 1000;
            p.dragStrength = 3;

            var layers = 7;
            var particleCount = 1 + (6 * layers * (layers + 1) / 2);
            var particleRadius = 0.04;

            for (var particleIndex = 0; particleIndex < particleCount; particleIndex++) {
                var particle = new Particle();
                particle.radius = particleRadius;
                var latticeSpacing = particleRadius * 2 * p.separationFactor;
                particle.position = hexagonalLatticePosition(particleIndex, latticeSpacing);
                var hexagonInnerRadius = 2 * particleRadius * (layers - 1);
                if (v2.square(particle.position) < square(hexagonInnerRadius))
                {
                    particle.position[1] -= hexagonInnerRadius; 
                    addParticle(simulation, particle);
                }
            }

            setInteraction(simulation, 0, 0, Interaction.lennardJones);
        },
    
    });

    insertHere(inelasticSim.div);
</script>
</div>

This is a model of a ball, made of up small atoms. We cannot simulate millions of atoms, so we make do with about a hundred.

Carefully drag and drop the ball from a reasonable height.

<script>
    var wasDown = false;
    cue({
        condition: function() 
        {
            var isAtReasonableHeight = inelasticSim.particles[0].position[1] > -0.2;
            return (isAtReasonableHeight);
        }
    });
    setup(function() {
        inelasticSim.parameters.trajectoryEnabled = true;
    });
</script>

Cool, it bounces! Note how with every bounce it loses a little height.

<script>
    insertHere(
        createCheckbox({
            object: inelasticSim.parameters,
            name: "trajectoryEnabled",
            label: "Draw the trajectory of the ball",
        })
    );

    insertHere(
        createSlider({
            object: inelasticSim.parameters,
            name: "friction",
            min: 0, max: 1,
            minLabel: "Friction:"
        })
    );

    createTimeSeriesHere({
        range: 300,
        update: function() {
            var height = inelasticSim.particles[0].position[1];
            return {time: inelasticSim.time, data: [height]};
        }
    })
</script>

</div>
<div class="twoColumn">
<script>
    insertHere(inelasticSim.div);
</script>
</div>
</div>

<script>
    initChapter();
</script>