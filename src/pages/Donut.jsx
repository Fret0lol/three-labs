import { OrbitControls, useGLTF, useHelper } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { DirectionalLightHelper } from "three";

export default function Donut() {
  return <Canvas dpr={[1, 2]}>
    <DonutComponent />
  </Canvas>
}

function DonutComponent() {
  const dirLight = useRef()
  const y = useGLTF("/donut.glb");
  console.log(y);

  useHelper(dirLight, DirectionalLightHelper, 1, "red")

  return <>
    <OrbitControls enableDamping />

    <directionalLight ref={dirLight} color={"#FFFFFF"} intensity={1} position={[1, 2, 1]} />

    {/* <directionalLightHelper /> */}
    <ambientLight intensity={2} />

    <DonutItem />
  </>
}

export function DonutItem(props) {
  const { nodes, materials } = useGLTF("/donut.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Donut.geometry}
        material={materials["Material.001"]}
      >
        <mesh
          castShadow
          geometry={nodes.Icing.geometry}
          material={materials.Material}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/donut.glb");