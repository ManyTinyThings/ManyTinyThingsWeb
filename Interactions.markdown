# Interactions / States of matter

## Micro &rarr;

We know that we can think of atoms as tiny billiard balls bouncing around endlessly. But bouncing isn't the only way particles interact.

<script>

    var interactionSim = createSimulation({
        width: 500,
        height: 400,
        initialize: function(simulation) {

            copyObject(simulation.parameters, {
                particleCount: 2,
                radiusScaling: 0.1,
                friction: 0.1,
                lennardJonesStrength: 0.5,
            });

            var particleOne = new Particle();
            v2.set(particleOne.position, -0.5, -0.5);
            addParticle(simulation, particleOne);

            var particleTwo = new Particle();
            v2.set(particleTwo.position, 0.5, 0.5);
            addParticle(simulation, particleTwo);

            setInteraction(simulation, 0, 0, Interaction.lennardJones);
        }
    });

    createSlidesHere([
        {
            text: "Try moving these particles closer to each other.", 
            nextCondition: function () {
                var quadrance = v2.quadrance(interactionSim.particles[0].position, interactionSim.particles[1].position);
                return (quadrance < square(0.25));
            },
        },
        {
            text: "They seem to like each other! As they come closer, they attract and snap together. Can you get them to let go?",
            nextCondition: function () {
                var quadrance = v2.quadrance(interactionSim.particles[0].position, interactionSim.particles[1].position);
                return (quadrance > square(0.5));
            },
        },
        {
            text: "It takes some effort! What happens if you collide them at high speed?",
            nextCondition: function () {
                var quadrance = v2.quadrance(interactionSim.particles[0].position, interactionSim.particles[1].position);
                var relativeSpeedSquared = v2.quadrance(interactionSim.particles[0].velocity, interactionSim.particles[1].velocity);
                return (quadrance < square(0.25)) && (relativeSpeedSquared > square(2.0));

            }
        },
        {
            text: "The speed is too great for them to have time to stick together.",
        },
        {
            text: "Let's add some more particles! (hold _c_ on the keyboard and use the mouse)",
            nextCondition: function () {
                return (interactionSim.particles.length > 30);
            }
        },
        {
            text: "They group together and form a larger shape, a _solid_, if you will. Try pulling carefully at it.",
            nextCondition: function () {
                var totalVelocity = v2.alloc();
                for (var particleIndex = 0; particleIndex < interactionSim.particles.length; particleIndex++) {
                    var particle = interactionSim.particles[particleIndex];
                    v2.add(averageVelocity, averageVelocity, particle.velocity);
                }
                var averageSpeed = v2.magnitude(totalVelocity) / interactionSim.particles.length;

                return (averageSpeed > 2);
            }
        },
        {
            text: "Let's add some more particles! (hold _c_ on the keyboard and use the mouse)",
        },

    ]);
</script>



## &rarr; Macro






The particles collectively behave like the macroscopic objects we are used to, moving and rotating as a unit.

## ~~Friction~~

So far, we've have had friction, but there is no friction in the microscopic world.

Now, the particles are constantly jiggling, meaning the system has a certain amount of heat.

Let's try amplifying the speed of each particle, in turn increasing the jiggling.



The random jiggling kicks the particles out of their positions, and what was a neat shape becomes something less ordered and more random. We have melted the _solid_ into a _liquid_.

If we increase the temperature (and thus the jiggling) even further, the speed is to great to keep the particles together, and they start bouncing around randomly. The heat of the system is too high for the attraction to matter much, and we've vaporized our _liquid_ into _gas_.
