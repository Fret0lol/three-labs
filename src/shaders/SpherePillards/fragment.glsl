#include "../noise/simplex3d.glsl"

uniform sampler2D uMatCap;
uniform float uSpecterSize;
uniform float uTime;
uniform float uWaveBorderSize;
uniform vec3 uWaveBorderColor;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vMatCapUV;

void main() {

  float n3 = snoise(vec3(vPosition.xz * 5.0, uTime * 1.0)) * 0.5;

  // Wave mask
  float wave = sin(vPosition.y * 2.0 - uTime * 10.0);
  float mask = step(wave, n3 - uSpecterSize);

  // Border wave mask
  float borderMask = step(wave, n3 - uSpecterSize);
  borderMask -= step(wave, n3 - (uSpecterSize + uWaveBorderSize));
  vec4 borderOut = vec4(uWaveBorderColor * borderMask, borderMask);

  vec4 matCapColor = vec4(texture2D(uMatCap, vMatCapUV).rgb, mask);

  // Transparency
  float opMask = 1.0 - vPosition.y;
  opMask *= 0.05;
  opMask += 0.5;
  vec4 opMaskOut = vec4(1.0, 1.0, 1.0, opMask);

  vec4 color = matCapColor + borderOut;
  color *= opMaskOut;

  gl_FragColor = vec4(color);

  // float positionY = vPosition.y * 0.2 - 0.4;
  // if (positionY <= 0.0) positionY = 0.0;
  // color = vec4(positionY);
  // gl_FragColor = vec4(color.rgb, 1.0);
}
