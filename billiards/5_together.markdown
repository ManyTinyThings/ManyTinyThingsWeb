---
sequenceTitle: Many Attracting that Never Stop
title: Group Hug
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.4;

            var particle = new Particle();
            addParticle(simulation, particle);

            var ljInteraction = new LennardJonesInteraction();
            ljInteraction.strength = 10;
            setInteraction(simulation, 0, 0, ljInteraction);

            setToolbarAvailableTools(simulation.toolbar, ["move", "create"]);
        }
    });
</script>

Let's now put it _all_ together!

We start with a single particle that you can **move around**.

<script>
    cue(function () {
        var energy = getTotalEnergy(sim);
        return (energy > 1);   
    });
    endStep();
</script>

We add **many more particles** (with the **create** tool).

<script>
    cue(function () {
        return (sim.particles.length >= requiredCount);  
    });
    var requiredCount = 30;
    insertHere(createOutput(function() {
        return `${sim.particles.length} / ${requiredCount} particles`;
    }));
    endStep();
</script>

They **attract each other** and form a bigger object.

Now **turn off the friction**.

<script>
    cue(function () {
        return (sim.parameters.friction <= 0);   
    });

    createSliderHere({
        initialValue: sim.parameters.friction,
        min: 0, max: sim.parameters.friction,
        minLabel: "No friction", maxLabel: "Some",
        update: function(value)
        {
            sim.parameters.friction = value;
        },
    });

    endStep();
</script>

Gently bump the object into a wall.

<script>
    cue(function () {
        var pressure = getTotalPressure(sim);
        return (pressure > 1);   
    });
    // insertHere(createOutput(function() {
    //     var pressure = getTotalPressure(sim);
    //     return `pressure: ${pressure.toFixed(2)}`;
    // }));
    endStep();
</script>

As the object bumps into the wall, the particles start **vibrating**.

What happens if you keep bumping it into walls?
