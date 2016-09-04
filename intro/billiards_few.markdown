---
chapterTitle: Introduction
title: Tiny Billiards
previous: /intro/billiards
next: /intro/billiards_friction
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
I added some more balls!

You know what to do.

<script>
	cue(isBilliardsTriangleSplit(sim));
	endStep();
</script>

Nice split!

_Wait, why are we playing billiards?_

Remember the _many tiny things_ i was talking about earlier?
The _tiny things_ are sort of like _tiny billiard balls_.
They move like billiard balls, and bounce like billiard balls.

There are three big differences, though:

1. They **never stop** moving.
2. There are **a lot more than seven** of them.
3. They can **like** or **dislike** each other.

Let's see what that's like!

</div>

<div class="twoColumn">
<script>
	insertHere(sim.div);
</script>
</div>
</div>
</div>