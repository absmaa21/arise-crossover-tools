import {ReactNode, useEffect, useState} from "react";
import {Guild} from "../entities/guild.ts";
import {useGuild} from "../hooks/useGuild.ts";
import {
  alpha,
  Box,
  Container,
  GlobalStyles,
  IconButton,
  Modal,
  Paper,
  Snackbar,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
import {OpenInFull, Restore, Save} from "@mui/icons-material";
import {Diff, parseDiff, FileData, Hunk} from "react-diff-view";
import {createTwoFilesPatch} from "diff";
import 'react-diff-view/style/index.css'

function GuildDiff({children}: { children: ReactNode }) {

  const Theme = useTheme()
  const {guild, changeGuild} = useGuild()

  const [oldGuild, setOldGuild] = useState<Guild | undefined>(undefined)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [files, setFiles] = useState<FileData[]>([])
  const [width, setWidth] = useState<number>(window.innerWidth)

  useEffect(() => {
    if (guild && !oldGuild) setOldGuild(guild)
    if (guild && oldGuild) {
      const guildJson = JSON.stringify(guild, null, 2)
      const oldGuildJson = JSON.stringify(oldGuild, null, 2)
      if (guildJson !== oldGuildJson) {
        const patchRaw = createTwoFilesPatch(
          'oldGuild.json', 'newGuild.json',
          oldGuildJson, guildJson
        )
        // react-diff-view requires a full git diff header. Else Error is thrown.
        const patch = `diff --git a/oldGuild.json b/newGuild.json\n${patchRaw}`;
        const nFiles: FileData[] = parseDiff(patch)
        setFiles(nFiles)
      } else {
        setFiles([])
        setOpenModal(false)
      }
    }
  }, [guild, oldGuild]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []);

  const saveGuildChanges = () => {
    if (files.length === 0 || !guild) return
    changeGuild(guild, false).then(() => localStorage.setItem('guild', JSON.stringify(guild)))
  }

  return (
    <>
      <GlobalStyles
        styles={{
          ':root': {
            '--diff-background-color': Theme.palette.background.default,
            '--diff-text-color': Theme.palette.text.primary,

            '--diff-code-insert-background-color': alpha(Theme.palette.success.dark, .3),
            '--diff-code-insert-text-color': Theme.palette.text.primary,

            '--diff-code-delete-background-color': alpha(Theme.palette.error.dark, .3),
            '--diff-code-delete-text-color': Theme.palette.error.contrastText,

            '--diff-gutter-insert-background-color': alpha(Theme.palette.success.dark, .4),
            '--diff-gutter-insert-text-color': Theme.palette.text.primary,

            '--diff-gutter-delete-background-color': alpha(Theme.palette.error.dark, .4),
            '--diff-gutter-delete-text-color': Theme.palette.text.primary,

            '--diff-code-selected-background-color': Theme.palette.action.selected,
            '--diff-code-selected-text-color': Theme.palette.text.primary,

            '--diff-selection-background-color': Theme.palette.action.selected,
            '--diff-selection-text-color': Theme.palette.text.primary,

            '--diff-omit-gutter-line-color': Theme.palette.warning.main,
          },
        }}
      />

      {children}
      <Snackbar
        open={files.length > 0 && !openModal}
        anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
        message="Unsaved Guild changes"
        action={(
          <IconButton onClick={() => setOpenModal(true)}>
            <OpenInFull sx={{color: Theme.palette.background.default}}/>
          </IconButton>
        )}
      />
      <Modal open={openModal} onClose={() => setOpenModal(false)}
             sx={{placeSelf: 'center'}}
      >
        <Container maxWidth={'xl'}>
          <Paper elevation={2} sx={{textAlign: 'center', p: 2}}>
            {files.length > 0 && oldGuild ? (
              <>
                <Box
                  display="flex" flexDirection="row" justifyContent="space-between"
                  mb={2}
                >
                  <Tooltip title={'Undo changes'} arrow>
                    <IconButton size="large" onClick={() => {
                      changeGuild(oldGuild).then(() => console.log('Guild changes undone'))
                    }}>
                      <Restore fontSize="inherit"/>
                    </IconButton>
                  </Tooltip>

                  <Typography variant={'h4'} alignSelf={'center'}>
                    Guild changes
                  </Typography>

                  <Tooltip title={'Save changes'} arrow>
                    <IconButton size="large" onClick={saveGuildChanges}>
                      <Save fontSize="inherit"/>
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{
                  overflowX: 'auto',
                  border: `1px solid ${Theme.palette.text.secondary}`,
                  borderRadius: 1,
                  maxHeight: '70vh',
                  padding: 1,
                  textAlign: 'left'
                }}>
                  <Diff viewType={width > 1000 ? 'split' : 'unified'} diffType="modify" hunks={files[0].hunks}>
                    {hunks => hunks.map((h, i) =>
                      <Hunk key={`hunk-${i}`} hunk={h}/>
                    )}
                  </Diff>
                </Box>
              </>
            ) : (
              <Typography>Something went wrong</Typography>
            )}
          </Paper>
        </Container>
      </Modal>
    </>
  );
}

export default GuildDiff;