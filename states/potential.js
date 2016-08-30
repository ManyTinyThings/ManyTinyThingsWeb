var addOppositeParticles = function(simulation)
{
    var d = simulation.parameters.boxWidth / 4;
    var particleSW = new Particle();
    v2.set(particleSW.position, -d, -d);
    addParticle(simulation, particleSW);

    var particleNE = new Particle();
    v2.set(particleNE.position, d, d);
    addParticle(simulation, particleNE);
}

var initOneDimSim = function(simulation)
{
    var p = simulation.parameters;
    p.simulationTimePerSecond = 1;
    p.boxHeight = 2;

    updateBounds(simulation);

    var d = simulation.boxBounds.width/2 - 1;
    var fixedParticle = new Particle();
    v2.set(fixedParticle.position, -d, 0);
    fixedParticle.mass = Infinity;
    addParticle(simulation, fixedParticle);

    var movingParticle = new Particle();
    v2.set(movingParticle.position, d, 0);
    addParticle(simulation, movingParticle);
}

var createPotentialPlotHere = function(potential, simulation)
{
    return createGraphHere({
        update: function(graph) {
            var relativePosition = v2.alloc();
            v2.subtract(relativePosition, simulation.particles[0].position, simulation.particles[1].position);
            var distance = v2.magnitude(relativePosition);
            v2.free(relativePosition);
            var r = distance / simulation.interactions[0].separation;

            var xMax = 4;
            var xs = [];
            var ys = [];
            var sampleCount = 100;
            for (var i = 0; i < sampleCount; i++) {
                var x = lerp(0.6, i/(sampleCount - 1), xMax);
                xs.push(x);
                ys.push(potential(x))
            }
            addCurve(graph, {
                x: xs, y: ys, color: Color.black,
            });
            setGraphLimits(graph, {
                xMin: -0.5, xMax: simulation.boxBounds.width/2 - 0.5,
            });

            drawGraph(graph);
           
            var markerRadius = 7;
            drawDiscMarker(graph.renderer, v2(r, potential(r)), markerRadius, Color.black);
        }
    });
}
