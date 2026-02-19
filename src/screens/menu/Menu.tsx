import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './menu.css'

export default function Menu() {
  useEffect(() => {
    document.title = 'Beer Farm — Menu'
  }, [])

  return (
    <main className="menu-screen">
      <div className="menu-scene" aria-hidden="true">
        <div className="menu-sun" />
        <div className="menu-cloud cloud-1" />
        <div className="menu-cloud cloud-2" />
        <div className="menu-cloud cloud-3" />
        <div className="menu-birds" />
        <div className="menu-mountain mountain-1" />
        <div className="menu-mountain mountain-2" />
        <div className="menu-hill hill-back" />
        <div className="menu-hill hill-front" />
        <div className="menu-field" />
        <div className="menu-path" />
        <div className="menu-barn" />
        <div className="menu-barn-roof" />
        <div className="menu-tree tree-1" />
        <div className="menu-tree tree-2" />
        <div className="menu-tree tree-3" />
        <div className="menu-fence" />
      </div>

      <div className="menu-cta">
        <Link className="menu-button" to="/farm">
          Go learn yey
        </Link>
      </div>
    </main>
  )
}
