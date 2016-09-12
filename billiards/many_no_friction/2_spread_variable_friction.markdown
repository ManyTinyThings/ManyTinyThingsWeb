---
title: The Return of Ice/Mud Billiards
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0;
            setBoxWidth(simulation, 90);

            initBilliards(simulation, simulation.boxBounds);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>

Does friction make it easier or harder to spread out the particles?

<script>
    createIceMudSliderHere();
</script>

