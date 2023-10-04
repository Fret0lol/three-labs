import { NavLink } from "react-router-dom";

export default function Html() {

  return <div className="html">
    <div className=" title">
      <nav>
        <ul>
          <li>
            <NavLink to={`/`} className={({isActive}) => (isActive ? "active" : null)}>01 - Blob</NavLink>
          </li>
          <li>
            <NavLink to={`02`} className={({isActive}) => (isActive ? "active" : null)}>02 - Kynetic Typo</NavLink>
          </li>
          <li>
            <NavLink to={`03`} className={({isActive}) => (isActive ? "active" : null)}>03 - Gradient</NavLink>
          </li>
          <li>
            <NavLink to={`04`} className={({isActive}) => (isActive ? "active" : null)}>04 - Neptune (Bugged)</NavLink>
          </li>
          <li>
            <NavLink to={`05`} className={({isActive}) => (isActive ? "active" : null)}>05 - Particles</NavLink>
          </li>
          <li>
            <NavLink to={`06`} className={({isActive}) => (isActive ? "active" : null)}>06 - FBO Particles</NavLink>
          </li>
          <li>
            <NavLink to={`07`} className={({isActive}) => (isActive ? "active" : null)}>07 - Vaporwave</NavLink>
          </li>
          <li>
            <NavLink to={`08`} className={({isActive}) => (isActive ? "active" : null)}>08 - Point Blob</NavLink>
          </li>
          <li>
            <NavLink to={`09`} className={({isActive}) => (isActive ? "active" : null)}>09 - Dispersion</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  </div>
}