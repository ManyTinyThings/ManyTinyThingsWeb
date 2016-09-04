---
title: Differences
previous: /billiards/break_shot
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;

            initBilliards(simulation, 7);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>


<div id="chapter">

<div class="page">
<div class="stepLog twoColumn">

Remember the _many tiny things_ i was talking about earlier?
The _tiny things_ are sort of like _tiny billiard balls_.
They move like billiard balls, and bounce like billiard balls.

There are three big differences, though:

1. [They **never stop** moving](/billiards/friction/stopping).
2. [There are **a lot more than seven** of them](/billiards/many/single_particle).
3. [They can **like** or **dislike** each other](/billiards/interaction/love).

Click the items in the list above to explore them.

</div>

<div class="twoColumn">
<script>
	insertHere(sim.div);
</script>
</div>
</div>
</div>