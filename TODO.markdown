# TODO    

* Display stuff
    * Redraw on resize
* Bugs
* Run backwards with collisions
    * Correct collision detection
    * Might have to arrange fixed timestep for this to work with collisions (might not be enough b/c collisions inherently non-reversible)
    * Discrete version?
* Controls
    * Save settings in cookie
    * Code to generate sliders
    * Draggable numbers
    * Move particles around
    * Control velocities
    * Draggable borders of box
* More than one kind of particle
    * Different thermal energy
    * Removing wall
* Measurements
    * Measure temperature
    * Measure velocity distribution
    * Pressure should be measured over time, not number of timesteps
* Figures
    * Draw trajectory of one particle
        * that particle gets a pilot hat 8)
    * Density histogram
    * Graph over quantities
    * Show total momentum as vector
* Optimizations
    * Quadtree restructure instead of clear+repopulate?
    * Do quadtree in local coordinates? So we don't have to regenerate it when the box changes size
    * SOA instead of AOS -> ball_positions = new Float32Array() etc.
    * Update velocities and positions on GPU?