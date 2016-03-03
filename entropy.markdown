# Entropy

When playing billiards, it's easy to make a mess.

<script>
    createSimulation("billiards", {
        particleGenerator: billiardsParticleGenerator,
        parameters: {
            particleCount: 11,
            friction: 0.1,
            bondEnergy: 0,
        },
    });

</script>

I mean, try putting the balls back manually. Kinda hard!

It's even easier to make a mess in frictionless billiards!

<script>
    createSimulation("frictionlessBilliards", {	
        particleGenerator: billiardsParticleGenerator,
        parameters: {
            particleCount: 11,
            friction: 0,
            bondEnergy: 0,
        },
    });
</script>

Try putting these back together. It's impossible!

How about something a little easier? Try putting all the particles in the left half of the box.

<script>
    var halfRegionSim = createSimulation("halfRegion", { 
        particleGenerator: uniformParticleGenerator,
        parameters: {
            maxInitialSpeed: 0.01,
            particleCount: 20,
            friction: 0,
            bondEnergy: 0,
        },
    });

    setLeftRighRegions(halfRegionSim);
</script>

It's quite hard, and they keep wanting to escape! Notice how, if you don't touch anything, they tend to be about half on the left side and half on the right.

