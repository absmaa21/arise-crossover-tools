import {emptyGuildMember, GuildMember} from "../entities/guild.ts";
import {useState} from "react";
import {Button, Container, Grid, IconButton, MenuItem, Paper, TextField, Typography} from "@mui/material";
import {Delete, Save} from "@mui/icons-material";
import {useGuild} from "../hooks/useGuild.ts";
import {formatDateToGerman, parseGermanDate} from "../utils/germanDate.ts";
import {getFormattedNumber, getHighestPotency} from "../utils/getFormattedNumber.ts";
import {ITER_POTENCY, Potency} from "../entities/potency.ts";


interface Props {
  initMember?: GuildMember,
  onSubmit: (newMember: GuildMember) => void,
}

function GuildMemberForm({initMember, onSubmit}: Props) {

  const {guild, changeGuild} = useGuild()
  const [member, setMember] = useState<GuildMember>(initMember ?? emptyGuildMember)

  function handleChange<K extends keyof GuildMember>(key: K, value: GuildMember[K]) {
    setMember({...member, [key]: value})
  }

  function handleValueChange(index: number, key: 'value' | 'date', value: number) {
    setMember(p => ({
      ...p,
      gemChecks: p.gemChecks.map((c, i) =>
        i === index ? { ...c, [key]: value } : c
      )
    }))
  }
  
  function handleDiscordChange(key: 'id' | 'display', value: string) {
    setMember(p => ({
      ...p,
      discord: {
        id: key === 'id' ? value : p.discord.id,
        display: key === 'display' ? value : p.discord.display,
        lastUpdate: Date.now(),
      }
    }))
  }

  function submit() {
    const processedMember = member
    processedMember.note = processedMember.note.trimEnd()
    if (guild) changeGuild({...guild, members: [...guild.members.filter(m => m.rbxName !== member.rbxName), processedMember]})
    onSubmit(member)
  }

  return (
    <Container maxWidth={'sm'} sx={{width: '100vw', borderRadius: 1}}>
      <Paper elevation={3} sx={{textAlign: 'center', p: 2}}>
        <Grid container mb={2}>
          <Grid size={1}>
            <TextField
              required variant={'standard'}
              value={member.prio}
              onChange={e => handleChange('prio', parseInt(e.target.value) || 0)}
            />
          </Grid>

          <Grid size={10}>
            <Typography variant={'h5'}>
              {initMember ? `Edit ${initMember.rbxName}` : 'Create new member'}
            </Typography>
          </Grid>

          <Grid size={1}>
            <IconButton onClick={submit}>
              <Save/>
            </IconButton>
          </Grid>
        </Grid>

        <Grid container spacing={2} mb={2}>
          <Grid size={6}>
            <TextField
              fullWidth required disabled={!!initMember}
              label="Roblox Name"
              value={member.rbxName}
              onChange={e => handleChange("rbxName", e.target.value)}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth required
              label="Display Name"
              value={member.displayName}
              onChange={e => handleChange("displayName", e.target.value)}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} mb={2}>
          <Grid size={6}>
            <TextField
              fullWidth required type={'number'}
              label="Discord Id"
              value={member.discord.id}
              onChange={e => handleDiscordChange("id", e.target.value)}
              inputMode={'numeric'}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth required
              label="Joined At (DD.MM.YYYY)"
              value={formatDateToGerman(member.joinedAt)}
              onChange={e => handleChange("joinedAt", parseGermanDate(e.target.value))}
            />
          </Grid>
        </Grid>

        <TextField
          fullWidth multiline
          label="Note"
          value={member.note}
          onChange={e => handleChange("note", e.target.value)}
        />

        <Typography variant={'h6'} gutterBottom>Gem Checks</Typography>

        {member.gemChecks.map((c, i) => (
          <Grid container spacing={1} mb={2}>
            <Grid size={2.4}>
              <TextField
                fullWidth
                label="Gems"
                type="number"
                value={parseInt(getFormattedNumber(c.value))}
                onChange={(e) => handleValueChange(i, 'value', (parseInt(e.target.value) || 1) * getHighestPotency(c.value))}
              />
            </Grid>
            <Grid size={2.4}>
              <TextField
                select
                label="Potency"
                fullWidth
                value={getHighestPotency(c.value)}
                onChange={e => handleValueChange(i, 'value', parseInt(getFormattedNumber(c.value)) * Number(e.target.value))}
              >
                {ITER_POTENCY.map((pot) => (
                  <MenuItem
                    key={pot}
                    value={Potency[pot as keyof typeof Potency]}
                  >
                    {pot}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth required label="Date"
                value={formatDateToGerman(c.date)}
                onChange={e => handleValueChange(i, "date", parseGermanDate(e.target.value))}
              />
            </Grid>
            <Grid size={1.2} sx={{display: 'grid'}}>
              <IconButton onClick={() => handleChange('gemChecks', member.gemChecks.filter((_, x) => x !== i))}>
                <Delete color="error"/>
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Button onClick={() => handleChange('gemChecks', [...member.gemChecks, {value: 0, date: Date.now()}])}>Add Gem History</Button>
      </Paper>
    </Container>
  )
}

export default GuildMemberForm;