---
title: Frictionless Hugs for Everyone!
previous: bounce_slowing
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0;

            var particleCount = 19;

            for (var particleIndex = 0; particleIndex < particleCount; particleIndex++) {
                var particle = new Particle();
                hexagonalLatticePosition(particle.position, particleIndex, 2);
                addParticle(simulation, particle);
            }


            var displacement = v2.alloc();
            var displacementMagnitude = 0.03;
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

With multiple particles, there is now a constant jiggling.

And without friction, the jiggling never stops.

<script>

    // TODO: use a thermostat instead
    // TODO: maybe have buttons for critical temperatures
    var negate = function(x) {
        return (-x);
    };
    createSliderHere({
        object: sim.parameters,
        name: "friction",
        min: 0.1, max: -0.1,
        minLabel: "Less",
        maxLabel: "More",
        isSnapBack: true,
        transform: negate,
        inverseTransform: negate,
    });
</script>