---
title: Microscopic Differences
layout: panel
---

We have looked at each difference separately.

Let's now put them together and see what happens!

<div class="flex">

<div class="threeColumn">

The particles **attract** each other and **never stop**.

<script>
    var attractNeverStopSim = createSimulationHere({
        pixelWidth: 250,
        pixelHeight: 250,
        initialize: function(simulation)
        {
            var p = simulation.parameters;
            p.friction = 0;

            addOppositeParticles(simulation, 1);

            var ljInteraction = new LennardJonesInteraction();
            ljInteraction.strength = 10;
            setInteraction(simulation, 0, 0, ljInteraction);

            thumbnailSim(simulation);
        }
    });

    makeParentElementSequenceLink("/billiards/4_combinations/attraction_no_friction");
</script>

</div>

<div class="threeColumn">

The particles **never stop** and are **very many**.

<script>
    var neverStopManySim = createSimulationHere({
        pixelWidth: 250,
        pixelHeight: 250,
        initialize: function(simulation)
        {
            var p = simulation.parameters;
            p.isOnlyHardSpheres = true;
            setBoxWidth(simulation, 150)

            var particleCount = 200;
            var initialSpeed = 5;
            for (var i = 0; i < particleCount; i++) {
                var particle = new Particle();
                randomDiscInRect(particle.position, particle.radius, simulation.boxBounds);
                v2.set(particle.velocity, randomGaussian(), randomGaussian());
                v2.scale(particle.velocity, particle.velocity, initialSpeed);
                addParticle(simulation, particle);
            }

            thumbnailSim(simulation);
        }
    });
    
    makeParentElementSequenceLink("/billiards/4_combinations/many_no_friction");
</script>

</div>

<div class="threeColumn">

The particles are **very many** and **attract** each other.

<script>
    var likeSim = createSimulationHere({
        pixelWidth: 250,
        pixelHeight: 250,
        initialize: function(simulation)
        {
            var p = simulation.parameters;
            p.friction = 0.2;
            setBoxWidth(simulation, 40);

            var particleCount = 100;
            var initialSpeed = 1;
            for (var i = 0; i < particleCount; i++) {
                var particle = new Particle();
                randomDiscInRect(particle.position, particle.radius, simulation.boxBounds);
                v2.set(particle.velocity, randomGaussian(), randomGaussian());
                v2.scale(particle.velocity, particle.velocity, initialSpeed);
                addParticle(simulation, particle);
            }

            var ljInteraction = new LennardJonesInteraction();
            ljInteraction.strength = 10;
            setInteraction(simulation, 0, 0, ljInteraction);

            thumbnailSim(simulation);
        }
    });

    makeParentElementSequenceLink("/billiards/4_combinations/many_attraction");
</script>

</div>

</div>
