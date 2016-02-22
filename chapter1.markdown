

# Energy and Heat

Here is a billiard ball. Try throwing it around.

<script>
    createSimulation("single", {
        graphs: ["energy"],
        parameters: {
            particleCount: 1,
            friction: 0.1,
        },
    });
</script>

As you pick up and throw the ball, you give it speed, and in turn, energy. This kind of energy is called
_kinetic energy_, or _movement energy_.
When you release the ball it starts to lose energy because of the friction in the air and in the collisions with the table.
(This natural loss of energy is called _dissipation_.)

I added some more balls. Play around with them some.

<script>

    function billiardsParticleGenerator(simulation, particleIndex)
    {
        var position;
        if (particleIndex == 0) {
            position = vec2.fromValues(-0.5, 0);
        }
        else
        {
            position = triangularLatticePosition(simulation, particleIndex - 1);
            vec2.add(position, position, vec2.fromValues(0.3, 0))
        }
        var velocity = vec2.fromValues(0, 0);
        return new Particle(position, velocity, oneColor(simulation, particleIndex));
    }

    createSimulation("billiards", {
        graphs: ["energy"],
        particleGenerator: billiardsParticleGenerator,
        parameters: {
            particleCount: 11,
            friction: 0.1,
        },
    });

</script>

It's easy to make a mess, which is what makes billiards an interesting game: it always creates new situations!

Let's remove all the friction and see what happens:

<script>
    createSimulation("frictionlessBilliards", {
        graphs: ["energy"],
        particleGenerator: billiardsParticleGenerator,
        parameters: {
            particleCount: 11,
            friction: 0,
        },
    });
</script>

Oh, look at that! The balls are bouncing all over the place, and they never stop. We have created a perpetual motion machine! 

Look at the energy: it stays the same, no matter how the balls are bouncing. If the energy was decreasing, like before, everything would eventually stop. If it was increasing, well, everything would be moving faster and faster and eventually EXPLODE!!! (good thing it doesn't!)

There is one way to change the energy: if you poke the balls after they have started bouncing. See if you can get the energy to decrease!