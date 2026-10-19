import { useEffect, useRef } from 'react'

/*
  Hero light scene, original single-pass WebGL2 implementation.
  Reproduces the measured scene config (CLONE_SPEC 2) analytically, without three.js:
    - camera z 16.54, fov 35, looking down -z
    - light cube 7x7x7 at z -9, screen-space 3-wave gradient (speed .1, size .99), pow 3
    - 16 touching glass cylinders r .5, h 15, centres x = i - 7, group rotated z .73 at z 0
    - transmission: refract with ior 1.5, thickness 1, thickness smear 2.88 (anisotropic blur),
      chromatic aberration 3 (G/B ior scaled 1 + CA*k, 1 + 2CA*k), roughness .35 normal jitter
  Motion (measured from the original's frame loop):
    - cube scale smooth-damps 0 -> 1, smoothTime 1s
    - cube rotation smooth-damps to [mouseX * .3, -mouseY * .3], smoothTime .5s (window mousemove, -1..1)
    - desktop only (viewport > 7.3 world units): distortion ramps toward 15 and temporal distortion
      toward .025, rate limited per frame like the original (about .006 and .002 per frame)
    - renders only while intersecting the viewport (IO threshold 0), stops for good after 200s
*/

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`

const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 uRes;        // canvas size in device px
uniform vec2 uCss;        // canvas size in CSS px
uniform float uTime;
uniform float uScale;     // cube scale 0..1
uniform vec2 uRot;        // cube rotation x, y (rad)
uniform float uDistortion;
uniform float uTemporal;
uniform float uSamples;

const vec3 BG = vec3(7.0, 9.0, 10.0) / 255.0;
const vec3 C1 = vec3(244.0, 254.0, 255.0) / 255.0;
const vec3 C2 = vec3(255.0, 122.0, 152.0) / 255.0;
const vec3 C3 = vec3(184.0, 2.0, 50.0) / 255.0;
const float CAM_Z = 16.54;
const float TAN_HALF_FOV = 0.31529879; // tan(17.5deg)
const float GLASS_ROT = 0.73;
const float IOR = 1.5;
const float CA = 3.0;
const float THICK = 1.0;
const float SMEAR = 2.88;
const float ROUGH = 0.35;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }

// 3D value noise, used for the slow glass wobble
float h3(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float noise3(vec3 p) {
  vec3 i = floor(p); vec3 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  float n = mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
                mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z);
  return n * 2.0 - 1.0;
}

// Light pattern: three waves summed, split around .5 into two colour ramps, cubed.
vec3 lightColor(vec2 xy) {
  float t = uTime * 0.1 + 10000.0;
  xy = (xy - 0.5) * 0.99 + 0.5;
  float a = cos(3.0 * xy.x + t);
  float b = cos(xy.x * cos(t) + 5.0 * xy.y * sin(t) + t);
  float rx = 0.3 * xy.x - 0.5 + cos(t);
  float ry = 0.3 * xy.y - 0.5 + sin(t * 0.5);
  float c = sin(20.0 * sqrt(rx * rx + ry * ry + 1.0) + t);
  float nv = ((a + b + c) / 3.0 + 1.0) * 0.5;
  vec3 col = nv < 0.5 ? mix(C3, C2, nv * 2.0) : mix(C2, C1, (nv - 0.5) * 2.0);
  return pow(col, vec3(3.0));
}

mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1,0,0, 0,c,s, 0,-s,c); }
mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c,0,-s, 0,1,0, s,0,c); }

vec3 rayDir(vec2 uv) {
  float aspect = uCss.x / uCss.y;
  vec2 ndc = uv * 2.0 - 1.0;
  return normalize(vec3(ndc.x * TAN_HALF_FOV * aspect, ndc.y * TAN_HALF_FOV, -1.0));
}

// Does the camera ray through screen uv hit the rotated, scaled cube?
float cubeMask(vec2 uv) {
  if (uScale < 0.001) return 0.0;
  vec3 ro = vec3(0.0, 0.0, CAM_Z);
  vec3 rd = rayDir(uv);
  mat3 inv = transpose(rotY(uRot.y) * rotX(uRot.x));
  vec3 o = inv * (ro - vec3(0.0, 0.0, -9.0));
  vec3 d = inv * rd;
  vec3 h = vec3(3.5 * uScale);
  vec3 t1 = (-h - o) / d, t2 = (h - o) / d;
  vec3 tmin = min(t1, t2), tmax = max(t1, t2);
  float tn = max(max(tmin.x, tmin.y), tmin.z);
  float tf = min(min(tmax.x, tmax.y), tmax.z);
  return tf > max(tn, 0.0) ? 1.0 : 0.0;
}

// What the glass sees behind it: the cube over the background. The light pattern is screen-space and in
// the original was rendered into the transmission buffer (useFBO(1024): 1024 wide x css height * dpr 2),
// so its coordinates are uv * (1024 / css width, 2).
vec3 behind(vec2 uv, vec2 patternScale) {
  return mix(BG, lightColor(uv * patternScale), cubeMask(uv));
}

vec2 project(vec3 p) {
  float aspect = uCss.x / uCss.y;
  float z = CAM_Z - p.z;
  vec2 ndc = vec2(p.x / (z * TAN_HALF_FOV * aspect), p.y / (z * TAN_HALF_FOV));
  return ndc * 0.5 + 0.5;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec3 ro = vec3(0.0, 0.0, CAM_Z);
  vec3 rd = rayDir(uv);

  // into glass-local space (group rotated about z)
  float cg = cos(-GLASS_ROT), sg = sin(-GLASS_ROT);
  mat2 toLocal = mat2(cg, sg, -sg, cg);
  vec2 loXY = toLocal * ro.xy, ldXY = toLocal * rd.xy;
  vec3 lo = vec3(loXY, ro.z), ld = vec3(ldXY, rd.z);

  // nearest of the 16 cylinders (centres x = -7..8, axis local y, length 15)
  float tz0 = -lo.z / ld.z;
  float u = lo.x + ld.x * tz0;
  float best = 1e9; float bestC = 0.0;
  for (int k = -1; k <= 1; k++) {
    float cx = clamp(floor(u + 0.5) + float(k), -7.0, 8.0);
    float ox = lo.x - cx;
    float A = ld.x * ld.x + ld.z * ld.z;
    float B = 2.0 * (ox * ld.x + lo.z * ld.z);
    float C = ox * ox + lo.z * lo.z - 0.25;
    float disc = B * B - 4.0 * A * C;
    if (disc > 0.0) {
      float t = (-B - sqrt(disc)) / (2.0 * A);
      if (t > 0.0 && t < best) { best = t; bestC = cx; }
    }
  }
  vec3 lp = lo + ld * best;
  vec2 patternGlass = vec2(1024.0 / uCss.x, 2.0);
  if (best > 1e8 || abs(lp.y) > 7.5) {
    // no glass here: the cube is seen directly, pattern in device px / css px (dpr 2 in the original)
    outColor = vec4(behind(uv, vec2(2.0)), 1.0);
    return;
  }

  // surface normal and world position
  vec3 ln = normalize(vec3(lp.x - bestC, 0.0, lp.z));
  mat2 toWorld = mat2(cg, -sg, sg, cg);
  vec3 n = vec3(toWorld * ln.xy, ln.z);
  vec3 wp = vec3(toWorld * lp.xy, lp.z);

  float dist = uDistortion * noise3(wp * 0.08 + uTime * uTemporal) * 0.06;
  float r0 = hash(gl_FragCoord.xy);
  vec3 acc = vec3(0.0);
  for (float i = 0.0; i < 8.0; i++) {
    if (i >= uSamples) break;
    float r1 = hash(gl_FragCoord.xy + i * 17.13);
    float r2 = hash(gl_FragCoord.yx + i * 31.71);
    float r3 = hash(gl_FragCoord.xy * 1.37 + i * 7.77);
    float r4 = hash(gl_FragCoord.yx * 0.71 + i * 3.19);
    float r5 = hash(gl_FragCoord.xy * 2.03 + i * 11.3);
    vec3 jitter = normalize(vec3(r1, r2, r3) - 0.5 + 1e-4) * pow(r4, 0.33);
    vec3 sn = normalize(n + ROUGH * ROUGH * 2.0 * jitter);
    float k = (i + r0) / uSamples;
    float thick = THICK + SMEAR * k + dist;
    vec3 tr = normalize(refract(rd, sn, 1.0 / IOR)) * thick;
    vec3 tg = normalize(refract(rd, sn, 1.0 / (IOR * (1.0 + CA * k)))) * thick;
    vec3 tb = normalize(refract(rd, sn, 1.0 / (IOR * (1.0 + 2.0 * CA * k)))) * thick;
    // roughness blur of the transmission buffer: the original samples mip ~3.5 of a 1024 buffer
    // bicubically (about 13 css px per texel, ~4 texel footprint). Triangular jitter of +-30 css px.
    vec2 blur = (vec2(r2 + r4, r3 + r5) - 1.0) * (30.0 / uCss);
      acc.r += behind(project(wp + tr) + blur, patternGlass).r;
    acc.g += behind(project(wp + tg) + blur, patternGlass).g;
    acc.b += behind(project(wp + tb) + blur, patternGlass).b;
  }
  outColor = vec4(acc / uSamples, 1.0);
}`

// Unity-style SmoothDamp, same model as maath's damp (critically damped, smoothTime in s)
function smoothDamp(state, key, target, smoothTime, dt, maxSpeed = Infinity) {
  const v = state[key + 'V'] || 0
  const omega = 2 / Math.max(1e-4, smoothTime)
  const x = omega * dt
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x)
  let change = state[key] - target
  const maxChange = maxSpeed * smoothTime
  change = Math.min(Math.max(change, -maxChange), maxChange)
  const to = state[key] - change
  const temp = (v + omega * change) * dt
  let nv = (v - omega * temp) * exp
  let out = to + (change + temp) * exp
  if (target - state[key] > 0 === out > target) {
    out = target
    nv = (out - target) / dt
  }
  state[key] = out
  state[key + 'V'] = nv
}

export default function HeroCanvas({ onReady }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    // The original scene does not check prefers-reduced-motion; neither does this one.
    const gl = canvas.getContext('webgl2', { antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: true })
    if (!gl) return

    const sh = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s))
      return s
    }
    let prog
    try {
      prog = gl.createProgram()
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
      gl.linkProgram(prog)
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog))
    } catch (e) {
      console.warn('[hero] WebGL scene unavailable, using CSS fallback', e)
      return
    }
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const U = {}
    ;['uRes', 'uCss', 'uTime', 'uScale', 'uRot', 'uDistortion', 'uTemporal', 'uSamples'].forEach((n) => (U[n] = gl.getUniformLocation(prog, n)))

    // Original: dpr 2 with a perf monitor that may lower it to 1.5. Mirror that, capped by the device.
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let cssW = 0
    let cssH = 0
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      cssW = Math.max(1, r.width)
      cssH = Math.max(1, r.height)
      canvas.width = Math.round(cssW * dpr)
      canvas.height = Math.round(cssH * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    const ro = new ResizeObserver(() => {
      resize()
      draw()
    })
    ro.observe(canvas)

    const s = { scale: 0, rx: 0, ry: 0, dist: 0, temporal: 0 }
    const mouse = { x: 0, y: 0 }
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -((e.clientY / window.innerHeight) * 2) + 1
    }
    window.addEventListener('mousemove', onMove)

    const start = performance.now()
    let last = start
    let raf = 0
    let visible = false
    let frames = 0
    let slowFrames = 0

    function draw() {
      const now = performance.now()
      const elapsed = (now - start) / 1000
      // world units across at z 0: 2 * 16.54 * tan(17.5deg) * aspect
      const viewportW = 2 * 16.54 * 0.31529879 * (cssW / cssH)
      gl.uniform2f(U.uRes, canvas.width, canvas.height)
      gl.uniform2f(U.uCss, cssW, cssH)
      gl.uniform1f(U.uTime, elapsed)
      gl.uniform1f(U.uScale, s.scale)
      gl.uniform2f(U.uRot, s.rx, s.ry)
      gl.uniform1f(U.uDistortion, s.dist)
      gl.uniform1f(U.uTemporal, s.temporal)
      gl.uniform1f(U.uSamples, viewportW < 7.3 ? 5 : 6)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      return viewportW
    }

    const tick = () => {
      raf = 0
      const now = performance.now()
      const dt = Math.min(0.1, (now - last) / 1000) || 0.016
      last = now
      const elapsed = (now - start) / 1000
      smoothDamp(s, 'scale', 1, 1, dt)
      smoothDamp(s, 'rx', mouse.x * 0.3, 0.5, dt)
      smoothDamp(s, 'ry', -mouse.y * 0.3, 0.5, dt)
      const viewportW = 2 * 16.54 * 0.31529879 * (cssW / cssH)
      if (viewportW > 7.3) {
        // original: damp(…, 15, smoothTime 30, maxSpeed 2e-4) and (.025, 10, 2e-4) -> per-frame steps
        s.dist = Math.min(15, s.dist + 0.006 * (dt * 60))
        s.temporal = Math.min(0.025, s.temporal + 0.002 * (dt * 60))
      }
      draw()
      if (frames === 0) onReady?.()
      frames++
      // perf monitor: drop to dpr 1.5, then 1, if frames are consistently slow
      if (dt > 0.03) slowFrames++
      if (frames % 60 === 0) {
        if (slowFrames > 30 && dpr > 1) {
          dpr = dpr > 1.5 ? 1.5 : 1
          resize()
        }
        slowFrames = 0
      }
      if (elapsed > 200) return // original switches the frame loop to "never" after 200s
      if (visible) raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting
        if (visible && !raf) {
          last = performance.now()
          raf = requestAnimationFrame(tick)
        }
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    return () => {
      io.disconnect()
      ro.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [onReady])

  return <canvas ref={ref} className="absolute inset-0 block h-full w-full" aria-hidden />
}
