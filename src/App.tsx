import './App.css'
import WeaponCalculatorScreen from "./screens/WeaponCalculatorScreen.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import GemContributionScreen from "./screens/GemContributionScreen.tsx";
import NavigationScreen from './screens/NavigationScreen.tsx';
import PageTransitionLayout from "./components/PageTransitionLayout.tsx";
import PoweredByBanner from "./components/PoweredByBanner.tsx";
import HomeButton from "./components/HomeButton.tsx";
import SettingsButton from "./components/SettingsButton.tsx";

function App() {

  return (
    <BrowserRouter>
      <PoweredByBanner/>
      <HomeButton/>
      <SettingsButton/>

      <Routes>
        <Route element={<PageTransitionLayout/>}>
          <Route index element={<NavigationScreen/>} />
          <Route path="swords" element={<WeaponCalculatorScreen/>} />
          <Route path="gems" element={<GemContributionScreen/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
