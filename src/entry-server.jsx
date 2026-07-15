import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import './styles/global.css'

export function render() {
  return renderToString(
    <React.StrictMode>
      <App prerender />
    </React.StrictMode>
  )
}
