---
title: Spreading Out
previous: /billiards/many/tons_of_particles
next: /billiards/differences
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.2;
            p.boxWidth = 100;

            // TODO: just a triangle, no need for billiards

            initBilliards(simulation, 301);

            setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>


Okay, let's go with an amount that the simulation can handle.

Do a few shots.

<script>
    var shotCount = 0;
    var requiredShotCount = 3;
    insertHere(createOutput(function() {
        return `${shotCount} / ${requiredShotCount} shots`; 
    }));
    var impendingShot = false;
    cue(function(){
        if (sim.mouse.mode === MouseMode.impulse)
        {
            impendingShot = true;
        }

        var didJustShoot = impendingShot && (sim.mouse.mode === MouseMode.none);
        if (didJustShoot)
        {
            impendingShot = false;
            shotCount += 1;
        }
        return (shotCount >= requiredShotCount);
    });
    endStep();
</script>

Notice how the particles get more and more spread out for each shot you make.