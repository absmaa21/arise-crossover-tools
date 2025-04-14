import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {useSettings} from "../hooks/useSettings.ts";
import PoweredByBanner from "./PoweredByBanner.tsx";

const PageTransitionLayout = () => {
  const Settings = useSettings()
  const location = useLocation();

  return (
    <div style={{ position: 'relative' }}>
      <PoweredByBanner/>

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 32, zoom: 0.94 }}
          animate={{ opacity: 1, y: 0, zoom: 1 }}
          transition={{ duration: Settings.animationsEnabled ? 0.5 : 0 }}
          style={{ height: '100%' }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PageTransitionLayout;
