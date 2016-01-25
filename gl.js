
function createRenderer(canvas)
{
    var renderer = {};
    
    // init GL
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    renderer.gl = gl;
    
    if (!gl) {
        console.log("Couldn't load WebGL.");
        return;
    }
    
    // set up screen
    
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    var screenMatrix = mat3.create();
    mat3.identity(screenMatrix);
    mat3.translate(screenMatrix, screenMatrix, [-1, -1]);
    mat3.scale(screenMatrix, screenMatrix, [2 / gl.canvas.width, 2 / gl.canvas.height]);
    renderer.screenMatrix = screenMatrix;
    
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    
    // set up shaders

    var lineVertexShader = loadShader(gl, gl.VERTEX_SHADER,[
        "attribute vec2 vertexPosition;",
        
        "uniform vec4 color;",
        "uniform mat3 screenMatrix;",
    
        "varying lowp vec4 vColor;",
    
        "void main(void) {",
            "vec2 screenPosition = (screenMatrix * vec3(vertexPosition, 1.0)).xy;",
            "gl_Position = vec4(screenPosition, 0, 1);",
            "vColor = color;",
        "}",
    ].join("\n"));
    
    var particleVertexShader = loadShader(gl, gl.VERTEX_SHADER,[
        "attribute vec2 vertexPosition;",
        "attribute vec2 offset;",
        "attribute vec4 color;",
        "attribute float scale;",
    
        "uniform mat3 screenMatrix;",
    
        "varying lowp vec4 vColor;",
    
        "void main(void) {",
            "vec2 newPosition = (vertexPosition * scale) + offset;",
            "vec2 screenPosition = (screenMatrix * vec3(newPosition, 1.0)).xy;",
            "gl_Position = vec4(screenPosition, 0, 1);",
            "vColor = color;",
        "}",
    ].join("\n"));
    
    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, [
        "varying lowp vec4 vColor;",
    
        "void main(void) {",
            "gl_FragColor = vColor;",
        "}",
    ].join("\n"));
    
    var particleShaderProgram = createShaderProgram(gl, particleVertexShader, fragmentShader);
    var lineShaderProgram = createShaderProgram(gl, lineVertexShader, fragmentShader);
    renderer.particleShaderProgram = particleShaderProgram;
    renderer.lineShaderProgram = lineShaderProgram;

    gl.useProgram(particleShaderProgram);

    particleShaderProgram.vertexPositionAttribute = gl.getAttribLocation(particleShaderProgram, "vertexPosition");
    particleShaderProgram.offsetAttribute = gl.getAttribLocation(particleShaderProgram, "offset");
    particleShaderProgram.colorAttribute  = gl.getAttribLocation(particleShaderProgram, "color");
    particleShaderProgram.scaleAttribute  = gl.getAttribLocation(particleShaderProgram, "scale");
    particleShaderProgram.screenMatrixUniform = gl.getUniformLocation(particleShaderProgram, "screenMatrix");
    gl.uniformMatrix3fv(particleShaderProgram.screenMatrixUniform, false, screenMatrix);
    
    gl.useProgram(lineShaderProgram);
    
    lineShaderProgram.vertexPositionAttribute = gl.getAttribLocation(lineShaderProgram, "vertexPosition");
    lineShaderProgram.screenMatrixUniform = gl.getUniformLocation(lineShaderProgram, "screenMatrix");
    lineShaderProgram.colorUniform = gl.getUniformLocation(lineShaderProgram, "color");
    gl.uniformMatrix3fv(lineShaderProgram.screenMatrixUniform, false, screenMatrix);
    
    // set up buffers

    renderer.vertexBuffer = gl.createBuffer();
    renderer.offsetBuffer = gl.createBuffer();
    renderer.colorBuffer  = gl.createBuffer();
    renderer.scaleBuffer  = gl.createBuffer();
    
    return renderer;
}

function loadShader(gl, type, str) {
    var shader = gl.createShader(type);

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function createShaderProgram(gl, vertexShader, fragmentShader)
{
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.log("Could not initialise shaders");
      return null;
    }
    
    return shaderProgram;
}

function resizeRenderer(renderer) {
    var w = renderer.gl.canvas.width;
    var h = renderer.gl.canvas.height;
    renderer.gl.viewport(0, 0, w, h);

    mat3.identity(renderer.screenMatrix);
    var aspectRatio = w / h;
    mat3.scale(renderer.screenMatrix, renderer.screenMatrix, [1 / aspectRatio, 1]);
}

function clearRenderer(renderer) {
    renderer.gl.clear(renderer.gl.COLOR_BUFFER_BIT);
}

function drawParticles(renderer, particles, radius_scaling) {

    var particleCount = particles.length;
    var vertexCount = Math.max(Math.floor(4*radius_scaling), 20);

    // generate vertices

    var vertices = new Float32Array(2 * vertexCount);
    var angle = tau / vertexCount;
    for (var i = 0; i < vertexCount; i++) {
        vertices[2*i]     = Math.cos(i * angle);
        vertices[2*i + 1] = Math.sin(i * angle);
    }

    // generate per-particle stuff

    var offsets = new Float32Array(2 * particleCount);
    var colors = new Float32Array(4 * particleCount);
    var radii = new Float32Array(particleCount);
    for (var i = 0; i < particleCount; i++) {
        offsets.set(particles[i].position, 2*i);
        colors.set(particles[i].color.rgba, 4*i);
        radii[i] = radius_scaling * particles[i].radius;
    }

    // set attributes
    
    var gl = renderer.gl;
    var particleShaderProgram = renderer.particleShaderProgram;
    
    gl.useProgram(particleShaderProgram);
    
    gl.uniformMatrix3fv(particleShaderProgram.screenMatrixUniform, false, renderer.screenMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, renderer.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(particleShaderProgram.vertexPositionAttribute);
    gl.vertexAttribPointer(particleShaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

    var ext = gl.getExtension("ANGLE_instanced_arrays");

    gl.bindBuffer(gl.ARRAY_BUFFER, renderer.offsetBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, offsets, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(particleShaderProgram.offsetAttribute);
    gl.vertexAttribPointer(particleShaderProgram.offsetAttribute, 2, gl.FLOAT, false, 0, 0);
    ext.vertexAttribDivisorANGLE(particleShaderProgram.offsetAttribute, 1);

    gl.bindBuffer(gl.ARRAY_BUFFER, renderer.scaleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, radii, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(particleShaderProgram.scaleAttribute);
    gl.vertexAttribPointer(particleShaderProgram.scaleAttribute, 1, gl.FLOAT, false, 0, 0);
    ext.vertexAttribDivisorANGLE(particleShaderProgram.scaleAttribute, 1);

    gl.bindBuffer(gl.ARRAY_BUFFER, renderer.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(particleShaderProgram.colorAttribute);
    gl.vertexAttribPointer(particleShaderProgram.colorAttribute, 4, gl.FLOAT, false, 0, 0);
    ext.vertexAttribDivisorANGLE(particleShaderProgram.colorAttribute, 1);

    ext.drawArraysInstancedANGLE(gl.TRIANGLE_FAN, 0, vertexCount, particleCount);
}

function drawTrajectory(renderer, trajectory, color)
{
    var vertexCount = trajectory.length / 2;
    var vertices = new Float32Array(trajectory);
    
    var gl = renderer.gl;
    var lineShaderProgram = renderer.lineShaderProgram;
    
    gl.useProgram(lineShaderProgram);
    
    gl.uniformMatrix3fv(lineShaderProgram.screenMatrixUniform, false, renderer.screenMatrix);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, renderer.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(lineShaderProgram.vertexPositionAttribute);
    gl.vertexAttribPointer(lineShaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);
    
    gl.uniform4fv(lineShaderProgram.colorUniform, color.rgba);

    gl.drawArrays(gl.LINE_STRIP, 0, vertexCount)
}