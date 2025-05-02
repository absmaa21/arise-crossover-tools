import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  Checkbox, Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton, MenuItem,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Guild } from "../entities/guild.ts";
import {getFormattedNumber, getHighestPotency} from "../utils/getFormattedNumber.ts";
import {ITER_POTENCY, Potency} from "../entities/potency.ts";
import {formatDateToGerman, parseGermanDate} from "../utils/germanDate.ts";
import {loadJsonFile, saveAsJson} from "../utils/computerSaveLoad.ts";
import {useNotifications} from "@toolpad/core";

interface Props {
  guild?: Guild;
  onSubmit: (guild: Guild) => void;
}

const daysOfWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
] as const;

const emptyGuild: Guild = {
  name: '',
  gemCheckDay: [],
  gemsPerCheck: [],
  entryFee: [],
  members: [],
}

const GuildForm: React.FC<Props> = ({ guild: initialGuild, onSubmit }) => {

  const notify = useNotifications()
  const [guild, setGuild] = useState<Guild>(initialGuild ?? emptyGuild);

  const handleChange = (field: keyof Guild, value: unknown) => {
    setGuild(prev => ({ ...prev, [field]: value }));
  };

  const handleGemCheckDayChange = (day: typeof daysOfWeek[number], checked: boolean) => {
    setGuild(prev => {
      const newDays = checked
        ? [...prev.gemCheckDay, day]
        : prev.gemCheckDay.filter(d => d !== day);
      return { ...prev, gemCheckDay: newDays };
    });
  };

  const addGemPerCheck = () => {
    setGuild(prev => ({
      ...prev,
      gemsPerCheck: [...prev.gemsPerCheck, { value: 0, validFrom: Date.now() }]
    }));
  };

  const updateGemPerCheck = (index: number, field: keyof Guild['gemsPerCheck'][0], value: number) => {
    setGuild(prev => {
      const newGems = [...prev.gemsPerCheck];
      newGems[index] = { ...newGems[index], [field]: value };
      return { ...prev, gemsPerCheck: newGems };
    });
  };

  const removeGemPerCheck = (index: number) => {
    setGuild(prev => ({
      ...prev,
      gemsPerCheck: prev.gemsPerCheck.filter((_, i) => i !== index)
    }));
  };

  const addEntryFee = () => {
    setGuild(prev => ({
      ...prev,
      entryFee: [...prev.entryFee, { value: 0, validFrom: Date.now() }]
    }));
  };

  const updateEntryFee = (index: number, field: keyof Guild['entryFee'][0], value: number) => {
    setGuild(prev => {
      const newGems = [...prev.entryFee];
      newGems[index] = { ...newGems[index], [field]: value };
      return { ...prev, entryFee: newGems };
    });
  };

  const removeEntryFee = (index: number) => {
    setGuild(prev => ({
      ...prev,
      entryFee: prev.entryFee.filter((_, i) => i !== index)
    }));
  };

  const handleDateChange = (index: number, dateString: string) => {
    const timestamp = parseGermanDate(dateString);
    if (!isNaN(timestamp)) {
      updateGemPerCheck(index, 'validFrom', timestamp);
    }
  };

  const handleFeeDateChange = (index: number, dateString: string) => {
    const timestamp = parseGermanDate(dateString);
    if (!isNaN(timestamp)) {
      updateEntryFee(index, 'validFrom', timestamp);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guild.gemCheckDay.length <= 0 || guild.gemsPerCheck.length <= 0) return
    onSubmit(guild);
  };

  const feeGridRef = useRef<HTMLDivElement>(null)
  const weeklyGridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (feeGridRef.current) feeGridRef.current.scrollTop = Number.MAX_SAFE_INTEGER
    if (weeklyGridRef.current) weeklyGridRef.current.scrollTop = Number.MAX_SAFE_INTEGER
  }, [feeGridRef, weeklyGridRef]);

  return (
    <Container maxWidth={'md'}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Guild Management</Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Guild Name */}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Guild Name"
                value={guild.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </Grid>

            {/* Entry fee */}
            <Grid size={12} ref={feeGridRef}>
              <Typography variant="h6" gutterBottom>Entry fee</Typography>
              <Grid sx={{maxHeight: '20vh', overflowY: 'auto', pt: 1}} ref={weeklyGridRef}>
                {guild.entryFee.map((gem, index) => (
                  <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 2 }}>
                    <Grid size={4}>
                      <TextField
                        fullWidth
                        label="Value"
                        type="number"
                        value={parseInt(getFormattedNumber(gem.value))}
                        onChange={(e) => updateEntryFee(index, 'value', (parseInt(e.target.value) || 1) * getHighestPotency(gem.value))}
                      />
                    </Grid>
                    <Grid size={2}>
                      <TextField
                        select
                        label="Potency"
                        fullWidth
                        value={getHighestPotency(gem.value)}
                        onChange={e => updateEntryFee(index, 'value', parseInt(getFormattedNumber(gem.value)) * Number(e.target.value))}
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

                    <Grid size={5}>
                      <TextField
                        fullWidth
                        label="Valid From (DD.MM.YYYY)"
                        value={formatDateToGerman(gem.validFrom)}
                        onChange={(e) => handleFeeDateChange(index, e.target.value)}
                        placeholder="DD.MM.YYYY"
                      />
                    </Grid>
                    <Grid size={1}>
                      <IconButton onClick={() => removeEntryFee(index)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={addEntryFee}
                  variant="outlined"
                >
                  Add Gem Rate
                </Button>
              </Grid>
            </Grid>

            {/* Gem Check Days */}
            <Grid size={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Gem Check Days</FormLabel>
                <FormGroup row>
                  {daysOfWeek.map(day => (
                    <FormControlLabel
                      key={day}
                      control={
                        <Checkbox
                          checked={guild.gemCheckDay.includes(day)}
                          onChange={(e) => handleGemCheckDayChange(day, e.target.checked)}
                          name={day}
                        />
                      }
                      label={day.charAt(0).toUpperCase() + day.slice(1)}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>

            {/* Gems Per Check */}
            <Grid size={12}>
              <Typography variant="h6" gutterBottom>Gems Per Check</Typography>
              <Grid sx={{maxHeight: '20vh', overflowY: 'auto', pt: 1}} ref={weeklyGridRef}>
                {guild.gemsPerCheck.map((gem, index) => (
                  <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 2 }}>
                    <Grid size={4}>
                      <TextField
                        fullWidth
                        label="Value"
                        type="number"
                        value={parseInt(getFormattedNumber(gem.value))}
                        onChange={(e) => updateGemPerCheck(index, 'value', (parseInt(e.target.value) || 1) * getHighestPotency(gem.value))}
                      />
                    </Grid>
                    <Grid size={2}>
                      <TextField
                        select
                        label="Potency"
                        fullWidth
                        value={getHighestPotency(gem.value)}
                        onChange={e => updateGemPerCheck(index, 'value', parseInt(getFormattedNumber(gem.value)) * Number(e.target.value))}
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

                    <Grid size={5}>
                      <TextField
                        fullWidth
                        label="Valid From (DD.MM.YYYY)"
                        value={formatDateToGerman(gem.validFrom)}
                        onChange={(e) => handleDateChange(index, e.target.value)}
                        placeholder="DD.MM.YYYY"
                      />
                    </Grid>
                    <Grid size={1}>
                      <IconButton onClick={() => removeGemPerCheck(index)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={addGemPerCheck}
                  variant="outlined"
                >
                  Add Gem Rate
                </Button>
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Grid size={8}>
              <Button type="submit" variant="contained" color="primary" size="large">
                Save Guild
              </Button>
            </Grid>
            <Grid size={2} sx={{placeSelf: 'self-end'}}>
              <Button fullWidth variant="outlined" color="primary" size="medium" onClick={() => saveAsJson(guild, 'guild.json')}>
                Export
              </Button>
            </Grid>
            <Grid size={2} sx={{placeSelf: 'self-end'}}>
              <Button fullWidth variant="outlined" color="primary" size="medium" onClick={() => loadJsonFile().then(data => {
                setGuild(data as Guild)
                notify.show('Guild successfully loaded!', {autoHideDuration: 2000, severity: 'success'})
              }).catch(e => {
                console.log('Error: ', e)
                notify.show('Error loading the guild!', {autoHideDuration: 5000, severity: 'error'})
              })}>
                Import
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default GuildForm;