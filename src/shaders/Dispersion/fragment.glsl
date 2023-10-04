// uniform vec2 winResolution;
// uniform sampler2D uTexture;

// varying vec3 worldNormal;
// varying vec3 eyeVector;

// void main() {
//   float iorRatio = 1.0/1.31;
//   vec2 uv = gl_FragCoord.xy / winResolution.xy;
//   vec3 normal = worldNormal;
//   vec3 refractVec = refract(eyeVector, normal, iorRatio);
  
//   vec4 color = texture2D(uTexture, uv + refractVec.xy);
  
//   gl_FragColor = color;
// }

uniform float uIorR;
uniform float uIorG;
uniform float uIorB;
uniform vec2 winResolution;
uniform sampler2D uTexture;

varying vec3 worldNormal;
varying vec3 eyeVector;

void main() {
  float iorRatioRed = 1.0/uIorR;
  float iorRatioGreen = 1.0/uIorG;
  float iorRatioBlue = 1.0/uIorB;

  vec3 color = vec3(1.0);

  vec2 uv = gl_FragCoord.xy / winResolution.xy;
  vec3 normal = worldNormal;

  vec3 refractVecR = refract(eyeVector, normal, iorRatioRed);
  vec3 refractVecG = refract(eyeVector, normal, iorRatioGreen);
  vec3 refractVecB = refract(eyeVector, normal, iorRatioBlue);
  
  float R = texture2D(uTexture, uv + refractVecR.xy).r;
  float G = texture2D(uTexture, uv + refractVecG.xy).g;
  float B = texture2D(uTexture, uv + refractVecB.xy).b;

  color.r = R;
  color.g = G;
  color.b = B;

  gl_FragColor = vec4(color, 1.0);
}