---
title: Breaking the triangle
previous: break_friction
next: break_no_friction
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

With more friction (_mud_), it becomes harder to break the triangle.

With less friction (_ice_), it gets easier.

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

