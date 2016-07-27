# Interactions / States of matter

<script>

    var interactionSim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0.1;

            simulation.particleGenerator = function() {
                var particle = new Particle();
                return particle;
            }

            for (var i = 0; i < 2; i++) {
                addParticle(simulation, simulation.particleGenerator());
            }

            var d = 5;
            v2.set(simulation.particles[0].position, -d, -d);
            v2.set(simulation.particles[1].position, d, d);

            var ljInteraction = new LennardJonesInteraction();
            ljInteraction.strength = 10;
            setInteraction(simulation, 0, 0, ljInteraction);
        }
    });

    function ensembleSpeed(particles)
    {
        var totalVelocity = v2.alloc();
        v2.set(totalVelocity, 0, 0);
        for (var particleIndex = 0; particleIndex < particles.length; particleIndex++) {
            var particle = particles[particleIndex];
            v2.add(totalVelocity, totalVelocity, particle.velocity);
        }
        var ensembleSpeed = v2.magnitude(totalVelocity) / particles.length;
        v2.free(totalVelocity);
        return ensembleSpeed;
    }
</script>

<div class="page">
<div class="stepLog twoColumn">
Try moving these particles closer to each other.

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

What happens if you collide them at high speed?

<script>
    cue(function () {
        var distance = v2.distance(interactionSim.particles[0].position, interactionSim.particles[1].position);
        // TODO: speed along normal instead
        var relativeSpeed = v2.distance(interactionSim.particles[0].velocity, interactionSim.particles[1].velocity);
        return (distance < 3) && (relativeSpeed > 1.0);
    });
    endStep();
</script>

The speed is too great for them to have time to stick together.

Let's add some more particles! (hold _c_ on the keyboard and use the mouse)

<script>
    cue(function () {
        return (interactionSim.particles.length > 20);  
    });
    endStep();
</script>

They group together and form a larger shape, a _solid_, if you will.

Try moving the solid around.

<script>
    cue(function () {
        return (ensembleSpeed(interactionSim.particles) > 0.15); 
    });
    endStep();
</script>

The particles collectively behave like the macroscopic objects we are used to, moving and rotating as a unit.

So far, we've have had friction, but there is no friction in the microscopic world.

Turn off the friction.

<script>
    cue(function () {
        return (interactionSim.parameters.friction == 0);
    });
    createSliderHere({
        object: interactionSim.parameters,
        name: "friction",
        min: 0, max: 0.1,
        minLabel: "No friction", maxLabel: "Some",
    });
</script>

Give the particles some energy.

<script>
    cue(function() {
        return (getTotalEnergy(interactionSim) > 0.3);
    });
    endStep();
</script>



Let's try amplifying the speed of each particle, in turn increasing the jiggling.

The random jiggling kicks the particles out of their positions, and what was a neat shape becomes something less ordered and more random. We have melted the _solid_ into a _liquid_.

If we increase the temperature (and thus the jiggling) even further, the speed is to great to keep the particles together, and they start bouncing around randomly. The heat of the system is too high for the attraction to matter much, and we've vaporized our _liquid_ into _gas_.
</div>
<div class="twoColumn">
<script>
    insertHere(interactionSim.div);

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
</script>
</div>
</div>

<script>
    initChapter();
</script>


