---
title: Differences
---

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


Remember the **many tiny things** I was talking about earlier?


The tiny things are sort of like _tiny billiard balls_.
They _move_ like billiard balls, and _bounce_ like billiard balls.

There are three big differences, though:

1. [They **never stop** moving](/billiards/friction/stopping).
2. [There are **a lot more than 16** of them](/billiards/many/single_particle).
3. [They can **like** or **dislike** each other](/billiards/interaction/love).

Click the items in the list above to explore them.
