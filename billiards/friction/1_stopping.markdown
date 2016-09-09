---
sequenceTitle: Never stop
title: Stopping
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
