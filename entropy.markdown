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

It doesn't matter how ordered they start out. As soon as they start moving they inevitably spread out evenly. What is going on? 

How come the particles like to spread out, but not come back together? Let's try to understand.

<script>
    var entropySim = createSimulation({
        controls: ["resetButton"],
        particleGenerator: uniformParticleGenerator,
        visualizations: ["entropy", "countsHistogram"],
        parameters: {
            maxInitialSpeed: 0.01,
            particleCount: 0,
            radiusScaling: 0.02,
            bondEnergy: 0,
        },
    });

    setColdHotRegions(entropySim);

</script>

## Important sentences

_Entropy is a measure of how evenly spread out something is._

_Entropy always increases, because it's more probable that things are spread out than not._

## Todo

* Show how velocities will also spread out
* Explain thru probabilities