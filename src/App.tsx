import './App.css'
import WeaponCalculatorScreen from "./screens/WeaponCalculatorScreen.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import GemContributionScreen from "./screens/GemContributionScreen.tsx";
import NavigationScreen from './screens/NavigationScreen.tsx';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<NavigationScreen/>} />
        <Route path="swords" element={<WeaponCalculatorScreen/>} />
        <Route path="gems" element={<GemContributionScreen/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
