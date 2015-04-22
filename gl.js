var tau = 2 * Math.PI;

var gl;
var vertexBuffer;
var viewMatrix = mat3.create();
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

        "uniform mat3 screenMatrix;",
        "uniform mat3 viewMatrix;",

        "void main(void) {",
            "vec2 position = (screenMatrix * viewMatrix * vec3(vertexPosition, 1.0)).xy;",
            "gl_Position = vec4(position, 0, 1);",
        "}",
    ].join("\n"));

    // fragment shader

    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, [
        "precision mediump float;",
        "uniform vec4 color;",

        "void main(void) {",
            "gl_FragColor = color;",
        "}",
    ].join("\n"));
  
    // set up shaders

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.viewMatrixUniform = gl.getUniformLocation(shaderProgram, "viewMatrix");
    shaderProgram.screenMatrixUniform = gl.getUniformLocation(shaderProgram, "screenMatrix");
    shaderProgram.colorUniform = gl.getUniformLocation(shaderProgram, "color");

    // set up screen


    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    mat3.identity(screenMatrix);
    mat3.translate(screenMatrix, screenMatrix, [-1, -1]);
    mat3.scale(screenMatrix, screenMatrix, [2 / gl.canvas.width, 2 / gl.canvas.height]);
    gl.uniformMatrix3fv(shaderProgram.screenMatrixUniform, false, screenMatrix);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // set up buffer

    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);
}

function resize_canvas() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    mat3.identity(screenMatrix);
    mat3.translate(screenMatrix, screenMatrix, [-1, -1]);
    mat3.scale(screenMatrix, screenMatrix, [2 / gl.canvas.width, 2 / gl.canvas.height]);
    gl.uniformMatrix3fv(shaderProgram.screenMatrixUniform, false, screenMatrix);
}

function clear_canvas() {
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function draw_ball(ball) {
    drawDisc([ball.position.x, ball.position.y], ball_radius, ball.color);
}

function drawDisc(center, radius, color, vertexCount) {

    vertexCount = vertexCount || Math.max(Math.floor(2*radius), 10);

    // generate vertices

    var vertices = new Float32Array(2 * vertexCount);
    var angle = tau / vertexCount;
    for (var i = 0; i < vertexCount; i++) {
        vertices[2*i]     = Math.cos(i * angle);
        vertices[2*i + 1] = Math.sin(i * angle);
    }

    mat3.identity(viewMatrix);
    mat3.translate(viewMatrix, viewMatrix, center);
    mat3.scale(viewMatrix, viewMatrix, [radius, radius]);
    gl.uniformMatrix3fv(shaderProgram.viewMatrixUniform, false, viewMatrix);
    
    gl.uniform4fv(shaderProgram.colorUniform, color.rgba);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertexCount);
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