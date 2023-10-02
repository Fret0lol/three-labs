import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import KineticTypo from './pages/KineticTypo.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Gradient from './pages/Gradient'
import Planet from './pages/Planet'
import FBOParticles from './pages/FBOParticles'
import Vaporwave from './pages/Vaporwave'
import App from './App'
import Blob from './pages/Blob'
import Particles from './pages/Particles'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/01",
        element: <Blob />
      },
      {
        path: "/02",
        element: <KineticTypo />
      },
      {
        path: "/03",
        element: <Gradient />
      },
      {
        path: "/04",
        element: <Planet />
      },
      {
        path: "/05",
        element: <Particles />
      },
      {
        path: "/06",
        element: <FBOParticles />
      },
      {
        path: "/07",
        element: <Vaporwave />
      }
    ]
  }, 
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={ router } />
  </React.StrictMode>,
)
