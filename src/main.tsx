import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {SettingsProvider} from "./contexts/SettingsContext.tsx";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <SettingsProvider>
        <CssBaseline/>
        <App />
      </SettingsProvider>
    </ThemeProvider>
  </StrictMode>,
)
