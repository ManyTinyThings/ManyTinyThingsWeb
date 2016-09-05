---
title: Sticky Billiards
previous: /billiards/interaction/group_hug
next: /billiards/differences
---

<script src="shared.js"></script>
<script>

    var interactionSim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;
            p.boxWidth = 30;

            initBilliards(simulation, 16);

            p.isOnlyHardSpheres = false;

            var ljInteraction = new LennardJonesInteraction();
            ljInteraction.strength = 3;
            setInteraction(simulation, 0, 0, ljInteraction);

            // TODO: maybe have the red particle not stick to the others

            setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>

<div id="chapter">

<div class="page">

<div class="stepLog twoColumn">

Back to billiards!

Split the triangle.

<script>
    cue(isBilliardsTriangleSplit(interactionSim));
    endStep();
</script>

It's harder when they are sticking together, but with enough speed it's possible.

</div>

<div class="twoColumn">
<script>
    insertHere(interactionSim.div);
</script>
</div>
</div>

</div>