import {
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  TextField, Tooltip
} from "@mui/material";
import {getFormattedNumber, getHighestPotency} from "../utils/getFormattedNumber.ts";
import {ITER_POTENCY, Potency} from "../entities/potency.ts";
import {useRef, useState} from "react";
import {Replay, Save} from "@mui/icons-material";

interface Props {
  value: number,
  setValue: (value: number) => void,
  valueSize?: number,
  potencySize?: number,
  valueLabel?: string,
  storeKey?: string,
}

function ValueHandler({value, setValue, valueSize = 2, potencySize = 2, valueLabel = 'Gems', storeKey}: Props) {

  const defaultValue: number = useRef(value).current
  const [storedValue, setStoredValue] = useState<number>(storeKey ? Number(localStorage.getItem(storeKey) ?? defaultValue) : defaultValue)

  function handleValueClick() {
    if (value === storedValue) setValue(defaultValue)
    else if (storeKey) {
      localStorage.setItem(storeKey, value.toString(10))
      setStoredValue(value)
    } else console.warn('handleValueClick in ValueHandler.tsx: Smth unusually happened!')
  }

  return (
    <>
      <Grid size={valueSize}>
        <FormControl variant="outlined">
          <InputLabel htmlFor="value-input">{valueLabel}</InputLabel>
          <OutlinedInput
            fullWidth
            label={valueLabel}
            id="value-input"
            type="number"
            value={parseFloat(getFormattedNumber(value))}
            onChange={e => setValue((Number(e.target.value) || 1) * getHighestPotency(value))}
            endAdornment={storeKey && (value !== defaultValue || value !== storedValue) && (
              <Tooltip title={value === storedValue ? 'Use stored value' : 'Save value'}>
                <InputAdornment position="end">
                  <IconButton onClick={handleValueClick}>
                    {value === storedValue ? <Replay/> : <Save/>}
                  </IconButton>
                </InputAdornment>
              </Tooltip>
            )}
          />
        </FormControl>
      </Grid>
      <Grid size={potencySize}>
        <TextField
          select fullWidth
          label="Potency"
          sx={{minWidth: 86}}
          value={getHighestPotency(value)}
          onChange={e => setValue(Number(getFormattedNumber(value, true)) * Number(e.target.value))}
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
    </>
  )
}

export default ValueHandler;