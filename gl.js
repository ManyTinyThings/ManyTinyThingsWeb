var tau = 2 * Math.PI;

var gl;
var vertexBuffer;
var offsetBuffer;
var colorBuffer;
var scaleBuffer;
var screenMatrix = mat3.create();
var particleShaderProgram;
var lineShaderProgram;

function createShaderProgram(vertexShader, fragmentShader)
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

function initGraphics(canvas) {

    // init GL
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
        console.log("Couldn't load WebGL.");
        return;
    }
    
    // set up screen
    
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    mat3.identity(screenMatrix);
    mat3.translate(screenMatrix, screenMatrix, [-1, -1]);
    mat3.scale(screenMatrix, screenMatrix, [2 / gl.canvas.width, 2 / gl.canvas.height]);
    
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
    
    particleShaderProgram = createShaderProgram(particleVertexShader, fragmentShader);
    lineShaderProgram = createShaderProgram(lineVertexShader, fragmentShader);

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

    vertexBuffer = gl.createBuffer();
    offsetBuffer = gl.createBuffer();
    colorBuffer  = gl.createBuffer();
    scaleBuffer  = gl.createBuffer();
}

function resize_canvas() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    mat3.identity(screenMatrix);
    var aspectRatio = gl.canvas.width / gl.canvas.height;
    mat3.scale(screenMatrix, screenMatrix, [1 / aspectRatio, 1]);
}

function clear_canvas() {
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function drawParticles(particles, radius) {

    var particleCount = particles.length;
    var vertexCount = Math.max(Math.floor(4*radius), 20);

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
        radii[i] = particle_radius * particles[i].radius;
    }

    // set attributes

    gl.useProgram(particleShaderProgram);
    
    gl.uniformMatrix3fv(particleShaderProgram.screenMatrixUniform, false, screenMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(particleShaderProgram.vertexPositionAttribute);
    gl.vertexAttribPointer(particleShaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

    var ext = gl.getExtension("ANGLE_instanced_arrays");

    gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, offsets, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(particleShaderProgram.offsetAttribute);
    gl.vertexAttribPointer(particleShaderProgram.offsetAttribute, 2, gl.FLOAT, false, 0, 0);
    ext.vertexAttribDivisorANGLE(particleShaderProgram.offsetAttribute, 1);

    gl.bindBuffer(gl.ARRAY_BUFFER, scaleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, radii, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(particleShaderProgram.scaleAttribute);
    gl.vertexAttribPointer(particleShaderProgram.scaleAttribute, 1, gl.FLOAT, false, 0, 0);
    ext.vertexAttribDivisorANGLE(particleShaderProgram.scaleAttribute, 1);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(particleShaderProgram.colorAttribute);
    gl.vertexAttribPointer(particleShaderProgram.colorAttribute, 4, gl.FLOAT, false, 0, 0);
    ext.vertexAttribDivisorANGLE(particleShaderProgram.colorAttribute, 1);

    ext.drawArraysInstancedANGLE(gl.TRIANGLE_FAN, 0, vertexCount, particleCount);
}

function drawTrajectory(trajectory, color)
{
    var vertexCount = trajectory.length / 2;
    var vertices = new Float32Array(trajectory);
    
    gl.useProgram(lineShaderProgram);
    
    gl.uniformMatrix3fv(lineShaderProgram.screenMatrixUniform, false, screenMatrix);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(lineShaderProgram.vertexPositionAttribute);
    gl.vertexAttribPointer(lineShaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);
    
    gl.uniform4fv(lineShaderProgram.colorUniform, color.rgba);

    gl.drawArrays(gl.LINE_STRIP, 0, vertexCount)
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
