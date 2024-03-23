var ddaCanvas = document.getElementById("dda-canvas");
ddaCanvas.width = 500
ddaCanvas.height = 300

var ddagl = ddaCanvas.getContext("webgl2");
ddagl.clearColor(0.1, 0.2, 0.3, 0.4);
ddagl.clear(ddagl.DEPTH_BUFFER_BIT | ddagl.COLOR_BUFFER_BIT);

var maxX = 20,
    maxY = 20;

const dda = (x1, y1, x2, y2) => {
    const ddaVertices = [];

    const length = Math.abs(x2 - x1) >= Math.abs(y2 - y1) ? Math.abs(x2 - x1) : Math.abs(y2 - y1);
    const deltaX = (x2 - x1) / length;
    const deltaY = (y2 - y1) / length;
    let x = x1 + 0.5;
    let y = y1 + 0.5;

    let i = 1;
    while (i <= length) {
        let coords = convertCoords(x, y);
        ddaVertices.push(coords.convertedX, coords.convertedY);

        x = x + deltaX;
        y = y + deltaY;
        i = i + 1;
    }

    return ddaVertices;
}

var vertices = dda(0, 0, 20, 13);

var bufferId = ddagl.createBuffer();
ddagl.bindBuffer(ddagl.ARRAY_BUFFER, bufferId);
ddagl.bufferData(ddagl.ARRAY_BUFFER, new Float32Array(vertices), ddagl.STATIC_DRAW);

var vertexShader = `#version 300 es
  precision mediump float;
  
  in vec2 aPosition;
  
  void main(){
  gl_PointSize = 10.0;
  gl_Position = vec4(aPosition, 0.0, 1.0);
  }`;

var fragmentShader = `#version 300 es
  precision highp float;
  out vec4 fColor;
  void main(){
     fColor=vec4(1.0, 1.0, 0.0, 1);
  }`;

var vertShdr = ddagl.createShader(ddagl.VERTEX_SHADER);
var fragShdr = ddagl.createShader(ddagl.FRAGMENT_SHADER);
ddagl.shaderSource(vertShdr, vertexShader);
ddagl.shaderSource(fragShdr, fragmentShader);
ddagl.compileShader(vertShdr);
ddagl.compileShader(fragShdr);

if (!ddagl.getShaderParameter(vertShdr, ddagl.COMPILE_STATUS)) {
    var msg =
        "Vertex shader failed to compile.  The error log is:" +
        "<pre>" +
        ddagl.getShaderInfoLog(vertShdr) +
        "</pre>";
    alert(msg);
}

if (!ddagl.getShaderParameter(fragShdr, ddagl.COMPILE_STATUS)) {
    var msg =
        "Fragment shader failed to compile.  The error log is:" +
        "<pre>" +
        ddagl.getShaderInfoLog(fragShdr) +
        "</pre>";
    alert(msg);
}

var program = ddagl.createProgram();
ddagl.attachShader(program, vertShdr);
ddagl.attachShader(program, fragShdr);
ddagl.linkProgram(program);

if (!ddagl.getProgramParameter(program, ddagl.LINK_STATUS)) {
    var msg =
        "Shader program failed to link.  The error log is:" +
        "<pre>" +
        ddagl.getProgramInfoLog(program) +
        "</pre>";
    alert(msg);
}

ddagl.useProgram(program);
var positionLoc = ddagl.getAttribLocation(program, "aPosition");
ddagl.vertexAttribPointer(positionLoc, 2, ddagl.FLOAT, false, 0, 0);
ddagl.enableVertexAttribArray(positionLoc);

ddagl.drawArrays(ddagl.POINTS, 0, vertices.length / 2);
