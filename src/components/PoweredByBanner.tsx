import { Box, Typography, Avatar } from '@mui/material';
import MascotLogo from '../assets/knuckles-logo-new.png';

const PoweredByBanner = () => (
  <Box
    sx={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      bgcolor: '#0a0a0a',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 1,
      px: 2,
      '&:hover': {
        cursor: 'pointer'
      },
    }}
    onClick={() => window.open('https://discord.gg/qQ9jwHxfFY', '_blank', 'noopener,noreferrer')}
  >
    <Avatar src={MascotLogo} sx={{ height: 40, width: 40, mr: 1 }} />
    <Typography variant="body2" color="white" fontWeight={500}>
      Powered by the <strong>Knuckles</strong> Guild
    </Typography>
  </Box>
);

export default PoweredByBanner;
