import {Fab, Modal, Tooltip} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings'
import {useState} from "react";
import SettingsScreen from "../screens/SettingsScreen.tsx";

const SettingsButton = () => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <SettingsScreen/>
      </Modal>

      <Tooltip title="Open Settings">
        <Fab
          color={"default"}
          size="large"
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 28,
            right: 24,
            zIndex: 999,
            color: '#eee',
            backgroundColor: '#0a0a0a',
            boxShadow: 0,
            '&:hover': {
              backgroundColor: '#050505',
            },
          }}
        >
          <SettingsIcon />
        </Fab>
      </Tooltip>
    </>
  );
};

export default SettingsButton;
