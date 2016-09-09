---
title: Frictionful Billiards
---

<script src="shared.js"></script>
<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;

            initBilliards(simulation, simulation.boxBounds);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>


Let's invent a new game: _Billiards on ice or mud!_

<script>
createIceMudSliderHere();
</script>

Which one is the most fun?
