import { Box, Typography, Avatar } from '@mui/material';
import MascotLogo from '../assets/guild-logo.png';
import HomeButton from "./HomeButton.tsx";
import SettingsButton from "./SettingsButton.tsx";
import {DiscordLink} from "../services/const.ts";

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
      justifyContent: 'center',
      py: 1,
      px: 2,
      zIndex: 99,
    }}
  >
    <HomeButton/>
    <SettingsButton/>

    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        '&:hover': {
          cursor: 'pointer'
        },
      }}
      onClick={() => window.open(DiscordLink, '_blank', 'noopener,noreferrer')}
    >
      <Avatar src={MascotLogo} sx={{ height: 40, width: 40, mr: 1 }} />
      <Typography variant="body2" color="white" fontWeight={500}>
        Powered by the <strong>Knuckles</strong> Guild
      </Typography>
    </Box>
  </Box>
);

export default PoweredByBanner;
