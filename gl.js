var tau = 2 * Math.PI;

var gl;
var vertexBuffer;
var offsetBuffer;
var colorBuffer;
var screenMatrix = mat3.create();
var shaderProgram;



function initGraphics(canvas) {
  
    // init GL
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    if (!gl) {
        console.log("Couldn't load WebGL.")
    }

    // vertex shader

    var vertexShader = loadShader(gl, gl.VERTEX_SHADER,[
        "attribute vec2 vertexPosition;",
        "attribute vec2 offset;",
        "attribute vec4 color;",

        "uniform mat3 screenMatrix;",
        
        "varying lowp vec4 vColor;",

        "void main(void) {",
            "vec2 newPosition = vertexPosition + offset;",
            "vec2 screenPosition = (screenMatrix * vec3(newPosition, 1.0)).xy;",
            "gl_Position = vec4(screenPosition, 0, 1);",
            "vColor = color;",
        "}",
    ].join("\n"));

    // fragment shader

    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, [
        "varying lowp vec4 vColor;",

        "void main(void) {",
            "gl_FragColor = vColor;",
        "}",
    ].join("\n"));
  
    // set up shaders

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.log("Could not initialise shaders");
      return null;
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPosition");
    shaderProgram.offsetAttribute = gl.getAttribLocation(shaderProgram, "offset");
    shaderProgram.colorAttribute  = gl.getAttribLocation(shaderProgram, "color");

    shaderProgram.screenMatrixUniform = gl.getUniformLocation(shaderProgram, "screenMatrix");

    // set up screen


    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    mat3.identity(screenMatrix);
    mat3.translate(screenMatrix, screenMatrix, [-1, -1]);
    mat3.scale(screenMatrix, screenMatrix, [2 / gl.canvas.width, 2 / gl.canvas.height]);
    gl.uniformMatrix3fv(shaderProgram.screenMatrixUniform, false, screenMatrix);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // set up buffers

    vertexBuffer = gl.createBuffer();
    offsetBuffer = gl.createBuffer();
    colorBuffer  = gl.createBuffer();
}

function resize_canvas() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    mat3.identity(screenMatrix);
    var aspectRatio = gl.canvas.width / gl.canvas.height;
    mat3.scale(screenMatrix, screenMatrix, [1 / aspectRatio, 1]);
    gl.uniformMatrix3fv(shaderProgram.screenMatrixUniform, false, screenMatrix);
}

function clear_canvas() {
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function drawBalls(balls, radius) {
    
    var ballCount = balls.length;
    var vertexCount = Math.max(Math.floor(4*radius), 20);

    // generate vertices

    var vertices = new Float32Array(2 * vertexCount);
    var angle = tau / vertexCount;
    for (var i = 0; i < vertexCount; i++) {
        vertices[2*i]     = radius * Math.cos(i * angle);
        vertices[2*i + 1] = radius * Math.sin(i * angle);
    }
    
    // generate per-ball stuff
    
    var offsets = new Float32Array(2 * ballCount);
    var colors = new Float32Array(4 * ballCount);
    for (var i = 0; i < ballCount; i++) {
        offsets.set(balls[i].position, 2*i);
        colors.set(balls[i].color.rgba, 4*i);
    }
    
    // set attributes
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);
    
    var ext = gl.getExtension("ANGLE_instanced_arrays");
    
    gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, offsets, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(shaderProgram.offsetAttribute);
    gl.vertexAttribPointer(shaderProgram.offsetAttribute, 2, gl.FLOAT, false, 0, 0);
    ext.vertexAttribDivisorANGLE(shaderProgram.offsetAttribute, 1);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(shaderProgram.colorAttribute);
    gl.vertexAttribPointer(shaderProgram.colorAttribute, 4, gl.FLOAT, false, 0, 0);
    ext.vertexAttribDivisorANGLE(shaderProgram.colorAttribute, 1);
    
    ext.drawArraysInstancedANGLE(gl.TRIANGLE_FAN, 0, vertexCount, ballCount);
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