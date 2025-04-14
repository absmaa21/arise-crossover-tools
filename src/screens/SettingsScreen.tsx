import { Container, Paper, Switch, Typography, FormControlLabel } from '@mui/material';
import { motion } from 'framer-motion';
import {useSettings} from "../hooks/useSettings.ts";

const SettingsScreen = () => {
  const Settings = useSettings()

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: Settings.animationsEnabled ? 0.3 : 0 }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h5" gutterBottom>
            Settings
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={Settings.animationsEnabled}
                onChange={Settings.toggleAnimations}
                color="primary"
              />
            }
            label="Enable Animations"
          />

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Turn this off to disable transitions and effects for performance or accessibility.
          </Typography>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default SettingsScreen;
