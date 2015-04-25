
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

vec2.projectOntoNormal = function(out, a, normal)
{
    var length = vec2.dot(a, normal);
    vec2.scale(out, normal, length);
    return out;
}

// Rectangle
// stored as an array of left, top, right, bottom

function Rect()
{
    this.left = 0;
    this.right = 0;
    this.top = 0;
    this.bottom = 0;
    this.width = 0;
    this.height = 0;
    this.center = vec2.create();
    return this;
}

Rect.prototype.setLeftTopRightBottom = function(left, top, right, bottom)
{
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.width = right - left;
    this.height = top - bottom;
    vec2.set(this.center, (left + right) / 2, (top + bottom) / 2);
    return this;
}

Rect.prototype.setLeftTopWidthHeight = function(left, top, width, height)
{
    this.left = left;
    this.top = top;
    this.right = left + width;
    this.bottom = top + height;
    this.width = width;
    this.height = height;
    vec2.set(this.center, left + width/2, top + height/2);
    return this;
}

Rect.prototype.setCenterWidthHeight = function(center, width, height)
{
    var halfWidth = width / 2;
    var halfHeight = height / 2;
    this.left = center[0] - halfWidth;
    this.top = center[1] - halfHeight;
    this.right = center[0] + halfWidth;
    this.bottom = center[1] + halfHeight;
    this.width = width;
    this.height = height;
    vec2.copy(this.center, center);
    return this;
}

Rect.prototype.containsRect = function(inner)
{
    var outer = this;
    var inside_x = (outer.left <= inner.left) && (inner.right <= outer.right);
    var inside_y = (outer.top  <= inner.top ) && (inner.bottom <= outer.bottom);
    return inside_x && inside_y;
}

Rect.prototype.containsPoint = function(point)
{
    var inside_x = (this.left <= point[0]) && (point[0] <= this.right)
    var inside_y = (this.top <= point[1])  && (point[1] <= this.bottom)
    return inside_x && inside_y;
}

function randomPointInRect(rect)
{
    return vec2.fromValues(random_in_interval(rect.left, rect.right),
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
    this.max_depth = max_depth || 7;
}

Quadtree.prototype.add = function(object)
{
    if (this.subtrees)
    {
        for (var subtreeIndex = 0; 
            subtreeIndex < this.subtrees.length; 
            ++subtreeIndex)
        {
            var subtree = this.subtrees[subtreeIndex];
            if (subtree.bounds.containsRect(object.bounds))
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
            // create subtrees
            var top_left = new Rect().setLeftTopRightBottom(
                this.bounds.left, this.bounds.top, 
                this.bounds.center[0], this.bounds.center[1]);
            var top_right = new Rect().setLeftTopRightBottom(
                this.bounds.center[0], this.bounds.top, 
                this.bounds.right, this.bounds.center[1]);
            var bottom_left = new Rect().setLeftTopRightBottom(
                this.bounds.left, this.bounds.center[1], 
                this.bounds.center[0], this.bounds.bottom);
            var bottom_right = new Rect().setLeftTopRightBottom(
                this.bounds.center[0], this.bounds.center[1], 
                this.bounds.right, this.bounds.bottom);
            this.subtrees = [new Quadtree(top_left), new Quadtree(top_right),
                             new Quadtree(bottom_left), new Quadtree(bottom_right)];
             for (var objectIndex = 0; 
                 objectIndex < this.objects.length; 
                 ++objectIndex)
             {
                var object = this.objects[objectIndex];
                for (var subtreeIndex = 0; 
                    subtreeIndex < this.subtrees.length; 
                    ++subtreeIndex)
                {
                    var subtree = this.subtrees[subtreeIndex];
                    if (subtree.bounds.containsRect(object.bounds))
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
    for (var objectIndex = 0; 
        objectIndex < this.objects.length; 
        ++objectIndex)
    {
        this.collide_with(this.objects[objectIndex], collision_function);
    }
    if (this.subtrees)
    {
        for (var subtreeIndex = 0; 
            subtreeIndex < this.subtrees.length; 
            ++subtreeIndex)
        {
            var subtree = this.subtrees[subtreeIndex];
            subtree.collide_all(collision_function);
        }
    }
}

Quadtree.prototype.collide_with = function(collider, collision_function) 
{
    for (var objectIndex = 0; 
        objectIndex < this.objects.length; 
        ++objectIndex)
    {
        var object = this.objects[objectIndex];
        if (object != collider)
        {
            collision_function(collider, object);
        }
    }
    if (this.subtrees)
    {
        for (var subtreeIndex = 0; 
            subtreeIndex < this.subtrees.length; 
            ++subtreeIndex)
        {
            var subtree = this.subtrees[subtreeIndex];
            subtree.collide_with(collider, collision_function);
        }
    }
}

Quadtree.prototype.clear = function() {
    this.objects = [];
    if (this.subtrees)
    {
        for (var subtreeIndex = 0; 
            subtreeIndex < this.subtrees.length; 
            ++subtreeIndex)
        {
            var subtree = this.subtrees[subtreeIndex];
            subtree.clear();
        }
    }
}