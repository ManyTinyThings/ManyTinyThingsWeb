---
title: Kinetic energy
---

In this chapter, we learn about the important concept of _energy_, starting with _kinetic energy_ (a fancy term for _movement energy_).

<div class="page">
<script>
    var singleEnergySim = createSimulation({
        initialize: function(simulation) {

            copyObject(simulation.parameters, {
                radiusScaling: 0.1,
                friction: 0.3,
            });
            var particle = new Particle();
            particle.radius = 0.1;
            addParticle(simulation, particle);
        }
    });

    enableOnlyTools(singleEnergySim.toolbar, ["select"]);
    selectTool(singleEnergySim.toolbar, "select");
</script>

<div class="stepLog twoColumn">
Here is a billiard ball. Try throwing it!

<script>
	cue(function () {
		var speed = v2.magnitude(singleEnergySim.particles[0].velocity);
        return (speed > 0.5);
	});
    endStep();
</script>

As you pick up and throw the ball, you give it speed, and in turn, energy. This kind of energy is called
_kinetic energy_, or _movement energy_. This plot shows how the energy changes over time:

<script>
	createTimeSeriesHere({
		range: 50,
		update: function() {
			var energy = getTotalEnergy(singleEnergySim);
			return {time: singleEnergySim.time, data: [energy]};
		},
	});
</script>

Throw the ball around some more and see what happens in the plot.

<script>
	var state = {throwCount: 0, hadHighSpeed: false};
	cue(function (dt) {
			var speed = v2.magnitude(singleEnergySim.particles[0].velocity);
			var hasHighSpeedNow = speed > 0.5;
			if (state.hadHighSpeed && (!hasHighSpeedNow))
			{
				state.throwCount += 1;
			}
			state.hadHighSpeed = hasHighSpeedNow;

			return (state.throwCount >= 3);
	});
    endStep();
</script>

When you release the ball it starts to lose energy because of the friction in the table and air, which looks like a little hill in the plot. 
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
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.3;

            var particleCount = 7;
            for (var i = 0; i < particleCount; i++) {
            	var particle = new Particle();
                particle.radius = 0.1;
            	billiardsPosition(particle.position, i, 2 * particle.radius);
            	addParticle(simulation, particle);
            }
        }
    });

    enableOnlyTools(totalEnergySim.toolbar, ["select"]);
    selectTool(totalEnergySim.toolbar, "select");
</script>
<div class="stepLog twoColumn">
I added some more balls in a conspicuous pattern. You know what to do!

<script>
	cue(function () {
			var speed = v2.magnitude(totalEnergySim.particles[0].velocity);
			return (speed > 0.5);
    });
    endStep();
</script>

As the balls collide, they bounce off each other, transferring energy from one to the other.

Below as a graph of the total energy, which is the energy for all particles combined. Note how the curve behaves very similarly to how it did with just one particle.

<script>
	// TODO: one color for each particle
	createTimeSeriesHere({
		range: 50,
		update: function() {
			var energy = getTotalEnergy(totalEnergySim);
			return {time: singleEnergySim.time, data: [energy]};
		},
	});
</script>

Give the group of particles some energy and look at what happens to the energy over time.

<script>
	cue(function (dt, state) {
			var energy = totalEnergySim.particles.reduce((acc, p) => acc + p.potentialEnergy + p.kineticEnergy, 0);
			return (energy > 1);
	});
</script>

Do the same with the lone particle above: give it a shove, and look at the energy graph.

<script>
	cue(function (dt, state) {
			var speed = v2.magnitude(singleEnergySim.particles[0].velocity);
			return (speed > 1);
	});
    endStep();
</script>

They look the same! Let's look at it a bit closer.



</div>
<div class="twoColumn">
<script>
	insertHere(totalEnergySim.div);
</script>
</div>
</div>

<div class="page">
<script>
    var energyAdditionSim = createSimulation({
        initialize: function(simulation) {

            copyObject(simulation.parameters, {
                radiusScaling: 0.1,
                friction: 0.3,
                dt: 0.001,
            });

            var particleCount = 7;
            for (var i = 0; i < particleCount; i++) {
            	var particle = new Particle();
                particle.radius = 0.1;
            	billiardsPosition(particle.position, i, 2*particle.radius);
            	var swatch = Color.niceSwatch;
            	particle.color = swatch[i % swatch.length];
            	addParticle(simulation, particle);
            }
        }
    });

    enableOnlyTools(energyAdditionSim.toolbar, ["select"]);
    selectTool(energyAdditionSim.toolbar, "select");
</script>
<div class="stepLog twoColumn">
To understand what happens to the energy as the particles collide, I have colored each particle in a unique color.

<script>
	// TODO: one color for each particle
	var timeLog = createTimeLog({range: 50});
	createGraphHere({
		update: function(graph) {
			var stackedEnergy = [0];
			var currentEnergy = 0;
			var sim = energyAdditionSim;
			for (var particleIndex = 0; particleIndex < sim.particles.length; particleIndex++) {
				var particle = sim.particles[particleIndex];
				currentEnergy += (particle.kineticEnergy + particle.potentialEnergy);
				stackedEnergy.push(currentEnergy);
			}
			addToLog(timeLog, sim.time, stackedEnergy);
			for (var particleIndex = 0; particleIndex < sim.particles.length; particleIndex++) {
				addArea(graph, {
                    x: timeLog.time,
                    yMin: timeLog.data[particleIndex],
                    yMax: timeLog.data[particleIndex + 1],
                    color: sim.particles[particleIndex].color,
                });
			}

		},
	});
</script>

Balls knocking each other around is actually a pretty good model of how the world works at the atomic level.
One big difference: _there is no friction_. Lower the friction of the system below and see what happens.


<script>
	insertHere(createSlider({
		object: energyAdditionSim.parameters,
		name: "friction",
		min: 0, max: 0.3,
		minLabel: "None", maxLabel: "Some",
	}));
	cue(function() {
			return (energyAdditionSim.parameters.friction == 0);
	});
    endStep();
</script>

The overall energy stays constant, but the amount of energy in each particle varies wildly.

</div>
<div class="twoColumn">
<script>
	insertHere(energyAdditionSim.div);
</script>
</div>
</div>


<script>
	initChapter();
</script>













## The rest



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
