---
title: Billiards
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;

            initBilliards(simulation, simulation.boxBounds);

            p.isOnlyHardSpheres = false;

            var ljInteraction = new LennardJonesInteraction();
            ljInteraction.strength = 10;
            setInteraction(simulation, 0, 0, ljInteraction);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>

In this chapter we started with the game of billiards, and modified it to be **very many**, **attractive**, **frictionless** particles.

What we have done is create a **model** of how the tiny particles in the real world work.
The model is not _exactly_ like the real world – it's simpler.
But by being simpler, it makes it easier for us to explore and understand things about the real world.

<!-- * In the real world there are **incredibly many** particles, and we have only a few hundred.
	* The particles in the real world are too many and small to see. It's easier to think about a few hundred.
* There are many different kinds of particle, and the attraction between them is more complicated in the real world.
	* Most things we will explore here work just as well with one or two kinds of particle.
* Our particles move only in two dimensions, but the real world is three-dimensional.
	* In 2D, we can see all the particles. In 3D, particles can hide behind other particles, which makes it harder to see what they're doing.

Now that we've created this model, let's put it to use!
In the coming chapters we will use our **model** to help us understand things about the **real world**. -->