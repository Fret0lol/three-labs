import {useFrame} from "@react-three/fiber";
import { useControls } from "leva";
import {useCallback, useEffect, useMemo, useRef} from "react";
import { Color, Vector2 } from "three";

export default function Gradient() {
	const mesh = useRef();
  const mousePosition = useRef({ x: 0, y: 0 })

  // Récupération des coordonnées de la souris
  const updateMousePosition = useCallback((e) => {
    mousePosition.current = { x: e.pageX, y: e.pageY }
  }, [])

  // Leva
  const { intensity } = useControls('Mesh', {
    intensity: { value: 0.3, min: 0, max: 10}
  })

	// Shaders
	const uniforms = useMemo(
		() => ({
			uTime: {value: 0},
			uMouse: {value: new Vector2(0, 0)},
      uBg: { value: new Color("#A1A3F7") },
      uColorA: { value: new Color("#9FBAF9")},
      uColorB: { value: new Color("#FEB3D9")}
		}),
		[]
	);

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition, false)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition, false)
    }
  }, [ updateMousePosition ])

	useFrame((state) => {
		const time = state.clock.getElapsedTime();

		mesh.current.material.uniforms.uTime.value = time * 0.4;
    mesh.current.material.uniforms.uMouse.value = new Vector2(mousePosition.current.x, mousePosition.current.y)
	});

	return (
		<mesh ref={mesh}>
			<planeGeometry args={[1, 1, 32, 32]} />
			<shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
		</mesh>
	);
}

const vertexShader = /* glsl */ `
  uniform float uTime;

  varying vec2 vUv;

  void main() {
    vUv = uv;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;

  uniform vec3 uBg;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec2 uMouse;

  varying vec2 vUv;

/* 
  Description : Array and textureless GLSL 2D simplex noise function.
  Author : Ian McEwan, Ashima Arts.
  Maintainer : ijm
  Lastmod : 20110822 (ijm)
  License : Copyright (C) 2011 Ashima Arts. All rights reserved.
            Distributed under the MIT License. See LICENSE file.
            https://github.com/ashima/webgl-noise

https://github.com/hughsk/glsl-noise/blob/master/simplex/2d.glsl
*/

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  // First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

  // Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  // Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

  // Gradients: 41 points uniformly over a line, mapped onto a diamond.
  // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  // Normalise gradients implicitly by scaling m
  // Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

  // Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

  void main() {
    vec3 color = uBg;

    float noise1 = snoise(vUv + uTime * (sin(uMouse.x * 0.001) + 0.2));
    float noise2 = snoise(vUv + uTime * (sin(uMouse.y * 0.001) + 0.2));

    color = mix(color, uColorA, noise1);
    color = mix(color, uColorB, noise2);

    gl_FragColor = vec4(color, 1.0);
  }
`;
