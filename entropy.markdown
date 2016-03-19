---
title: Entropy
---

# Entropy

When playing billiards, it's easy to make a mess.

<script>
    createSimulation({
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
    createSimulation({ 
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
    var halfRegionSim = createSimulation({ 
        particleGenerator: uniformParticleGenerator,
        visualizations: ["countsHistogram"],
        parameters: {
            maxInitialSpeed: 0.01,
            particleCount: 20,
            bondEnergy: 0,
        },
    });

    setColdHotRegions(halfRegionSim);

</script>

It's quite hard, and they keep wanting to escape! Notice how, if you don't touch anything, they tend to spread out so that about half is on the left side and half on the right.

Don't agree? It's more obvious when there are more particles.

<script>
    var halfRegionMoreSim = createSimulation({ 
        particleGenerator: uniformParticleGenerator,
        visualizations: ["countsHistogram"],
        parameters: {
            maxInitialSpeed: 0.01,
            particleCount: 200,
            radiusScaling: 0.02,
            bondEnergy: 0,
        },
    });

    setColdHotRegions(halfRegionMoreSim);

</script>

"But you're cheating!", you might say, "you're starting with all particles evenly spread out!"

Okay, put them wherever you want (hold _c_ on the keyboard and use the mouse) and then give them a kick.

<script>
    var initialConfigSim = createSimulation({
        controls: ["resetButton"],
        particleGenerator: uniformParticleGenerator,
        visualizations: ["countsHistogram"],
        parameters: {
            maxInitialSpeed: 0,
            particleCount: 0,
            radiusScaling: 0.02,
            bondEnergy: 0,
        },
    });

    setColdHotRegions(initialConfigSim);

</script>

It can take a while for them to spread out. If you're impatient, try giving them a harder kick (or more kicks, if you prefer).

It works the same with more regions than just two.

<script>
    var fourRegionSim = createSimulation({
        controls: ["resetButton"],
        particleGenerator: uniformParticleGenerator,
        visualizations: ["countsHistogram"],
        parameters: {
            maxInitialSpeed: 0,
            particleCount: 0,
            radiusScaling: 0.02,
            bondEnergy: 0,
        },
    });

    fourRegionSim.measurementRegions = [];
    var regionCount = 4;
    var regionWidth = fourRegionSim.boxBounds.width / regionCount;
    var regionColors = [colors.blue, colors.green, colors.yellow, colors.red];
    for (var i = 0; i < regionCount; i++) {
        var region = createMeasurementRegion();
        var left = fourRegionSim.boxBounds.left + i * regionWidth;
        var right = left + regionWidth;
        setLeftTopRightBottom(region.bounds,
            left, fourRegionSim.boxBounds.top, right, fourRegionSim.boxBounds.bottom);
        region.color = regionColors[i];
        region.overlayColor = withAlpha(regionColors[i], 0.2);
        fourRegionSim.measurementRegions.push(region);
    }
</script>

It doesn't matter how ordered they start out. As soon as they start moving they inevitably spread out evenly.
How come the particles like to spread out, but not come back together? To understand, we need to talk about randomness.

## Randomness

When there are just a few particles, our "billiards sense" tells us roughly how the particles will bounce off each other. We can predict what will happen a few moments from now.

<script>
    var simpleSim = createSimulation({
        controls: ["resetButton"],
        particleGenerator: uniformParticleGenerator,
        parameters: {
            maxInitialSpeed: 0.0,
            particleCount: 3,
            radiusScaling: 0.1,
            bondEnergy: 0,
        },
    });
</script>

Nothing random about it.

However, if we add more particles, it becomes much harder to predict what will happen.

<script>
    var moreParticlesSim = createSimulation({
        controls: ["resetButton"],
        particleGenerator: uniformParticleGenerator,
        parameters: {
            maxInitialSpeed: 0.0,
            particleCount: 20,
            radiusScaling: 0.1,
            bondEnergy: 0,
        },
    });
</script>

While this simulation follows the exact same rules as the previous one, it's much harder to make predictions, which makes it look random. Let me show you. 

<div class="two_column">
Add particles randomly by dragging the slider. As you do, the particles appear randomly, and are equally likely to appear in any free space in the box.
</div>

<div class="two_column">
Kickstart this simulation and run it for a while, then pause.
</div>


<div class="two_column">
<script>
    var randomSim = createSimulation({
        controls: ["resetButton", "particleCount"],
        particleGenerator: uniformParticleGenerator,
        parameters: {
            maxInitialSpeed: 0.0,
            particleCount: 0,
            radiusScaling: 0.03,
            bondEnergy: 0,
        },
    });
</script>
</div>

<div class="two_column">
<script>
    function gridGenerator(simulation, particleIndex)
    {
        var particle = new Particle();
        particle.position = rectangularLatticePosition(simulation, particleIndex);
        particle.velocity = uniformVelocity(simulation, particleIndex);
        return particle;
    }

    var frozenSim = createSimulation({
        controls: ["playPauseButton", "resetButton"],
        particleGenerator: gridGenerator,
        parameters: {
            maxInitialSpeed: 0,
            particleCount: 225,
            radiusScaling: 0.03,
            bondEnergy: 0,
        },
    });
</script>
</div>

The two frozen systems are generated in very different ways, yet if you didn't know it, you wouldn't be able to tell which one is which. This brings us to a very useful conclusion:

_After waiting for a certain period of time, the system is practically random._

This means that we can analyse the spreading behavior we observed above by forgetting about the movement of the particles and just think of them as randomly placed.

Now, let's return to the getting all the particles in one half of the box.

<script>
    function halfGenerator(simulation, particleIndex)
    {
        var particle = new Particle();
        do {
            particle.position = randomPointInRect(simulation.leftRect);    
        } 
        while (isColliding(simulation, particle))

        particle.velocity = uniformVelocity(simulation, particleIndex);
        return particle;
    }

    var halfBox = createSimulation({ 
        particleGenerator: halfGenerator,
        controls: ["playPauseButton", "resetButton"],
        visualizations: ["countsHistogram"],
        parameters: {
            maxInitialSpeed: 0.01,
            particleCount: 20,
            bondEnergy: 0,
        },
    });

    setColdHotRegions(halfBox);

    halfBox.pausedByUser = true;
</script>

What's the probability that the particles would spontaneously end up in one half after a while?

Let's add one at a time. Each time we add a particle, the probability is 50% that it will end up in the left half. Probabilities multiply, so the total probability will be a half of a half of a half ... etc.

<script>
    var probabilitySim = createSimulation({
        controls: ["resetButton", "addRandomParticleButton"],
        visualizations: ["probability"],
        particleGenerator: halfGenerator,
        parameters: {
            maxInitialSpeed: 0.0,
            particleCount: 0,
            bondEnergy: 0,
        },
        customUpdate: function(simulation) {
            var output = document.getElementById("probability");
            var p = arrayLast(simulation.probability);
            output.value = (p * 100).toPrecision(3) + "%";
        },
    });

    setColdHotRegions(probabilitySim);
</script>

Total probability: <output id="probability"></output>

It's _very_ unlikely that all of them would end up in that half.

What's most probable? You guessed it: that they end up 


## Important sentences

_Entropy is a measure of how evenly spread out something is._

_Entropy always increases, because it's more probable that things are spread out than not._

## Todo

* Show how velocities will also spread out
* Explain thru probabilities
* Run simulation super fast to show where balls will end up after long time?