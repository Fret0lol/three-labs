import {OrbitControls, PerspectiveCamera, SpotLight, useHelper, useTexture} from "@react-three/drei";
import {useFrame, useThree} from "@react-three/fiber";
import {useEffect, useRef} from "react";
import { Object3D, SpotLightHelper, Vector3 } from "three";
import { Bloom, DepthOfField, EffectComposer } from "@react-three/postprocessing"

export default function Vaporwave() {
	const plane = useRef();
	const plane2 = useRef();
  const spotlight = useRef()
  const spotLight2 = useRef()

  const spotLight1Target = new Object3D()
  spotLight1Target.position.clone(new Vector3(-0.25, 0.25, 0.25))

  const spotLight2Target = new Object3D()
  spotLight2Target.position.clone(new Vector3(0.25, 0.25, 0.25))

	const texture = useTexture("./grid.png");
	const displacementTexture = useTexture("./displacement.png");
  const metalnessTexture = useTexture("./metalness.png")


	useFrame((state) => {
		const time = state.clock.getElapsedTime();

		/**
		 * When the first plane reaches a position of z = 2
		 * we reset it to 0, its initial position
		 */
		plane.current.position.z = (time * 0.15) % 2;
		/**
		 * When the first plane reaches a position of z = 0
		 * we reset it to -2, its initial position
		 */
		plane2.current.position.z = ((time * 0.15) % 2) - 2;
	});

	return (
		<>
			<color attach={"background"} args={["#000000"]} />
			<OrbitControls enableDamping />
			<PerspectiveCamera makeDefault position={[0, 0.06, 1.1]} fov={75} near={0.01} far={20} />

			<ambientLight intensity={100} />
      <spotLight 
        ref={spotlight}
        color={"#D53C3D"}
        intensity={20}
        distance={25}
        angle={Math.PI * 0.1}
        penumbra={0.25}
        position={[0.5, 0.75, 2.2]}
        target={spotLight1Target}
      />
      <spotLight 
        ref={spotLight2}
        color={"#D53C3D"}
        intensity={20}
        distance={25}
        angle={Math.PI * 0.1}
        penumbra={0.25}
        position={[-0.5, 0.75, 2.2]}
        target={spotLight2Target}
      />
      <fog attach={"fog"} args={["#000000", 1, 2.5]} />

			<mesh ref={plane} rotation-x={-Math.PI * 0.5} position={[0, 0, 0.15]}>
				<planeGeometry args={[1, 2, 24, 24]} />
				<meshStandardMaterial color={"#FFFFFF"} map={texture} displacementMap={displacementTexture} displacementScale={0.4} metalnessMap={metalnessTexture} metalness={0.96} roughness={0.5} />
			</mesh>
			<mesh ref={plane2} rotation-x={-Math.PI * 0.5} position={[0, 0, -1.85]}>
				<planeGeometry args={[1, 2, 24, 24]} />
				<meshStandardMaterial color={"#FFFFFF"} map={texture} displacementMap={displacementTexture} displacementScale={0.4} metalnessMap={metalnessTexture} metalness={0.96} roughness={0.5} />
			</mesh>

			<EffectComposer>
				<DepthOfField bokehScale={2} height={480} />
				<Bloom intensity={0.2} luminanceThreshold={0.8} luminanceSmoothing={0} />
			</EffectComposer>
		</>
	);
}
