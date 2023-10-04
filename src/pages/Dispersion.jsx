import {OrbitControls, useFBO} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import {useMemo, useRef} from "react";
import {Vector2} from "three";

import fragmentShader from "../shaders/Dispersion/fragment.glsl";
import vertexShader from "../shaders/Dispersion/vertex.glsl";

export default function Dispersion() {
  const columns = [-7.5, -5, -2.5, 0, 2.5, 5, 7.5]
  const rows = [-7.5, -5, -2.5, 0, 2.5, 5, 7.5]

	const meshRef = useRef();

	return (
		<>
      <color attach={"background"} args={["#000000"]} />

      <OrbitControls enableDamping />
      <ambientLight intensity={1} />

			<group>
        {columns.map((col, i) =>
          rows.map((row, j) => (
            <mesh key={`${col}-${row}`} position={[col, row, -4]}>
              <icosahedronGeometry args={[0.333, 8]} />
              <meshStandardMaterial color="white" />
            </mesh>
          ))
        )}
      </group>

			<mesh ref={meshRef}>
				<sphereGeometry args={[3, 32, 32]} />
        <meshPhysicalMaterial transparent roughness={0} transmission={1} metalness={0} thickness={5} />
			</mesh>
    </>
	);
}
