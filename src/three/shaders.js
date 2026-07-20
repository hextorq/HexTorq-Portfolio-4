/**
 * ─────────────────────────────────────────────────────────────
 *  GLSL SHADERS (EXACT HEX SECTION COLOR STOPS)
 * ─────────────────────────────────────────────────────────────
 *  Exact Color Map:
 *   - Hero (0%):       #3D6BFF (electric blue) → #5C4DFF (indigo)
 *   - Services (25%):  #5C4DFF (indigo) → #9E42F2 (violet)
 *   - Products (50%):  #9E42F2 (violet) → #21B8DB (teal-cyan)
 *   - Projects (75%):  #21B8DB (teal) → #3D6BFF (blue)
 *   - Contact (100%):  #3D6BFF (blue) → #7D56F2 (violet)
 * ─────────────────────────────────────────────────────────────
 */

/* Classic Ashima simplex noise */
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

/* ── NEBULA BACKGROUND ── */
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
${snoise}

float fbm(vec3 p){
  float v = 0.0;
  v += 0.5000 * snoise(p); p *= 2.0;
  v += 0.2500 * snoise(p); p *= 2.0;
  v += 0.1250 * snoise(p); p *= 2.0;
  v += 0.0625 * snoise(p);
  return v;
}

float fbmWarp(vec3 p){
  float v = 0.0;
  v += 0.500 * snoise(p); p *= 2.0;
  v += 0.250 * snoise(p);
  return v;
}

void main(){
  vec3 dir = normalize(vPos);
  vec3 q = dir * 1.7;
  q.z += uTime * 0.05;
  q.y += uScroll * 0.7;

  // Domain-warped fbm → flowing aurora clouds.
  float n = fbm(q + fbmWarp(q * 0.7 + uTime * 0.04));
  n = n * 0.5 + 0.5;

  float n2 = fbmWarp(q * 0.5 - vec3(uTime * 0.03, 0.0, 0.0));
  n2 = n2 * 0.5 + 0.5;

  float blueField   = smoothstep(0.30, 0.92, n);
  float violetField = smoothstep(0.42, 1.00, mix(n, n2, 0.5));
  float hot         = smoothstep(0.72, 1.00, n);

  // Exact Hex Section Stops:
  //   0.0  Hero      → #3D6BFF (0.239, 0.420, 1.0) ↔ #5C4DFF (0.361, 0.302, 1.0)
  //   0.25 Services  → #5C4DFF (0.361, 0.302, 1.0) ↔ #9E42F2 (0.620, 0.259, 0.949)
  //   0.50 Products  → #9E42F2 (0.620, 0.259, 0.949) ↔ #21B8DB (0.129, 0.722, 0.859)
  //   0.75 Projects  → #21B8DB (0.129, 0.722, 0.859) ↔ #3D6BFF (0.239, 0.420, 1.0)
  //   1.00 Contact   → #3D6BFF (0.239, 0.420, 1.0) ↔ #7D56F2 (0.490, 0.337, 0.949)
  vec3 cHeroA = vec3(0.239, 0.420, 1.0);
  vec3 cHeroB = vec3(0.361, 0.302, 1.0);
  vec3 cServB = vec3(0.620, 0.259, 0.949);
  vec3 cProdB = vec3(0.129, 0.722, 0.859);
  vec3 cProjB = vec3(0.239, 0.420, 1.0);
  vec3 cContB = vec3(0.490, 0.337, 0.949);

  vec3 accentA, accentB;
  float s = clamp(uScroll, 0.0, 1.0) * 4.0;
  if (s < 1.0) {
    float f = smoothstep(0.0, 1.0, s);
    accentA = mix(cHeroA, cHeroB, f);
    accentB = mix(cHeroB, cServB, f);
  } else if (s < 2.0) {
    float f = smoothstep(0.0, 1.0, s - 1.0);
    accentA = mix(cHeroB, cServB, f);
    accentB = mix(cServB, cProdB, f);
  } else if (s < 3.0) {
    float f = smoothstep(0.0, 1.0, s - 2.0);
    accentA = mix(cServB, cProdB, f);
    accentB = mix(cProdB, cProjB, f);
  } else {
    float f = smoothstep(0.0, 1.0, s - 3.0);
    accentA = mix(cProdB, cProjB, f);
    accentB = mix(cProjB, cContB, f);
  }

  vec3 uBaseCol = vec3(0.02, 0.03, 0.06);
  vec3 col = uBaseCol;
  col += accentA * blueField   * 0.95;
  col += accentB * violetField * 1.05;
  col += vec3(0.55, 0.68, 1.0) * hot * 0.6;

  float centerGlow = pow(1.0 - abs(dir.y), 3.0);
  col += mix(accentA, accentB, 0.5) * centerGlow * (0.18 + 0.25 * uScroll);

  float grad = smoothstep(-1.0, 1.0, dir.y);
  col *= mix(0.7, 1.25, grad);

  col = mix(uBaseCol, col, 0.96);

  gl_FragColor = vec4(col, 1.0);
}
`

/* ── THE "X" MOTIF SHADERS ──────────────────────────────────────── */
export const xVertex = /* glsl */ `
precision highp float;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vWorld;
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld  = wp.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vView   = cameraPosition - wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`

export const xFragment = /* glsl */ `
precision highp float;
uniform vec3  uBlue;
uniform vec3  uViolet;
varying vec3  vNormal;
varying vec3  vView;
varying vec3  vWorld;
void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vView);
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.2);

  float t = clamp(vWorld.x * 0.32 + 0.5, 0.0, 1.0);
  vec3 base = mix(uBlue, uViolet, t);

  vec3 col = base * 0.30;
  col += fres * base * 2.6;
  col += pow(fres, 3.0) * 1.3;
  gl_FragColor = vec4(col, 1.0);
}
`

export const xHaloFragment = /* glsl */ `
precision highp float;
uniform vec3  uBlue;
uniform vec3  uViolet;
varying vec3  vNormal;
varying vec3  vView;
varying vec3  vWorld;
void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vView);
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.0);
  float t = clamp(vWorld.x * 0.32 + 0.5, 0.0, 1.0);
  vec3 col = mix(uBlue, uViolet, t);
  gl_FragColor = vec4(col, fres * 0.5);
}
`
