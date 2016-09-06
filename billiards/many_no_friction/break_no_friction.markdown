---
title: Many particles, no friction
previous: break_variable_friction
next: soft_hard
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

With no friction, it doesn't matter how carefully you shoot, the triangle will always break, eventually.

Break the triangle.

<script>
    cue(isBilliardsTriangleSplit(sim));
    endStep();
</script>

Reset and try softer or harder shots.

Notice how it takes longer for the particles to spread out with a slow shot, and faster with a hard shot.

They also move slower/faster collectively.
