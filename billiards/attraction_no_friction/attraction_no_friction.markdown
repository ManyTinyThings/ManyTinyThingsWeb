---
title: Frictionless attraction
previous: /billiards/combined/many_no_friction
next: /billiards/FILL_ME_IN
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

Before you break the triangle: What do you think will happen?

Break the triangle.

<script>
    cue(isBilliardsTriangleSplit(sim));
    endStep();
</script>

The particles never stop moving, as expected.

Because they never stop moving, we don't need to give them a kick several times for them to spread out.

No matter how softly you shoot, they will eventually spread out evenly. (Try it!)