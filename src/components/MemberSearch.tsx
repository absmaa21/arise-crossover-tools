import React, {SetStateAction, useEffect, useMemo, useState} from "react";
import {useGuild} from "../hooks/useGuild.ts";
import {Box, List, ListItem, ListItemText, Stack, TextField, Typography} from "@mui/material";
import {GuildMember} from "../entities/guild.ts";

interface FilteredMember {
  member: GuildMember,
  matchedField: string,
}

interface Props {
  setFoundMembers: React.Dispatch<SetStateAction<GuildMember[] | null>>,
  suggestions?: boolean,
}

function MemberSearch({setFoundMembers, suggestions}: Props) {

  const {guild} = useGuild()
  const [search, setSearch] = useState<string>('')
  const [focused, setFocused] = useState<boolean>(false)

  const filteredMembers: (FilteredMember | null)[] = useMemo(() => {
    if (!search.trim() || !guild?.members) return []

    return guild.members
      .map(member => {
        let matchedField: string | undefined = undefined
        const searchLowered: string = search.toLowerCase()

        if (member.rbxName.toLowerCase().includes(searchLowered)) matchedField = 'Roblox Name'
        else if (member.displayName.toLowerCase().includes(searchLowered)) matchedField = 'Roblox Display'
        else if (member.discord.display.toLowerCase().includes(searchLowered)) matchedField = 'Discord Display'
        else if (member.discord.id.toLowerCase().includes(searchLowered)) matchedField = 'Discord Id'

        return matchedField ? {member, matchedField} : null
      })
      .filter(Boolean)
  }, [search, guild?.members])

  useEffect(() => {
    const members = filteredMembers.filter(m => m !== null).map(m => m?.member)
    if (members.length === 0) setFoundMembers(search.trim().length > 0 ? [] : null)
    else setFoundMembers(members)
  }, [filteredMembers, search, setFoundMembers]);

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        size={'small'}
        fullWidth type={'text'}
        label="Search Member"
        variant="outlined"
        value={search}
        onChange={e => setSearch(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 100)} // allow click events to register
      />
      {suggestions && focused && filteredMembers.length > 0 && (
        <List
          sx={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, mt: 1, boxShadow: 3, borderRadius: 1,
            bgcolor: 'background.paper', maxHeight: 300, overflowY: 'auto'
          }}
        >
          {filteredMembers.slice(0, 5).map((m, i) => m && (
            <ListItem key={i} divider={i < filteredMembers.length-1}>
              <ListItemText>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                  <Typography variant='subtitle1'>
                    {m.member.rbxName}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    {m.matchedField}
                  </Typography>
                </Stack>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default MemberSearch;