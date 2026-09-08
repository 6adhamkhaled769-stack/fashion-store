import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { StoreConfigProvider } from '@/context/StoreConfigContext'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <StoreConfigProvider>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'var(--color-primary)',
              color: 'var(--color-primary-foreground)',
              borderRadius: '3px',
              fontSize: '14px',
            },
          }}
        />
      </StoreConfigProvider>
    </BrowserRouter>
  </StrictMode>,
)
