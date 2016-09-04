---
title: Stopping
previous: /billiards/break_shot
next: /billiards/friction/friction
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;

            initBilliards(simulation, 1);

    		setToolbarAvailableTools(simulation.toolbar, ["move"]);
        }
    });
</script>


<div id="chapter">

<div class="page">
<div class="stepLog twoColumn">
Normally, if you stop pushing or pulling something, it will eventually stop moving.

Drag around the ball a bit and then look at what happens when you let go.

<script>
    var isDragging = false
	cue(function () {
        if (sim.mouse.mode === MouseMode.move)
        {
            isDragging = true;
        }

        var didJustLetGo = isDragging && (sim.mouse.mode === MouseMode.none);
        return didJustLetGo;
    });
	endStep();
</script>

When you let go, the ball starts slowing down and eventually stops.

</div>

<div class="twoColumn">
<script>
	insertHere(sim.div);
</script>
</div>
</div>
</div>