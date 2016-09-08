---
chapterTitle: Attraction & No Friction
title: Frictionless attraction
previous: ../combining
next: low_speed
---

<script>

    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.1;

            addOppositeParticles(simulation);

            var ljInteraction = new LennardJonesInteraction();
            ljInteraction.strength = 10;
            setInteraction(simulation, 0, 0, ljInteraction);


            setToolbarAvailableTools(simulation.toolbar, ["move", "create"]);
        }
    });

</script>

Move these particles closer to each other.

<script>
    cue(function () {
        // TODO: timer here
        var distance = v2.distance(sim.particles[0].position, sim.particles[1].position);
        return (distance < 3);   
    });
    endStep();
</script>

They still like each other!

But what if the friction is removed?

<script>
    createSliderHere({
        object: sim.parameters,
        name: "friction",
        min: 0, max: 0.2,
        minLabel: "No friction", maxLabel: "Some",
    }); 
</script>

They keep vibrating together forever.
