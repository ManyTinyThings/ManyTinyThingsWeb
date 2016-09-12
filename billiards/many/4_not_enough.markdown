---
title: Still Not Enough
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;
            setBoxWidth(simulation, 150);
            p.isOnlyHardSpheres = true;

            setWallsAlongBorder(simulation);
            var particleCount = 1000;
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


One thousand particles!

It might seem like a lot.

_It isn't._

You would need approximately 

10,000,000,000,000,000,000 (or 10<sup>19</sup>) boxes 

each with 1000 particles, just to get the amount of air particles in a single human breath.
