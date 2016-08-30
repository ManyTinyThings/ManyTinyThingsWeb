---
chapterTitle: Heat
title: Heat
previous: /
---

To a person like you and me, heat is very important. We heat our food, get hot in the sun, feel the body heat when hugging someone, avoid touching things that are too hot and with too little heat we start freezing.

But what _is_ heat?

<div class="page">


<script>
    var heatSim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.1;
            p.dt = 0.005;
            p.boxWidth = 30;

            updateBounds(simulation);

            var particleCount = 1 + 21;
            for (var i = 0; i < particleCount; i++) {
                var particle = new Particle();
                particle.radius = 1;
                billiardsPosition(particle.position, i, 2*particle.radius);
                addParticle(simulation, particle);
            }
        }
    });
</script>

<div class="stepLog twoColumn">

Turn off the friction.

<script>
    cue(function() {
            return (heatSim.parameters.friction == 0);
    });
    insertHere(createSlider({
        object: heatSim.parameters,
        name: "friction",
        min: 0, max: 0.1,
        minLabel: "No friction", maxLabel: "Some",
    }));
</script>

Give the particles a shove.

<script>
    cue(function() {
        var isFrictionless = heatSim.parameters.friction == 0;
        var hasEnoughEnergy = getTotalEnergy(heatSim) > 0.1;
        return (isFrictionless && hasEnoughEnergy);
    });
    endStep();
</script>

**This is heat.** 

Particles moving around randomly, endlessly.

</div>

<div class="twoColumn">
<script>
    insertHere(heatSim.div);
</script>
</div>
</div>



* Balls bouncing around
    * _This is heat_
    * Random motion of the tiny stuff that makes up everything
    * Heat is kinetic energy, but chaotic
* Try decreasing energy
    * a few particles -> kinetic energy is easily controllable
    * a lot of particles -> heat is completely random
* Show a solid too
* Links to heat energy

* Balloon model
    * A rope with two ends stuck
    * As the air inside gets colder, the baloon shrinks because of the outside pressure


<!--
Another big difference: the world isn't made of 11 atoms, there are a lot more!

<script>
    createSimulation({
        particleGenerator: uniformParticleGenerator,
        parameters: {
            particleCount: 250,
            radiusScaling: 0.003,
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
    });
    hotColdSim.walls.push(
        new Wall(v2(0, -1), v2(0, 1))
    );
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
            v2.scale(particle.velocity, particle.velocity, maxSpeed / 5);
        }
        else
        {
            particle.position = randomPointInRect(simulation.rightRect);
            particle.velocity = randomUnitVector();
            v2.scale(particle.velocity, particle.velocity, maxSpeed);
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
    });

    slowFastBall.walls.push(
        new Wall(v2(0, -1), v2(0, 1))
    );
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
            v2.scale(particle.velocity, particle.velocity, 1.9*maxSpeed);
            particle.radius = 5;
            particle.mass = squared(5);
        }
        else
        {
            particle.position = randomPointInRect(simulation.rightRect);
            particle.velocity = randomUnitVector();
            v2.scale(particle.velocity, particle.velocity, maxSpeed);
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
            maxInitialSpeed: 0.01,
        },
    });

    oneManySim.walls.push(
        new Wall(v2(0, -1), v2(0, 1))
    );
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

-->


<script>
    initChapter();
</script>
