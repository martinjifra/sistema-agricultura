import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { GestionDispositivos } from '../Modulos/GestionDispositivos.jsx'

const contenedor = document.getElementById('app')

if (!contenedor) {
  throw new Error('No se encontró #app en index.html')
}

createRoot(contenedor).render(createElement(GestionDispositivos))
