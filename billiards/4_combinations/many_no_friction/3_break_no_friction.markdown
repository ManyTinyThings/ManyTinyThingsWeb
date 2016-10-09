---
title: Careful Breakage
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0;
            setBoxWidth(simulation, 90);

            initBilliards(simulation, simulation.boxBounds);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>

With **no friction**, it should be even easier to break the triangle than on ice.

Shoot the ball _very carefully_.

<script>
    var isAiming = false;
    cue(function() {
        if (sim.mouse.mode === MouseMode.impulse)
        {
            isAiming = true;
        }
        var didJustShoot = isAiming && (sim.mouse.mode === MouseMode.none);
        if (didJustShoot)
        {
            isAiming = false;
            var isEnergyLowEnough = (getTotalEnergy(sim) < 50);
            if (isEnergyLowEnough)
            {
                return true;
            }
            else
            {
                setResetReminder(sim, true);
                return false;
            }
        }
        // TODO: use least squares here
    });
    endStep();
</script>

The triangle _will_ break, and the particles _will_ spread out evenly.

You just need to have _patience_.

(_Psst!_ If you get bored, use this slider to speed up time.)

<script>
    createSliderHere({
        initialValue: sim.parameters.simulationTimePerSecond,
        min: sim.parameters.simulationTimePerSecond,
        max: 10 * sim.parameters.simulationTimePerSecond,
        minLabel: "Normal",
        maxLabel: "Fast",
        transform: function(x) { return Math.exp(x); },
        inverseTransform: function(x) { return Math.log(x); },
        update: function (value)
        {
            sim.parameters.simulationTimePerSecond = value;
        },
    });
</script>
