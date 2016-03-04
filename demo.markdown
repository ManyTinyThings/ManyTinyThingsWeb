---
title: Energy and Heat
---

# Energy and Heat

Here is a billiard ball. Try throwing it around.

<script>
    createSimulation("single", {
        visualizations: ["energy"],
        controls: [],
        parameters: {
            particleCount: 1,
            friction: 0.1,
            bondEnergy: 0,
        },
    });
</script>

As you pick up and throw the ball, you give it speed, and in turn, energy. This kind of energy is called
_kinetic energy_, or _movement energy_.
When you release the ball it starts to lose energy because of the friction in the air and in the collisions with the table.

I added some more balls. Play around with them!

<script>
    createSimulation("billiards", {
        visualizations: ["energy"],
        particleGenerator: billiardsParticleGenerator,
        parameters: {
            particleCount: 11,
            friction: 0.1,
            bondEnergy: 0,
        },
    });
</script>

Here I show the total energy, which is what you get by adding up the energy of each particle.

Balls knocking each other around is actually a pretty good model of how the world works at the atomic level.
One big difference: there is no friction.

<script>
    createSimulation("frictionlessBilliards", {
        visualizations: ["energy"],
        particleGenerator: billiardsParticleGenerator,
        parameters: {
            particleCount: 11,
            friction: 0,
            bondEnergy: 0,
        },
    });
</script>

The atoms are bouncing all over the place, and they never stop. We have created a perpetual motion machine!

Notice that the energy stays the same. We've already seen what happens if the energy keeps decreasing: everything stops. What happens if the energy always increases? Try out negative friction!

<script>
    createSimulation("negativeFriction", {
        visualizations: ["energy"],
        controls: ["resetButton", "friction"],
        particleGenerator: billiardsParticleGenerator,
        parameters: {
            particleCount: 11,
            friction: 0,
            bondEnergy: 0,
        },
    });
</script>

Yeah... that would be madness.

Another big difference: the world isn't made of 11 atoms, there are a lot more!

<script>
    createSimulation("manyParticles", {
        particleGenerator: uniformParticleGenerator,
        parameters: {
            particleCount: 500,
            radiusScaling: 0.01,
            bondEnergy: 0,
        },
    });
</script>

Try following a single particle with your eyes. It's hard! 
And this is only 500 particles. That's about 100 000 000 000 000 000 000 times less than the amount of air particles in a single breath!

So if we can't keep track of each particle, is there any way we can still make sense of the bouncy, jittery mess?

Take a look at these two boxes of particles. Which one has more energy?

<script>
    function hotColdGenerator(simulation, particleIndex)
    {
        var position;
        var velocity;
        var maxSpeed = simulation.parameters.maxInitialSpeed;
        if (particleIndex % 2)
        {
            position = randomPointInRect(simulation.leftRect);
            velocity = randomVelocity(maxSpeed / 10);
        }
        else
        {
            position = randomPointInRect(simulation.rightRect);
            velocity = randomVelocity(maxSpeed);
        }
        var particle = new Particle(position, velocity, colors.black);
        return particle;
    }

    var hotColdSim = createSimulation("hotAndCold", {
        particleGenerator: hotColdGenerator,
        visualizations: ["energy"],
        parameters: {
            particleCount: 500,
            radiusScaling: 0.01,
            bondEnergy: 0,
            maxInitialSpeed: 0.02,
        },
        walls: [{start: vec2.fromValues(0, -1), end: vec2.fromValues(0, 1)}],
    });

    setLeftRightRegions(hotColdSim);

</script>

Yep, the right one definitely has more energy. Now compare with this:

<script>
    function slowFastGenerator(simulation, particleIndex)
    {
        var position;
        var velocity;
        var maxSpeed = simulation.parameters.maxInitialSpeed;
        if (particleIndex % 2)
        {
            position = randomPointInRect(simulation.leftRect);
            velocity = randomUnitVector();
            vec2.scale(velocity, velocity, maxSpeed / 5);
        }
        else
        {
            position = randomPointInRect(simulation.rightRect);
            velocity = randomUnitVector();
            vec2.scale(velocity, velocity, maxSpeed);
        }
        var particle = new Particle(position, velocity, colors.black);
        return particle;
    }

    var slowFastBall = createSimulation("slowFast", {
        visualizations: ["energy"],
        particleGenerator: slowFastGenerator,
        parameters: {
            particleCount: 2,
            radiusScaling: 0.1,
            bondEnergy: 0,
            maxInitialSpeed: 0.1,
        },
        walls: [{start: vec2.fromValues(0, -1), end: vec2.fromValues(0, 1)}],
    });

    setLeftRightRegions(slowFastBall);
</script>

In both cases, it's obvious that one side has more energy. But with a single ball, there is a clear direction, and you can easily change the direction (try it!). For example: try decreasing the energy of both kinds of system. It's much harder to control!

Both cases are really the same kinetic energy, but the random, bouncy, jiggling energy is of a different character than the moving-in-a-straight-line energy of the single ball.

This "new" kind of energy is what we call _heat_. A system with more random bouncing around has more heat, and is _hotter_. A more chill system is _cooler_.

It might not yet be clear how this connects to our everyday notions of hot and cold, but I hope we can get there eventually!

To be continued...


# Entropy

When playing billiards, it's easy to make a mess.

<script>
    createSimulation("billiards2", {
        particleGenerator: billiardsParticleGenerator,
        parameters: {
            particleCount: 11,
            friction: 0.1,
            bondEnergy: 0,
        },
    });

</script>

I mean, try putting the balls back manually. Not my idea of a fun time ...

Frictionless billiards is even messier!

<script>
    createSimulation("frictionlessBilliards2", { 
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
        visualizations: ["countsHistogram"],
        parameters: {
            maxInitialSpeed: 0.01,
            particleCount: 20,
            bondEnergy: 0,
        },
    });

    setLeftRightRegions(halfRegionSim);

</script>

It's quite hard, and they keep wanting to escape! Notice how, if you don't touch anything, they tend to spread out so that about half is on the left side and half on the right.

Don't agree? It's more obvious when there are more particles.

<script>
    var halfRegionMoreSim = createSimulation("halfRegionMore", { 
        particleGenerator: uniformParticleGenerator,
        visualizations: ["countsHistogram"],
        parameters: {
            maxInitialSpeed: 0.01,
            particleCount: 200,
            radiusScaling: 0.02,
            bondEnergy: 0,
        },
    });

    setLeftRightRegions(halfRegionMoreSim);

</script>

"But you're cheating!", you might say, "you're starting with all particles evenly spread out!"

Okay, put them wherever you want (hold _c_ on the keyboard).

<script>
    var initialConfigSim = createSimulation("initialConfig", {
        controls: ["playPauseButton", "resetButton"],
        particleGenerator: uniformParticleGenerator,
        visualizations: ["countsHistogram"],
        parameters: {
            maxInitialSpeed: 0.01,
            particleCount: 1,
            radiusScaling: 0.02,
            bondEnergy: 0,
        },
    });

    setLeftRightRegions(initialConfigSim);
    pauseSimulation(initialConfigSim);

</script>

That didn't take very long, did it?

How come the particles like to spread out, but not come back together? Let's try to understand.