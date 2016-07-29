---
title: Pressure
---

<div class="page">
<script>
    var wallDetectorSim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.1;
            p.dragStrength = 2;

            var particle = new Particle();
            addParticle(simulation, particle);
        },
    });
</script>

<div class="stepLog twoColumn">

I've installed force measurement devices in the walls here. They detect whenever a particle bounces off the wall, and how hard.

<script>

    createTimeSeriesHere({
        timeRange: 50,
        yMax: 10,
        update: function(graph) {
            return {time: wallDetectorSim.time, data: [getTotalPressure(wallDetectorSim)]};
        },
    });
</script>

Carefully throw the ball at a wall.

<script>
    cue(function() {
        var pressure = getTotalPressure(wallDetectorSim);
        return ((0.1 < pressure) && (pressure < 2));
    });
</script>

Throw the ball with a lot of force.

<script>
    cue(function() {
        var pressure = getTotalPressure(wallDetectorSim);
        return (pressure > 5);
    });
    endStep();
</script>

Since the particles only collides with the wall for an instant, the collisions show up as narrow spikes in the graph. Short impacts like these are called _impulses_.

Drag the ball toward the edge of the box, and keep dragging even as the mouse is outside the box.
    
<script>
    var dragTime = 1;
    var dragTimeLeft = dragTime;
    cue(function(dt) {
        var pressure = getTotalPressure(wallDetectorSim);
        if (pressure > 1)
        {
            dragTimeLeft -= dt;
        }
        else
        {
            dragTimeLeft = dragTime;
        }

        return (dragTimeLeft <= 0);
    });
    endStep();
</script>

This simulates you pushing the ball toward the wall, which puts _pressure_ on the wall. And not just a short spike, but continuous pressure that doesn't let up until you let go.

</div>
<div class="twoColumn">
<script>
    insertHere(wallDetectorSim.div);
</script>
</div>
</div>






<div class="page">
<script>
    
    var pressureSim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0;
            p.boxWidth = 100;
            p.maxParticleCount = 1000;

            updateBounds(simulation);

            var particleCount = 500;

            var newParticles = [];
            for (var i = 0; i < (particleCount - 1); i++) {
                var particle = new Particle();
                particle.velocity = randomVelocity(20);
                newParticles[i] = particle;


            }

            addParticle(simulation, new Particle());
            addParticlesRandomly(simulation, newParticles);

            setInteraction(simulation, 0, 0, null);
        },
    });

    pressureSim.pausedByUser = true;
</script>

<div class="stepLog twoColumn">

I've installed force measurement devices in the walls here. They detect whenever a particle bounces off the wall, and how hard. Try throwing the particle at the wall at different speeds.

<script>
createTimeSeriesHere({
        timeRange: 100,
        update: function(graph) {
            return {time: pressureSim.time, data: [getTotalPressure(pressureSim)]};
        },
    });
</script>
</div>
<div class="twoColumn">
<script>
    insertHere(pressureSim.div);

</script>
</div>
</div>
<script>
    initChapter();
</script>


## Hard-to-open jar

