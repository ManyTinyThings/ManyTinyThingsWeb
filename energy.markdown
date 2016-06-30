---
title: Energy and Heat
---

In this chapter, we learn about the important concept of _energy_, starting with _kinetic energy_ (a fancy term for _movement energy_).

<div class="page">
<script>
    var singleEnergySim = createSimulation({
        width: 400,
        height: 400,
        initialize: function(simulation) {

            copyObject(simulation.parameters, {
                radiusScaling: 0.1,
                friction: 0.1,
                coefficientOfRestitution: 0.7,
            });

            addParticle(simulation, new Particle())
        }
    });

    enableOnlyTools(singleEnergySim.toolbar, ["select"]);
</script>

<div class="stepLog twoColumn">
Here is a billiard ball. Try throwing it around.

<script>
	cue({
		confirmationDelay: 1,
		condition: function () {
			var speed = v2.magnitude(singleEnergySim.particles[0].velocity);
			return (speed > 0.5);
		},
	});
</script>

As you pick up and throw the ball, you give it speed, and in turn, energy. This kind of energy is called
_kinetic energy_, or _movement energy_. This plot shows how the energy changes over time:

<script>
	var energyLog = createTimeLog({range: 50});
	createGraphHere({
		update: graph => {
			var energy = singleEnergySim.particles.reduce((acc, p) => acc + p.potentialEnergy + p.kineticEnergy, 0);
			addToLog(energyLog, singleEnergySim.time, {energy: energy});
			addCurve(graph, {x: energyLog.time, y: energyLog.data.energy});
			addAxes(graph, {x: arrayLast(energyLog.time) - energyLog.range, y: 0});
		}
	});
</script>

Throw the ball around some more and see what happens in the plot.

<script>
	cue({
		confirmationDelay: 2,
		condition: function () {
			return (singleEnergySim.particles[0].kineticEnergy > 0.5);
		},
	});
</script>

When you release the ball it starts to lose energy because of the friction in the air and in the collisions with the table.
</div>
<div class="twoColumn">
<script>
	insertHere(singleEnergySim.div);
</script>
</div>
</div>




<div class="page">
<script>
    var totalEnergySim = createSimulation({
        width: 400,
        height: 400,
        initialize: function(simulation) {

            copyObject(simulation.parameters, {
                radiusScaling: 0.1,
                friction: 0.1,
                coefficientOfRestitution: 0.7,
            });

            var particleCount = 11;
            for (var i = 0; i < particleCount; i++) {
            	var particle = new Particle();
            	particle.position = billiardsPosition(simulation, i);
            	addParticle(simulation, particle);
            }
        }
    });
</script>
<div class="stepLog twoColumn">
I added some more balls. Play around with them!

<script>
	cue({
		delay: 2,
		condition: function () {
			var speed = v2.magnitude(totalEnergySim.particles[0].velocity);
			return (speed > 1);
		},
	});
</script>

Here I show the total energy, which is what you get by adding up the energy of each particle.

<script>
	// TODO: one color for each particle
	var totalEnergyLog = createTimeLog({range: 50});
	createGraphHere({
		update: graph => {
			var energy = totalEnergySim.particles.reduce((acc, p) => acc + p.potentialEnergy + p.kineticEnergy, 0);
			addToLog(totalEnergyLog, totalEnergySim.time, {energy: energy});
			addCurve(graph, {x: totalEnergyLog.time, y: totalEnergyLog.data.energy});
			addAxes(graph, {x: arrayLast(totalEnergyLog.time) - totalEnergyLog.range, y: 0});
		}
	});
</script>
</div>
<div class="twoColumn">
<script>
	insertHere(totalEnergySim.div);
</script>
</div>
</div>


<script>
	initChapter();
</script>













## The rest

Balls knocking each other around is actually a pretty good model of how the world work at the atomic level.
One big difference: _there is no friction_. Lower the friction of the system below an see what happens.

<cript>
    createSimulation({
        visualizations: ["energy"],
        controls: ["friction"],
        particleGenerator: billiardsParticleGenerator,
        parameters: {
            particleCount: 11,
            friction: 0,
            bondEnergy: 0,
        },
    });
</cript>

The atoms are bouncing all over the place, and they never stop. We have created  perpetual motion machine!

Also, notice that the energy stays the same. Put another way: _energy is never created o destroyed_. This is how the world works at the microscopic level.

Another big difference: the world isn't made of 11 atoms, there are a lot more!

<cript>
    createSimulation({
        particleGenerator: uniformParticleGenerator,
        parameters: {
            particleCount: 250,
            radiusScaling: 0.003,
            bondEnergy: 0,
        },
    });
</cript>

Try following a single particle with your eyes. It's hard! 
And this is only 250 particles. That's about 100 000 000 000 000 000 000 times less than the amount of air particles in a single breath!

So if we can't keep track of each particle, is there any way we can still make sense of the bouncy, jittery mess?

Take a look at these two boxes of particles. Which one has more energy?

<cript>
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

</cript>

Yep, the right one definitely has more energy. Now compare with this:

<cript>
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
</cript>

Here it's even more obvious that the right side has more energy.

But with a single ball, there is a clear direction, and you can easily change the direction. With a lot of tiny particles, direction doesn't make sense, and it's hard to control what happens.

To demonstrate: try _decreasing_ the energy of both systems below.

<cript>
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
</cript>

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
