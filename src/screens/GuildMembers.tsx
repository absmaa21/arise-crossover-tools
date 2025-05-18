import {
  alpha, Box, Button, Checkbox,
  Container,
  IconButton, Modal,
  Paper,
  Table, TableBody, TableCell,
  TableContainer,
  TableHead, TablePagination, TableRow, TableSortLabel,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";
import React, {SetStateAction, useMemo, useState} from "react";
import {descendingComparator, GuildMember} from "../entities/guild.ts";
import {Delete, FilterList} from "@mui/icons-material";
import GuildMemberForm from "./GuildMemberForm.tsx";
import {formatDateToGerman} from "../utils/germanDate.ts";
import {toHumanReadable} from "../utils/textFormatting.ts";
import {getFormattedNumber} from "../utils/getFormattedNumber.ts";
import {useGuild} from "../hooks/useGuild.ts";
import {getMissingGems} from "../utils/memberCalcs.ts";
import MemberSearch from "../components/MemberSearch.tsx";


interface TableToolbarProps {
  selected: readonly string[],
  onDelete: () => void,
  setSearchedMembers: React.Dispatch<SetStateAction<GuildMember[] | null>>
}

function TableToolbar({selected, onDelete, setSearchedMembers}: TableToolbarProps) {
  return (
    <Toolbar sx={[
      {
        pl: {sm: 2},
        pr: {xs: 1},
        justifyContent: 'space-between',
      },
      selected.length > 0 && {
        bgcolor: (theme) =>
          alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
      }
    ]}>
      {selected.length > 0 ? <>
        <Typography
          variant="subtitle1"
        >
          {selected.length} selected
        </Typography>
        <Tooltip title={"Delete"}>
          <IconButton onClick={onDelete}>
            <Delete/>
          </IconButton>
        </Tooltip>
      </> : <>
        <MemberSearch setFoundMembers={setSearchedMembers}/>
        <Tooltip title={"Filter below gem check"}>
          <IconButton>
            <FilterList/>
          </IconButton>
        </Tooltip>
      </>}
    </Toolbar>
  )
}


const tableHeadCells: (keyof GuildMember)[] = ['prio', 'rbxName', 'displayName', 'discord', 'gemChecks', 'joinedAt']

interface TableHeadProps {
  onRequestSort: (property: string) => void,
  order: 'asc' | 'desc',
  orderBy: keyof GuildMember,
}

function EnhancedTableHead({onRequestSort, order, orderBy}: TableHeadProps) {
  return (
    <TableHead>
      <TableRow>
        {tableHeadCells.map((k, i) => (
          <TableCell
            key={k}
            align={i <= 1 ? 'left' : 'right'}
            sortDirection={orderBy === k ? order : false}
          >
            <TableSortLabel
              active={orderBy === k}
              direction={orderBy === k ? order : 'asc'}
              onClick={() => onRequestSort(k)}
            >
              {toHumanReadable(k)}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}


function GuildMembers({members}: { members: GuildMember[] }) {

  const {guild, isAuthorized, changeGuild} = useGuild()
  const [dense, setDense] = useState<boolean>(false)

  function toggleDense() {
    setDense(!dense)
  }

  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [orderBy, setOrderBy] = useState<keyof GuildMember>('prio')
  const [selected, setSelected] = useState<readonly string[]>([])
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(5)
  const [memberFormOpen, setMemberFormOpen] = useState<boolean>(false)
  const [memberToEdit, setMemberToEdit] = useState<GuildMember>()
  const [searchedMembers, setSearchedMembers] = useState<GuildMember[] | null>(null)

  function handleRequestSort(property: string) {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property as keyof GuildMember)
  }

  function handleCheckboxClick(rbxName: string) {
    if (selected.includes(rbxName))
      setSelected(selected.filter(s => s !== rbxName))
    else
      setSelected(p => [...p, rbxName])
  }

  function handleMemberClick(member: GuildMember) {
    if (!isAuthorized) return
    setMemberToEdit(member)
    setMemberFormOpen(true)
  }

  function closeMemberForm() {
    setMemberToEdit(undefined)
    setMemberFormOpen(false)
  }

  function deleteSelectedMembers() {
    if (!guild) return
    changeGuild({
      ...guild,
      members: members.filter(m => !selected.includes(m.rbxName))
    })
    setSelected([])
  }

  const visibleRows = useMemo(() =>
      [...members]
        .filter(m => {
          if (!searchedMembers) return true
          return searchedMembers.find(f => f.rbxName === m.rbxName)
        })
        .sort((a, b) => order === 'desc' ? descendingComparator(a, b, orderBy) : -descendingComparator(a, b, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [members, order, orderBy, page, rowsPerPage, searchedMembers]
  )

  const emptyRows = rowsPerPage - visibleRows.length
  if (!guild) return null

  return (
    <Container maxWidth={'md'}>
      <Paper sx={{display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
        <TableToolbar selected={selected} onDelete={deleteSelectedMembers} setSearchedMembers={setSearchedMembers}/>
        <TableContainer>
          <Table aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
            <EnhancedTableHead
              onRequestSort={handleRequestSort}
              order={order}
              orderBy={orderBy}
            />
            <TableBody>
              {visibleRows.map((member, index) => {
                const isSelected = selected.includes(member.rbxName)
                const labelId = `enhanced-table-checkbox-${index}`
                const missingGems = getMissingGems(guild, member)
                return (
                  <Tooltip
                    key={member.rbxName}
                    title={`Missing Gems: ${getFormattedNumber(missingGems.curMissing)} (${getFormattedNumber(missingGems.overallNeeded)})`}
                  >
                    <TableRow
                      hover role="checkbox" selected={isSelected} tabIndex={-1}
                      aria-checked={isSelected} sx={{cursor: 'pointer'}}
                      onDoubleClick={() => handleMemberClick(member)}
                    >
                      <TableCell padding={'checkbox'}>
                        <Checkbox color="primary" checked={isSelected} aria-labelledby={labelId}
                                  onClick={() => handleCheckboxClick(member.rbxName)}
                                  onDoubleClick={e => e.stopPropagation()}
                                  sx={{m: 0}} disabled={!isAuthorized}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">{member.rbxName}</TableCell>
                      <TableCell align={'right'}>{member.displayName}</TableCell>
                      <TableCell align={'right'}>{member.discord.display || member.discord.id}</TableCell>
                      <TableCell
                        align="right">{getFormattedNumber(member.gemChecks[member.gemChecks.length - 1]?.value || -1)}</TableCell>
                      <TableCell align={'right'}>{formatDateToGerman(member.joinedAt)}</TableCell>
                    </TableRow>
                  </Tooltip>
                )
              })}

              {emptyRows > 0 && (
                <TableRow style={{height: (dense ? 33 : 53) * emptyRows}}>
                  <TableCell colSpan={tableHeadCells.length}/>
                </TableRow>
              )}

              {isAuthorized && <TableRow>
                  <TableCell colSpan={tableHeadCells.length} sx={{p: dense ? .2 : 1}}>
                      <Button fullWidth onClick={() => setMemberFormOpen(true)}>Add Member</Button>
                  </TableCell>
              </TableRow>}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Box sx={{display: 'flex', alignItems: 'center', cursor: 'pointer'}} onClick={toggleDense}>
            <Checkbox checked={dense}/>
            <Typography variant={'subtitle2'}>Compact</Typography>
          </Box>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 20, 25]} component="div"
            count={searchedMembers?.length ?? members.length} rowsPerPage={rowsPerPage} page={page}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={e => {
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }}
          />
        </Box>
      </Paper>

      <Modal open={memberFormOpen} onClose={closeMemberForm} sx={{placeSelf: 'center'}}>
        <GuildMemberForm initMember={memberToEdit} onSubmit={closeMemberForm}/>
      </Modal>
    </Container>
  );
}

export default GuildMembers;