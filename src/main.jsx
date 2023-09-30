import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import KineticTypo from './KineticTypo.jsx'
import Blob from './Blob'
import { Canvas } from '@react-three/fiber'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Gradient from './Gradient'
import Planet from './Planet'
import Particles from './Particles'
import FBOParticles from './FBOParticles'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Blob />
  },
  {
    path: "/01",
    element: <KineticTypo />
  },
  {
    path: "/02",
    element: <Gradient />
  },
  {
    path: "/03",
    element: <Planet />
  },
  {
    path: "/04",
    element: <Particles />
  },
  {
    path: "/05",
    element: <FBOParticles />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Canvas>
      <RouterProvider router={ router } />
    </Canvas>
  </React.StrictMode>,
)
