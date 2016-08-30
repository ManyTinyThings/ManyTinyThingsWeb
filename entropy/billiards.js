function isTriangleSplit(simulation)
{
	var cueFunction = function(){
		var totalEnergy = getTotalEnergy(simulation);
		var firstBall = simulation.particles[0];
		var triangleEnergy = totalEnergy - firstBall.kineticEnergy - firstBall.potentialEnergy;
		return (triangleEnergy > 1);	
	}
	
	return cueFunction;
}