import {useRef} from "react";
import {Depth, Fresnel, LayerMaterial} from "lamina";
import {extend, useFrame} from "@react-three/fiber";

import CustomLayer from "./CustomLayer";
import { OrbitControls } from "@react-three/drei";
extend({CustomLayer});

export default function Planet() {
	const materialRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    materialRef.current.time = time
  })

	return (
		<>
      <OrbitControls position={{ x: 0, y: 0, z: 8 }} />

      <ambientLight intensity={0.03} />
      <directionalLight position={[ 0.3, 0.15, 0.0]} intensity={2} />

			<mesh position={[0, 0, 0]} rotation={[0, Math.PI, 0]} scale={1.5}>
				<icosahedronGeometry args={[2, 11]} />
				<LayerMaterial lighting="lambert">
					<customLayer ref={materialRef} time={0.0} lacunarity={2.3} />
					<Depth colorA={"blue"} colorB={"aqua"} alpha={0.9} mode="add" />
          <Fresnel color={"#FEB3D9"} mode="add" />
				</LayerMaterial>
			</mesh>
		</>
	);
}
