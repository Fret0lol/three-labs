import { OrbitControls, useGLTF, useTexture } from "@react-three/drei"
import { useEffect, useMemo, useRef } from "react"
import { BoxGeometry, IcosahedronGeometry, MeshBasicMaterial, MeshMatcapMaterial, Vector3 } from "three"
import { Pillard } from "../components/SpherePillards/Pillard"
import { Perf } from "r3f-perf"
import { Spectrum } from "../components/SpherePillards/Spectrum"

export default function SpherePillards() {
  const icosahedronRef = useRef()
  

  // Models
  const pillardsScene = useGLTF("/pillard.glb");
  const floorScene = useGLTF("./floor.glb")

  // Textures
  const greyMetalTexture = useTexture("./greyMetal.png")
  const blackMetalTexture = useTexture("./blackMetal.png")

  const pillard = pillardsScene.scene.children[0]
  pillard.material = new MeshMatcapMaterial({ matcap: greyMetalTexture })

  pillard.traverse(child => {
    if (child.name == "Cylinder") {
      child.material = new MeshMatcapMaterial({ matcap: blackMetalTexture })
    }
  })

  const floor = floorScene.scene.children[0]
  floor.position.y = -3

  const ico = new IcosahedronGeometry(2, 3)

  const pillardsPosition = useMemo(() => {
    const vertexArray = []
    for (let i = 0; i < ico.attributes.position.array.length; i++) {
      vertexArray.push({
        x: ico.attributes.position.array[i * 3],
        y: ico.attributes.position.array[i * 3 + 1],
        z: ico.attributes.position.array[i * 3 + 2]
      })
    }

    const pillardPositions = []
    for (let i = 0; i < vertexArray.length; i++) {
      let existingFlag = false
      for (let j = 0; j < pillardPositions.length; j++) {
        if (pillardPositions[j].x == vertexArray[i].x && 
          pillardPositions[j].y == vertexArray[i].y &&
          pillardPositions[j].z == vertexArray[i].z
          ) {
            existingFlag = true
          }
      }
      
      if (!existingFlag) {
        pillardPositions.push(new Vector3(vertexArray[i].x, vertexArray[i].y, vertexArray[i].z))
      }
    }
    return pillardPositions
  }, [ icosahedronRef ])

  return <>
    <Perf />

    <OrbitControls enableDamping />

    <mesh geometry={ico}>
      <meshMatcapMaterial matcap={ greyMetalTexture } />
    </mesh>

    { pillardsPosition.map((pillardPosition, index) => (
      <Pillard key={index} position={pillardPosition} scale={0.2} />
    ))}

    <Spectrum />
  </>
}