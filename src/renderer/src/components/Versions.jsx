import { useState } from 'react'

function Versions() {
  const [versions] = useState(window.electron.process.versions)

  return (
    <ul className="=">
      <li className="">Electron v{versions.electron}</li>
      <li className="">Chromium v{versions.chrome}</li>
      <li className="">Node v{versions.node}</li>
    </ul>
  )
}

export default Versions
