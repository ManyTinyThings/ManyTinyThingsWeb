---
chapterTitle: Particle Attraction
title: Particles in Love
previous: /billiards/kickoff
next: /billiards/interaction/high_speed_love
---

<script src="shared.js"></script>
<script>

    var interactionSim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.1;

            addOppositeParticles(simulation);

            var ljInteraction = new LennardJonesInteraction();
            ljInteraction.strength = 10;
            setInteraction(simulation, 0, 0, ljInteraction);


            setToolbarAvailableTools(simulation.toolbar, ["move"]);
        }
    });

</script>

<div id="chapter">

<div class="page">
<div class="stepLog twoColumn">
Move these particles closer to each other.

<script>
    cue(function () {
        var distance = v2.distance(interactionSim.particles[0].position, interactionSim.particles[1].position);
        return (distance < 3);   
    });
    endStep();
</script>

They seem to like each other! As they come closer, they attract and snap together.

Can you get them to let go?

<script>
    cue(function () {
        var distance = v2.distance(interactionSim.particles[0].position, interactionSim.particles[1].position);
        return (distance > 6);
    });
    endStep();
</script>

It takes some effort!

There's a _force_ binding the particles together. You can think of this force as _love_: it's something that can't be explained, it's just there, binding things together.

</div>

<div class="twoColumn">
<script>
    insertHere(interactionSim.div);
    /*
    insertHere(createOutput({
        label: "distance: ",
        update: function () {
            var distance = v2.distance(interactionSim.particles[0].position, interactionSim.particles[1].position);
            return distance.toFixed(2);
        }
    }));
    insertHere(createOutput({
        label: "average speed: ",
        update: function () {
            var speed = ensembleSpeed(interactionSim.particles);
            return speed.toFixed(2);
        }
    }));
    */
    // createTimeSeriesHere({
    //     timeRange: 20,
    //     update: function() {
    //         var sim = interactionSim;
    //         var energy = getTotalEnergy(sim);
    //         return {time: sim.time, data: [energy]};
    //     },
    // });
</script>
</div>
</div>

</div>
