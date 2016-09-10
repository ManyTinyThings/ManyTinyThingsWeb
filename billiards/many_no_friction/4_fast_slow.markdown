---
title: Fast and slow
---

<script>
    var sim = createSimulation({
        initialize: function(simulation) {
            var p = simulation.parameters;
            p.friction = 0;
            setBoxWidth(simulation, 90);

            var b = simulation.boxBounds;

            var topRect = new Rectangle();
            setLeftTopRightBottom(topRect, b.left, b.top, b.right, b.center[1]);
            var bottomRect = new Rectangle();
            setLeftTopRightBottom(bottomRect, b.left, b.center[1], b.right, b.bottom);

            initBilliards(simulation, topRect);
            initBilliards(simulation, bottomRect);

            setWallsAlongBorder(simulation);
            var middleWall = new Wall(v2(b.left, 0), v2(b.right, 0));
            simulation.walls.push(middleWall);

    		setToolbarAvailableTools(simulation.toolbar, ["impulse"]);
        }
    });
</script>

I've put two billiards tables side-by-side.

Make a hard break shot in one.

And a soft break shot in the other.