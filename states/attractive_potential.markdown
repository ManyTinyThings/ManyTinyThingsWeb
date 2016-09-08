---
title: Attractive potentia
---

<script src="states.js"></script>

<div id="chapter">

<div class="page">
<div class="stepLog twoColumn">
<script>
    var lennardJonesPotentialSim = createSimulation({
        pixelWidth: 400,
        pixelHeight: 80,
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;
            p.dragStrength = 1;
            
            initOneDimSim(simulation);

            var interaction = new LennardJonesInteraction();
            interaction.strength = 2;
            setInteraction(simulation, 0, 0, interaction);

            setToolbarAvailableTools(simulation.toolbar, ["move"]);
        }
    });
</script>

Things get more interesting when the particles attract each other. The potential still has a steep hill that prevents the particles from overlapping too much, but there is now also a valley.

Drag the <span class="red">**red**</span> particle toward the <span class="blue">**blue**</span>.

<script>
    cue(function () {
        var sim = lennardJonesPotentialSim;
        var distance = v2.distance(sim.particles[0].position, sim.particles[1].position);
        return (distance < 2);
    });
    endStep();
</script>

If you give the particle a lot of speed it will roll into the valley, up the other side, turn around and go back out. With less speed, the particle will roll back and forth in the valley before settling at the bottom.

The back-and-forth rolling is why the particles vibrate a bit when they snap together. Without friction, they will keep vibrating forever.

<script>
    createSliderHere({
        object: lennardJonesPotentialSim.parameters,
        name: "friction",
        min: 0, max: lennardJonesPotentialSim.parameters.friction,
        minLabel: "No friction", maxLabel: "Some",
    });
</script>
</div>


<div class="twoColumn">
<script>
    insertHere(lennardJonesPotentialSim.div);
    var lennardJonesGraph = createPotentialPlotHere(lennardJonesEnergy, lennardJonesPotentialSim);
    setGraphLimits(lennardJonesGraph, { yMax: 2 });

        // createTimeSeriesHere({
        //     timeRange: 10,
        //     update: function() {
        //         var sim = lennardJonesPotentialSim;
        //         var energy = getTotalEnergy(sim);
        //         return {time: sim.time, data: [energy]};
        //     },
        // });
</script>
</div>
</div>

</div>