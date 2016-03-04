---
title: Energy and Heat
---

# Energy and Heat

Here is a billiard ball. Try throwing it around.

<script>
    createSimulation("single", {
        graphs: ["energy"],
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
(This natural loss of energy is called _dissipation_.)

I added some more balls. Play around with them some.

<script>
    createSimulation("billiards", {
        graphs: ["energy"],
        particleGenerator: billiardsParticleGenerator,
        parameters: {
            particleCount: 11,
            friction: 0.1,
            bondEnergy: 0,
        },
    });

</script>

* Maybe ask user to try putting them back where they were

It's easy to make a mess, which is what makes billiards an interesting game: it always creates new situations!

Let's remove all the friction and see what happens:

* maybe remove friction for just one particle
    * ask to decrease the energy
* then to billiards frictionless
    * ask to decrease energy

<script>
    createSimulation("frictionlessBilliards", {
        graphs: ["energy"],
        particleGenerator: billiardsParticleGenerator,
        parameters: {
            particleCount: 11,
            friction: 0,
            bondEnergy: 0,
        },
    });
</script>

Oh, look at that! The balls are bouncing all over the place, and they never stop. We have created a perpetual motion machine! 

Look at the energy: it stays the same, no matter how the balls are bouncing. If the energy was decreasing, like before, everything would eventually stop. If it was increasing, well, everything would be moving faster and faster and eventually EXPLODE!!! (good thing it doesn't!)

There is one way to change the energy: if you poke the balls after they have started bouncing. See if you can get the energy to decrease! Kinda hard, isn't it?

Now, imagine there are lots and lots of tiny, tiny balls bouncing around. Oh wait, we don't have to imagine!

<script>
    createSimulation("manyParticles", {
        graphs: ["energy"],
        particleGenerator: uniformParticleGenerator,
        parameters: {
            particleCount: 200,
            radiusScaling: 0.01,
            bondEnergy: 0,
        },
    });
</script>

The energy here is still the sum of the kinetic energy of each individual particle. But it's hard to even follow a single particle with your eyes, let alone interact with it!

Have a look at these two systems:

* two rooms in one simulation
    * First with just a single particle?
    * each with its own energy measurement, both in one plot
    * Maybe let user give them different energy

<script>
    function hotColdGenerator(simulation, particleIndex)
    {
        var position;
        var velocity;
        if (particleIndex % 2)
        {
            position = randomPointInRect(simulation.leftRect);
            velocity = randomVelocity(0.01);
        }
        else
        {
            position = randomPointInRect(simulation.rightRect);
            velocity = randomVelocity(0.03);
        }
        var particle = new Particle(position, velocity, colors.black);
        return particle;
    }

    var hotColdSim = createSimulation("hotAndCold", {
        graphs: ["energy"],
        particleGenerator: hotColdGenerator,
        parameters: {
            particleCount: 200,
            radiusScaling: 0.01,
            bondEnergy: 0,
            maxInitialSpeed: 0.05,
        },
        walls: [{start: vec2.fromValues(0, -1), end: vec2.fromValues(0, 1)}],
    });

    setLeftRightRegions(hotColdSim);

</script>

While it's hard to say anything about a particular particle, we can clearly see that particles in the left box are much more bouncy, jittery, filled with energy! However, it's a much more messy kind of energy than the one of a large object such as a billiard ball. This messy, jiggling, random, bouncing-all-over-the-place kind of energy is what we call _heat_. The more _heat_ something has, the _warmer_ it will seem. 

This might seem strange to you, and I agree: at this point, it is not clear how this giant billiards table connects to boiling water, a metal feeling colder than wood, etc. It will hopefully be more clear as we explore the world of tiny particles in the chapters ahead!

# Random walk

<script>
    function oneMassiveParticleGenerator(simulation, particleIndex)
    {
        var particle = uniformParticleGenerator(simulation, particleIndex);
        if (particleIndex == 0)
        {
            particle.mass = 50;
            particle.radius = Math.sqrt(50);
        }
        return particle;
    }

    createSimulation("randomWalk", {
        controls: ["trajectoryEnabled"],
        graphs: ["energy"],
        particleGenerator: oneMassiveParticleGenerator,
        parameters: {
            particleCount: 1000,
            radiusScaling: 0.005,
            bondEnergy: 0,
            maxInitialSpeed: 0.05,
        },
    });
</script>