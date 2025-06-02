import './style.css'
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <p>Vite + TypeScript + Tailwind CSS</p>
    <a href="https://vitejs.dev" target="_blank">
    
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
