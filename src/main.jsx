import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ThemeContextProvider from './store/ThemeCtx.jsx';
import FlightContextProvider from "./store/FlightCtx.jsx";
import StaffContextProvider from "./store/StaffCtx.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StaffContextProvider>
    <ThemeContextProvider>
      <FlightContextProvider>
      <App />
      </FlightContextProvider>
    </ThemeContextProvider>
    </StaffContextProvider> 
  </StrictMode>,
)
