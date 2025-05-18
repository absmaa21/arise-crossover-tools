import {useGuild} from "../../hooks/useGuild.ts";
import {Container, Grid, IconButton, Paper, TextField, Typography} from "@mui/material";
import {formatDateToGerman} from "../../utils/germanDate.ts";
import {descendingComparator, GuildMember} from "../../entities/guild.ts";
import ValueHandler from "../ValueHandler.tsx";
import {useEffect, useState} from "react";
import {Check} from "@mui/icons-material";
import MemberSearch from "../MemberSearch.tsx";

function GemCheckScreen() {

  const {guild, changeGuild} = useGuild()
  const [filteredMembers, setFilteredMembers] = useState<GuildMember[]>([])
  const [searchedMembers, setSearchedMembers] = useState<GuildMember[] | null>(null)

  function handleValueChange(rbxName: string, newValue: number) {
    const changedMember = filteredMembers.find(m => m.rbxName === rbxName)
    if (!changedMember) {
      console.error(`Member ${rbxName} to change not found!`)
      return
    }

    changedMember.gemChecks[changedMember.gemChecks.length - 1].value = newValue
    setFilteredMembers([...filteredMembers.filter(m => m.rbxName !== rbxName), changedMember])
  }

  useEffect(() => {
    if (!guild) return
    setFilteredMembers(
      guild.members
        .filter(m => m.gemChecks.length === 0 || formatDateToGerman(m.gemChecks[m.gemChecks.length - 1].date) !== formatDateToGerman(Date.now()))
        .map(m => ({
          ...m,
          gemChecks: [...m.gemChecks, {value: m.gemChecks[m.gemChecks.length - 1]?.value || 0, date: Date.now()}]
        }))
        .sort()
    )
  }, [guild]);

  if (!guild) return null

  return (
    <Container maxWidth={'md'}>
      <Paper elevation={3} sx={{textAlign: 'center', p: 2}}>
        <Typography
          variant={'h4'} gutterBottom
          component={'h2'}
        >
          {`Gem Check for ${formatDateToGerman(Date.now())}`}
        </Typography>

        <MemberSearch setFoundMembers={setSearchedMembers}/>

        {filteredMembers.length === 0 && <Typography variant={'h6'} component={'p'}>
            Everyone done for today
        </Typography>}

        {filteredMembers
          .filter(m => {
            if (!searchedMembers) return true
            return searchedMembers.find(f => f.rbxName === m.rbxName)
          })
          .sort((a, b) => {
            const prioCompare = -descendingComparator(a, b, 'prio')
            if (prioCompare !== 0) return prioCompare
            return -descendingComparator(a, b, 'rbxName')
          })
          .slice(0, 5).map(m => (
            <Grid container spacing={2} mt={3} key={m.rbxName}>
              <Grid size={6}>
                <TextField
                  disabled fullWidth
                  label={'Roblox Name'}
                  value={m.rbxName}
                />
              </Grid>
              <ValueHandler value={m.gemChecks[m.gemChecks.length - 1].value}
                            setValue={newValue => handleValueChange(m.rbxName, newValue)} valueSize={3}/>
              <Grid size={1}>
                <IconButton
                  onClick={() => changeGuild({
                    ...guild,
                    members: [...guild!.members.filter(mem => mem.rbxName !== m.rbxName), m]
                  })}
                  sx={{display: 'flex', alignItems: 'center', height: '100%', width: '100%'}}
                >
                  <Check/>
                </IconButton>
              </Grid>
            </Grid>
          ))}
      </Paper>
    </Container>
  )
}

export default GemCheckScreen;