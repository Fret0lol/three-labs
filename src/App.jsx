import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Html from './Html'
import { Outlet } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Html />
      <Canvas>
        <Outlet />
      </Canvas>
    </>
  )
}

export default App
