---
title: Combining
previous: /billiards/differences
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0;

            initBilliards(simulation, 1);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>

What have we learned?

Everything is made up of **tiny particles** that behave kind of like billiards balls, except:

* The particles **never stop moving**, because they have **no friction**.
* There are **incredible many** tiny particles, which means they tend to **spread out everywhere**.
* The particles can **attract each other**, so they can make up **bigger things**.

We have looked at these three properties separately.

Let's now put them together and see what happens!

* [Attraction & many particles](/billiards/attraction_many/TODO)
* [Many particles & no friction](/billiards/many_no_friction/break_friction)
* [No friction & attraction](/billiards/attraction_no_friction/TODO)
