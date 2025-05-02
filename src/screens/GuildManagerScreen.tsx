import {useGuild} from "../hooks/useGuild.ts";
import {Box, Button, Container, IconButton, Modal, Tooltip, Typography} from "@mui/material";
import GuildForm from "./GuildForm.tsx";
import EditIcon from '@mui/icons-material/Edit';
import {useState} from "react";
import {Guild} from "../entities/guild.ts";
import GuildMembers from "./GuildMembers.tsx";

function GuildManagerScreen() {

  const [editGuild, setEditGuild] = useState<boolean>(false)
  const {guild, changeGuild} = useGuild()

  const submitEdit = (newGuild: Guild) => {
    setEditGuild(false)
    changeGuild(newGuild)
  }

  if (!guild) return <GuildForm onSubmit={changeGuild}/>

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
        <Button variant={'contained'}>
          <Typography variant={'caption'}>
            gem check
          </Typography>
        </Button>
      </Tooltip>

      <GuildMembers members={guild.members}/>

      <Modal open={editGuild} onClose={() => setEditGuild(false)}
             sx={{placeSelf: 'center'}}
      >
        <GuildForm onSubmit={submitEdit} guild={guild}/>
      </Modal>
    </Container>
  );
}

export default GuildManagerScreen;