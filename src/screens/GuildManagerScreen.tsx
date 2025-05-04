import {useGuild} from "../hooks/useGuild.ts";
import {Box, Button, Container, IconButton, Modal, Tooltip, Typography} from "@mui/material";
import GuildForm from "./GuildForm.tsx";
import EditIcon from '@mui/icons-material/Edit';
import {useState} from "react";
import {Guild} from "../entities/guild.ts";
import GuildMembers from "./GuildMembers.tsx";
import GemCheckScreen from "./GemCheckScreen.tsx";

function GuildManagerScreen() {

  const [editGuild, setEditGuild] = useState<boolean>(false)
  const [gemCheck, setGemCheck] = useState<boolean>(false)
  const {guild, changeGuild} = useGuild()

  const submitEdit = (newGuild: Guild) => {
    setEditGuild(false)
    changeGuild(newGuild)
  }

  if (!guild) return (
    <Box sx={{textAlign: 'left'}}>
      <GuildForm onSubmit={changeGuild} isCreation/>
    </Box>
  )

  return (
    <Container maxWidth="md">
      <Box sx={{display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Typography variant="h4" align="center">
          {guild.name}
        </Typography>
        <IconButton sx={{width: 36, height: 36}} onClick={() => setEditGuild(true)}>
          <EditIcon/>
        </IconButton>
      </Box>

      <Tooltip title={'Submit current gems for all members'} sx={{mb: 2, mt: 1}}>
        <Button variant={'contained'} onClick={() => setGemCheck(true)}>
          <Typography variant={'caption'}>
            gem check
          </Typography>
        </Button>
      </Tooltip>

      <GuildMembers members={guild.members}/>

      <Modal open={editGuild} onClose={() => setEditGuild(false)} sx={{placeSelf: 'center'}}
      >
        <GuildForm onSubmit={submitEdit} guild={guild}/>
      </Modal>

      <Modal open={gemCheck} onClose={() => setGemCheck(false)} sx={{ placeSelf: 'center' }}>
        <GemCheckScreen onFinish={() => setGemCheck(false)}/>
      </Modal>
    </Container>
  );
}

export default GuildManagerScreen;