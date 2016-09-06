---
title: Friction
previous: /billiards/friction/stopping
next: /billiards/friction/frictionful_billiards
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;

            initBilliards(simulation, simulation.boxBounds);

    		setToolbarAvailableTools(simulation.toolbar, ["move"]);
        }
    });
</script>


The force that that causes the ball to slow down is called **friction**.

Some things have more friction than others: 

* if you roll the ball in **mud**, it will slow down very quickly,
* but if you slide it on **ice**, it can go very far before stopping.

Here is a slider that changes the friction of the billiards table to be more _mud-like_ (_more_ friction) or _ice-like_ (_less_ friction).

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

Change the friction with the slider and drag around the ball to get a feel for how friction works.
