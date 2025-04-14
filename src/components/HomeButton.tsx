import { useLocation, useNavigate } from 'react-router-dom';
import { Fab, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import {AnimatePresence, motion} from "framer-motion";

const HomeButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {location.pathname !== '/' && (
        <motion.div
          key="home-button"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 28 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            bottom: 28,
            left: 24,
            zIndex: 999,
          }}
        >
          <Tooltip title="Go to Home">
            <Fab
              color={"default"}
              size="large"
              onClick={() => navigate('/')}
              sx={{
                color: '#eee',
                backgroundColor: '#0a0a0a',
                boxShadow: 0,
                '&:hover': {
                  backgroundColor: '#050505',
                },
              }}
            >
              <HomeIcon />
            </Fab>
          </Tooltip>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HomeButton;
