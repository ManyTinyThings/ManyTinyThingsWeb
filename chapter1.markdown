

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

