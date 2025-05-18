import './App.css'
import WeaponCalculatorScreen from "./screens/WeaponCalculatorScreen.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import GemContributionScreen from "./components/guild/GemContributionScreen.tsx";
import NavigationScreen from './screens/NavigationScreen.tsx';
import PageTransitionLayout from "./components/PageTransitionLayout.tsx";
import GuildManagerScreen from "./components/guild/GuildManagerScreen.tsx";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageTransitionLayout/>}>
          <Route index element={<NavigationScreen/>} />
          <Route path="swords" element={<WeaponCalculatorScreen/>} />
          <Route path="gems" element={<GemContributionScreen/>} />
          <Route path="guild" element={<GuildManagerScreen/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
