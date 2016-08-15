---
title: Repulsive potential
---

<script src="potential.js"></script>

<div id="chapter">

To better understand the interaction, let's first simplify the situation. 

I have put the particles on a narrow track, so they can only move back and forth (and not around each other). Imagine the camera rotating with the particles so that they are always on a horizontal line.

Then I glue the left particle to the wall so that only the right one can move. Imagine the camera following the left particle, always keeping it on the same place on the screen.

<div class="page">

<div class="stepLog twoColumn">
<script>
    var repulsivePotentialSim = createSimulation({
        pixelWidth: 400,
        pixelHeight: 80,
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.1;
            p.simulationTimePerSecond = 1;
            p.boxHeight = 2;

            updateBounds(simulation);

            for (var i = 0; i < 2; i++) {
                addParticle(simulation, simulation.particleGenerator());
            }

            var d = simulation.boxBounds.width/2 - 1;
            v2.set(simulation.particles[0].position, -d, 0);
            simulation.particles[0].mass = Infinity;
            v2.set(simulation.particles[1].position, d, 0);

            var interaction = new RepulsiveInteraction();
            interaction.strength = 1;
            setInteraction(simulation, 0, 0, interaction);
        }
    });
</script>


Try dragging the left particle.

<script>
    cue(function () {
        var isDragging = (repulsivePotentialSim.mouse.draggedParticle === repulsivePotentialSim.particles[0]);
        return isDragging;
    });
    endStep();
</script>

It won't budge.

Below the particles I have added the **potential** for the interaction between the two particles. Think of it as an "interaction landscape", where the right particle can be thought of as a ball rolling in the landscape.

Drag the right particle towards the left one and see what happens to the ball in the potential.

<script>
    cue(function () {
        var sim = repulsivePotentialSim;
        var distance = v2.distance(sim.particles[0].position, sim.particles[1].position);
        return (distance < 2);
    });
    endStep();
</script>

As the particles bounce off each other, the ball in the landscape rolls up the hill, and then rolls back down again.

[Next page](attractive_potential)

</div>

<div class="twoColumn">
<script>
    insertHere(repulsivePotentialSim.div);

    var repulsivePotential = function(x) { 
        return (x < 1) ? (lennardJonesEnergy(x) - lennardJonesEnergy(1)) : 0;
    }
    var repulsiveGraph = createPotentialPlotHere(repulsivePotential, repulsivePotentialSim);
    setGraphLimits(repulsiveGraph, { yMax: 50});
</script>
</div>
</div>

</div>