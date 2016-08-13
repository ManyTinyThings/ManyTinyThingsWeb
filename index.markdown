---

---

Every big thing in the world is made up of **many tiny things**.


<div class="flex">

<div class="threeColumn">
**Air** is _many tiny things_ bouncing around everywhere

<script>
	var airSim = createSimulationHere({
		pixelWidth: 250,
		pixelHeight: 250,
		initialize: function(simulation)
		{
			var p = simulation.parameters;
			p.boxWidth = 200;
			p.isOnlyHardSpheres = true;
			p.gravityAcceleration = 1;

			updateBounds(simulation);

			var particleCount = 200;
			var initialSpeed = 10;
			for (var i = 0; i < particleCount; i++) {
				var particle = new Particle();
				particle.position = randomPointInRect(simulation.boxBounds);
				v2.set(particle.velocity, randomGaussian(), randomGaussian());
				v2.scale(particle.velocity, particle.velocity, 10);
				addParticle(simulation, particle);
			}
		}
	});

	enableOnlyTools(airSim.toolbar, ["repel"]);
</script>
</div>

<div class="threeColumn">
**Water** is _many tiny things_ sloshing around

<script>
	var waterSim = createSimulationHere({
		pixelWidth: 250,
		pixelHeight: 250,
		initialize: function(simulation)
		{
			var p = simulation.parameters;
			p.boxWidth = 60;
			p.gravityAcceleration = 1;
			p.thermostatSpeed = 0.1;
			p.thermostatTemperature = 1;
			p.repelStrength = 0.2;
			p.isOnlyHardSpheres = true;

			updateBounds(simulation);

			var particleCount = 300;
			var particles = [];
			for (var i = 0; i < particleCount; i++) {
				var particle = new Particle();
				particle.position = randomPointInRect(simulation.boxBounds);
				particles.push(particle);
			}
			addParticlesRandomly(simulation, particles);

			var ljInteraction = new LennardJonesInteraction();

			setInteraction(simulation, 0, 0, ljInteraction);
		}
	});

	enableOnlyTools(waterSim.toolbar, ["repel"]);
</script>
</div>

<div class="threeColumn">

**Normal-sized things** are _many tiny things_ stuck together

<script>
	var solidSim = createSimulationHere({
		pixelWidth: 250,
		pixelHeight: 250,
		initialize: function(simulation)
		{
			var p = simulation.parameters;
			p.boxWidth = 40;
			p.gravityAcceleration = 1;
			p.dragStrength = 10;
			p.friction = 0.1;

			updateBounds(simulation);

			var particleCount = 2 * 37;
			var latticeSpacing = 2;
			var redBallMiddle = v2(0, 10);
			var blackBallMiddle = v2(-5, -10);
			for (var i = 0; i < particleCount; i++) {
				var halfIndex = Math.floor(i / 2);
				var particle = new Particle();
				particle.type = i % 2;
				if (particle.type == 0)
				{
					hexagonalLatticePosition(particle.position, halfIndex, latticeSpacing);
					v2.add(particle.position, particle.position, blackBallMiddle);
				}
				else
				{
					particle.color = Color.red;
					hexagonalLatticePosition(particle.position, halfIndex, latticeSpacing);
					v2.add(particle.position, particle.position, redBallMiddle);
				}
				
				addParticle(simulation, particle);
			}

			var ljInteraction = new LennardJonesInteraction();
			ljInteraction.strength = 200;
			setInteraction(simulation, 0, 0, ljInteraction);
			setInteraction(simulation, 1, 1, ljInteraction);
		}
	});

	enableOnlyTools(solidSim.toolbar, ["select"]);
</script>
	
</div>

</div>

But we can't see the tiny things without a microscope. They are too small, _microscopic_. We can only see the _macroscopic_ objects the tiny things make up. (And in the case of air, we can't see it at all!)

This website is a _series of explanations_ on how the tiny, microscopic things are connected to the big, macroscopic things that we _can_ see, hear and feel. We will ask the question: What are the _macroscopic_ consequences of being made up of many _microscopic_ things?

<div class="flex">

<div class="threeColumn">
**Heat** is the _many tiny things_ jiggling randomly

<script>
    var heatSim = createSimulationHere({
    	pixelWidth: 250,
    	pixelHeight: 250,
        initialize: function(simulation) {

            var p = simulation.parameters;
            p.boxWidth = 20;
            p.boxHeight = 20
            p.isPeriodic = true;

            p.thermostatSpeed = 0.1;
            p.thermostatTemperature = 0.5;

            updateBounds(simulation);

            simulation.walls = [];
            
            var x = v2.alloc();
            var y = v2.alloc();
            var origin = v2.alloc();

            v2.set(origin, -p.boxWidth / 2 + 1, - p.boxHeight / 2 + 1);

            var latticeSpacing = 2;
            var lilExtra = 1.05;
            v2.setPolar(x, latticeSpacing, 0);
            v2.setPolar(y, lilExtra * latticeSpacing, tau / 6);

            var colCount = 10;
            var rowCount = 11;
            var particleCount = colCount * rowCount;

            for (var row = 0; row < rowCount; row++) {
                for (var col = 0; col < colCount; col++) {
                    var particle = new Particle();
                    v2.copy(particle.position, origin);
                    v2.scaleAndAdd(particle.position, particle.position, x, col);
                    v2.scaleAndAdd(particle.position, particle.position, y, row);
                    addParticle(simulation, particle);
                }
            }

            v2.free(origin);
            v2.free(x);
            v2.free(y);

            var interaction = new LennardJonesInteraction();
            interaction.strength = 5;
            setInteraction(simulation, 0, 0, interaction);


        }
    });
    insertHere(createButton({
        label: "Reset",
        action: function() { resetSimulation(sim) },
    }));
</script>
</div>

<div class="threeColumn">
**Pressure** is _many tiny things_ bouncing on a surface

<script>
    var pressureSim = createSimulationHere({
    	pixelWidth: 250,
    	pixelHeight: 250,
        initialize: function(simulation) {

            var p = simulation.parameters;
            p.boxWidth = 100;
            p.onlyHardSpheres = true;

            updateBounds(simulation);
            
            var particleCount = 300;

            var particles = [];

            for (var particleIndex = 0; particleIndex < particleCount; particleIndex++) {
                var particle = new Particle();
                particle.position = randomPointInRect(simulation.boxBounds);
                particles.push(particle);
            }

            addParticlesRandomly(simulation, particles);

            var interaction = new LennardJonesInteraction();
            interaction.strength = 5;
            setInteraction(simulation, 0, 0, interaction);
        }
    });
    pressureSim.pausedByUser = true;
</script>
</div>

</div>

The explanations are _interactive_, which means you can poke at them and they will react!

<div class="page flex">

<script>
    var introSim = createSimulation({
        initialize: function(simulation) {
			var p = simulation.parameters;
			p.friction = 0.1;
			p.gravityAcceleration = 1;
			p.dragStrength = 2;

			var particle = new Particle();
			v2.set(particle.position, 0, particle.radius - simulation.boxBounds.height / 2);
			addParticle(simulation, particle);
        },
    });
</script>

<div class="stepLog twoColumn">
To the right is a ball.

Pick up the ball and throw it!

<script>
	cue(function() {
		var energy = getTotalEnergy(introSim);
		return (energy > 1);
	});
	endStep();
</script>

Well done!

We will explore a fair number of fairly abstract concepts, and to help understand them there will be visualisations accompanying the models.
Here's an example:

Try figuring out what this graph shows by throwing around the ball a bit.

<script>
	createTimeSeriesHere({
		timeRange: 50,
		yMax: introSim.boxBounds.height,
		update: function(graph) {
			var height = introSim.particles[0].position[1] + introSim.boxBounds.height / 2;
			return {time: introSim.time, data: [height]};
		},
	})
</script>

The speed of the ball over time.

The shape of the ball at different heights.

The height of the ball over time.
</div>

<div class="twoColumn">
<script>
	insertHere(introSim.div);
</script>
</div>
</div>

<script>
	initChapter();
</script>





## What do you want to learn more about?

{% for page in site.pages %}
    {% if page.isStartPage %}
* [{{ page.title | escape }}]({{ page.url | prepend: site.baseurl }})
    {% endif %}
{% endfor %}
