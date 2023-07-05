import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app.tsx'
import './styles/index.css'
import './styles/code-mirror.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
