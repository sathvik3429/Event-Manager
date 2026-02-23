import React from 'react'
import ReactDOM from 'react-dom/client'
import AppFirebase from './AppFirebase'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppFirebase />
    <Toaster position="top-right" />
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  </React.StrictMode>,
)
