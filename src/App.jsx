import { Canvas } from '@react-three/fiber'
import Html from './Html'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
      <Html />
      <Canvas camera={{ position: [ 0, 0, 6 ]}} dpr={[1, 2]}>
        <Outlet />
      </Canvas>
    </>
  )
}

export default App
