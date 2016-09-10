function createIceMudSliderHere()
{
	createSliderHere({
		initialValue: sim.parameters.friction,
	    min: 0.04, max: 5,
	    minLabel: "Ice", maxLabel: "Mud",
	    transform: function(x) { return Math.exp(x); },
	    inverseTransform: function(x) { return Math.log(x); },
	    update: function(value)
	    {
	    	sim.parameters.friction = value;
	    }
	});	
}

