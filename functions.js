
// Random stuff

function microstateEntropy(p)
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
    var insideX = (outer.left <= inner.left) && (inner.right <= outer.right);
    var insideY = (outer.top  <= inner.top ) && (inner.bottom <= outer.bottom);
    return insideX && insideY;
}

Rect.prototype.containsPoint = function(point)
{
    var insideX = (this.left <= point[0]) && (point[0] <= this.right)
    var insideY = (this.top <= point[1])  && (point[1] <= this.bottom)
    return insideX && insideY;
}

function randomPointInRect(rect)
{
    return vec2.fromValues(randomInInterval(rect.left, rect.right),
                           randomInInterval(rect.top, rect.bottom));
}

function randomInInterval(a, b)
{
    return (a + (b - a)*Math.random())
}

// Quadtree

Quadtree = function(bounds, maxObjects, maxDepth)
{
    this.objects = [];
    this.bounds = bounds;
    this.subtrees = undefined;
    this.maxObjects = maxObjects || 4;
    this.maxDepth = maxDepth || 7;
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
    
        if (this.objects.length > this.maxObjects)
        {
            // create subtrees
            var topLeft = new Rect().setLeftTopRightBottom(
                this.bounds.left, this.bounds.top, 
                this.bounds.center[0], this.bounds.center[1]);
            var topRight = new Rect().setLeftTopRightBottom(
                this.bounds.center[0], this.bounds.top, 
                this.bounds.right, this.bounds.center[1]);
            var bottomLeft = new Rect().setLeftTopRightBottom(
                this.bounds.left, this.bounds.center[1], 
                this.bounds.center[0], this.bounds.bottom);
            var bottomRight = new Rect().setLeftTopRightBottom(
                this.bounds.center[0], this.bounds.center[1], 
                this.bounds.right, this.bounds.bottom);
            this.subtrees = [new Quadtree(topLeft), new Quadtree(topRight),
                             new Quadtree(bottomLeft), new Quadtree(bottomRight)];
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

Quadtree.prototype.collideAll = function(collisionFunction)
{
    for (var objectIndex = 0; 
        objectIndex < this.objects.length; 
        ++objectIndex)
    {
        this.collideWith(this.objects[objectIndex], collisionFunction);
    }
    if (this.subtrees)
    {
        for (var subtreeIndex = 0; 
            subtreeIndex < this.subtrees.length; 
            ++subtreeIndex)
        {
            var subtree = this.subtrees[subtreeIndex];
            subtree.collideAll(collisionFunction);
        }
    }
}

Quadtree.prototype.collideWith = function(collider, collisionFunction) 
{
    for (var objectIndex = 0; 
        objectIndex < this.objects.length; 
        ++objectIndex)
    {
        var object = this.objects[objectIndex];
        if (object != collider)
        {
            collisionFunction(collider, object);
        }
    }
    if (this.subtrees)
    {
        for (var subtreeIndex = 0; 
            subtreeIndex < this.subtrees.length; 
            ++subtreeIndex)
        {
            var subtree = this.subtrees[subtreeIndex];
            subtree.collideWith(collider, collisionFunction);
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