
// Random stuff

function microstate_entropy(p)
{
    if (p == 0)
    {
        return 0;
    }
    else
    {
        return - p * Math.log2(p);
    }
}

function squared(x) 
{ 
    return x * x
};

function sum(array)
{
    return array.reduce(function(x, y) {
        return x + y;
    });
}

// Vector

function V2(x, y)
{
    return new Vector2(x, y);
}

function Vector2(x, y)
{
    this.x = x || 0;
    this.y = y || 0;
}

Vector2.prototype = {
    plus: function(v)
    {
        return V2(this.x + v.x, this.y + v.y);
    },
    minus: function(v)
    {
        return V2(this.x - v.x, this.y - v.y);
    },
    times: function(scalar)
    {
        return V2(scalar * this.x, scalar * this.y);
    },
    dot: function(v)
    {
        return (this.x * v.x + this.y * v.y);
    },
    squared: function()
    {
        return this.dot(this);
    },
    magnitude: function()
    {
        return Math.sqrt(this.squared());
    },
    normalized: function()
    {
        return this.times(1 / this.magnitude());
    },
    project_onto_normal: function(normal)
    {
        return normal.times(this.dot(normal));
    }
}

// Rectangle

Rectangle = function(left, top, width, height)
{
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.right = left + width;
    this.bottom = top + height;
    this.center = V2(left + width/2, top + height/2);
}

function RectLeftTopWidthHeight(left, top, width, height)
{
    return new Rectangle(left, top, width, height);
}

function RectLeftTopRightBottom(left, top, right, bottom)
{
    return new Rectangle(left, top, right - left, bottom - top);
}

function RectCenterWidthHeight(center, width, height)
{
    var half_width = width / 2;
    var half_height = height / 2;
    return new Rectangle(center.x - half_width, 
                         center.y - half_height,
                         width, height);
}

function is_rectangle_in_rectangle(inner, outer)
{
    var inside_x = (outer.left <= inner.left) && (inner.right <= outer.right);
    var inside_y = (outer.top  <= inner.top ) && (inner.bottom <= outer.bottom);
    return inside_x && inside_y;
}

function is_point_in_rectangle(v, rect)
{
    var inside_x = (rect.left <= v.x) && (v.x <= rect.right)
    var inside_y = (rect.top <= v.y)  && (v.y <= rect.bottom)
    return inside_x && inside_y;
}

function random_point_in_rectangle(rect)
{
    return V2(random_in_interval(rect.left, rect.right),
              random_in_interval(rect.top, rect.bottom));
}


function random_in_interval(a, b)
{
    return (a + (b - a)*Math.random())
}

// Quadtree

Quadtree = function(bounds, max_objects, max_depth)
{
    this.objects = [];
    this.bounds = bounds;
    this.subtrees = undefined;
    this.max_objects = max_objects || 4;
    this.max_depth = max_depth || 10;
}

Quadtree.prototype.add = function(object)
{
    if (this.subtrees)
    {
        for (var subtree of this.subtrees)
        {
            if (is_rectangle_in_rectangle(object.bounds(), subtree.bounds))
            {
                subtree.add(object);
                return;
            }
        }
        
        this.objects.push(object);
        return;
    }
    else
    {
        this.objects.push(object);
    
        if (this.objects.length > this.max_objects)
        {
            var top_left = RectLeftTopRightBottom(
                this.bounds.left, this.bounds.top, 
                this.bounds.center.x, this.bounds.center.y);
            var top_right = RectLeftTopRightBottom(
                this.bounds.center.x, this.bounds.top, 
                this.bounds.right, this.bounds.center.y);
            var bottom_left = RectLeftTopRightBottom(
                this.bounds.left, this.bounds.center.y, 
                this.bounds.center.x, this.bounds.bottom);
            var bottom_right = RectLeftTopRightBottom(
                this.bounds.center.x, this.bounds.center.y, 
                this.bounds.right, this.bounds.bottom);
            this.subtrees = [new Quadtree(top_left), new Quadtree(top_right),
                             new Quadtree(bottom_left), new Quadtree(bottom_right)];
            
            for (var object of this.objects)
            {
                for (var subtree of this.subtrees)
                {
                    if (is_rectangle_in_rectangle(object.bounds(), subtree.bounds))
                    {
                        subtree.add(object);
                        break;
                    }
                }
            }
        }
    }
    
}

Quadtree.prototype.collide_all = function(collision_function)
{
    for (var object of this.objects)
    {
        this.collide_with(object, collision_function);
    }
    if (this.subtrees)
    {
        for (var subtree of this.subtrees)
        {
            subtree.collide_all(collision_function);
        }
    }
}

Quadtree.prototype.collide_with = function(collider, collision_function) 
{
    for (var object of this.objects)
    {
        if (object != collider)
        {
            collision_function(collider, object);
        }
    }
    if (this.subtrees)
    {
        for (var subtree of this.subtrees)
        {
            subtree.collide_with(collider, collision_function);
        }
    }
}

Quadtree.prototype.clear = function() {
    this.objects = [];
    if (this.subtrees)
    {
        for (var subtree of this.subtrees)
        {
            subtree.clear();
        }
    }
}