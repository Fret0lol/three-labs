import {useEffect, useRef} from "react";
import {Depth, Fresnel, LayerMaterial} from "lamina";
import {extend, useFrame, useThree} from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import CustomLayer from "../CustomLayer";
import { useControls } from "leva";
import { Color } from "three";
import { Perf } from "r3f-perf";
extend({CustomLayer});

export default function Planet() {
	const materialRef = useRef();
	const depthRef = useRef()
	const fresnelRef = useRef()

	const { camera } = useThree()
	camera.position.set(0, 0, 7)

	useControls("Depth", {
		colorA: { value: 'blue', onChange: (value) => {
			depthRef.current.colorA = new Color(value)
		}},
		colorB: { value: 'aqua', onChange: (value) => {
			depthRef.current.colorB = new Color(value)
		}},
		alpha: { value: 0.9, min: 0, max: 1, onChange: (value) => {
			depthRef.current.alpha = value
		}}
	})

	useControls("Fresnel", {
		color: { value: "#FEB3D9", onChange: (value) => {
			fresnelRef.current.color = new Color(value)
		} }
	})

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    // materialRef.current.time = time
  })

	return (
		<>
			<Perf position="bottom-left" />

      <OrbitControls />

      <ambientLight intensity={0.03} />
      <directionalLight position={[ 0.3, 0.15, 0.0]} intensity={2} />

			<mesh position={[0, 0, 0]} rotation={[0, Math.PI, 0]} scale={1.5}>
				<icosahedronGeometry args={[2, 11]} />
				<LayerMaterial lighting="lambert">
					<customLayer ref={materialRef} time={0.0} lacunarity={2.3} />
					<Depth ref={ depthRef } colorA={"blue"} colorB={"aqua"} alpha={0.9} mode="add" />
          <Fresnel ref={fresnelRef} color={"#FEB3D9"} mode="add" />
				</LayerMaterial>
			</mesh>
		</>
	);
}
