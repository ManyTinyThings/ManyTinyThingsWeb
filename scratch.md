---
---

\newcommand{\floor}[1]{\left\lfloor#1\right\rfloor}
\newcommand{\p}[1]{\left(#1\right)}

## Lennard-Jones potential


Potential:

$$ V(r) = \epsilon \p{ \p{\frac{r_m}{r}}^{12} - 2 \p{\frac{r_m}{r}}^6 } $$

where $\epsilon$ is the bond energy (deepest part of well), and $r_m$ is distance to the potential minimum.

Force:

$$ F(r) = - \frac{dV}{dr} = \frac{12 \epsilon}{r}\p{ \p{\frac{r_m}{r}}^{12} - \p{\frac{r_m}{r}}^6 } $$

## Triangular numbers

We have the triangular numbers, describing the number of particles needed to make a triangle with $n$ layers.

$$ T_n = \frac{n (n + 1)}{2} $$

Given a particle index $k$, which layer does it belong to?
We invert the above relation to get

$$ n = \frac{\sqrt{8 T_n + 1} - 1}{2} $$

which we can generalize to

$$ n = \floor{\frac{\sqrt{8 k + 1} - 1}{2}} $$

which, given a $k$, returns the layer it belongs to.

## Hexagonal numbers

The hexagonal numbers are

$$ H_n = 1 + 6 T_n = 1 + 6 \frac{n(n + 1)}{2} $$

Inverted, this becomes

$$ n = \frac{\sqrt{12 H_n  - 3} - 3}{6} $$

## Collision

Collision of two objects with coefficient of restitution $C_R$ and collision normal $\hat{n}$. Use the coordinate system where one object is resting by using the relative velocity. Project the relative velocity on the normal, since the velocities will only change in the direction of the normal.

$$ v_n = \p{(v_1 - v_2) \cdot \hat{n}} \hat{n} $$

The new velocities become (after taking conservation of momentum into account)

$$
	v_1' = v_1 - \frac{(1 + C_R)m_2}{m_1 + m_2} v_n \\
	v_2' = v_2 + \frac{(1 + C_R)m_1}{m_1 + m_2} v_n
$$


# Interactivity

* Without any gating or feedback, the user would easily miss interacting with the model and only read the text.
* Too much gating becomes grating? Balance between checking if user is following and annoying the user?
* Have to balance unguided exploration and guided explanation. The goal is to not have the user get lost, but also to have them trying things out because they want to. Can't have only "do this, do that", with no agency on the users part.
* With interactivity, animation becomes important. It draws the eye to important things, and helps the user not get lost. New content popping in from nowhere is quite disorienting.
* Steps vs pages vs free scrolling. Balance between freedom of exploration (like reading a book), and making sure user is following with small challenges (like a game).
* Without pages, tendency to scroll to the new thing and never stay and explore.

# Implementation

* Browser/Javascript
	* Because of ease of distribution and standardized, works everywhere.
	* Not great for performance
		* Interpreted (with JIT)
		* Memory management
	* Possibility of WebAssembly, asm.js and emscripten
	* Run simulation on graphics card
* Drawing
	* Canvas
	* WebGL
* Authoring
	* Separate the interactive things from this particular model
	* Simple way of adding interactive elements to html text
	* Simple way to make interactive steps with conditions
	* Made simple plotting library
* Model
	* Potentials
	* Collision
	* Grid
	* Periodicity
	* Integrator
	* Brownian noise
	* symplectic stuff
	* Measurements
		* Formulae
		* Per particle, to measure different areas or groups