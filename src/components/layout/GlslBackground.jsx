import { useEffect, useRef } from 'react';

const vertexShaderSource = `
  attribute vec2 aPosition;

  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform vec2 iResolution;
  uniform float iTime;

  #define PHI 1.61803398874989484820459

  float rand_with_seed(int i) {
    return fract(sin(float(i) * 12.9898 + 78.233) * 43758.5453);
  }

  float gold_noise(in vec2 xy, in float seed) {
    return fract(tan(distance(xy * PHI, xy) * seed) * xy.x);
  }

  void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    const int STARS_SIZE = 400;

    vec2 uv;
    if (iResolution.x > iResolution.y) {
      uv = fragCoord.xy * 2.0 / iResolution.x - 1.0;
      uv.y += (iResolution.x - iResolution.y) / iResolution.x;
    } else {
      uv = fragCoord.xy * 2.0 / iResolution.y - 1.0;
      uv.x += (iResolution.y - iResolution.x) / iResolution.y;
    }

    vec2 uv2 = fragCoord.xy / 1000.0 - iResolution.xy / 2000.0;
    vec3 col = mix(vec3(0.0, 0.0, 0.1), vec3(0.0, 0.0, 0.0), (uv.x * uv.x + uv.y * uv.y) / 2.0);

    float noise = gold_noise(uv.xy / 2.0, 10000000.0) / 30.0;
    col += noise;

    for(int i = 0; i < STARS_SIZE; i++) {
      float r1 = rand_with_seed(i);
      float r2 = rand_with_seed(i + 1);
      float r3 = rand_with_seed(i + 2);
      float r4 = rand_with_seed(i + 3);

      vec2 star_pos = vec2(r1 * 2.0 - 1.0, r2 * 2.0 - 1.0);
      float brightness = (sin(iTime / 5.0 + r3 * 12.9898) - 0.9) * 10.0;

      if (brightness > 0.0) {
        float to_star = sqrt(abs(uv2.x - star_pos.x)) + sqrt(abs(uv2.y - star_pos.y));
        float star_size = r4;
        if (to_star <= 0.1 * star_size) {
          col += mix(vec3(0.0), vec3(1.5, 1.5, 1.0), brightness);
        }
      }
    }

    gl_FragColor = vec4(col, 1.0);
  }
`;

// Keep the background intentionally cheaper than the foreground UI: FPS is capped while resolution stays crisp.
const targetFrameMs = 1000 / 15;
const renderScale = 1;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || 'Shader compilation failed.');
  }

  return shader;
}

function createProgram(gl) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || 'Shader program linking failed.');
  }

  return program;
}

// Full-screen WebGL background that runs the provided fragment shader without extra libraries.
export function GlslBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) return undefined;

    let animationFrameId = 0;
    let lastRenderedAt = 0;
    const program = createProgram(gl);
    const positionLocation = gl.getAttribLocation(program, 'aPosition');
    const resolutionLocation = gl.getUniformLocation(program, 'iResolution');
    const timeLocation = gl.getUniformLocation(program, 'iTime');
    const positionBuffer = gl.createBuffer();
    const startedAt = window.performance.now();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1) * renderScale;
      const width = Math.max(1, Math.floor(window.innerWidth * pixelRatio));
      const height = Math.max(1, Math.floor(window.innerHeight * pixelRatio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      gl.viewport(0, 0, width, height);
    };

    const drawFrame = (now) => {
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, (now - startedAt) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const render = (now) => {
      if (document.hidden) {
        animationFrameId = window.requestAnimationFrame(render);
        return;
      }

      if (now - lastRenderedAt >= targetFrameMs) {
        resize();
        drawFrame(now);
        lastRenderedAt = now;
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    resize();
    drawFrame(startedAt);
    animationFrameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} className="glsl-background" aria-hidden="true" />;
}
