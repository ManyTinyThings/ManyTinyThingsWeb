---
title: Frictionless Hugs for Everyone!
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0;
            p.thermostatTemperature = 0;
            p.thermostatDeterministicStrength = 1;
            setBoxWidth(simulation, 50);

            var particleCount = 37;

            for (var particleIndex = 0; particleIndex < particleCount; particleIndex++) {
                var particle = new Particle();
                hexagonalLatticePosition(particle.position, particleIndex, 2);
                addParticle(simulation, particle);
            }


            var displacement = v2.alloc();
            var displacementMagnitude = 0.01;
            for (var particleIndex = 0; particleIndex < simulation.particles.length; particleIndex++) {
                var particle = simulation.particles[particleIndex];
                v2.set(displacement, randomGaussian(), randomGaussian());
                v2.scaleAndAdd(particle.position, particle.position, 
                    displacement, displacementMagnitude);
            }
            v2.free(displacement);

            var ljInteraction = new LennardJonesInteraction();
            ljInteraction.strength = 10;
            setInteraction(simulation, 0, 0, ljInteraction);

            setToolbarAvailableTools(simulation.toolbar, ["move"]);
        }
    });
</script>

Bumping stuff into walls is not a very precise method of investigation.

Instead, here is a slider that controls how much the particles move.

<script>
    // TODO: maybe have buttons for critical temperatures
    createSliderHere({
        initialValue: sim.parameters.thermostatTemperature,
        min: 0, max: 20,
        minLabel: "No movement", maxLabel: "A lot",
        transform: function(x) { return (x * x)},
        inverseTransform: function(x) { return Math.sqrt(x) },
        update: function (value)
        {
            sim.parameters.thermostatTemperature = value;
        }
    });
</script>

Slowly increase the amount of movement.

<script>
    cue(function()
    {
        return (sim.parameters.thermostatTemperature > 0.5);
    });
    endStep();
</script>

The particles jiggle in place.

Keep increasing.

<script>
    cue(function()
    {
        return (sim.parameters.thermostatTemperature > 2.7);
    });
    endStep();
</script>

The particles start "walking" around the other particles. Sometimes, a single particle breaks free from the object.

Keep increasing.

<script>
    cue(function()
    {
        return (sim.parameters.thermostatTemperature > 4.5);
    });
    endStep();
</script>

The particles start to lose their connections and break off into separate groups.

Keep increasing.

<script>
    cue(function()
    {
        return (sim.parameters.thermostatTemperature >= 15);
    });
    endStep();
</script>

The particles are bouncing around, alone or in small groups, almost as if there was no attraction at all.

