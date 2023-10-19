import { Canvas } from '@react-three/fiber'
import Html from './Html'
import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'

function App() {

  return (
    <>
      <Html />
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </>
  )
}

export default App
