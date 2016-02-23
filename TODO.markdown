# TODO    

* Display stuff
    * Redraw on resize
    * Stuttery animation sometimes
* Bugs
    * Stability
        * Smaller timestep?
        * energy conservation
* Run backwards with collisions
    * Correct collision detection
    * Might have to arrange fixed timestep for this to work with collisions (might not be enough b/c collisions inherently non-reversible)
    * Discrete version?
* Controls
    * Save settings in cookie
    * Draggable numbers
    * Draggable borders of box
    * Controls drawn in GL?
    * Draw potential?
* Save config
    * As URL?
    * As JSON?
* More than one kind of particle
    * Different thermal energy
    * Removing wall
* Measurements
    * Measure velocity distribution
    * Pressure should be measured over time, not number of timesteps
    * Pressure using virial
* Figures
    * Trajectory particle gets a pilot hat 8)
    * Density histogram
    * Phase diagrams?
* Optimizations
    * Quadtree restructure instead of clear+repopulate?
    * Do quadtree in local coordinates? So we don't have to regenerate it when the box changes size
    * SOA instead of AOS -> ballPositions = new Float32Array() etc.
    * Update velocities and positions on GPU?