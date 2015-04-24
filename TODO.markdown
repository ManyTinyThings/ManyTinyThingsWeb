# TODO    

* Bugs
    * Some weirdness with timesteps when it lags (probably fixed by correct collision detection)
* Run backwards with collisions
    * Might have to arrange fixed timestep for this to work with collisions (might not be enough b/c collisions inherently non-reversible)
    * Discrete version?
* Controls
    * Number of particles by adding or removing individual particles
    * Move particles around
    * Control velocities
    * Draggable borders of box
* More than one kind of particle
    * Different energy
    * Removing wall
* Measurements
    * Measure entropy (mixing of different colors?)
    * Measure temperature
    * Measure velocity distribution
    * Pressure should be measured over time, not timesteps
* Figures
    * Density histogram
    * Graph over quantities
    * Show total momentum as vector
* Optimizations
    * Quadtree restructure instead of clear+repopulate
    * Memory management by not allocating anything inside the loop
    * SOA instead of AOS -> ball_positions = new Float32Array() etc.
    