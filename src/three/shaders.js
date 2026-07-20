/**
 * ─────────────────────────────────────────────────────────────
 *  GLSL SHADERS
 * ─────────────────────────────────────────────────────────────
 *  Custom shaders for the futuristic scene:
 *   - snoise: Ashima 3D simplex noise (shared chunk)
 *   - sky:    inside-out nebula background sphere
 *   - orb:    displaced, fresnel-lit energy core
 * ─────────────────────────────────────────────────────────────
 */

/* Classic Ashima simplex noise — well-known, compiles everywhere. */
export const snoise = /* glsl */ `
vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`

/* ── GEOMETRIC PATTERN BACKGROUND (inside-out sphere) ───────────────
     Renders tech/architectural geometry on jet black instead of
     organic nebula clouds. Patterns include a wireframe grid,
     hexagonal tessellation, concentric rings, and radial tech beams. ──*/
export const skyVertex = /* glsl */ `
varying vec3 vPos;
void main() {
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const skyFragment = /* glsl */ `
precision highp float;
varying vec3 vPos;
uniform float uTime;
uniform float uScroll;

// ── Anti-aliased line helper ────────────────────────────────────
float aastep(float width, float v) {
  float d = fwidth(v);
  return smoothstep(width - d, width + d, v);
}

void main(){
  vec3 col = vec3(0.0);                       // jet black base
  vec3 dir = normalize(vPos);

  // Spherical coordinates for pattern mapping.
  float theta = atan(dir.z, dir.x);           // -PI..PI  longitude
  float phi   = acos(dir.y);                  //  0..PI   latitude

  // ── 1. Wireframe grid (lat/long lines) ───────────────────────
  float gridLat = sin(phi * 22.0 + uTime * 0.008) * 0.5 + 0.5;
  float gridLon = sin(theta * 16.0 + uTime * 0.006) * 0.5 + 0.5;
  float grid    = aastep(0.94, gridLat) + aastep(0.94, gridLon);

  // ── 2. Hexagonal tessellation ────────────────────────────────
  float hx = theta * 7.0;
  float hy = phi * 5.0;
  float hexDist = max(
    abs(sin(hx + sin(hy) * 0.5)),
    abs(cos(hy + sin(hx) * 0.5))
  );
  float hexCells = aastep(0.82, hexDist);
  float hexAnim = sin(uTime * 0.05 + hexDist * 4.0) * 0.5 + 0.5;
  float hexPulse = aastep(0.70 + hexAnim * 0.18, hexDist);

  // ── 3. Concentric rings ──────────────────────────────────────
  float ringsRaw = sin(phi * 14.0 - uTime * 0.04 + uScroll * 3.0);
  float rings    = aastep(0.90, ringsRaw * 0.5 + 0.5);

  // ── 4. Radial tech beams ─────────────────────────────────────
  float beamsRaw = sin(theta * 28.0 + uScroll * 5.0) * sin(phi * 8.0 + uScroll * 2.0);
  float beams    = aastep(0.88, beamsRaw * 0.5 + 0.5);

  // ── 5. Scan-line pulse ───────────────────────────────────────
  float scanY = sin(phi * 60.0 + uTime * 0.2) * 0.5 + 0.5;
  float scan  = aastep(0.94, scanY);

  // ── Composite with scroll-driven density ──────────────────────
  float density = 0.4 + uScroll * 0.6;              // more patterns as you scroll
  float pattern  = grid     * 0.15 * density;
       pattern += hexCells * 0.08 * density;
       pattern += hexPulse * 0.04 * density;
       pattern += rings    * 0.10 * density;
       pattern += beams    * 0.06 * density;
       pattern += scan     * 0.03 * density;

  // ── Scroll-driven accent color ───────────────────────────────
  vec3 accentA = mix(vec3(0.10, 0.14, 0.30), vec3(0.14, 0.08, 0.30), uScroll);
  vec3 accentB = mix(vec3(0.06, 0.10, 0.20), vec3(0.20, 0.06, 0.25), uScroll);

  col += accentA * (grid + rings) * 0.12;
  col += accentB * (hexCells + beams) * 0.08;

  // ── Subtle central glow for depth ────────────────────────────
  float centerGlow = pow(1.0 - abs(dir.y), 4.0) * 0.03;
  col += vec3(0.02, 0.03, 0.06) * centerGlow;

  // Keep everything extremely dark — jet black with faint etched lines.
  col = clamp(col, 0.0, 0.18);

  gl_FragColor = vec4(col, 1.0);
}
`

/* ── MORPHING TORUS KNOT ───────────────────────────────────────────
     Vertex displacement with simplex noise creates an organic, living
     surface. Scroll controls morph intensity; pointer creates a bulge. ──*/
export const knotVertex = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uScroll;
uniform vec3  uPointer;
uniform float uScale;
varying vec3  vNormal;
varying vec3  vView;
varying float vNoise;
${snoise}

void main(){
  vec3 pos = position;
  float t = uTime * 0.15;

  // 3-octave noise for organic morphing
  float n  = snoise(pos * 1.8 + t);
  n       += 0.5  * snoise(pos * 3.5 - t * 1.2);
  n       += 0.25 * snoise(pos * 7.0 + t * 0.8);

  // Displacement intensity grows with scroll
  float intensity = 0.06 + uScroll * 0.14;
  // Pointer bulge — follow the cursor
  float bulge = dot(normalize(pos), normalize(uPointer + 0.0001)) * 0.04;
  float displacement = (n * 0.5 + 0.5) * intensity + bulge;

  vec3 newPos = pos + normal * displacement;
  vNoise = n;

  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(newPos, 1.0);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`

export const knotFragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uScroll;
uniform vec3  uBlue;
uniform vec3  uViolet;
varying vec3  vNormal;
varying vec3  vView;
varying float vNoise;

void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vView);

  // Fresnel rim — bright at edges, dark at center
  float fresnel = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.6);

  // Gradient: blue→violet driven by noise + scroll
  float mixVal = clamp(vNoise * 0.8 + 0.5 + uScroll * 0.3, 0.0, 1.0);
  vec3 base = mix(uBlue, uViolet, mixVal);

  // Energy pulse rippling across the surface
  float pulse = sin(uTime * 0.5 + vNoise * 4.0) * 0.5 + 0.5;

  vec3 col = base * 0.12;
  col += fresnel * base * 2.6;
  col += pow(fresnel, 4.0) * vec3(1.6);       // white-hot core rim
  col += base * pulse * 0.15;                 // surface energy pulse

  gl_FragColor = vec4(col, 1.0);
}
`

/* ── ENERGY CORE ORB (displaced sphere + fresnel rim) ── */
export const orbVertex = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uScroll;
uniform float uDisplace;
uniform vec3  uPointer;
varying vec3  vNormal;
varying vec3  vView;
varying float vNoise;
${snoise}

void main(){
  vec3 pos = position;

  // Layered noise displacement — a living, morphing surface.
  float t = uTime * 0.35;
  float n  = snoise(pos * 1.1 + vec3(0.0, 0.0, t));
  n       += 0.5  * snoise(pos * 2.3 + vec3(t * 1.3));
  n       += 0.25 * snoise(pos * 4.6 - vec3(t));

  // Pointer creates a soft bulge; scroll increases turbulence.
  float bulge = dot(normalize(pos), normalize(uPointer + 0.0001)) * 0.15;
  float displacement = (n + bulge) * (uDisplace + uScroll * 0.35);

  vec3 newPos = pos + normal * displacement;
  vNoise = n;

  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(newPos, 1.0);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`

export const orbFragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uScroll;
uniform vec3  uCyan;
uniform vec3  uPurple;
varying vec3  vNormal;
varying vec3  vView;
varying float vNoise;

void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vView);

  // Fresnel rim — the neon glow along the silhouette.
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.4);

  // Base color flows between cyan and purple with the noise + scroll.
  float mixv = smoothstep(-1.0, 1.0, vNoise) * 0.6 + uScroll * 0.4;
  vec3 base = mix(uCyan, uPurple, clamp(mixv, 0.0, 1.0));

  vec3 col = base * 0.25;                 // dark interior
  col += fres * mix(uCyan, uPurple, uScroll) * 2.6;  // glowing rim
  col += pow(fres, 3.0) * 1.5;            // hot white edge

  gl_FragColor = vec4(col, 1.0);
}
`

/* ── SOFT GLOW HALO (additive shell around the core, fakes bloom) ── */
export const haloFragment = /* glsl */ `
precision highp float;
uniform float uScroll;
uniform vec3  uCyan;
uniform vec3  uPurple;
varying vec3  vNormal;
varying vec3  vView;
varying float vNoise;

void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vView);
  // Bright at the silhouette, transparent toward the center → aura.
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.0);
  vec3 col = mix(uCyan, uPurple, clamp(uScroll + vNoise * 0.2, 0.0, 1.0));
  gl_FragColor = vec4(col, fres * 0.55);
}
`




