import {useState} from "react";
import {Container, Grid, IconButton, Paper, Tooltip, Typography, Box} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check"
import ValueHandler from "../components/ValueHandler.tsx";
import {getFormattedNumber} from "../utils/getFormattedNumber.ts";

function GemContributionScreen() {

  const [value, setValue] = useState<number>(5000000000000)
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center">
        Gem Contribution
      </Typography>

      <Grid container spacing={2} marginTop={2} maxWidth={300} sx={{ placeSelf: 'center' }}>
        <ValueHandler
          value={value}
          setValue={setValue}
          valueSize={8}
          potencySize={4}
        />

        <Grid size={12}>
          <Paper
            elevation={2}
            sx={{
              padding: 2,
              display: 'flex',
              justifyContent: 'space-around',
              '&:hover': {
                cursor: 'pointer',
              },
            }}
            onClick={handleCopy}
          >
            <Box
              sx={{ overflow: 'hidden' }}
            >
              <Typography variant="subtitle1">Total Contribution:</Typography>
              <Typography variant="h6" textOverflow="ellipsis" overflow="hidden">
                {value.toLocaleString()}
              </Typography>
            </Box>

            <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
              <IconButton>
                {copied ? <CheckIcon color="success" /> : <ContentCopyIcon />}
              </IconButton>
            </Tooltip>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant={'h6'} mt={2}>
        You can also just type -- {getFormattedNumber(value)} -- in game!
      </Typography>
    </Container>
  );
}

export default GemContributionScreen;