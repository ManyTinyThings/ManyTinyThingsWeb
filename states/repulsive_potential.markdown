---
title: Repulsive potential
previous: /states/fast_collision
next: /states/attractive_potential
---

<script src="states.js"></script>

<div id="chapter">

To better understand the attraction, let's first look at two _non-attracting_ particles.

I have put the particles on a narrow track, so they can only move back and forth (and not around each other). Imagine the camera rotating with the particles so that they are always on a horizontal line.

<div class="page">

<div class="stepLog twoColumn">
<script>
    var repulsivePotentialSim = createSimulation({
        pixelWidth: 400,
        pixelHeight: 80,
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.1;
            
            initOneDimSim(simulation);

            var interaction = new RepulsiveInteraction();
            interaction.strength = 0.1 ;
            setInteraction(simulation, 0, 0, interaction);

            setToolbarAvailableTools(simulation.toolbar, ["move"]);
        }
    });
</script>


Try moving the <span class="blue">**blue**</span> particle on the left.

<script>
    cue(function () {
        var sim = repulsivePotentialSim;
        return (sim.mouse.activeParticle === sim.particles[0]);
    });
    endStep();
</script>

I've glued the <span class="blue">**blue**</span> particle to the wall so that only the <span class="red">**red**</span> one can move. Imagine the camera following the <span class="blue">**blue**</span> particle, always keeping it on the same place on the screen.

Below the particles I have added the **potential** for the interaction between the two particles. Think of it as an "interaction landscape", where the <span class="red">**red**</span> particle can be thought of as a ball rolling in the landscape.

Drag the right particle towards the left one and see what happens to the ball in the potential.

<script>
    cue(function () {
        var sim = repulsivePotentialSim;
        var distance = v2.distance(sim.particles[0].position, sim.particles[1].position);
        return (distance < 2);
    });
    endStep();
</script>

The ball in the potential landscape rolls up the hill, and then rolls back down again – it bounces off the other one!

</div>

<div class="twoColumn">
<script>
    insertHere(repulsivePotentialSim.div);

    var repulsivePotential = function(x) { 
        return (x < 1) ? (lennardJonesEnergy(x) - lennardJonesEnergy(1)) / 100 : 0;
    }
    var repulsiveGraph = createPotentialPlotHere(repulsivePotential, repulsivePotentialSim);
    setGraphLimits(repulsiveGraph, { yMax: 50});
</script>
</div>
</div>

</div>