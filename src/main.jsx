import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import QrCodeScanner from './QrCodeScanner'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QrCodeScanner />
  </StrictMode>,
)
