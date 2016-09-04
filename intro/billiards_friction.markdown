---
chapterTitle: Introduction
title: Friction
previous: /intro/billiards
next: /intro/billiards_no_friction
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
The force that that causes the ball to slow down is called **friction**.

Some things have more friction than others: 

* if you roll the ball in **mud**, it will slow down very quickly,
* but if you slide it on **ice**, it can go very far before stopping.

Here is a slider that changes the friction of the billiards table to be more _mud-like_ (_more_ friction) or _ice-like_ (_less_ friction).

<script>
createSliderHere({
    object: sim.parameters,
    name: "friction",
    min: 0.04, max: 2,
    minLabel: "Ice", maxLabel: "Mud",
    transform: x => Math.exp(x),
    inverseTransform: x => Math.log(x),
});
</script>

Change the friction with the slider and drag around the ball to get a feel for how friction works.

</div>

<div class="twoColumn">
<script>
	insertHere(sim.div);
</script>
</div>
</div>
</div>