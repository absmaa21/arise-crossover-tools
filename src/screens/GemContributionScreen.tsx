import {useEffect, useState} from "react";
import {ITER_POTENCY, Potency} from "../entities/potency.ts";
import {Container, Grid, IconButton, MenuItem, Paper, TextField, Tooltip, Typography} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check"

function GemContributionScreen() {

  const [potency, setPotency] = useState<Potency>(Potency.Qa)
  const [value, setValue] = useState<number>(10)
  const [contribution, setContribution] = useState<number>(0)

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(contribution.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  useEffect(() => {
    setContribution(value * potency)
  }, [value, potency]);

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" gutterBottom align="center">
        Gem Contribution
      </Typography>

      <Grid container spacing={2} marginTop={2}>
        <Grid size={8}>
          <TextField
            type="number"
            label="Amount"
            fullWidth
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        </Grid>

        <Grid size={4}>
          <TextField
            select
            label="Potency"
            fullWidth
            value={potency}
            onChange={(e) => setPotency(Number(e.target.value))}
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

        <Grid size={12}>
          <Paper elevation={2} sx={{ padding: 2, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div>
              <Typography variant="subtitle1">Total Contribution:</Typography>
              <Typography variant="h6">
                {contribution.toLocaleString()}
              </Typography>
            </div>

            <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
              <IconButton onClick={handleCopy}>
                {copied ? <CheckIcon color="success" /> : <ContentCopyIcon />}
              </IconButton>
            </Tooltip>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default GemContributionScreen;