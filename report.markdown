---
header-includes:
	\usepackage{cancel}
	\usepackage{amsmath}
	\usepackage[noend]{algorithm2e}
	\DontPrintSemicolon
	\SetArgSty{}
---

\newcommand{\floor}[1]{\left\lfloor#1\right\rfloor}
\newcommand{\p}[1]{\left(#1\right)}
\newcommand{\abs}[1]{\left|#1\right|}
\renewcommand{\v}[1]{\mathbf{#1}}

\newcommand{\sub}[1]{_{\textup{#1}}}

# Abstract

This thesis report describes the development of a series of interactive explanations on the fundamentals of statistical physics.
The target audience of the explanations is people with no physics or mathematics background, and instead of the usual mathematical treatment, is built around a simple molecular simulation, with round particles interacting.
The simple model is enough to explain concepts such as _energy_, _temperature_, _pressure_, _entropy_, _state transition_ and _friction_.
The idea is to engage the reader by letting them interact with the model, and through playing with it hopefully inspire questions, simple experiments or just having fun while learning.

# Introduction

* Why?
* previous explorables
	* bret victor
	* earth primer
	* parable polygons
* design constraints
	* 2D
		* legibility
		* efficiency (need a lot less particles to fill $[0, 1]^2$ than $[0, 1]^3$)
	* Be a web page
		* low effort to use/find
		* linking
		* works everywhere
		* standardized
* Outline
	* Model
	* Implementation concerns
	* Design/Pedagogy
	* Discussion/Evaluation/Future work

# Model

The model consists of particles and walls. Particles will interact with other particles, and bounce off walls. Walls are stationary.

## Particles

A particle is described by

* an index $k$, $0 \leq k < n$,
* a position $\v{x}_k$,
* a velocity $\v{v}_k$,
* a radius $r_k$,
* a mass $m_k$,
* and a type $T_k$.

There will be many identical particles, differing only in index and dynamic variables ($\v{x}_k$, $\v{v}_k$).
The type $T_k$ is associated with all the properties shared between the identical particles.
Importantly, instead of having to specify the interaction between every pair of particles, we specify it between every pair of types.
When two particles interact, we look up their types, and use the types to look up the interaction.

Note that the particles are spherically symmetric, which let's us ignore the orientation of the particles.
The model is thus only concerned with the linear momentum of the particles, and does not incorporate their angular momentum (spin).

## Walls

A wall is an infinitely thin (mathematical) line, described by

* a starting point $\v{p}_0$,
* and an endpoint $\v{p}_1$.

The model has two different modes:

1. _Macro mode_, where the particles and walls behave like macroscopic rigid objects.
    * Large timesteps.
    * Only works for step potentials. (and we only use the "hard sphere" potential $V(r) = dfasfasfafsdfd$)
    * Solves for exact collision between hard spheres and lines. The velocities are only changed at the exact moment of impact between two bodies.
    * Useful for gases, since particles in a gas essentially only interact by elastic collisions.
    * Behaves like we expect macroscopic objects to behave.
2. _Micro mode_, where the particles and walls interact using only potentials.
    * Small timesteps.
    * Allows for arbitrary, smooth potentials, and thus more interesting interactions.
    * Breaks down if the particle velocities become too large w.r.t. the timestep.
    * The closest real world analogue people are familiar with is magnets.

#### TODOS:

* talk about 2D
* radius, mass and color should be tied to type.
* measurements tied to each particle

## Micro model

## Interactions

Potential:

$$ V(r) = \epsilon \p{ \p{\frac{r_m}{r}}^{12} - 2 \p{\frac{r_m}{r}}^6 } $$

where $\epsilon$ is the bond energy (deepest part of well), and $r_m$ is distance to the potential minimum.

Force:

$$ F(r) = - \frac{dV}{dr} = \frac{12 \epsilon}{r}\p{ \p{\frac{r_m}{r}}^{12} - \p{\frac{r_m}{r}}^6 } $$


## Macro model

In this model, the particles are all hard spheres, corresponding to the two-particle potential
$$
    V(r) = 
    \begin{cases}
        \infty, & r \leq R
        \\
        0, & r > R
    \end{cases}
$$
where $R$ is the sum of the particle radii.
This potential cannot be numerically integrated because of the infinite potential, and the infinite slope at $r = R$.
However, because the potential is constant everywhere else, the only time this potential exerts a force is at exactly $r = R$, where a collision occurs.

The dynamics of the model can thus be split into two parts:

* handling a collision
* moving all particles between collisions.


#### TODOS:

* Can be generalised to arbitrary stepwise constant potentials.

### Handling a hard collision

The collision is instantaneous, and conserves momentum.
Because the force is normal, the momenta of the particles will only change in the normal direction $\hat{\v{n}}$.
If we have two particles with velocities $\v{v}_1$ and $\v{v}_2$, the relative velocity in the normal direction is

$$ \v{v}_n = \p{(\v{v}_1 - \v{v}_2) \cdot \hat{\v{n}}} \hat{\v{n}}. $$

Using conservation of momentum and a coefficient of restitution $C_R$, the new velocities become

$$ \v{v}_1' = \v{v}_1 - \frac{(1 + C_R)m_2}{m_1 + m_2} \v{v}_n $$
$$ \v{v}_2' = \v{v}_2 + \frac{(1 + C_R)m_1}{m_1 + m_2} \v{v}_n. $$

If $C_R = 1$, the collision is elastic (the particles bounce off each other) and energy is conserved.
If $C_R = 0$ the collision is completely inelastic, 
the particles will stick together and move with the same velocity after the collision MAXIMAL ENERGY LOSS???.
With $0 < C_R < 1$ we interpolate between these two scenarios.


#### TODOS:

* Derivation of general collision in appendix?
    * In lab frame or center-of-mass frame?

### Between collisions

Since there are no interparticle forces between collisions, the basic idea of how to run the simulation is:

1. Move all the particles at constant velocity until next collision.
2. Resolve the collision, changing the velocity of the two particles involved.

This idea seems simple, but there are a number of things that complicate the situation:

* How do we find the next collision?
* What about walls?
* Avoiding unnecessary work in finding collisions (optimization)
* Combining this with the potential approach? (for i.e. gravity)

Let's examine them in turn:

#### Finding the next collision

Consider two particles moving along at constant velocity. Will they collide, and if so, when? At first glance, it seems tricky, but we can simplify the problem in a few steps.

Even at constant velocity, it's not always obvious to tell from a picture whether two particles with velocities $v_a$ and $v_b$ will collide.
It gets simpler if we measure the velocities relative to one of the particles (let's pick particle $a$).
Then $v_a' = 0$ and $v_b' = v_b - v_a$.
In this system, only one particle is moving, 
and it's easier to see whether the two particles will collide.

Each particle moves at constant velocity $v_k$, which means that during a time interval $\Delta t$, 
the particle will have moved $\Delta x_k = v_k \Delta t$.
Using this, we can change the question of "when do they collide?" to "where do they collide?" and not have to worry about time anymore.
The problem is now a purely geometric one.

The question is now "where does the extruded circle intersect the stationary circle?", 
where "intersects" is sort of a fuzzy question.
It's not obvious how to intersect a circle extruded along a line, and another circle. 

The problem would be much simpler if the extruded circle was just an extruded point: a line.
We can achieve this in a way similar to the relative velocity change above.
There, we choose a system where one particle had all the velocity. 
Here, we will choose a system where one particle has all the collision hull.

Move one shape around the perimeter of the other, with no gap between them. 
The shape traced by the origin of the other shape will be their combined hull.
That is, colliding a point with the newly traced shape is the same as colliding the two original shapes. Technically, this operation is the _Minkowski difference_ of two sets.
For two discs, the Minkowski difference is just another discs with radius $R = R_1 + R_2$. 

Now we have reduced the problem to the intersection between a line segment and a circle.

However, we are only interested in the first intersection $t_-$ (negative sign in front of the square root),
which corresponds to collision from the outside. 
(If the particles collide from inside, we let them move out of overlap without any collision.) 

* If $t_- < 0$, the collision is behind us, and we can ignore it.
* If $0 \leq t_- < \Delta t$, we have a collision during this time step, and we record the potential collision. 
* If $t_- \geq \Delta t$, the collision is in the next time step, ignore it. 

#### Collision with wall

Here we are colliding a circle with a line. 
The Minkowski difference for these shapes is more complicated than the circle-circle case.
Here, we get a rectangle capped by two halfcircles.
We have to check for intersection with the two straight sides, and the two circles at the ends.
If the movement line intersects the line segments from the outside, it cannot intersect the circle, so we begin by testing the sides.
After testing the sides.

\pagebreak

#### Algorithm

We now have the algorithm

\begin{algorithm}

	$t\sub{remaining} \gets \Delta t$ \;
	\Repeat{no recorded collisions}{
		Reset recorded collisions \;
		\For{all particle pairs}{
			\If{this pair collides with $0 \leq t\sub{collision} < t\sub{remaining}$}{
				Record the collision and its time \;
			}
		}
		Find the earliest collision $C\sub{earliest}$, with time $t\sub{earliest}$ \;
		Move all particles: $\v{x}_k \gets \v{x}_k + t\sub{earliest} \v{v}_k$ \;
		$t\sub{remaining} \gets t\sub{remaining} - t\sub{earliest}$ \;
		Resolve the collision $C\sub{earliest}$ \;
	}
	Move all particles to end of timestep: $\v{x}_k \gets \v{x}_k + t\sub{remaining} \v{v}_k$ \; 
\end{algorithm}

It seems wasteful to look at all pairs of particles after each collision.
Only the two particles involved in the collision have changed their trajectories, so only the collisions involving them needs to be updated.
This idea leads us to the next iteration of the algorithm:

\begin{algorithm}
	$t\sub{remaining} \gets \Delta t$ \;
	\nlset{+}	\For{all particle pairs}{
	\nlset{+}		\If{this pair collides with $0 \leq t\sub{collision} < t\sub{remaining}$}{
	\nlset{+}			Record the collision and its time \;
					}
				}
	\Repeat{no recorded collisions}{
		Find the earliest collision $C\sub{earliest}$, with time $t\sub{earliest}$ \;
		Move all particles: $\v{x}_k \gets \v{x}_k + t\sub{earliest} \v{v}_k$ \;
		$t\sub{remaining} \gets t\sub{remaining} - t\sub{earliest}$ \;
		Resolve the collision $C\sub{earliest}$ \;
		\nlset{+}	\For{all recorded collisions $C$}{
		\nlset{+}		$t(C) \gets t(C) - t\sub{earliest}$ \;
		\nlset{+}		\If{$C$ shares an involved particle with $C\sub{earliest}$}{
		\nlset{+}			Remove $C$ from the recorded collisions \;
					}
				}
		\nlset{+}	\For{all particle pairs containing a particle involved in $C\sub{earliest}$}{
		\nlset{+}		\If{this pair collides with $0 \leq t\sub{collision} < t\sub{remaining}$}{
		\nlset{+}			Record the collision and its time \;
					}
				}
	}
	Move all particles to end of timestep: $\v{x}_k \gets \v{x}_k + t\sub{remaining} \v{v}_k$ \; 
\end{algorithm}

There is a possibility that two collisions happen at the exact same time.
If we let the algorithm pick one randomly, 
there is a risk that the other one will have $t\sub{collision} < 0$ after subtracting $t\sub{remaining}$ from it, 
because of floating point math.
THINK ABOUT THIS!!!

\pagebreak

### TODOS

* How do I describe lines
* Maybe don't talk about extrusions?
* Constant velocity
	* since I use dt as the parametrisation of the line segment, maybe it's kinda weird to remove it here?
* Minkowski difference
	* maybe discuss this more
* Solve line intersects circle
	* Use velocity and time for the parameters
* Algorithm
	* Use array notation for "recorded collisions"
	* Write $C = (t, P)$, where $P$ is a set of involved particles.
	* Something in the margin indicating new lines?
* more complicated because of i.e. gravity







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
	* 2D not 3D
		* Easier to visualize
		* Needs less particles to fill space
		* Not physically correct, sligthly weird with 3D potentials
		* Does not exhibit all richness of structure in solids (BCC, FCC)
		* 3D is a natural extension
	* Potentials
		* Lennard Jones
		* Coulomb?
	* Collision
	* Grid
	* Periodicity
	* Integrator
	* Brownian noise
	* symplectic stuff
	* Measurements
		* Formulae
		* Per particle, to measure different areas or groups











# Design


## Interactivity

* Without any gating or feedback, the user would easily miss interacting with the model and only read the text.
* Too much gating becomes grating? Balance between checking if user is following and annoying the user?
* Have to balance unguided exploration and guided explanation. The goal is to not have the user get lost, but also to have them trying things out because they want to. Can't have only "do this, do that", with no agency on the users part.
* With interactivity, animation becomes important. It draws the eye to important things, and helps the user not get lost. New content popping in from nowhere is quite disorienting.
* Steps vs pages vs free scrolling. Balance between freedom of exploration (like reading a book), and making sure user is following with small challenges (like a game).
* Without pages, tendency to scroll to the new thing and never stay and explore.
* Maybe leave pages with an open question for the reader to figure out on their own?


# Discussion



## Future work

* Improve




# Appendix

## Intersections

The outer product is the 2D version of the cross product in 3D. I define it as
$$
	\v{a} \wedge \v{b} = \abs{\v{a}} \abs{\v{b}} \sin \theta
$$
where $\theta$ is the angle between the vectors. The outer product is anticommutative
$$
	\v{a} \wedge \v{b} = - \v{b} \wedge \v{a} 
$$
which implies the useful property
$$
	\v{a} \wedge \v{a} = 0.
$$
Using orthonormal coordinates, the outer product is calculated
$$
	(a_x, a_y) \wedge (b_x, b_y) = a_x b_y - a_y b_x.
$$

### Line-line intersection

We write both lines in parametric form
$$
	\v{x}' = \v{x} + t\v{v}, 
	\quad 
	\v{x}' = \v{a} + s\v{b}.
$$
Intersection occurs when these are equal
$$
	\v{x} + t \v{v} = \v{a} + s\v{b}
	\quad
	\implies
	\quad
	\v{x} - \v{a} = s \v{b} - t \v{v}.
$$
Outer multiplying by $\v{v}$ and $\v{b}$, we can eliminate $t$ and $s$, respectively
$$
	(\v{x} - \v{a}) \wedge \v{v} = s \v{b} \wedge \v{v} - \cancel{t\v{v} \wedge \v{v}}
$$
$$
	(\v{x} - \v{a}) \wedge \v{b} = \cancel{s \v{b} \wedge \v{b} } - t\v{v} \wedge \v{b}
$$
and we can solve for $s$ and $t$
$$ 
	s = \frac{(\v{x} - \v{a}) \wedge \v{v}}{\v{b} \wedge \v{v}}
	,\qquad
	t = \frac{(\v{x} - \v{a}) \wedge \v{b}}{\v{b} \wedge \v{v}},
$$
where we used $\v{v} \wedge \v{b} = - \v{b} \wedge \v{v}$.

The $s$ and $t$ tells us where along the lines the intersection occurs. To find the intersection point, plug in $s$ or $t$ in their respective parametric equation.

* If $s < 0$ the intersection occurs before the starting point $a$
* If $0 \leq s \leq 1$ the intersection occurs on the line segment, _on_ the vector $\v{b}$ with its base in $\v{a}$.
* If $s > 1$ the intersection occurs after the endpoint of the line segment.

Similarly for $t$. This allows us to use this algorithm for line segments (with $s \in [0, 1]$), lines (no restrictions on $s$), and half-lines or _rays_ ($s > 0$).

### Line-circle intersection

We represent the line by a starting point $\v{a}$ and vector $\v{b}$ describing its extent, which gives us any point on the line with the parametric equation
$$
	\v{x} = \v{a} + t \v{b}
$$
The circle is represented by a center point $\v{c}$ and a radius $R$, and is described by the equation
$$
	(\v{x} - \v{c})^2 = R^2
$$
Solving these equations for $t$ gives us a point on the line where they intersect, or a criterion for when they do not intersect. Using $\v{d} = \v{a} - \v{c}$:
$$ R^2 = ((\v{a} + t \v{b}) - \v{c})^2 = (\v{d} + t \v{b})^2 = \v{d}^2 + 2t \v{d} \cdot \v{b} + t^2 \v{b}^2 $$
Solving for $t$ we get
$$
	t_{+,-} = 
	\frac{
		- \v{d} \cdot \v{b} 
		\pm
		\sqrt{ (\v{d} \cdot \v{b})^2  - \v{b}^2 (R^2 - \v{d}^2)}
	}
	{
		\v{b}^2
	}
$$
When the argument of the square root is negative, there are no real solutions and no intersections.
If there are solutions, they generally come in pairs, since a line usually intersects a circle two times.
The only exception is when the square root vanishes, in which case the line is tangent to the circle.

Here we have assumed that the vectors are two-dimensional, but the derivation works just as well with vectors of arbitrary dimension. In particular, it works just as well with a sphere as it does with a circle.

## Grid patterns

### Triangular numbers

We have the triangular numbers, describing the number of particles needed to make a triangle with $n$ layers.

$$ T_n = \frac{n (n + 1)}{2} $$

Given a particle index $k$, which layer does it belong to?
We invert the above relation to get

$$ n = \frac{\sqrt{8 T_n + 1} - 1}{2} $$

which we can generalize to

$$ n = \floor{\frac{\sqrt{8 k + 1} - 1}{2}} $$

which, given a $k$, returns the layer it belongs to.

### Hexagonal numbers

The hexagonal numbers are

$$ H_n = 1 + 6 T_n = 1 + 6 \frac{n(n + 1)}{2} $$

Inverted, this becomes

$$ n = \frac{\sqrt{12 H_n  - 3} - 3}{6} $$
