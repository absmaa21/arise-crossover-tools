import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {SettingsProvider} from "./contexts/SettingsContext.tsx";
import GuildProvider from "./contexts/GuildContext.tsx";
import {NotificationsProvider} from "@toolpad/core";
import GuildDiff from "./contexts/GuildDiff.tsx";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  }
})

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={darkTheme}>
    <SettingsProvider>
      <NotificationsProvider>
        <GuildProvider>
          <GuildDiff>
            <CssBaseline/>
            <App/>
          </GuildDiff>
        </GuildProvider>
      </NotificationsProvider>
    </SettingsProvider>
  </ThemeProvider>
)
