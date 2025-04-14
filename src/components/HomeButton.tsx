import { useLocation, useNavigate } from 'react-router-dom';
import { Fab, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

const HomeButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === '/') return null;

  return (
    <Tooltip title="Go to Home">
      <Fab
        color={"default"}
        size="large"
        onClick={() => navigate('/')}
        sx={{
          position: 'fixed',
          bottom: 28,
          left: 24,
          zIndex: 999,
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
  );
};

export default HomeButton;
