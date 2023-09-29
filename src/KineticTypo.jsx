import { OrbitControls, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { NearestFilter } from "three";

export default function KineticTypo() {

  const mesh = useRef()

  // Load the texture
  const texture = useTexture("./text.png")
  texture.minFilter = NearestFilter

  // Shader
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uTexture: { value: texture }
  }), [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    mesh.current.material.uniforms.uTime.value = time
  })

  return <>
    <OrbitControls />

    <mesh ref={ mesh }>
      <torusGeometry args={[ 3, 1, 100, 100]} />
      <shaderMaterial 
        vertexShader={ vertexShader }
        fragmentShader={ fragmentShader }
        uniforms={ uniforms }
      />
    </mesh>
  </>
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform sampler2D uTexture;

  void main() {
    float time = uTime;

    vec2 uv = vUv;

    // Effet texte en diagonale
    uv.x += sin(uv.y + time) * 0.25;

    // Repete 6 fois le motif sur l'axe X et 12 fois sur l'axe Y 
    vec2 repeat = vec2(6.0, 12.0);
    uv = fract(uv * repeat + vec2(0.0, time));

    // Transformation de la texture en vecteur 4
    vec4 color = texture2D(uTexture, uv);

    gl_FragColor = color;
  }
`