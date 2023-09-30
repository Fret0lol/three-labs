import { OrbitControls, useFBO } from "@react-three/drei";
import { createPortal, extend, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { FloatType, NearestFilter, RGBAFormat, Scene, OrthographicCamera, AdditiveBlending } from "three";

import SimulationMaterial from "./SimulationMaterial";
extend({ SimulationMaterial })

export default function FBOParticles() {
  const size = 128

  const points = useRef()
  const simulationMaterialRef = useRef()

  const scene = new Scene()
  const camera = new OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1)
  const positions = new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]);
  const uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]);

  const renderTarget = useFBO(size, size, {
    minFilter: NearestFilter,
    magFilter: NearestFilter,
    format: RGBAFormat,
    stencilBuffer: false,
    type: FloatType
  }) 

  const particlesPosition = useMemo(() => {
    const length = size * size
    const particles = new Float32Array(length * 3)
    for (let i = 0; i < length; i++) {
      particles[i * 3] = (i % size) / size
      particles[i * 3 + 1] = i / size / size
    }
    return particles
  }, [ size ])

  const uniforms = useMemo(() => ({
    uPositions: {
      value: null
    }
  }), [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const gl = state.gl

    gl.setRenderTarget(renderTarget)
    gl.clear()
    gl.render(scene, camera)
    gl.setRenderTarget(null)

    points.current.material.uniforms.uPositions.value = renderTarget.texture

    simulationMaterialRef.current.uniforms.uTime.value = time
  })

  return <>
    <OrbitControls />

    <ambientLight intensity={0.5} />

    {createPortal(
      <mesh>
        <bufferGeometry>
          <bufferAttribute 
            attach={"attributes-position"}
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute 
            attach={"attributes-uv"}
            count={uvs.length / 2}
            array={uvs}
            itemSize={2}
          />
        </bufferGeometry>
        <simulationMaterial ref={simulationMaterialRef} args={[ size ]} />
      </mesh>,
      scene
    )}

    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute 
          attach={"attributes-position"}
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial 
        blending={AdditiveBlending}
        depthWrite={false}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </points>
  </>
}

const vertexShader = /* glsl */`
  uniform sampler2D uPositions;

  void main() {
    vec3 pos = texture2D(uPositions, position.xy).xyz;

    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    gl_PointSize = 3.0;
    // Size attenuation;
    gl_PointSize *= step(1.0 - (1.0/64.0), position.x) + 0.5;
  }
`

const fragmentShader = /* glsl */`
  void main() {
    vec3 color = vec3(0.34, 0.53, 0.96);
    gl_FragColor = vec4(color, 1.0);
  }
`