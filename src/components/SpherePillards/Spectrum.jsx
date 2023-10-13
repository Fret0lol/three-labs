import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import fragmentShader from "../../shaders/SpherePillards/fragment.glsl"
import vertexShader from "../../shaders/SpherePillards/vertex.glsl"
import { useFrame } from "@react-three/fiber";
import { Color } from "three";

export function Spectrum(props) {
  const spectrum = useRef()

  const { nodes, materials } = useGLTF("/spectrum.glb");

  // Textures
  const blackMetalTexture = useTexture("./blackMetal.png")

  const uniforms = useMemo(() => ({
      uMatCap: { value: blackMetalTexture },
      uSpecterSize: { value: 0.6 },
      uTime: { value: 0 },
      uWaveBorderSize: { value: 0.1 },
      uWaveBorderColor: { value: new Color('hsl(287, 80%, 80%)') }
  }), [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    spectrum.current.material.uniforms.uTime.value = time;
  })

  return (
      <mesh
        ref={spectrum}
        {...props} 
        geometry={nodes.Sphere.geometry}
        material={nodes.Sphere.material}
        position={[0, -3, 0]}
      >
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
        />
      </mesh>
  );
}

useGLTF.preload("/spectrum.glb");