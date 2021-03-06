---
title: Friction
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;
            p.isOnlyHardSpheres = true;

            var particle = new Particle();
            particle.color = Color.red;
            addParticle(simulation, particle);

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
createIceMudSliderHere();
</script>

Change the friction with the slider and drag around the ball to get a feel for how friction works.
