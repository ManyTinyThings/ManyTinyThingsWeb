---
title: Inelastic collisions
---

<div class="page">
## Inelastic collisions

<div class="stepLog twoColumn">
<div class="rightColumn">
<script>
    var inelasticSim = createSimulation({
        height: 800,
        initialize: function (simulation) {
            var p = simulation.parameters;
            p.gravityAcceleration = 0.1;
            p.dt = 0.005;
            p.separationFactor = 1.1;
            p.maxParticleCount = 1000;
            p.dragStrength = 3;
            setBoxWidth(simulation, 30);

            var layers = 5;
            var particleCount = 1 + (6 * layers * (layers + 1) / 2);

            for (var particleIndex = 0; particleIndex < particleCount; particleIndex++) {
                var particle = new Particle();
                var latticeSpacing = particle.radius * 2;
                hexagonalLatticePosition(particle.position, particleIndex, latticeSpacing);
                var hexagonOuterRadius = 2 * (layers - 1);
                if (v2.square(particle.position) < square(hexagonOuterRadius))
                {
                    particle.position[1] += -12.5; 
                    addParticle(simulation, particle);
                }
            }
            var ljInteraction = new LennardJonesInteraction();
            ljInteraction.strength = 50;
            setInteraction(simulation, 0, 0, ljInteraction);
        },
    
    });

    insertHere(inelasticSim.div);


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

</script>
</div>

This is a model of a ball, made of up small atoms. We cannot simulate millions of atoms, so we make do with about a hundred.

Drag and drop the ball from the top of the box.

<script>
    var wasDown = false;
    cue(function() 
    {
        var isAtReasonableHeight = inelasticSim.particles[0].position[1] > 0.3;
        return isAtReasonableHeight;
    });
    endStep();
</script>

Observe how it bounces. This helpful graph shows how the ball's height changes over time:

<script>
    var lowTime = 0;
    cue(function(dt)
    {
        var isLow = inelasticSim.particles[0].position[1] < 0;
        if (isLow)
        {
            lowTime += dt;
        }
        else
        {
            lowTime = 0;
        }
        return (lowTime > 2);
    });

    createTimeSeriesHere({
        timeRange: 300,
        update: function() {
            var height = inelasticSim.particles[0].position[1];
            return {time: inelasticSim.time, data: [height]};
        }
    });

    endStep();
</script>

It keeps losing height, so at first glance it seems to be losing energy. But look at the energy graph:

<script>
    createTimeSeriesHere({
        timeRange: 300,
        update: function() {
            var energy = getTotalEnergy(inelasticSim);
            return {time: inelasticSim.time, data: [energy]};
        }
    });
</script>

The energy doesn't change at all! So where is the energy going?

Part of the energy goes into the rotation of the ball. 

_Figure with stacked gravitational potential + rotational energy. Or perhaps skip rotational._

The rest of the energy becomes heat! As the ball bounces into a wall, some of the energy will cause the atoms to randomly bump into each other and start jiggling.

So when you bounce a ball on the ground and it loses height, that lost height is actually heating up the ball (and also the ground, but we didn't include that in the model).


</div>
</div>

<script>
    initChapter();
</script>