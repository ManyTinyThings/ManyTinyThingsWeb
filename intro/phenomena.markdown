---
title: Phenomena
previous: /
layout: default
---

Many familiar physical phenomena can be explained by looking through the _many-tiny-things_ lens. Here are the ones we'll be focusing on here, with some related questions to give you a feel for what each concept is about.

* **Solid, liquid, gas**
    * why does heating up water make it become gas?
    * why does freezing water make it solid ice?
    * why does water left in a glass disappear over time?

* **Heat**
    * why is it easier to wash dishes in hot water?
    * why does metal feel colder than wood?
    * why does a metal frying pan handle get hot much quicker than a plastic one?
    
* **Pressure**
    * how does a vacuum cleaner work?
    * why does balloons shrink when cold?
    * why is it harder to breathe when you're on a mountain?
    
* **Friction**
    * why does a bouncy ball eventually stop bouncing?
    * when you rub your hands together, why do they get warm?
    * (how does a tiny particle move around?)
* **Entropy**
    * how come the temperature is usually the same in an entire room?
    * why can we mix paint but not unmix it?


<div class="flex">

<div class="threeColumn">
**Heat** is the _many tiny things_ jiggling randomly

<script>
    var heatSim = createSimulationHere({
    	pixelWidth: 250,
    	pixelHeight: 250,
        initialize: function(simulation) {

            var p = simulation.parameters;
            setBoxWidth(simulation, 20);
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
            setBoxWidth(simulation, 100);
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
