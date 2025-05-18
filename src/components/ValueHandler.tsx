import {Grid, MenuItem, TextField} from "@mui/material";
import {getFormattedNumber, getHighestPotency} from "../utils/getFormattedNumber.ts";
import {ITER_POTENCY, Potency} from "../entities/potency.ts";

interface Props {
  value: number,
  setValue: (value: number) => void,
  valueSize?: number,
  potencySize?: number,
  valueLabel?: string,
}

function ValueHandler({value, setValue, valueSize = 2, potencySize = 2, valueLabel = 'Gems'}: Props) {
  return (
    <>
      <Grid size={valueSize}>
        <TextField
          fullWidth
          label={valueLabel}
          type="number"
          value={parseInt(getFormattedNumber(value))}
          onChange={(e) => setValue((parseInt(e.target.value) || 1) * getHighestPotency(value))}
        />
      </Grid>
      <Grid size={potencySize}>
        <TextField
          select sx={{minWidth: 86}}
          label="Potency"
          fullWidth
          value={getHighestPotency(value)}
          onChange={e => setValue(parseInt(getFormattedNumber(value)) * Number(e.target.value))}
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