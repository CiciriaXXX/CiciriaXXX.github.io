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

  const int NS = 100;
  const float CI = 0.3;

  float N21(vec2 p) {
    return fract(sin(p.x * 100.0 + p.y * 7446.0) * 8345.0);
  }

  float SS(vec2 uv) {
    vec2 lv = fract(uv);
    lv = lv * lv * (3.0 - 2.0 * lv);
    vec2 id = floor(uv);

    float bl = N21(id);
    float br = N21(id + vec2(1.0, 0.0));
    float b = mix(bl, br, lv.x);

    float tl = N21(id + vec2(0.0, 1.0));
    float tr = N21(id + vec2(1.0, 1.0));
    float t = mix(tl, tr, lv.x);

    return mix(b, t, lv.y);
  }

  float L(vec2 uv, vec2 ofs, float b, float l) {
    return smoothstep(
      0.0,
      1000.0,
      b * max(0.1, l) / pow(max(0.0000000000001, length(uv - ofs)), 1.0 / max(0.1, l))
    );
  }

  vec2 H12(float s) {
    vec2 p = vec2(s * 127.1 + 311.7, s * 269.5 + 183.3);
    return fract(sin(p) * 43758.5453123) - 0.5;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;

    uv -= 0.5;
    uv.x *= iResolution.x / iResolution.y;

    vec4 col = vec4(0.0);

    vec4 b = vec4(0.01176470588, 0.05098039215, 0.14117647058, 1.0);
    vec4 p = vec4(0.13333333333, 0.07843137254, 0.13725490196, 1.0);
    vec4 lb = vec4(0.10196078431, 0.21568627451, 0.33333333333, 1.0);

    vec4 blb = mix(b, lb, -uv.x * 0.2 - (uv.y * 0.5));

    col += mix(blb, p, uv.x - (uv.y * 1.5));

    for (int i = 0; i < NS; i++) {
      float fi = float(i);
      vec2 ofs = H12(fi + 1.0);
      ofs *= vec2(1.8, 1.1);

      float r = 0.18;
      if (mod(fi, 10.0) == 0.0) {
        r = 0.7 + abs(sin(fi / 31.0)) * 0.6;
      }

      col += vec4(L(uv, ofs, r + (sin(fract(iTime) * 0.5 * fi) + 1.0) * 0.02, 1.0));
    }

    uv.x += iTime * 0.03;
    uv.y += sin(iTime * 0.03);

    float c = 0.0;

    for (int i = 1; i < 8; i++) {
      float fi = float(i);
      c += SS(uv * pow(2.0, fi)) * pow(0.5, fi);
    }

    col = col + c * CI;

    gl_FragColor = col;
  }
`;

// Keep the background intentionally cheaper than the foreground UI: FPS is capped while resolution stays crisp.
const targetFrameMs = 1000 / 15;
const renderScale = 0.8;
const staticBackgroundQuery = '(max-width: 767px), (pointer: coarse), (prefers-reduced-motion: reduce)';

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
    const staticBackground = window.matchMedia(staticBackgroundQuery).matches;
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

    if (staticBackground) {
      const handleResize = () => {
        resize();
        drawFrame(startedAt);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
      };
    }

    animationFrameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} className="glsl-background" aria-hidden="true" />;
}
