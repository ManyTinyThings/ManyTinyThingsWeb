---
title: Frictionful Billiards
previous: /billiards/friction/friction
next: /billiards/friction/no_friction
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;
            p.boxWidth = 30;

            initBilliards(simulation, 16);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>


<div id="chapter">

<div class="page">
<div class="stepLog twoColumn">
Let's invent a new game: _Billiards on ice or mud!_

<script>
createSliderHere({
    object: sim.parameters,
    name: "friction",
    min: 0.04, max: 5,
    minLabel: "Ice", maxLabel: "Mud",
    transform: x => Math.exp(x),
    inverseTransform: x => Math.log(x),
});
</script>

Which one is the most fun?

</div>

<div class="twoColumn">
<script>
	insertHere(sim.div);
</script>
</div>
</div>
</div>