---
title: Energy and Heat
---

# Energy and Heat

Here is a billiard ball. Try throwing it around.

<script>
    createSimulation({
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
    createSimulation({
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
    createSimulation({
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
    createSimulation({
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
    createSimulation({
        particleGenerator: uniformParticleGenerator,
        parameters: {
            particleCount: 250,
            radiusScaling: 0.01,
            bondEnergy: 0,
        },
    });
</script>

Try following a single particle with your eyes. It's hard! 
And this is only 250 particles. That's about 100 000 000 000 000 000 000 times less than the amount of air particles in a single breath!

So if we can't keep track of each particle, is there any way we can still make sense of the bouncy, jittery mess?

Take a look at these two boxes of particles. Which one has more energy?

<script>
    function hotColdGenerator(simulation, particleIndex)
    {
        var particle = new Particle();
        var maxSpeed = simulation.parameters.maxInitialSpeed;
        if (particleIndex % 2)
        {
            particle.position = randomPointInRect(simulation.leftRect);
            particle.velocity = randomVelocity(maxSpeed / 10);
        }
        else
        {
            particle.position = randomPointInRect(simulation.rightRect);
            particle.velocity = randomVelocity(maxSpeed);
        }
        return particle;
    }

    var hotColdSim = createSimulation({
        particleGenerator: hotColdGenerator,
        visualizations: ["energy"],
        parameters: {
            particleCount: 300,
            radiusScaling: 0.01,
            bondEnergy: 0,
            maxInitialSpeed: 0.02,
        },
        walls: [{start: vec2.fromValues(0, -1), end: vec2.fromValues(0, 1)}],
    });

    setColdHotRegions(hotColdSim);

</script>

Yep, the right one definitely has more energy. Now compare with this:

<script>
    function slowFastGenerator(simulation, particleIndex)
    {
        var particle = new Particle();
        var maxSpeed = simulation.parameters.maxInitialSpeed;
        if (particleIndex % 2)
        {
            particle.position = randomPointInRect(simulation.leftRect);
            particle.velocity = randomUnitVector();
            vec2.scale(particle.velocity, particle.velocity, maxSpeed / 5);
        }
        else
        {
            particle.position = randomPointInRect(simulation.rightRect);
            particle.velocity = randomUnitVector();
            vec2.scale(particle.velocity, particle.velocity, maxSpeed);
        }
        return particle;
    }

    var slowFastBall = createSimulation({
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

    setColdHotRegions(slowFastBall);
</script>

Here it's even more obvious that the right side has more energy.

But with a single ball, there is a clear direction, and you can easily change the direction. With a lot of tiny particles, direction doesn't make sense, and it's hard to control what happens.

To demonstrate: try _decreasing_ the energy of both systems below.

<script>
    function oneMany(simulation, particleIndex)
    {
        var particle = new Particle();
        var maxSpeed = simulation.parameters.maxInitialSpeed;
        if (particleIndex == 0)
        {
            particle.position = randomPointInRect(simulation.leftRect);
            particle.velocity = randomUnitVector();
            vec2.scale(particle.velocity, particle.velocity, maxSpeed);
            particle.radius = 10;
            particle.mass = 20;
        }
        else
        {
            particle.position = randomPointInRect(simulation.rightRect);
            particle.velocity = randomUnitVector();
            vec2.scale(particle.velocity, particle.velocity, maxSpeed / 10);
        }
        return particle;
    }

    var oneManySim = createSimulation({
        visualizations: ["energy"],
        particleGenerator: oneMany,
        parameters: {
            particleCount: 101,
            radiusScaling: 0.02,
            bondEnergy: 0,
            maxInitialSpeed: 0.1,
        },
        walls: [{start: vec2.fromValues(0, -1), end: vec2.fromValues(0, 1)}],
    });

    setColdHotRegions(oneManySim);
</script>

Both cases are really the same kinetic energy, but the random, bouncy, jiggling energy is of a different character than the moving-in-a-straight-line energy of the single ball.

This "new" kind of energy is what we call _heat_. A system with more random bouncing around has more heat, and is _hotter_. A more chill system is _cooler_.

It might not yet be clear how this connects to our everyday notions of hot and cold, but I hope we can get there eventually!

To be continued...

## Important sentences

_Heat is a kind of energy: the movement energy of many small things moving around randomly._


## Todo

* maybe remove friction for just one particle
    * ask to decrease the energy
* then to billiards frictionless
    * ask to decrease energy
