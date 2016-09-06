---
title: Frictionful Billiards
previous: /billiards/friction/friction
next: /billiards/friction/no_friction
---

<script src="shared.js"></script>
<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;
            setBoxWidth(simulation, 30);

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
